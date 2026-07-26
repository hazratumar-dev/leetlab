import { Router } from "express";
import {verifyJWT} from "../middleware/auth.middleware.js"
import {
    executeCode
} from "../controllers/executeCode.controllers.js";


const router = Router();

router.use(verifyJWT)

router
    .route("/execute-code")
    .post(executeCode)


export default router;