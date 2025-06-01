import React, { useEffect, useState } from 'react';
import {
  Play,
  Plus,
  Search,
  Target,
  Award,
  MoreVertical,
  Trash2,
  Check
} from 'lucide-react';
import { 
  getPlaylistById, 
  copyPlaylist, 
  deletePlaylist, 
  togglePublish, 
  RemoveProblemFromPlaylist 
} from '../store/Slices/playlistSlice.js';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import { currentUser } from '../store/Slices/authSlice.js';
import { useMemo } from 'react';
import { EditPlaylist } from './EditPlaylist.jsx';

export const Testing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector((state) => state.playlist?.loading);
  const playlist = useSelector((state) => state.playlist?.playlist);
  console.log("playlist", playlist);
  const user = useSelector((state) => state.auth?.user);

  // Calculate progress data
  const problemsInPlaylist = playlist?.problems?.map((problem) => problem?.problemId) || [];
  
  const problemSolved = playlist?.problems?.flatMap(
    (problem) => problem?.problem?.solvedBy?.map((entry) => entry?.problem?.id) || []
  );

  const uniqueSolved = [...new Set(problemSolved)];

  const totalSolved = problemsInPlaylist.filter((id) =>
    uniqueSolved.includes(id)
  ).length;

  const progress = problemsInPlaylist.length === 0 
    ? 0 
    : Math.round((totalSolved / problemsInPlaylist.length) * 100);

  // Difficulty counts
  const totalEasyProblems = playlist?.problems?.filter(
    (problem) => problem?.problem?.difficulty === 'EASY'
  ).length || 0;
  
  const totalMediumProblems = playlist?.problems?.filter(
    (problem) => problem?.problem?.difficulty === 'MEDIUM'
  ).length || 0;
  
  const totalHardProblems = playlist?.problems?.filter(
    (problem) => problem?.problem?.difficulty === 'HARD'
  ).length || 0;

  const totalSolvedEasy = playlist?.problems?.filter(
    (problem) => problem?.problem?.solvedBy?.some(
      (entry) => entry?.problem?.difficulty === 'EASY'
    )
  ).length || 0;
  
  const totalSolvedMedium = playlist?.problems?.filter(
    (problem) => problem?.problem?.solvedBy?.some(
      (entry) => entry?.problem?.difficulty === 'MEDIUM'
    )
  ).length || 0;
  
  const totalSolvedHard = playlist?.problems?.filter(
    (problem) => problem?.problem?.solvedBy?.some(
      (entry) => entry?.problem?.difficulty === 'HARD'
    )
  ).length || 0;

  // Extract all unique tags
  const allTags = useMemo(() => {
    if (!playlist?.problems) return [];
    
    const tagsSet = new Set();
    playlist.problems.forEach((p) => {
      p.problem?.tags?.forEach((tag) => tagsSet.add(tag));
    });
    
    return Array.from(tagsSet);
  }, [playlist]);

  // Filter problems based on search and filter
  const filteredProblems = useMemo(() => {
    if (!playlist?.problems) return [];
    
    return playlist.problems.filter((problemData) => {
      const problem = problemData.problem;
      const matchesSearch = problem?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isSolved = problem?.solvedBy?.some(entry => entry?.userId === user?.id);
      
      const matchesFilter = selectedFilter === 'all' ||
        (selectedFilter === 'solved' && isSolved) ||
        (selectedFilter === 'unsolved' && !isSolved) ||
        (selectedFilter === 'easy' && problem?.difficulty === 'EASY') ||
        (selectedFilter === 'medium' && problem?.difficulty === 'MEDIUM') ||
        (selectedFilter === 'hard' && problem?.difficulty === 'HARD');
      
      return matchesSearch && matchesFilter;
    });
  }, [playlist?.problems, searchQuery, selectedFilter, user?.id]);

  useEffect(() => {
    if (playlistId) {
      dispatch(getPlaylistById(playlistId));
      dispatch(currentUser());
    }
  }, [dispatch, playlistId]);

  const handleCopyPlaylist = () => {
    dispatch(copyPlaylist(playlistId));
    setIsDropdownOpen(false);
  };

  const handleDeletePlaylist = () => {
    dispatch(deletePlaylist(playlistId));
    navigate('/');
  };

  const handleTogglePublish = () => {
    dispatch(togglePublish(playlistId));
    setIsDropdownOpen(false);
  };

  const handleRemoveProblem = (problemId) => {
    dispatch(RemoveProblemFromPlaylist({ problemId, playlistId }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'text-emerald-400';
      case 'MEDIUM': return 'text-amber-400';
      case 'HARD': return 'text-rose-400';
      default: return 'text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-100">Loading...</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-100">Playlist not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar - Playlist Info */}
      <div className="w-80 bg-slate-900/50 border-r border-slate-800 flex flex-col">
        {/* Playlist Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">{playlist.name}</h1>
              <p className="text-sm text-slate-400">by {playlist?.user?.name}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button className="flex-1 bg-violet-600 hover:bg-violet-700 px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm font-medium">
              <Play className="w-4 h-4" />
              <span>Start Practice</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-slate-800 rounded-md shadow-lg z-50 py-1 text-sm border border-slate-700">
                  <button
                    onClick={handleCopyPlaylist}
                    className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors"
                  >
                    Fork
                  </button>
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleTogglePublish}
                    className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors"
                  >
                    {playlist.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={handleDeletePlaylist}
                    className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors text-red-400"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            {playlist.description}
          </p>
        </div>

        {/* Progress Section */}
        <div className="p-6 border-b border-slate-800">
          <h3 className="font-semibold text-slate-200 mb-6">Progress</h3>

          <div className="flex items-center justify-center mb-6">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress
                determinate
                value={progress}
                size="lg"
                sx={{
                  '--CircularProgress-size': '80px',
                  '--CircularProgress-trackThickness': '6px',
                  '--CircularProgress-progressThickness': '6px',
                  '--CircularProgress-trackColor': '#222222',
                  '--CircularProgress-progressColor': '#1976d2',
                }}
              >
                <Typography level="title-sm" color="primary">
                  {`${progress}%`}
                </Typography>
              </CircularProgress>
            </Box>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
              <div className="text-slate-400 mb-1 text-xs uppercase tracking-wide">Solved</div>
              <div className="text-xl font-bold text-emerald-400">{totalSolved}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
              <div className="text-slate-400 mb-1 text-xs uppercase tracking-wide">Total</div>
              <div className="text-xl font-bold text-slate-200">{playlist?.problems?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="p-6 border-b border-slate-800">
          <h3 className="font-semibold text-slate-200 mb-4">Difficulty Breakdown</h3>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent rounded-lg p-3 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-400">Easy</span>
                </div>
                <span className="text-sm font-bold text-emerald-400">{totalSolvedEasy}/{totalEasyProblems}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${totalEasyProblems > 0 ? (totalSolvedEasy / totalEasyProblems) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg p-3 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-amber-400">Medium</span>
                </div>
                <span className="text-sm font-bold text-amber-400">{totalSolvedMedium}/{totalMediumProblems}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${totalMediumProblems > 0 ? (totalSolvedMedium / totalMediumProblems) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-rose-500/10 to-transparent rounded-lg p-3 border border-rose-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  <span className="text-sm font-medium text-rose-400">Hard</span>
                </div>
                <span className="text-sm font-bold text-rose-400">{totalSolvedHard}/{totalHardProblems}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${totalHardProblems > 0 ? (totalSolvedHard / totalHardProblems) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="p-6 border-b border-slate-800">
          <h3 className="font-semibold text-slate-200 mb-3">Topics</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1.5 bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 rounded-full text-xs font-medium border border-violet-500/30 hover:border-violet-400/50 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Meta Info */}
        <div className="p-6 flex-1">
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Created: {new Date(playlist.createdAt).toDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Problems List */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/30 border-b border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-100">Problems</h2>
            <button className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm">
              <Plus className="w-4 h-4" />
              <span>Add Problem</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="all">All Problems</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-2">
            {filteredProblems.length > 0 ? (
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-sm text-left text-white">
                  <tbody>
                    {filteredProblems.map((problemData, index) => {
                      const problem = problemData.problem;
                      const isSolved = problem?.solvedBy?.some(entry => entry?.userId === user?.id);

                      return (
                        <tr
                          key={problem?.id || index}
                          className="transition-colors hover:bg-slate-800/50 border-b border-slate-800"
                        >
                          <td className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 min-w-0">
                                {isSolved ? (
                                  <Check className="text-green-400" size={20} />
                                ) : (
                                  <div className="w-5"></div>
                                )}
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-400">
                                    {index + 1}.
                                  </span>
                                  <Link
                                    className="truncate hover:underline font-medium text-white"
                                    to={`/problem/${problem?.id}`}
                                  >
                                    {problem?.title}
                                  </Link>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                <span className={getDifficultyColor(problem?.difficulty)}>
                                  {problem?.difficulty}
                                </span>
                                
                                <button
                                  onClick={() => handleRemoveProblem(problem?.id)}
                                  className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                  title="Remove from playlist"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-slate-400 text-lg mb-2">No problems found</div>
                <p className="text-slate-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Playlist Modal */}
      {isEditModalOpen && (
        <EditPlaylist
          playlist={playlist}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};