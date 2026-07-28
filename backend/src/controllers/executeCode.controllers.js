import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { submitBatch, pollBatchResults } from "../services/judge0.services.js";
import { Submission } from "../models/Submission.models.js";
import { getLanguageName } from "../utils/constant.js";
import { problemSolved } from "../models/ProblemSolved.models.js";
import { TestCasesResult } from "../models/TestCasesResult.js";

const executeCode = asyncHandler(async (req, res) => {
  const { sourceCode, languageId, stdin, expectedOutPut, problemId } = req.body;

  const userId = req.user._id;

  // validate test cases
  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expectedOutPut) ||
    expectedOutPut.length !== stdin.length
  ) {
    throw new ApiError(400, "Invalid or Missing test cases");
  }

  // 2=> prepare each test cases for judge0 batch submission
  const submissions = stdin.map((input) => ({
    source_code: sourceCode,
    language_id: languageId,
    stdin: input,
  }));

  // send the batch of submissions to judge0
  const submitResponse = await submitBatch(submissions);
  const tokens = submitResponse.map((res) => res.token);

  const results = await pollBatchResults(tokens);

  let allPassed = true;

  const detailResult = results.map((result, index) => {
    const stdout = result.stdout?.trim();
    const expected_output = expectedOutPut[index]?.trim();
    const passed = stdout === expected_output;

    if (!passed) allPassed = false;

    return {
      testCases: index + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });

  const submission = await Submission.create({
    userId,
    problemId,
    sourceCode: sourceCode,
    language: getLanguageName(languageId),
    stdin: stdin.join("\n"),
    stdout: JSON.stringify(detailResult.map((r) => r.stdout)),
    stderr: detailResult.some((r) => r.stderr)
      ? JSON.stringify(detailResult.map((r) => r.stderr))
      : null,
    compileOutPut: detailResult.some((r) => r.compile_output)
      ? JSON.stringify(detailResult.map((r) => r.compile_output))
      : null,
    status: allPassed ? "Accepted" : "Wrong Answer", // make a enum
    memory: detailResult.some((r) => r.memory)
      ? JSON.stringify(detailResult.map((r) => r.memory))
      : null,
    time: detailResult.some((r) => r.time)
      ? JSON.stringify(detailResult.map((r) => r.time))
      : null,
  });

  if (allPassed) {
    await problemSolved.findOneAndUpdate(
      { userId, problemId },
      {
        $set: {
          language: getLanguageName(languageId),
          solvedAt: new Date(),
        },
        $setOnInsert: {
          userId,
          problemId,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    );
  }

  const testCaseResult = detailResult.map((result) => ({
    submissionId: submission._id,
    testCases: result.testCases,
    passed: result.passed,
    stdout: result.stdout,
    stdin: result.stdin,
    expected: result.expected,
    stderr: result.stderr,
    compileOutPut: result.compile_output,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  const submissionWithTestCases = await TestCasesResult.insertMany(testCaseResult);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { submissionWithTestCases },
        "code execution successfully"
      )
    );
});

export { executeCode };
