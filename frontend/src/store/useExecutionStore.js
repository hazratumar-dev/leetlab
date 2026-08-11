import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import ProblemPage from "../page/ProblemPage.jsx";


export const useExecutionStore = create((set) => ({
    isExecuting: false,
    submission: null,


    executeCode: async (sourceCode, languageId, stdin, expectedOutPut, problemId) => {
        try {
            set({ isExecuting: true })

            const response = await axiosInstance.post("/execute-code/execute-code", { sourceCode, languageId, stdin, expectedOutPut, problemId })

            set({ submission: response.data.submission })
            toast.success(response.data.message)
        } catch(error) {
            toast.error("error while execude code")
            console.error("error executing code", error)
        } finally {
            set({isExecuting: false})
        }
    }
}))
