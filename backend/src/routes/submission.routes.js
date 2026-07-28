import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    getAllSubmission,
    getAllTheSubmissionsForProblem,
    getSubmissionsForProblem
} from "../controllers/submission.controllers.js";


const router = Router();

router.use(verifyJWT);

router
    .route("/all-submission")
    .get(getAllSubmission)

router
    .route("/submissions/:problemId")
    .get(getSubmissionsForProblem)

router
    .route("/get-all-submission/:problemId")
    .get(getAllTheSubmissionsForProblem)

export default router;
