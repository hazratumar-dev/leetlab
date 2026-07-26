import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import { ApiRsponse } from "../utils/apiResponse.js" 
import {Submission} from "../models/Submission.models.js"

const getAllSubmission = asyncHandler( async(req, res) => {
    const submissions = await Submission.find({
        userId: req.user._id
    })

    if(!submissions){
        throw new ApiError(404, "submission not found")
    }

    return res
        .status(200)
        .json(
            new ApiRsponse(
                200,
                {submissions},
                "fetched all submission"
            )
        )
})

// problemId
const getSubmissionsForProblem  = asyncHandler( async(req, res) => {

})

// problemId
const getAllTheSubmissionsForProblem = asyncHandler( async(req, res) => {

})