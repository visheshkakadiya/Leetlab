import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Brain, Bot, Terminal } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "../schemas/authValidate.js";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, currentUser, googleLogin } from "../store/Slices/authSlice.js";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import toast from "react-hot-toast";
import LoaderDefault from "../components/LoaderDefault.jsx";
import { motion } from "framer-motion";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth?.isLoading);

  const [showPassword, setShowPassword] = useState(false);

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
      navigate("/problems");
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-screen bg-[#0e1111]">
        <LoaderDefault />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#0b0e10] text-white relative overflow-hidden px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute w-[600px] h-[600px] rounded-full bg-blue-500 blur-3xl -top-40 -left-40"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute w-[600px] h-[600px] rounded-full bg-purple-600 blur-3xl bottom-[-200px] right-[-200px]"
      />

      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-extrabold text-blue-400 drop-shadow-lg cursor-pointer"
          onClick={() => navigate("/")}
        >
          NexCode
        </h1>
        <p className="mt-2 text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          AI-powered coding lab to{" "}
          <span className="text-blue-400">analyze your solutions</span>,{" "}
          <span className="text-green-400">chat with bots</span> for instant
          help, and{" "}
          <span className="text-purple-400">master coding challenges</span>.
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-gray-900/70 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-800"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter your Email"
                {...register("email")}
                className={`block w-full rounded-lg bg-gray-800 text-white border ${errors.email ? "border-red-500" : "border-gray-700"
                  } py-2 pl-10 pr-3 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                {...register("password")}
                className={`block w-full rounded-lg bg-gray-800 text-white border ${errors.password ? "border-red-500" : "border-gray-700"
                  } py-2 pl-10 pr-10 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="cursor-pointer w-full rounded-md bg-gradient-to-r from-blue-600 to-purple-600 py-2 px-4 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30"
          >
            Sign In
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-900/70 px-2 text-gray-400">Or With</span>
          </div>
        </div>

        <div className="w-full mt-4 flex justify-center">
          <GoogleLogin
            theme="filled_blue"
            onSuccess={(credentialResponse) => {
              dispatch(googleLogin(credentialResponse))
                .unwrap()
                .then(() => {
                  setTimeout(() => {
                    navigate("/problems");
                  }, 2000);
                })
                .catch((error) => {
                  console.error("Google login error:", error);
                  toast.error("Login failed");
                });
            }}
            onError={() => {
              toast.error("Login with Google Failed");
            }}
          />
        </div>

        <div className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-500 hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-8 flex flex-wrap justify-center gap-6 text-gray-400 text-sm"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <span>AI Code Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-green-400" />
          <span>Chat with Code Bots</span>
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          <span>Interactive Challenges</span>
        </div>
      </motion.div>
    </div>
  );
}