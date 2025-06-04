import React, { useState, useEffect } from 'react';
import {
    ChevronUp,
    Eye,
    MessageCircle,
    MoreHorizontal,
    Plus,
    MoveUp,
    MoveUpIcon,
    Dot,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiscussions } from '../store/Slices/discussionSlice.js';
import { toggleUpVotes } from '../store/Slices/toggleSlice.js';
import { currentUser } from "../store/Slices/authSlice.js";
import { useNavigate } from 'react-router-dom';

export const Community = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const discussions = useSelector((state) => state.discussion?.discussions);
    console.log(discussions);
    const loading = useSelector((state) => state.discussion?.loading);
    const user = useSelector((state) => state.auth?.user);

    const [localUpVotes, setLocalUpVotes] = useState({});

    useEffect(() => {
        dispatch(getAllDiscussions());
        dispatch(currentUser());
    }, [dispatch]);

    useEffect(() => {
        if (discussions && user) {
            const initialUpVotes = {};
            discussions.forEach(discussion => {
                const userUpVoted = discussion?.upVotes?.some(upVote => upVote?.userId === user?.id);
                initialUpVotes[discussion.id] = {
                    isUpVoted: userUpVoted,
                    count: discussion?.upVotes?.length || 0
                };
            });
            setLocalUpVotes(initialUpVotes);
        }
    }, [discussions, user]);

    const handleUpVote = (discussionId) => {
        setLocalUpVotes(prev => {
            const currentState = prev[discussionId] || { isUpVoted: false, count: 0 };
            return {
                ...prev,
                [discussionId]: {
                    isUpVoted: !currentState.isUpVoted,
                    count: currentState.isUpVoted ? currentState.count - 1 : currentState.count + 1
                }
            };
        });

        dispatch(toggleUpVotes(discussionId));
    };

    if(loading) {
        return <p>Loading...</p>
    }

    return (
        <div className="bg-[#0e1111] min-h-screen text-white p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header with Discuss Button */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-6 text-sm">
                        <button className="flex items-center gap-2 text-white font-medium">
                            <ChevronUp className="w-4 h-4" />
                            Most Votes
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                            <div className="w-4 h-4 flex items-center justify-center">
                                <div className="w-2 h-2 bg-current rounded-full"></div>
                            </div>
                            Newest
                        </button>
                    </div>

                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors hover:cursor-pointer">
                        <Plus className="w-4 h-4" />
                        Discuss
                    </button>
                </div>

                <div className="space-y-4">
                    {discussions?.map((discussion) => {
                        const discussionUpVotes = localUpVotes[discussion.id]?.count || discussion?.upVotes?.length || 0;
                        const isUserUpVoted = localUpVotes[discussion.id]?.isUpVoted || false;

                        return (
                            <div key={discussion.id} className="bg-[#222222] rounded-lg p-6 hover:bg-gray-750 transition-colors hover:cursor-pointer"
                                onClick={() => navigate(`/discussion/${discussion.id}`)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium">
                                        {discussion?.user?.imageUrl ? (
                                            <img
                                                src={discussion.user.imageUrl}
                                                alt={discussion.user.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            discussion?.user?.name?.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-gray-400 text-sm">{discussion?.user?.name}</span>
                                            <span className="text-gray-500 text-sm"><Dot /></span>
                                            <span className="text-gray-500 text-sm">
                                                {new Date(discussion?.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h3 className="text-white font-medium text-lg mb-3 cursor-pointer">
                                            {discussion?.title}
                                        </h3>

                                        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {discussion?.content}
                                        </p>

                                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpVote(discussion?.id)}
                                                    className={`flex items-center gap-1 hover:text-white transition-colors ${isUserUpVoted ? 'text-green-400' : ''
                                                        }`}
                                                >
                                                    <MoveUpIcon className="w-4 h-4" />
                                                    <span>{discussionUpVotes}</span>
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{discussion?.views || 0}</span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{discussion?.repliesCount || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="text-gray-400 hover:text-white p-1 rounded">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};