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
  }, [dispatch, getAllProblems]);

  console.log("all problems:", problems);

  if(loading){
    return (
      <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center mt-14 px-4">
      <div className="absolute top-16 left-0 w-1/3 h-1/3 bg-primary opacity-30 blur-3xl rounded-md bottom-9"></div>
      <h1 className="text-4xl font-extrabold z-10 text-center">
        Welcome to <span className="text-primary">LeetLab</span>
      </h1>

      <p className="mt-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10">
        A Platform Inspired by Leetcode which helps you to prepare for coding
        interviews and helps you to improve your coding skills by solving coding
        problems
      </p>

      {
        problems?.length > 0 ? <ProblemsTable problems={problems}/> : (
            <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
          No problems found
        </p>
        )
      }
    </div>
  );
};

export default ProbemPage;