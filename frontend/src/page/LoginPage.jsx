import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "../schemas/authValidate.js";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, currentUser } from "../store/Slices/authSlice.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth?.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    const login = await dispatch(loginUser(data));
    const user = await dispatch(currentUser());

    if (user && login?.payload) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-gray-900 text-white items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white overflow-hidden">
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-sm text-gray-400">Please enter your details</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  {...register("email")}
                  className={`block w-full rounded-md bg-gray-800 text-white border ${errors.email ? "border-red-500" : "border-gray-700"
                    } py-2 pl-10 pr-3 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  {...register("password")}
                  className={`block w-full rounded-md bg-gray-800 text-white border ${errors.password ? "border-red-500" : "border-gray-700"
                    } py-2 pl-10 pr-3 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-900 px-2 text-gray-400">Or With</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-800">
        <div className="max-w-lg text-center px-6">
          <h2 className="text-3xl font-bold text-white">Welcome to LeetLab</h2>
          <p className="mt-4 text-sm text-gray-400">
            Your personal coding lab to practice, compete, and grow.
            Sharpen your problem-solving skills with real-world coding challenges, track your progress, and get ready for interviews.
          </p>
        </div>
      </div>
    </div>
  );
}
