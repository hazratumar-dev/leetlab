import mongoose, { Schema } from "mongoose";
import {
  AvailableDifficultylevel,
  AvailableCodeLanguage,
} from "../utils/constant.js";

const languageExampleSchema = new Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const problemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    difficulty: {
      type: String,
      enum: AvailableDifficultylevel,
      required: true,
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

    examples: {
      JAVASCRIPT: { 
        type: languageExampleSchema, 
        required: true 
      },
      PYTHON: { type: 
        languageExampleSchema, 
        required: true 
      },
      JAVA: { 
        type: languageExampleSchema, 
        required: true 
      },
    },

    constraints: { 
      type: String, 
      required: true 
    },
    hints: { 
      type: String 
    },      
    editorial: { 
      type: String 
    },

    testcases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        _id: false,
      },
    ],

    codeSnippets: {
      JAVASCRIPT: { type: String, required: true },
      PYTHON: { type: String, required: true },
      JAVA: { type: String, required: true },
    },

    referenceSolutions: {
      JAVASCRIPT: { type: String, required: true },
      PYTHON: { type: String, required: true },
      JAVA: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Problem = mongoose.model("Problem", problemSchema);