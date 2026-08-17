import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"


export const useAction = create((set) => ({
    isDeletingProblem: false,

    onDeleteProblem: async (problemId) => {
        try {
            set({ isDeletingProblem: true });
            const response = await axiosInstance.delete(`/problems/delete-problem/${problemId}`);
            toast.success(response.data.message);
        } catch (error) {
            toast.error("error while deleting problem", error)
        } finally {
            set({ isDeletingProblem: false})
        }
    }
}))
