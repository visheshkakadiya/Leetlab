import React, { useEffect, useState } from 'react';
import {
  Play,
  Plus,
  Search,
  Target,
  Award,
  MoreVertical,
  Trash2,
  Check,
  GitFork,
  Pen,
  Lock,
  Globe,
  Trash,
  Clock
} from 'lucide-react';
import {
  getPlaylistById,
  copyPlaylist,
  deletePlaylist,
  togglePublish,
  RemoveProblemFromPlaylist,
  getOwnPlaylists,
  AddProblemToPlaylist
} from '../store/Slices/playlistSlice.js';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import { currentUser } from '../store/Slices/authSlice.js';
import { useMemo } from 'react';
import { EditPlaylist } from './EditPlaylist.jsx';
import { AddToPlaylistPopup } from './AddToPlaylistPopup.jsx';

export const PlaylistDetail = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [problemMenuOpen, setProblemMenuOpen] = useState(null);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector((state) => state.playlist?.loading);
  const playlist = useSelector((state) => state.playlist?.playlist);
  const user = useSelector((state) => state.auth?.user);

  const isOwner = user?.id === playlist?.userId;

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

  const allTags = useMemo(() => {
    if (!playlist?.problems) return [];

    const tagsSet = new Set();
    playlist.problems.forEach((p) => {
      p.problem?.tags?.forEach((tag) => tagsSet.add(tag));
    });

    return Array.from(tagsSet);
  }, [playlist]);

  const filteredProblems = useMemo(() => {
    if (!playlist?.problems) return [];

    return playlist.problems.filter((problemData) => {
      const problem = problemData.problem;
      const matchesSearch = problem?.title?.toLowerCase().includes(searchQuery.toLowerCase());

      const isSolved = problem?.solvedBy?.some(entry => entry?.problem?.userId === user?.id);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (problemMenuOpen && !event.target.closest('.problem-menu')) {
        setProblemMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [problemMenuOpen]);

  const handleCopyPlaylist = () => {
    dispatch(copyPlaylist(playlistId))
      .unwrap()
      .then(() => {
        dispatch(getOwnPlaylists())
      })
    setIsDropdownOpen(false);
  };

  const handleDeletePlaylist = () => {
    dispatch(deletePlaylist(playlistId));
    navigate('/problems');
  };

  const handleTogglePublish = () => {
    dispatch(togglePublish(playlistId))
      .unwrap()
      .then(() => {
        dispatch(getPlaylistById(playlistId));
        dispatch(getOwnPlaylists())
      })
    setIsDropdownOpen(false);
  };

  const handleRemoveProblem = (problemId) => {
    dispatch(RemoveProblemFromPlaylist({ problemId, playlistId }))
      .unwrap()
      .then(() => {
        dispatch(getPlaylistById(playlistId));
      })
    setProblemMenuOpen(null);
  };

  const handleAddToPlaylist = (targetPlaylistId, problemId) => {
    return dispatch(AddProblemToPlaylist({ playlistId: targetPlaylistId, problemId }))
  };

  const openAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setAddToPlaylistOpen(true);
    setProblemMenuOpen(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HARD': return 'text-red-400';
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
    <div className="min-h-screen bg-[#0e1111] text-slate-100 flex ml-5">
      <div className="w-80 bg-[#222222] border-r border-slate-800 flex flex-col mt-4 mb-4 rounded-xl">
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

          <div className="flex space-x-2">
            <button className="flex-1 bg-white/10 px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm font-medium">
              <Play className="w-4 h-4" />
              <span>Start Practice</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#222222] rounded-md shadow-lg z-50 py-1 text-sm border border-slate-700">
                  {!isOwner && (
                    <button
                      onClick={handleCopyPlaylist}
                      className="flex w-full px-2 py-2 gap-2 text-left hover:bg-[#353839] transition-colors hover:cursor-pointer"
                    >
                      <GitFork size={18} />Fork
                    </button>
                  )}
                  {isOwner && (
                    <>
                      <button
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex gap-2 px-2 py-2 text-left hover:bg-[#353839] transition-colors hover:cursor-pointer"
                      >
                        <Pen size={18} /> Edit
                      </button>
                      <button
                        onClick={handleTogglePublish}
                        className="flex gap-2 w-full px-2 py-2 text-left hover:bg-[#353839] transition-colors hover:cursor-pointer"
                      >
                        {playlist?.isPublished ? (
                          <>
                            <Lock size={18} className="inline mr-1" />
                            Make Private
                          </>
                        ) : (
                          <>
                            <Globe size={18} className="inline mr-1" />
                            Make Public
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleDeletePlaylist}
                        className="flex gap-2 w-full px-2 py-2 text-left hover:bg-[#353839] transition-colors text-red-400 hover:cursor-pointer"
                      >
                        <Trash size={18} /> Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-0 leading-relaxed mt-5">
            {playlist.description}
          </p>
        </div>

        {isOwner && (
          <div className="p-6 border-b bg-white/10 border-slate-800 rounded-xl m-4">
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
                    '--CircularProgress-trackColor': '#6a6b6a',
                    '--CircularProgress-progressColor': '#228a22',
                  }}
                >
                  <div className='text-slate-200'>{progress}%</div>
                </CircularProgress>
              </Box>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
                <div className="text-slate-400 mb-1 text-xs uppercase tracking-wide">Solved</div>
                <div className="text-xl font-bold text-slate-200">{totalSolved}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
                <div className="text-slate-400 mb-1 text-xs uppercase tracking-wide">Total</div>
                <div className="text-xl font-bold text-slate-200">{playlist?.problems?.length || 0}</div>
              </div>
            </div>
          </div>
        )}

        {isOwner && (
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
        )}

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

        <div className="p-6 flex-1">
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Created: {new Date(playlist.createdAt).toDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last Updated: {new Date(playlist.updatedAt).toDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-[#0e1111]  p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-100">Problems</h2>
          </div>

          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-[#222222] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
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

        <div className="flex-1 overflow-auto p-6 pt-2">
          <div className="space-y-2">
            {filteredProblems.length > 0 ? (
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-sm text-left text-white">
                  <tbody>
                    {filteredProblems.map((problemData, index) => {
                      const problem = problemData.problem;
                      const isSolved = problem?.solvedBy?.some(entry => entry?.problem?.userId === user?.id);

                      return (
                        <tr
                          key={problem?.id || index}
                          className="transition-colors hover:bg-white/10 border-b border-slate-800"
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

                                {user && (
                                  <div className="relative problem-menu">
                                    <button
                                      onClick={() => setProblemMenuOpen(
                                        problemMenuOpen === problem?.id ? null : problem?.id
                                      )}
                                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-300 transition-colors"
                                      title="More options"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {problemMenuOpen === problem?.id && (
                                      <div className="absolute right-0 mt-2 w-48 bg-[#222222] rounded-md shadow-lg z-50 py-1 text-sm border border-slate-700">
                                        <button
                                          onClick={() => openAddToPlaylist(problem?.id)}
                                          className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors flex items-center space-x-2"
                                        >
                                          <Plus className="w-4 h-4" />
                                          <span>Add to Playlist</span>
                                        </button>
                                        {isOwner && (
                                          <button
                                            onClick={() => handleRemoveProblem(problem?.id)}
                                            className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors text-red-400 flex items-center space-x-2"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Remove from Playlist</span>
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Playlist Modal - Only for playlist owner */}
      {isOwner && isEditModalOpen && (
        <EditPlaylist
          playlist={playlist}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Add to Playlist Popup - Only for logged in users */}
      {user && (
        <AddToPlaylistPopup
          isOpen={addToPlaylistOpen}
          onClose={() => setAddToPlaylistOpen(false)}
          problemId={selectedProblemId}
          currentPlaylistId={playlistId}
          onAdd={handleAddToPlaylist}
        />
      )}
    </div>
  );
};