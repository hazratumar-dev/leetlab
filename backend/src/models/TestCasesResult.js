import mongoose, {Schema} from "mongoose";

const testCasesResult = new Schema({
    submissionId: {
        type: Schema.Types.ObjectId,
        ref: "Submission",
        required: true
    },
    testCases: {
        type: Number,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    stdout: {
        type: String,
        default: null
    },
    stdin: {
        type: String,
        default: null
    },
    expected: {
        type: String,
        required: true
    },
    stderr: {
        type: String,
        default: null
    },
    compileOutPut: {
        type: String,
        default: null
    },
    status: {
        type: String,
        required: true
    },
    memory: {
        type: String,
        default: null
    },
    time: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

testCasesResult.index({ submissionId: 1 })

export const TestCasesResult = mongoose.model("TestCasesResult", testCasesResult)