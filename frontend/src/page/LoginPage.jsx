import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from '../schemas/authValidate.js';
import { useSelector, useDispatch } from 'react-redux'
import { loginUser, currentUser } from '../store/Slices/authSlice.js';

export default function LoginPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth?.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema)
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
      <div className="flex h-screen w-screen overflow-hidden">
        <div className="flex w-full flex-col justify-center bg-white p-8 lg:w-1/2">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-black">Loading...</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left side - Login Form */}
      <div className="flex w-full flex-col justify-center bg-white p-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">Welcome Back</h1>
            <p className="text-sm text-gray-500">Please enter your details</p>
          </div>

          <div className="mt-8 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                    className={`block w-full rounded-md border ${errors.email ? "border-red-500" : "border-gray-300"} py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                    className={`block w-full rounded-md border ${errors.password ? "border-red-500" : "border-gray-300"} py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                  />
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or With</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google */}
              <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  {/* Google logo paths */}
                </svg>
                Google
              </button>

              {/* Apple */}
              <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  {/* Apple logo path */}
                </svg>
                Apple
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="hidden h-full lg:flex lg:w-1/2 items-center justify-center bg-blue-100">
        <div className="max-w-lg text-center px-6">
          <h2 className="text-3xl font-bold text-gray-800">SmartSave</h2>
          <p className="mt-4 text-sm text-gray-600">
            Join the millions of smart investors who trust us to manage their finances. Log in to access your
            personalized dashboard, track your portfolio performance, and make informed investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
