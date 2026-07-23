import express from "express";
import {verifyJWT, verifyPermission} from "../middleware/auth.middleware.js"
import {UserRoleEnum} from "../utils/constant.js";
import {
    createProblem,
    getProblems,
    getProblemById,
    updateProblemById,
    deleteProblemById
} from "../controllers/problem.controllers.js"

const router = express.Router();

router.use(verifyJWT);

router
    .route("/create-problem")
    .post(
        verifyPermission(UserRoleEnum.ADMIN),
        createProblem
    )
router
    .route("/get-problems")
    .get(getProblems)
router
    .route("/:problemId")
    .get(getProblemById)
router
    .route("/update-problem/:problemId")
    .patch(updateProblemById)
router
    .route("/delete-problem/:problemId")
    .delete(deleteProblemById)
export default router