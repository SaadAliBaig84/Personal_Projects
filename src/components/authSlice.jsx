import { createSlice } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";
const cookies = new Cookies();
const token = cookies.get("jwt");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!token,
    token: token || null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      console.log("in slice, login");
      state.token = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      console.log("in slice, logout");
      cookies.remove("jwt", { path: "/" });
      console.log(
        "Removed local gv i.e " + localStorage.getItem("googleVerified")
      );
      localStorage.removeItem("googleVerified");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
