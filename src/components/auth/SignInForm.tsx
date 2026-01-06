import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { EyeCloseIcon, EyeIcon } from "../../icons"
import Label from "../form/Label"
import Input from "../form/input/InputField"
import "./auth.css"
import useForm from "./useForm"
import { signinUser } from "../../api/auth"
import type { AuthSignin } from "../../@types/Auth"

export default function SignInForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  

  const { value, handleChange, errors } = useForm({
  email: "",
  password: "",
})

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  const payload: AuthSignin = {
    email: value.email,
    password: value.password,
  }

  try {
    setLoading(true)

    const res = await signinUser(payload)
    const data = res.data

    console.log("Signin successful:", data)

    localStorage.setItem("access_token", data.access_token)
    localStorage.setItem("token_type", data.token_type)

    navigate("/")
  } catch (error: any) {
    console.error("Signin failed:", error)

    if (error.response) {
      alert(error.response.data?.detail || "Login failed")
    } else {
      alert("Server not reachable")
    }
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                {errors.email && <p className="error">{errors.email}</p>}
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                  name="email"
                  value={value.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                {errors.password && (
                  <p className="error">{errors.password}</p>
                )}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={value.password}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-between">
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Signup */}
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
