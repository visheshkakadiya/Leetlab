import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AddToPlaylist } from "./AddToPlaylist.jsx";
import Dropdown from "./DropDown.jsx";
import { totalSubmissionsForProblem } from "../store/Slices/submissionsSlice.js";
import { Check } from "lucide-react";

const ProblemsTable = ({ problems }) => {
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.user);

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("ALL");
    const [selectedTag, setSelectedTag] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredRow, setHoveredRow] = useState(null);
    const totalSubmissions = useSelector((state) => state.submissions.submissionCount);

    useEffect(() => {
        dispatch(totalSubmissionsForProblem(problems?.map((p) => p.id)));
    }, [dispatch, problems]);

    const allTags = useMemo(() => {
        if (!Array.isArray(problems)) return [];
        const tagsSet = new Set();
        problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
        return Array.from(tagsSet);
    }, [problems]);

    const difficulties = ["EASY", "MEDIUM", "HARD"];

    const filteredProblems = useMemo(() => {
        return (problems || [])
            .filter((problem) =>
                problem.title.toLowerCase().includes(search.toLowerCase())
            )
            .filter((problem) =>
                difficulty === "ALL" ? true : problem.difficulty === difficulty
            )
            .filter((problem) =>
                selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
            );
    }, [problems, search, difficulty, selectedTag]);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
    const paginatedProblems = useMemo(() => {
        return filteredProblems.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredProblems, currentPage]);

    return (
        <div className="w-full max-w-6xl mx-auto mt-10">

            <div className="flex flex-wrap justify-start items-center mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search by title..."

                    className="input input-bordered w-full md:max-w-xs bg-[#222222] text-white border-gray-700 rounded-lg py-2 px-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="select select-bordered w-full md:w-48  bg-[#222222] text-white border-gray-700 rounded-lg py-2 px-4"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="ALL">All Difficulties</option>
                    {difficulties.map((diff) => (
                        <option key={diff} value={diff}>
                            {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
                <select
                    className="select select-bordered w-full md:w-48 bg-[#222222] text-white border-gray-700 rounded-lg py-2 px-4"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                >
                    <option value="ALL">All Tags</option>
                    {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto rounded-xl">
                <table className="table table-md w-full text-sm text-left text-white p-0 ">
                    <tbody>
                        {paginatedProblems.length > 0 ? (
                            paginatedProblems.map((problem, index) => {

                                const isSolved = Array.isArray(problem.solvedBy)
                                    ? problem.solvedBy.some(user => user.userId === authUser?.id)
                                    : false;

                                const currentIndex = index + 1 + (currentPage - 1) * itemsPerPage;
                                const isDemoIndex = [1, 2, 6, 10].includes(currentIndex);

                                return (
                                    <tr
                                        key={problem.id}
                                        onMouseEnter={() => setHoveredRow(problem.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        className="transition-colors hover:bg-[#222222]"
                                    >
                                        <td colSpan={6} className="p-0">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    {isSolved ? <Check className="text-green-400" size={20} />
                                                        : (
                                                            <div className="w-5"></div>
                                                        )
                                                    }
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-400 w-6">
                                                            {currentIndex}.
                                                        </span>
                                                        <Link
                                                            className="truncate hover:underline font-medium text-white"
                                                            to={`/problem/${problem.id}`}
                                                        >
                                                            {problem.title}
                                                        </Link>
                                                        {isDemoIndex && (
                                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                                                                demo
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 shrink-0">
                                                    <span className="relative group text-gray-300 text-sm w-4 text-center">
                                                        {totalSubmissions?.[problem.id] ?? 0}
                                                        <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 rounded bg-gray-700 px-2 py-1 text-xs text-white whitespace-nowrap group-hover:scale-100 transition-transform origin-bottom">
                                                            Total submissions
                                                        </span>
                                                    </span>

                                                    <span
                                                        className={`text-sm font-medium w-16 text-left ${problem.difficulty === "EASY"
                                                            ? "text-green-400"
                                                            : problem.difficulty === "MEDIUM"
                                                                ? "text-yellow-400"
                                                                : "text-red-400"
                                                            }`}
                                                    >
                                                        {problem.difficulty}
                                                    </span>

                                                    <span
                                                        className={`transition-opacity duration-200 ${hoveredRow === problem.id ? "opacity-100" : "opacity-0"
                                                            }`}
                                                    >
                                                        <AddToPlaylist problemId={problem.id} />
                                                    </span>

                                                    {authUser?.role === "ADMIN" && <Dropdown problemId={problem.id} />}
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    No problems found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-6 gap-2">
                <button
                    className="btn btn-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                    Prev
                </button>
                <span className="btn btn-ghost btn-sm">
                    {currentPage} / {totalPages}
                </span>
                <button
                    className="btn btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProblemsTable;