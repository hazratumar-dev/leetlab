import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";


export const useAuthStore = create( (set) => ({
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,

    checkAuth: async() => {
        set({isCheckingAuth: true})

        try {
            const res = await axiosInstance.get("/user/getMe");
            console.log("checkAuth response", res.data);

            set({authUser: res.data.user})
        } catch (error) {
            console.error("Error checking auth", error)
            set({authUser: null})
        }
        finally{
            set({isCheckingAuth: false})
        }
    }
}))