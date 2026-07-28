import { Router } from "express"
import {
    addProblemToPlaylist,
    createPlaylist,
    deletePlayList,
    getAllPlaylistDetails,
    getPlaylistDetails,
    removeProblemFromPlaylist
} from "../controllers/playlist.controllers.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router
    .route("/create-playlist")
    .post(createPlaylist)
router
    .route("/all-playlist-details")
    .get(getAllPlaylistDetails)
router
    .route("/playlist-details/:playlistId")
    .get(getPlaylistDetails)
router
    .route("/delete-playlist/:playlistId")
    .delete(deletePlayList)
router
    .route("/add-problem-to-playlist/:playlistId")
    .post(addProblemToPlaylist)
router
    .route("/remove-problem-playlist/:playlistId")
    .put(removeProblemFromPlaylist)

export default router
