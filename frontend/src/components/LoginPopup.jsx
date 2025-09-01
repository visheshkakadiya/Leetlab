import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export const LoginPopup = () => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white/10 p-8 rounded-xl shadow-2xl w-[90%] max-w-md text-center relative">
        <h2 className="text-2xl font-bold text-white/90 mb-2">Access Required</h2>
        <p className="text-sm text-white/80 mb-4">Log in to unlock exclusive content and features.</p>

        <hr className="my-4 border-purple-200" />

        <p className="text-white/80 mb-6">Already have an account? Sign in to continue.</p>

        <Link to="/login">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md flex items-center justify-center w-full gap-2 transition">
            Sign In <ArrowRight size={18} />
          </button>
        </Link>

        <p className="mt-4 text-sm text-white/80">
          New here?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
