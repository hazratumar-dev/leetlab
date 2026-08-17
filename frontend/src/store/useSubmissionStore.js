import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/submission/all-submission");

      set({ submissions: response.data.data.submission });
      toast.success(response.data.message);
    } catch (error) {
      toast.error("error getting submissions", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(
        `/submission/submissions/${problemId}`,
      );
      console.log("response: ", response);
      set({ submission: response.data.data.submission });
      toast.success(response.data.message);
    } catch (error) {
      toast.error("error getting submission");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(
        `/submission/get-all-submission-count/${problemId}`,
      );
      set({ submissionCount: response.data.data.count });
      toast.success(response.data.success);
    } catch (error) {
      toast.error("error getting submission count");
    } finally {
      set({ isLoading: false });
    }
  },
}));
