import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Brain, Bot, Terminal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SignUpSchema } from "../schemas/authValidate.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser, googleLogin } from "../store/Slices/authSlice.js";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import LoaderDefault from "@/components/LoaderDefault.jsx";

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
      const { email, password } = data;
      const loginResult = await dispatch(loginUser({ email, password }));

      if (loginResult?.type === "login/fulfilled") {
        navigate("/");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0e1111] w-full">
        <LoaderDefault />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#0b0e10] text-white relative overflow-hidden">
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
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-12 relative z-10"
      >
        <div className="max-w-lg">
          <h1 className="cursor-pointer text-5xl font-extrabold text-blue-400 drop-shadow-lg mb-6"
            onClick={() => navigate("/")}
          >
            NexCode
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            AI-powered coding lab to{" "}
            <span className="text-blue-400 font-semibold">analyze your solutions</span>,{" "}
            <span className="text-green-400 font-semibold">chat with bots</span> for instant
            help, and{" "}
            <span className="text-purple-400 font-semibold">master coding challenges</span>.
          </p>

          <div className="space-y-4 mt-12">
            <div className="flex items-center gap-4 bg-gray-900/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Code Analysis</h3>
                <p className="text-gray-400 text-sm">Get instant feedback on your code quality</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-900/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Chat with Code Bots</h3>
                <p className="text-gray-400 text-sm">24/7 assistance for your coding questions</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-900/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Terminal className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Interactive Challenges</h3>
                <p className="text-gray-400 text-sm">Practice with real-world coding problems</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-8 relative z-10 mr-20"
      >
        <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-800">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-sm text-gray-400 mt-2">
              Join thousands of developers mastering their craft
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <GoogleLogin
              theme="filled_blue"
              onSuccess={(credentialResponse) => {
                dispatch(googleLogin(credentialResponse));
                setTimeout(() => {
                  navigate("/problems");
                }, 2000);
              }}
              onError={() => {
                console.log("Google Signup Failed");
              }}
            />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-900/70 px-2 text-gray-400">Or Sign Up With</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  {...register("name")}
                  className={`block w-full rounded-lg bg-gray-800 text-white border ${errors.name ? "border-red-500" : "border-gray-700"
                    } py-2 pl-10 pr-3 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="cursor-pointer w-full rounded-md bg-gradient-to-r from-blue-600 to-purple-600 py-2 px-4 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30"
            >
              Create Account
            </motion.button>
          </form>

          <div className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}