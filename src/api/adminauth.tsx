import api from "./axios";
import { AdminAuth, AdminAuthResponse } from "../@types/Auth";
import { AdminAuthSignin } from "../@types/Auth";

export const signupUser = (data: AdminAuth) => {
  return api.post<AdminAuthResponse>("/register_admin", data);
};


export const AdminsigninUser = (data: AdminAuthSignin) => {
  const formData = new URLSearchParams()
  formData.append("username", data.email)
  formData.append("password", data.password)

  return api.post("/admin_login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}