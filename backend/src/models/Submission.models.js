import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    sourceCode: {
      type: Schema.Types.Mixed,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    stdin: {
      type: String,
      default: null,
    },
    stdout: {
      type: String,
      default: null,
    },
    stderr: {
      type: String,
      default: null,
    },
    compileOutPut: {
      type: String,
      default: null,
    },
    status: {
      type: String,
    },
    memory: {
      type: String,
      default: null,
    },
    time: {
      type: String,
      default: null,
    },
    testCases: [
      {
        type: Schema.Types.ObjectId,
        ref: "TestCasesResult",
      },
    ],
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ userId: 1 });
submissionSchema.index({ problemId: 1 });

export const Submission = mongoose.model("Submission", submissionSchema);
