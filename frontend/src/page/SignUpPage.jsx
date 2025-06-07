import { useState } from "react";
import { Facebook, Apple, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SignUpSchema } from "../schemas/authValidate.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../store/Slices/authSlice.js";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector((state) => state.auth?.isLoading);

  const onSubmit = async (data) => {
    const response = await dispatch(registerUser(data));
    if (response?.payload?.success) {
      const email = data?.email;
      const password = data?.password;
      const loginResult = await dispatch(loginUser({ email, password }));

      if (loginResult?.type === "login/fulfilled") {
        navigate("/");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-[#0F1729] via-[#0B1B33] to-[#070F20] text-white">
        <div className="w-[90%] max-w-lg rounded-lg bg-[#121c2c]/80 p-8 shadow-xl backdrop-blur-md">
          <h1 className="mb-6 text-center text-2xl font-semibold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-[#0F1729] via-[#0B1B33] to-[#070F20] text-white">
      <div className="w-[90%] max-w-lg rounded-lg bg-[#121c2c]/80 p-8 shadow-xl backdrop-blur-md">
        <h1 className="mb-6 text-center text-2xl font-semibold">Register with</h1>

        <div className="mb-6 flex items-center justify-center">
          <span className="text-gray-400">or</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className={`h-12 w-full rounded-md border ${errors.name ? "border-red-500" : "border-gray-600"
                  } bg-[#1f2937] pl-10 pr-4 text-white placeholder-gray-400`}
                {...register("name")}
                placeholder="Name"
              />
            </div>
            {errors.name && <span className="ml-1 text-sm text-red-500">{errors.name.message}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                className={`h-12 w-full rounded-md border ${errors.email ? "border-red-500" : "border-gray-600"
                  } bg-[#1f2937] pl-10 pr-4 text-white placeholder-gray-400`}
                {...register("email")}
                placeholder="Email"
              />
            </div>
            {errors.email && <span className="ml-1 text-sm text-red-500">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                className={`h-12 w-full rounded-md border ${errors.password ? "border-red-500" : "border-gray-600"
                  } bg-[#1f2937] pl-10 pr-10 text-white placeholder-gray-400`}
                {...register("password")}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="ml-1 text-sm text-red-500">{errors.password.message}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-[#3b82f6] py-2 text-base font-semibold uppercase text-white hover:bg-[#2563eb]"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-white underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
