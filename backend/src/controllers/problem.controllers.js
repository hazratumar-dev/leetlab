import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiRsponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { Problem } from "../models/Problem.models.js";
import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResults,
} from "../services/judge0.services.js";
import { UserRoleEnum } from "../utils/constant.js";

const getProblems = asyncHandler(async (req, res) => {
  const problems = await Problem.aggregate([
    {
      $lookup: {
        from: "problemSolved",
        let: { problemId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$problemId", "$$problemId"] },
                  { $eq: ["$userId", req.user._id] },
                ],
              },
            },
          },
        ],
        as: "solvedBy",
      },
    },
  ]);

  if (!problems || problems.length == 0) {
    throw new ApiError(404, "problems not found");
  }

  return res
    .status(200)
    .json(new ApiRsponse(200, { problems }, "problems fetched successfully"));
});

const getProblemById = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  console.log(problemId);

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new ApiError(404, "project not found");
  }

  return res
    .status(200)
    .json(new ApiRsponse(200, problem, "problem fetched successfully"));
});

const createProblem = asyncHandler(async (req, res) => {
  // get the data from request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    refrenceSolution,
  } = req.body;

  // check the user role again
  if (req.user.role !== UserRoleEnum.ADMIN) {
    throw new ApiError(403, "You are not allowed to create a problem");
  }

  // loop through each solution reference for different languages and validate them
  for (const item of refrenceSolution) {
    const language = item.language;
    const solution = item.solution;
    const languageId = getJudge0LanguageId(language);

    if (!languageId) {
      throw new ApiError(400, `Language ${language} is not supported`);
    }

    const submissions = testCases.map(({ input, output }) => ({
      source_code: solution,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));

    const submissionResult = await submitBatch(submissions);
    const tokens = submissionResult.map((res) => res.token);

    const results = await pollBatchResults(tokens);

    for (let i = 0; i < results.length; i++) {
      console.log("result", results);
      const result = results[i];

      if (result.status.id !== 3) {
        throw new ApiError(
          400,
          `Testcase ${i + 1} failed for language ${language}`
        );
      }
    }
  }

  // Once all reference solutions pass validation, create the problem once
  const newProblem = await Problem.create({
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    refrenceSolution,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiRsponse(201, newProblem, "problem create successfully"));
});

const updateProblem = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    refrenceSolution,
  } = req.body;

  if (!problemId) {
    throw new ApiError(400, "Inalid problem");
  }

  if (req.user.role !== UserRoleEnum.ADMIN) {
    throw new ApiError(400, "You are not allowed to update problem");
  }

  if (refrenceSolution && testCases) {
    for (const item of refrenceSolution) {
      const language = item.language;
      const solution = item.solution;
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        throw new ApiError(400, `Language ${language} is not supported`);
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solution,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResult = await submitBatch(submissions);
      const tokens = submissionResult.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          throw new ApiError(
            400,
            `Testcase ${i + 1} failed for language ${language}`
          );
        }
      }
    }
  }

  const updatedProblem = await Problem.findByIdAndUpdate(
    problemId,
    {
      $set: {
        ...(title && { title }),
        ...(description && { description }),
        ...(difficulty && { difficulty }),
        ...(tags && { tags }),
        ...(examples && { examples }),
        ...(constraints && { constraints }),
        ...(testCases && { testCases }),
        ...(codeSnippets && { codeSnippets }),
        ...(refrenceSolution && { refrenceSolution }),
      },
    },
    {
      new: true,
      runValidator: true,
    }
  );

  if (!updatedProblem) {
    throw new ApiError(404, "problem not found");
  }

  return res
    .status(200)
    .json(
      new ApiRsponse(200, { updatedProblem }, "problem updated successfully")
    );
});

const deleteProblemById = asyncHandler(async (req, res) => {
  const { problemId } = req.params;

  const deletedProblem = await Problem.findByIdAndDelete(problemId);

  if (!deletedProblem) {
    throw new ApiError(404, "problem not found");
  }

  return res
    .status(200)
    .json(new ApiRsponse(200, {}, "problem deleted successfully"));
});

const getSolvedProblem = asyncHandler(async (req, res) => {});

export {
  createProblem,
  getProblemById,
  getSolvedProblem,
  getProblems,
  updateProblem,
  deleteProblemById,
};
