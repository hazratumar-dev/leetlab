import express from "express";
import {verifyJWT, verifyPermission} from "../middleware/auth.middleware.js"
import {UserRoleEnum} from "../utils/constant.js";
import {
    createProblem,
    getProblems
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
export default router