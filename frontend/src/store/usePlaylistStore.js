import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const usePlaylistStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  createPlaylist: async (playistData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post(
        "/playlist/create-problem",
        playistData,
      );
      console.log("response", response);
      set((state) => ({
        playlists: [...state.playlists, response.data.data.playlist],
      }));

      toast.success("Playlist created successfully");
      return response.data.data.playlist;
    } catch (error) {
      toast.error("Failed to create playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPlaylistDetails: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(
        "/playlist/all-playlist-details",
      );
      set({ playlists: response.data.data.playlistDetails });
    } catch (error) {
      toast.error("Failed to get playlist details");
    } finally {
      set({ isLoading: false });
    }
  },

  getPlaylistDetails: async (playlistId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(
        `/playlist/playlist-details/${playlistId}`,
      );

      set({ currentPlaylist: response.data.data.playlistDetails });
    } catch (error) {
      toast.error("Failed to get playlist details");
    } finally {
      set({ isLoading: false });
    }
  },

  addProblemToPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true });

      const response = await axiosInstance.post(
        `/playlist/add-problem-to-playlist/${playlistId}`,
        { problemIds },
      );

      toast.success("Problems added to playlist successfully");

      if (get().currentPlaylist._id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      toast.error("Failed to add problems to playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  removeProblemFromPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true });

      const response = await axiosInstance.post(
        `/playlist/remove-problem-playlist/${playlistId}`,
        { problemIds },
      );

      toast.success("Problems removed from playlist successfully");

      if (get().currentPlaylist._id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      toast.error("Failed to remove problems from playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (playlistId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.delete(
        `/problems/delete-playlist/${playlistId}`,
      );
      set((state) => ({
        playlists: state.playlists.filter(
          (playlist) => playlist._id !== playlistId,
        ),
      }));
      toast.success("Playlist deleted successfully");
    } catch (error) {
      toast.error("Failed to delete playlist");
    } finally {
      set({ isLoading: false });
    }
  },
}));
