import React, { useEffect } from "react";
import { getAllProblems } from "../store/Slices/problemSlice.js";
import { Loader } from "lucide-react";
import ProblemsTable from "../components/Problems.jsx";
import { useSelector, useDispatch } from "react-redux";

const ProbemPage = () => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.problem?.loading);
    const problems = useSelector((state) => state.problem?.problems);

    useEffect(() => {
        dispatch(getAllProblems());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center px-4 bg-[#0e1111]">
            {/* Compact Header Section */}
            <div className="w-full max-w-6xl bg-[#1a1d1f] rounded-xl px-6 py-5 mt-6 mb-6 border border-[#2e2e2e] shadow-md flex justify-between items-center">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">
                        💡 Ready to solve problems?
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Browse challenges and sharpen your coding skills!
                    </p>
                </div>
                <div className="hidden md:block bg-primary text-black font-semibold px-4 py-2 rounded-lg shadow hover:brightness-110 transition">
                    LeetLab 🚀
                </div>
            </div>

            {/* Problems Table */}
            {problems?.length > 0 ? (
                <ProblemsTable problems={problems} />
            ) : (
                <p className="mt-10 text-center text-lg font-semibold text-gray-400 border border-primary px-4 py-2 rounded-md border-dashed">
                    No problems found
                </p>
            )}
        </div>
    );
};

export default ProbemPage;
