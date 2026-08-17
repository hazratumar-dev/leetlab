import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblem: async () => {
    try {
      set({ isProblemsLoading: true });
      const response = await axiosInstance.get("/problems/get-problems");
      set({ problems: response.data.data.problems });
    } catch (error) {
      toast.error("error in getting problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getProblemById: async (problemId) => {
    try {
      set({ isProblemLoading: true });
      const response = await axiosInstance.get(
        `/problems/get-problem/${problemId}`,
      );
      // console.log("problem: ", response)
      set({ problem: response.data });
      toast.success(response.data.message);
    } catch (error) {
      toast.error("error in getting problem", error);
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const response = await axiosInstance.get("/problems/solved-problem");

      set({ solvedProblems: response.data.problems });
    } catch (error) {
      toast.error("error in gettin problems", error);
    }
  },
}));
