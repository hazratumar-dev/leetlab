import mongoose, {Schema} from "mongoose";
import {AvailableDifficultylevel, AvailableCodeLanguage} from "../utils/constant.js"

const problemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    difficulty: {
        type: String,
        enum: AvailableDifficultylevel,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    examples: [
        {
            input: {type: String, required: true},
            output: {type: String, required: true},
            explanation: {type: String}
        }  
    ],
    constraints: {
        type: String,
        required: true
    },
    hint: {
        type: String
    },
    editorial: {
        type: String
    },
    testCases: [
        {
            input: {type: String, required: true},
            output: {type: String, required: true}
        }
    ],
    codeSnippets: [
        {
            language: {
                type: String,
                required: true,
                enum: AvailableCodeLanguage
            },
            code: {
                type: String,
                required: true
            }
        }
    ],
    refrenceSolution: [
        {
            language: {
                type: String,
                required: true,
                enum: AvailableCodeLanguage
            },
            solution: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
})

const Problem = mongoose.model("Problem", problemSchema)