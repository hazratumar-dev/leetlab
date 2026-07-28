import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Submission } from "../models/Submission.models.js";

const getAllSubmission = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({
    userId: req.user._id,
  });

  if (!submissions) {
    throw new ApiError(404, "submission not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { submissions }, "fetched all submission"));
});

const getSubmissionsForProblem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { problemId } = req.params;

  const submission = await Submission.find({
    userId,
    problemId,
  });

  if (!submission) {
    throw new ApiError(404, "submission not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { submission }, "fetched submission of the problem")
    );
});

const getAllTheSubmissionsForProblem = asyncHandler(async (req, res) => {
  const { problemId } = req.params;

  const submission = await Submission.countDocuments( problemId );

  if (!submission) {
    throw new ApiError(404, "submission not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count: submission },
        "fetched all submission of the problem"
      )
    );
});

export {
  getAllSubmission,
  getAllTheSubmissionsForProblem,
  getSubmissionsForProblem,
};
