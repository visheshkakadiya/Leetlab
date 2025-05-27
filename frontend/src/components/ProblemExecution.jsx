import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Users,
    MessageSquare,
    Settings,
    CloudUpload,
    Maximize,
    Minimize
} from "lucide-react";
import Editor from '@monaco-editor/react';
import { getProblemById } from "../store/Slices/problemSlice.js";
import { getLanguageId } from "../helper/language.js";
import { submitCode, runCode } from "../store/Slices/ExecuteSlice.js";
import { getSubmissionsForProblem, totalSubmissionsForProblem } from "../store/Slices/submissionsSlice.js";
import SubmissionResults from "../components/Submission.jsx";
import SubmissionsList from "../components/SubmissionList.jsx";

export const ProblemExecution = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const problem = useSelector((state) => state.problem.problem);
    console.log("problem", problem);
    const problemLoading = useSelector((state) => state.problem.loading);
    const executing = useSelector((state) => state.execute.executing);

    const submissionsLoading = useSelector((state) => state.submissions?.loading);
    const submissions = useSelector((state) => state.submissions?.submission);

    const submission = useSelector((state) => state.execute.submission);
    // const totalSubmission = useSelector((state) => state.submissions.submissionCount);

    const [code, setCode] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [testcases, setTestCases] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getProblemById(id));
            // dispatch(totalSubmissionsForProblem(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (problem) {
            setCode(
                problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
            );
            setTestCases(
                problem.testcases?.map((tc) => ({ input: tc.input, output: tc.output })) || []
            );
        }
    }, [problem, selectedLanguage]);

    useEffect(() => {
        if (activeTab === "submissions" && id) {
            dispatch(getSubmissionsForProblem(id));
        }
    }, [activeTab, id, dispatch]);

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        setCode(problem?.codeSnippets?.[lang] || "");
    };

    const handleRunCode = (e) => {
        e.preventDefault();
        try {
            const language_id = getLanguageId(selectedLanguage);
            const stdin = problem?.testcases?.map((tc) => tc.input) || [];
            const expected_outputs = problem?.testcases?.map((tc) => tc.output) || [];
            dispatch(submitCode({ code, language_id, stdin, expected_outputs, id }));
        } catch (error) {
            console.log("Error executing code", error);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "description":
                return (
                    <div className="text-sm text-gray-300 leading-relaxed">
                        <div className="mb-6">
                            <p className="mb-4">{description}</p>
                            <p className="text-gray-400 italic">{note}</p>
                        </div>
                        <div className="space-y-4">
                            {examples.map((example, index) => (
                                <div key={index} className="bg-[#353839] rounded-lg p-4">
                                    <div className="font-semibold text-white mb-2">Example {index + 1}:</div>
                                    <div className="space-y-2 font-mono text-sm">
                                        <div><span className="text-blue-400">Input:</span> {example.input}</div>
                                        <div><span className="text-green-400">Output:</span> {example.output}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <div className="font-semibold text-white mb-2">Constraints:</div>
                            <div className="bg-[#353839] rounded-lg p-3 font-mono text-sm">
                                {constraints}
                            </div>
                        </div>
                    </div>
                );
            case "editorial":
                return <div className="text-center text-gray-400 py-8">Editorial content would go here</div>;
            case "solutions":
                return <div className="text-center text-gray-400 py-8">Community solutions would go here</div>;
            case "submissions":
                return <div className="text-center text-gray-400 py-8">Your submissions would go here</div>;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-[#222222] text-white flex flex-col w-full">
            Top Navigation
            <div className="bg-[#222222] border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                        <span className="text-sm text-gray-400">Problem List</span>
                    </div>
                    <div className="w-px h-6 bg-gray-600"></div>
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium">{problem.title}</span>
                    </div>
                </div>

                <button className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm font-medium flex gap-2">
                    <CloudUpload size={20} />
                    Submit
                </button>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">{difficulty}</span>
                        <Users className="w-4 h-4" />
                        <span>14.1K</span>
                        <MessageSquare className="w-4 h-4" />
                        <span>534</span>
                    </div>
                    <button className="p-2 hover:bg-gray-700 rounded">
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Panel - Problem Description */}
                <div
                    className={`${isFullscreen ? "absolute top-0 left-0 w-full h-full z-50 bg-[#222222]" : "ml-2 mb-2 w-1/2"} 
                        border border-gray-700 rounded-xl overflow-hidden flex flex-col transition-all duration-300`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >


                    <div className="bg-[#222222] border-b border-gray-700 flex items-center justify-between flex-shrink-0 rounded-t-xl px-2">
                        {/* Tabs */}
                        <div className="flex">
                            {[
                                ["description", "Description"],
                                ["editorial", "Editorial"],
                                ["solutions", "Solutions"],
                                ["submissions", "Submissions"]
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                                        ? "border-orange-500 text-white bg-[#222222]"
                                        : "border-transparent text-gray-400 hover:text-white hover:bg-gray-700"
                                        }`}
                                    onClick={() => setActiveTab(key)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Fullscreen Toggle Button */}
                        <div className="ml-auto pr-2 flex items-center">
                            {isHovered && !isFullscreen && (
                                <button
                                    className="z-10 bg-transparent bg-opacity-50 text-white px-2 py-1 rounded hover:bg-opacity-75"
                                    onClick={() => setIsFullscreen(true)}
                                >
                                    <Maximize size={20} />
                                </button>
                            )}
                            {isFullscreen && (
                                <button
                                    className="z-10 bg-transparent bg-opacity-50 text-white px-2 py-1 rounded hover:bg-opacity-75"
                                    onClick={() => setIsFullscreen(false)}
                                >
                                    <Minimize size={20} />
                                </button>
                            )}
                        </div>
                    </div>


                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {renderTabContent()}
                    </div>
                </div>

                {/* Right Panel */}
                {!isFullscreen && (
                    <div className="w-1/2 p-6 overflow-y-auto">
                        <div className="bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 py-2">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Code2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Code</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                    <span>Accepted</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center space-x-2">
                                <select
                                    className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white"
                                    value={selectedLanguage}
                                    onChange={handleLanguageChange}
                                >
                                    {Object.keys(problem.codeSnippets || {}).map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                        </option>
                                    ))}
                                </select>

                                <button className="p-1 hover:bg-gray-700 rounded text-white">
                                    <RotateCcw className="w-4 h-4"
                                        onClick={() => setCode(problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || "")}
                                    />
                                </button>
                                <button className="p-1 hover:bg-gray-700 rounded text-white">
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Editor Panel */}
                        <div className="flex-1 bg-gray-900 relative h-[500px]">
                            <div className="absolute inset-0 font-mono text-sm">
                                <div className="h-full flex">
                                    {/* Code Textarea */}
                                    <Editor
                                        height="100%"
                                        language={selectedLanguage.toLowerCase()}
                                        theme="vs-dark"
                                        value={code}
                                        onChange={(value) => setCode(value || "")}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 20,
                                            lineNumbers: "on",
                                            roundedSelection: false,
                                            scrollBeyondLastLine: false,
                                            readOnly: false,
                                            automaticLayout: true,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
