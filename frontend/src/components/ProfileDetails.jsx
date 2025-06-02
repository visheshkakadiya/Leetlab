import React, { use, useEffect, useState } from 'react';
import {
    User,
    MapPin,
    Calendar,
    Trophy,
    Code,
    Eye,
    MessageSquare,
    Star,
    TrendingUp,
    Award,
    GitBranch,
    Zap,
    ScrollText,
    BookCheck
} from 'lucide-react';
import { getAllProblems } from '../store/Slices/problemSlice.js'
import { getUserPlaylists } from '../store/Slices/playlistSlice.js'
import { useSelector, useDispatch } from 'react-redux';
import { getAllSubmissions } from '../store/Slices/submissionsSlice.js';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

export function ProfileDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useParams();
    const [activeTab, setActiveTab] = useState('submissions');

    const problems = useSelector((state) => state.problem?.problems);
    const playlists = useSelector((state) => state.playlist?.playlists);
    const submissions = useSelector((state) => state.submissions?.submissions);

    // console.log('playlists', playlists);
    // console.log('submissions', submissions);
    // console.log('problems', problems);

    useEffect(() => {
        dispatch(getAllProblems());
        dispatch(getUserPlaylists(userId));
        dispatch(getAllSubmissions());
    }, [dispatch]);

    // Calculate stats from your data
    const AcceptedSubmissions = submissions?.filter(submission => submission.status === 'Accepted') || [];
    // console.log('AcceptedSubmissions', AcceptedSubmissions);

    const totalProblems = problems?.length || 0;
    const totalSolved = problems?.flatMap((problem) => problem.solvedBy.map((entry) => entry.problemId)).length || 0;
    const totalSubmissions = submissions?.length || 0;

    const totalEasy = problems?.filter((problem) => problem.difficulty === 'EASY').length || 0;
    const totalMedium = problems?.filter((problem) => problem.difficulty === 'MEDIUM').length || 0;
    const totalHard = problems?.filter((problem) => problem.difficulty === 'HARD').length || 0;

    const EasySolved = AcceptedSubmissions.filter((easy) => easy.problem.difficulty === 'EASY').map((sub) => sub.problemId) || [];
    const uniqueEasySolved = [...new Set(EasySolved)];
    const MediumSolved = AcceptedSubmissions.filter((medium) => medium.problem.difficulty === 'MEDIUM').map((sub) => sub.problemId) || [];
    const uniqueMediumSolved = [...new Set(MediumSolved)];
    const HardSolved = AcceptedSubmissions.filter((hard) => hard.problem.difficulty === 'HARD').map((sub) => sub.problemId) || [];
    const uniqueHardSolved = [...new Set(HardSolved)];

    const javascriptSolved = AcceptedSubmissions
        ?.filter((sub) => sub.language === 'Javascript')
        .map((sub) => sub.problemId) || [];

    const uniqueJavascriptSolved = [...new Set(javascriptSolved)];

    const pythonSolved = AcceptedSubmissions
        ?.filter((sub) => sub.language === 'Python')
        .map((sub) => sub.problemId) || [];

    const uniquePythonSolved = [...new Set(pythonSolved)];

    const javaSolved = AcceptedSubmissions
        ?.filter((sub) => sub.language === 'Java')
        .map((sub) => sub.problemId) || [];

    const uniqueJavaSolved = [...new Set(javaSolved)];

    const acceptanceRate = totalSubmissions > 0 ? ((AcceptedSubmissions.length / totalSubmissions) * 100).toFixed(2) : 0;
    // console.log('acceptanceRate', acceptanceRate);

    // Language stats from your calculated data
    const languages = [
        { name: 'JavaScript', problems: uniqueJavascriptSolved.length, color: 'bg-yellow-500' },
        { name: 'Python', problems: uniquePythonSolved.length, color: 'bg-blue-500' },
        { name: 'Java', problems: uniqueJavaSolved.length, color: 'bg-red-500' }
    ].filter(lang => lang.problems > 0);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toUpperCase()) {
            case 'EASY': return 'text-green-400';
            case 'MEDIUM': return 'text-yellow-400';
            case 'HARD': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusColor = (status) => {
        return status === 'Accepted' ? 'text-green-400' : 'text-red-400';
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-[#0e1111] text-white p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Sidebar - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-[#222222] rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center space-x-4 pb-4 border-b border-gray-700">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <User size={32} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-1">Your Name</h2>
                                <p className="text-gray-400 mb-2">@username</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-400">
                                        <MapPin size={14} className="mr-1" />
                                        <span className="text-sm">Location</span>
                                    </div>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-xs font-medium transition-colors">
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-blue-400">Community Stats</h3>
                                <div className="bg-white/10 px-3 py-1 rounded-lg">
                                    <span className="text-xs text-gray-300">Rank #-</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: Eye, label: 'Views', value: 0 },
                                    { icon: Code, label: 'Solutions', value: totalSolved },
                                    { icon: MessageSquare, label: 'Discussions', value: 0 },
                                    { icon: Star, label: 'Reputation', value: 0 }
                                ].map((stat, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <stat.icon size={16} className="text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium text-white">{stat.value.toLocaleString()}</div>
                                            <div className="text-xs text-gray-400">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="bg-[#222222] rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Code size={20} className="mr-2 text-purple-400" />
                            Languages Used
                        </h3>
                        <div className="space-y-3">
                            {languages.length > 0 ? languages.map((lang, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full ${lang.color} mr-3`}></div>
                                        <span className="text-gray-300">{lang.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">{lang.problems} solved</span>
                                </div>
                            )) : (
                                <p className="text-gray-400 text-sm">No languages data yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Progress Stats */}
                    <div className="bg-[#222222] rounded-2xl p-6 border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <div className="flex items-center space-x-6">
                                <div className="relative w-32 h-32">
                                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50" cy="50" r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-gray-700"
                                        />
                                        <circle
                                            cx="50" cy="50" r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={`${totalProblems > 0 ? (totalSolved / totalProblems) * 251.2 : 0} 251.2`}
                                            className="text-emerald-500"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-[18px] font-bold">{totalSolved}/{totalProblems}</span>
                                        <span className="text-gray-400 text-[14px]">Solved</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { label: 'Easy', solved: uniqueEasySolved.length, total: totalEasy, color: 'text-green-400' },
                                        { label: 'Medium', solved: uniqueMediumSolved.length, total: totalMedium, color: 'text-yellow-400' },
                                        { label: 'Hard', solved: uniqueHardSolved.length, total: totalHard, color: 'text-red-400' }
                                    ].map((difficulty, index) => (
                                        <div key={index} className="flex items-center justify-between gap-2">
                                            <span className={`${difficulty.color} text-sm font-medium`}>{difficulty.label}</span>
                                            <span className="text-gray-300 text-sm">
                                                {difficulty.solved}/{difficulty.total}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="relative w-32 h-32">
                                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50" cy="50" r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-gray-700"
                                        />
                                        <circle
                                            cx="50" cy="50" r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={`${(acceptanceRate / 100) * 251.2} 251.2`}
                                            className="text-blue-500"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-1xl font-bold">{acceptanceRate}%</span>
                                        <span className="text-gray-400 text-[14px]">Acceptance</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Total Submissions:</span>
                                        <span className="text-white font-medium">{totalSubmissions}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Accepted:</span>
                                        <span className="text-green-400 font-medium">{totalSolved}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300">Acceptance Rate:</span>
                                        <span className="text-blue-400 font-medium ml-4">{acceptanceRate}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Contribution Graph */}
                    <div className="bg-[#222222] rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Contribution Activity</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <span>Less</span>
                                <div className="flex space-x-1">
                                    {[0, 1, 2, 3, 4].map(intensity => (
                                        <div key={intensity} className={`w-3 h-3 rounded-sm ${intensity === 0 ? 'bg-gray-800' :
                                            intensity === 1 ? 'bg-emerald-900' :
                                                intensity === 2 ? 'bg-emerald-700' :
                                                    intensity === 3 ? 'bg-emerald-500' :
                                                        'bg-emerald-400'
                                            }`}></div>
                                    ))}
                                </div>
                                <span>More</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <CalendarHeatmap
                                startDate={new Date('2016-01-01')}
                                endDate={new Date('2016-12-01')}
                                values={[
                                    { date: '2016-01-01', count: 12 },
                                    { date: '2016-01-22', count: 122 },
                                    { date: '2016-01-30', count: 38 },
                                ]}
                                classForValue={(value) => {
                                    if (!value) {
                                        return 'color-gray';
                                    }
                                    if (value.count > 100) {
                                        return 'color-scale-4';
                                    }
                                    if (value.count > 50) {
                                        return 'color-scale-3';
                                    }
                                    if (value.count > 20) {
                                        return 'color-scale-2';
                                    }
                                    return 'color-scale-1';
                                }}
                            />
                        </div>

                        <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
                            <span>{totalSubmissions} submissions in the past year</span>
                            <div className="flex space-x-4">
                                <span>Total active days: -</span>
                                <span>Max streak: -</span>
                                <span>Current streak: -</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Tabs */}
                    <div className="bg-[#222222] rounded-2xl border border-gray-700">
                        <div className="flex border-b border-gray-700">
                            {[
                                { id: 'submissions', label: 'Submissions', icon: Code },
                                { id: 'playlists', label: 'Playlists', icon: ScrollText },
                                { id: 'solutions', label: 'Solutions', icon: BookCheck },
                                { id: 'discussions', label: 'Discussions', icon: MessageSquare }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                                        ? 'text-blue-400 border-b-2 border-blue-400'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <tab.icon size={16} className="mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {activeTab === 'submissions' && (
                                <div className="space-y-4">
                                    {submissions && submissions.length > 0 ? (
                                        submissions.slice(0, 10).map((submission, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors hover:cursor-pointer"
                                                onClick={() => navigate(`/problem/${submission.problem?.id}`)}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <Code size={20} className="text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-white">{submission.problem?.title || 'Unknown Problem'}</h4>
                                                        <div className="flex items-center space-x-3 mt-1">
                                                            <span className={`text-sm ${getDifficultyColor(submission.problem?.difficulty)}`}>
                                                                {submission.problem?.difficulty || 'Unknown'}
                                                            </span>
                                                            <span className={`text-sm ${getStatusColor(submission.status)}`}>
                                                                {submission.status}
                                                            </span>
                                                            <span className="text-sm text-gray-400">
                                                                {submission.language}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    {formatDate(submission.createdAt)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <Code size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>No submissions found</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'playlists' && (
                                <div className="space-y-4">
                                    {playlists && playlists.length > 0 ? (
                                        playlists.map((playlist, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors hover:cursor-pointer"
                                                onClick={() => navigate(`/playlist/${playlist.id}`)}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <ScrollText size={20} className="text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-white">{playlist.name}</h4>
                                                        <div className="flex items-center space-x-3 mt-1">
                                                            <span className="text-sm text-gray-400">
                                                                {playlist.problems?.length || 0} problems
                                                            </span>
                                                            <span className="text-sm text-gray-400">
                                                                Updated: {formatDate(playlist.updatedAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <ScrollText size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>No playlists found</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(activeTab === 'solutions' || activeTab === 'discussions') && (
                                <div className="text-center py-8 text-gray-400">
                                    <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Coming soon...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};