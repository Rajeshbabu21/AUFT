import api from "./axios";
import {  AuthResponse, SignupPayload } from "../@types/Auth";
import { AuthSignin } from "../@types/Auth";

export const signupUser = (data: SignupPayload) => {
  return api.post<AuthResponse>("/register_users", data);
};


export const signinUser = (data: AuthSignin) => {
  const formData = new URLSearchParams()
  formData.append("username", data.email)
  formData.append("password", data.password)

  return api.post("/user_login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}