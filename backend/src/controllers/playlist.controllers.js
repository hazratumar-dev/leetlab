import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/Playlist.models.js";
import { ProblemPlaylist } from "../models/ProblemPlaylist.models.js";


const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;

  const playlist = await Playlist.create({
    name,
    description,
    userId,
  });

    if (!playlist) {
      throw new ApiError(404, "something went wrong while creating a playlist")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, { playlist }, "successfully create playlist"));
});

const getAllPlaylistDetails = asyncHandler(async (req, res) => {
    const playlistDetails = await Playlist.find({
        userId: req.user._id
    }).populate({
        path: "problems",
        populate: {
            path: "problemId"
        }
    })

    if (!playlistDetails) {
        throw new ApiError(404, "something went wrong while fetching playlist detail")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { playlistDetails },
                "fetched playlist detail successfully"
            )
        )
})

const getPlaylistDetails = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    const playlistDetails = await Playlist.findOne({
        _id: playlistId,
        userId: req.user._id
    }).populate({
        path: "problems",
        populate: {
            path: "problemId"
        }
    })

    if (!playlistDetails) {
        throw new ApiError(404, "detail not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { playlistDetails },
                "fetched details by a playlist"
            )
        )
})

const addProblemToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { problemIds } = req.body

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
        throw new ApiError(400, "Invalid or missing problemIds")
    }

    const playlist = await ProblemPlaylist.insertMany(
        problemIds.map((problemId) => ({
            playlistId: playlistId,
            problemId: problemId
        }))
    )

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { playlist },
                "successfully add problem to the playlist"
            )
        )

})

const deletePlayList = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
        throw new ApiError(404, "error occur while deleting the playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "playlist deleted successfully"
            )
        )
})

const removeProblemFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { problemIds } = req.body

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
        throw new ApiError(400, "Invalid or missing problemIds")
    }

    const deleteProblems = await ProblemPlaylist.deleteMany({
        playlistId,
        problemId: {
            $in: problemIds
        }
    });

    if (!deleteProblems) {
        throw new ApiError(404, "error occur while deleting a problems")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { deleteProblems },
                "deleted problem successfully"
            )
        )
})


export {
    createPlaylist,
    getAllPlaylistDetails,
    addProblemToPlaylist,
    removeProblemFromPlaylist,
    deletePlayList,
    getPlaylistDetails,
};
