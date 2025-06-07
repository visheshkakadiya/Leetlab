import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Users,
    MessageSquare,
    Settings,
    CloudUpload,
    Maximize,
    Minimize,
    Code2,
    Maximize2,
    RotateCcw,
    Play,
    Loader2,
    Dot,
    X,
    Building2,
    Lightbulb,
    ArrowUp,
    ArrowDown
} from "lucide-react";
import Editor from '@monaco-editor/react';
import { getProblemById } from "../store/Slices/problemSlice.js";
import { getLanguageId } from "../helper/language.js";
import { submitCode, runCode } from "../store/Slices/ExecuteSlice.js";
import { getSubmissionsForProblem, getSubmissionById } from "../store/Slices/submissionsSlice.js";
import { Submission } from "../components/Submission.jsx";
import SubmissionsList from "../components/SubmissionList.jsx";
import { useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const CodeEditor = React.memo(({ code, setCode, selectedLanguage }) => {
    return (
        <Editor
            height="100%"
            language={selectedLanguage.toLowerCase()}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
                minimap: { enabled: false },
                fontSize: 15,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
            }}
        />
    );
});
CodeEditor.displayName = 'CodeEditor';

export const ProblemDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const problem = useSelector((state) => state.problem?.problem);
    const problemLoading = useSelector((state) => state.problem.loading);

    const submitting = useSelector((state) => state.execute.executing);
    const running = useSelector((state) => state.execute.running);
    const submission = useSelector((state) => state.execute.submission);
    const runCodeRes = useSelector((state) => state.execute.runCodeRes);

    const timeArr = runCodeRes?.data?.map((res) => res.time || []);
    const avgTime = timeArr?.length > 0 ? timeArr.map((t) => parseFloat(t)).reduce((a, b) => a + b, 0) / timeArr.length : 0;

    const submissionsLoading = useSelector((state) => state.submissions?.loading);
    const submissions = useSelector((state) => state.submissions?.submission);
    const submissionIdData = useSelector((state) => state.submissions?.submissionIdData);

    const [code, setCode] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [testcases, setTestCases] = useState([]);
    const [submissionId, setSubmissionId] = useState(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeCase, setActiveCase] = useState(0);
    const [testTab, setTestTab] = useState("testCase");
    const [editorialTab, setEditorialTab] = useState("editorial");

    useEffect(() => {
        if (id) {
            dispatch(getProblemById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (problem) {
            const availableLanguages = Object.keys(problem.codeSnippets || {});
            let languageToUse = selectedLanguage;

            if (!availableLanguages.includes(selectedLanguage) && availableLanguages.length > 0) {
                languageToUse = availableLanguages.includes('javascript') ? 'javascript' : availableLanguages[0];
                setSelectedLanguage(languageToUse);
            }

            setCode(
                problem.codeSnippets?.[languageToUse] || submission?.sourceCode || ""
            );
            setTestCases(
                problem.testcases?.map((tc) => ({ input: tc.input, output: tc.output })) || []
            );
        }
    }, [problem]);

    useEffect(() => {
        if (problem && problem.codeSnippets) {
            setCode(problem.codeSnippets[selectedLanguage] || "");
        }
    }, [selectedLanguage, problem?.codeSnippets]);

    useEffect(() => {
        if (activeTab === "submissions" && id) {
            dispatch(getSubmissionsForProblem(id));
        }
    }, [activeTab, id, dispatch]);

    useEffect(() => {
        if (submissionId) {
            dispatch(getSubmissionById(submissionId));
            setEditorialTab("Accepted");
        }
    }, [submissionId, dispatch]);

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        setCode(problem?.codeSnippets?.[lang] || "");
    };

    const handleCodeRun = async () => {
        const language_id = getLanguageId(selectedLanguage);
        const stdin = problem?.testcases?.map((tc) => tc.input);
        const expected_outputs = problem?.testcases?.map((tc) => tc.output);
        await dispatch(runCode({ code, language_id, stdin, expected_outputs, id }));
        setTestTab("testCaseResult");
    }

    const handleSubmitCode = (e) => {
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

    const memoizedCodeEditor = useMemo(() => (
        <CodeEditor
            code={code}
            setCode={setCode}
            selectedLanguage={selectedLanguage}
        />
    ), [code, selectedLanguage]);

    if (problemLoading) return <Loader2 className="animate-spin" />

    const renderTabContent = () => {
        switch (activeTab) {
            case "description":
                return (
                    <div className="text-sm text-gray-300 leading-relaxed p-4">
                        {/* Problem Title and Company Tags */}
                        <div className="mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-white mb-2">{problem?.title}</h1>
                                    <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${problem?.difficulty === "EASY"
                                            ? "bg-green-600/20 text-green-300 border border-green-600/30"
                                            : problem?.difficulty === "MEDIUM"
                                                ? "bg-yellow-600/20 text-yellow-300 border border-yellow-600/30"
                                                : "bg-red-600/20 text-red-300 border border-red-600/30"
                                        }`}>
                                        {problem?.difficulty}
                                    </div>
                                </div>

                                {/* Company Tags - Right Side */}
                                {problem?.company && problem.company.length > 0 && (
                                    <div className="ml-4 flex-shrink-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm font-medium text-gray-400">Companies:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-end">
                                            {problem.company.map((comp, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-md text-xs font-medium border border-blue-600/30"
                                                >
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <p className="mb-4">{problem?.description}</p>
                        </div>

                        <div className="space-y-4">
                            {problem?.examples && Object.entries(problem.examples).map(([lang, example], index) => (
                                <div key={lang} className="bg-[#353839] rounded-lg p-4 space-y-3">
                                    <div className="font-semibold text-white mb-2">Example {index + 1} :</div>
                                    <div className="space-y-2 font-mono text-sm">
                                        <div><span className="text-blue-400">Input:</span> {example.input}</div>
                                        <div><span className="text-green-400">Output:</span> {example.output}</div>
                                    </div>
                                    {example.explanation && (
                                        <div>
                                            <div className="font-semibold text-white mb-2">Explanation:</div>
                                            <p className="text-base-content/70 font-sem">{example.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <div className="font-semibold text-white mb-2">Constraints:</div>
                            <div className="bg-[#353839] rounded-lg p-3 font-mono text-sm">
                                {problem?.constraints}
                            </div>
                        </div>

                        {problem?.hints && problem.hints.length > 0 && (
                            <div className="mt-6">
                                <Accordion
                                    sx={{
                                        backgroundColor: '#353839',
                                        color: 'white',
                                        '&:before': {
                                            display: 'none',
                                        },
                                        boxShadow: 'none',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ArrowDown className="text-white/50" />}
                                        aria-controls="hints-content"
                                        id="hints-header"
                                        sx={{
                                            backgroundColor: '#353839',
                                            '&:hover': {
                                                backgroundColor: '#404143'
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                                Hints 
                                            </Typography>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ backgroundColor: '#2d2d2d', padding: '16px' }}>
                                        <div className="bg-[#353839] rounded-lg p-3">
                                            <div className="flex items-start gap-2">
                                                <span className="text-yellow-400 font-bold text-sm mt-1">
                                                    1.
                                                </span>
                                                <Typography sx={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.5' }}>
                                                    {problem.hints}
                                                </Typography>
                                            </div>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        )}
                    </div>
                );
            case "editorial":
                return <div className="text-center text-gray-400 py-8">Editorial is under development</div>;
            case "solutions":
                return <div className="text-center text-gray-400 py-8">Community is under development</div>;
            case "submissions":
                return (
                    <SubmissionsList
                        submissions={submissions.data}
                        isLoading={submissionsLoading}
                        submissionId={setSubmissionId}
                    />
                )
            default:
                return null;
        }
    };

    const renderCaseContent = () => {
        switch (testTab) {
            case "testCase":
                return (
                    <>
                        <div className="flex space-x-2 mb-4">
                            {testcases.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveCase(idx)}
                                    className={`px-3 py-1 rounded font-medium text-sm ${activeCase === idx
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    Case {idx + 1}
                                </button>
                            ))}
                        </div>

                        {testcases[activeCase] && (
                            <div className="space-y-2 text-sm font-mono text-white">
                                <div className='bg-[#353839] rounded-lg p-3'>
                                    <span className="text-white/70">Input:</span>{" "}
                                    {testcases[activeCase].input}
                                </div>
                                <div className='bg-[#353839] rounded-lg p-3'>
                                    <span className="text-white/70">Expected Output:</span>{" "}
                                    {testcases[activeCase].output}
                                </div>
                            </div>
                        )}
                    </>
                );
            case "testCaseResult":
                return (
                    <>
                        {runCodeRes && Object.keys(runCodeRes).length > 0 ? (
                            <>
                                <div className="mb-0 p-2 pt-0 rounded-lg ">
                                    <div className={`text-xl font-bold mb-2 ${runCodeRes?.data[activeCase]?.passed === true ? 'text-green-400' : 'text-red-400'}`}>
                                        {runCodeRes?.data[activeCase]?.passed ? (
                                            <>
                                                Accepted <span className="text-white/80 text-sm ml-2 font-light">Runtime: {avgTime.toFixed(3)} s</span>
                                            </>
                                        ) : (
                                            <>Wrong Answer</>
                                        )}
                                    </div>
                                </div>

                                <div className="flex space-x-2 mb-4">
                                    {testcases.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveCase(idx)}
                                            className={`px-3 py-1 rounded font-medium text-sm flex items-center gap-2 ${activeCase === idx
                                                ? "bg-white/10 text-white"
                                                : "text-gray-400 hover:bg-white/10"
                                                }`}
                                        >
                                            {runCodeRes?.data[idx]?.passed === true ? (
                                                <Dot size={20} className="text-green-400" />
                                            ) : (
                                                <Dot size={20} className="text-red-400" />
                                            )}
                                            Case {idx + 1}
                                        </button>

                                    ))}
                                </div>

                                {testcases[activeCase] && (
                                    <div className="space-y-3 text-sm font-mono text-white">
                                        <div className='bg-white/5 rounded-lg p-3 border border-gray-700'>
                                            <div className="text-gray-300 font-medium mb-2">Input:</div>
                                            <div className="text-white p-0 rounded">{testcases[activeCase].input}</div>
                                        </div>
                                        <div className='bg-white/5 rounded-lg p-3 border border-gray-700'>
                                            <div className="text-gray-300 font-medium mb-2">Output:</div>
                                            {runCodeRes?.data[activeCase]?.stderr || runCodeRes?.data[activeCase]?.compile_output ? (
                                                <div className="text-red-500 p-0 rounded">{runCodeRes?.data[activeCase]?.stderr || runCodeRes?.data[activeCase]?.compile_output}</div>
                                            ) : (
                                                <div className="text-white p-0 rounded">{runCodeRes?.data[activeCase]?.stdout}</div>
                                            )}
                                        </div>
                                        <div className='bg-white/5 rounded-lg p-3 border border-gray-700'>
                                            <div className="text-gray-300 font-medium mb-2">Expected Output:</div>
                                            <div className="text-white p-0 rounded">{testcases[activeCase].output}</div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-gray-400 py-12">
                                <div className="text-lg mb-2">No test results yet</div>
                                <div className="text-sm">Run your code to see the results</div>
                            </div>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className='h-screen bg-[#222222] text-white flex flex-col w-full'>
            <div className="bg-[#222222] border-b border-gray-700 px-2 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2" onClick={() => navigate("/problems")}>
                        <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                        <span className="text-sm text-gray-400 hover:text-white hover:cursor-pointer">Problem List</span>
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <button
                        className={`px-3 py-2 rounded text-sm font-medium flex gap-2 bg-blue-600 hover:bg-blue-700
      ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleCodeRun}
                        disabled={submitting}
                    >
                        {running && !submitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Running
                            </>
                        ) : (
                            <>
                                <Play size={20} />
                                Run
                            </>
                        )}
                    </button>

                    <button
                        className={`px-3 py-2 rounded text-sm font-medium flex gap-2 bg-green-600 hover:bg-green-700
                                ${running ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleSubmitCode}
                        disabled={running}
                    >
                        {submitting && !running ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Compiling
                            </>
                        ) : (
                            <>
                                <CloudUpload size={20} />
                                Submit
                            </>
                        )}
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
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

            <div className="flex flex-1 overflow-hidden relative gap-2 mr-2">
                <div
                    className={`${isFullscreen ? "absolute top-0 left-0 w-full h-full z-50 bg-[#222222]" : "ml-2 mb-2 w-1/2"} 
                                border border-gray-700 rounded-xl overflow-hidden flex flex-col transition-all duration-300`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="bg-[#222222] border-b border-gray-700 flex items-center justify-between flex-shrink-0 rounded-t-xl px-2">
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
                                        : "border-transparent text-gray-400 hover:text-white hover:bg-white/10"
                                        }`}
                                    onClick={() => setActiveTab(key)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

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
                    <div className="flex-1 overflow-y-auto p-0">
                        {renderTabContent()}
                    </div>
                </div>

                {!isFullscreen && (
                    <div className='w-1/2 flex flex-col h-full'>
                        <div className="bg-[#222222] border border-gray-700 rounded-t-lg flex items-center justify-between px-4 py-2 flex-shrink-0">
                            <div className="flex items-center space-x-4">
                                {[
                                    ["editorial", "Code"],
                                    ...(submissionId ? [["Accepted", "Submission"]] : []),
                                ].map(([Key, label]) => (
                                    <button
                                        key={Key}
                                        className={`flex px-4 py-2 text-sm font-medium border-b-2 transition-colors ${editorialTab === Key
                                            ? "border-orange-500 text-white bg-[#222222]"
                                            : "border-transparent text-gray-400 hover:text-white hover:bg-white/10"
                                            }`}
                                        onClick={() => setEditorialTab(Key)}
                                    >
                                        {label}
                                        {Key === "Accepted" && editorialTab === "Accepted" && (
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSubmissionId(null);
                                                    setEditorialTab("editorial");
                                                }}
                                                className="ml-1 text-gray-400 hover:text-white text-xs cursor-pointer"
                                            >
                                                <X size={15} className='mt-1 ml-1 hover:bg-white/10' />
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center space-x-2">
                                <select
                                    className="bg-[#222222] text-white border border-gray-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={selectedLanguage}
                                    onChange={handleLanguageChange}
                                >
                                    {Object.keys(problem?.codeSnippets || {}).map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    className="p-1 hover:bg-white/10 rounded text-white"
                                    onClick={() => setCode(problem?.codeSnippets?.[selectedLanguage] || submission?.sourceCode || "")}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button className="p-1 hover:bg-white/10 rounded text-white">
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Editor Panel */}
                        <div className="flex flex-col bg-[#222222] relative font-mono text-sm overflow-hidden gap-1 h-full">
                            {/* Code Editor Area */}
                            <div className="h-[60%] border border-gray-700 rounded-lg overflow-hidden">
                                {editorialTab === "editorial" ? (
                                    memoizedCodeEditor
                                ) : editorialTab === "Accepted" && submissionId ? (
                                    <Submission submission={submissionIdData} />
                                ) : (
                                    memoizedCodeEditor
                                )}
                            </div>

                            {/* Test Case Panel */}
                            <div className="h-[40%] bg-[#2d2d2d] border border-gray-700 rounded-lg flex flex-col overflow-hidden mb-2">
                                <div className="flex-shrink-0 bg-[#2d2d2d] border-b border-gray-600">
                                    <div className="flex">
                                        {[
                                            ["testCase", "Testcase"],
                                            ["testCaseResult", "Test Result"],
                                        ].map(([key, label]) => (
                                            <button
                                                key={key}
                                                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${testTab === key
                                                    ? "border-orange-500 text-white bg-[#2d2d2d]"
                                                    : "border-transparent text-gray-400 hover:text-white hover:bg-white/10"
                                                    }`}
                                                onClick={() => setTestTab(key)}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-3">
                                    {renderCaseContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};