import mongoose, {Schema} from "mongoose";

const problemSolvedSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    }
}, {
    timestamps: true
})

problemSolvedSchema.index({ userId: 1, problemId: 1}, {unique: true});

export const problemSolved = mongoose.model("problemSolved", problemSolvedSchema)