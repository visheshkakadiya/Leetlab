import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Eye, X, Check, Trash2, Edit, ArrowLeft, SendHorizonal } from 'lucide-react'; // <-- Import ArrowLeft
import { getDiscussionById } from '@/store/Slices/discussionSlice';
import { getDiscussionReplies, addReply, updateReply, deleteReply } from '@/store/Slices/repliesSlice';
import UpVote from './UpVote';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import LoaderDefault from './LoaderDefault';
import { ClipLoader } from 'react-spinners';
import MarkdownPreview from "@uiw/react-markdown-preview"

const DiscussionDetails = () => {
    const { discussionId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth?.user);
    const discussion = useSelector((state) => state.discussion?.discussion);
    const replies = useSelector((state) => state.replies?.replies);
    const discussionLoading = useSelector((state) => state.discussion?.loading);
    const repliesLoading = useSelector((state) => state.replies?.loading);

    const [showComments, setShowComments] = useState(true);
    const [editingReply, setEditingReply] = useState(null);
    const [editContent, setEditContent] = useState('');

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        dispatch(getDiscussionById(discussionId));
        dispatch(getDiscussionReplies(discussionId));
    }, [dispatch, discussionId]);

    const isDiscussionUpvoted = (discussion) => {
        return user && discussion?.upVotes?.some((vote) => vote?.userId === user?.id);
    }

    const onSubmitReply = async (data) => {
        try {
            await dispatch(addReply({ data: { content: data.content }, discussionId }));
            reset();
            dispatch(getDiscussionReplies(discussionId));
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleUpdateReply = async (replyId) => {
        try {
            await dispatch(updateReply({ replyId, data: { content: editContent } }));
            setEditingReply(null);
            setEditContent('');
            dispatch(getDiscussionReplies(discussionId));
        } catch (error) {
            console.error('Error updating reply:', error);
        }
    };

    const handleDeleteReply = async (replyId) => {
            try {
                await dispatch(deleteReply(replyId));
                dispatch(getDiscussionReplies(discussionId));
            } catch (error) {
                console.error('Error deleting reply:', error);
            }
    };

    const startEditReply = (reply) => {
        setEditingReply(reply.id);
        setEditContent(reply.content);
    };

    const cancelEdit = () => {
        setEditingReply(null);
        setEditContent('');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getUserInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    };

    if (discussionLoading) {
        return (
            <div className="min-h-screen bg-[#0e1111] text-white w-full flex items-center justify-center">
                <LoaderDefault />
            </div>
        );
    }

    if (!discussion) {
        return (
            <div className="min-h-screen bg-[#0e1111] text-white w-full flex items-center justify-center">
                <div className="text-xl text-red-400">Discussion not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0e1111] text-white w-full">
            <div className="max-w-7xl mx-auto px-6 py-8 relative">
                <button
                    onClick={() => navigate('/discuss')}
                    className="mb-5 top-6 left-6 cursor-pointer flex items-center gap-2 text-gray-300 hover:text-white transition-colors z-10"
                >
                    <ArrowLeft className="w-5 h-5" size={10}/>
                    <span className="text-base font-medium">Back</span>
                </button>

                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                        {discussion.user?.imageUrl ? (
                            <img 
                                src={discussion.user.imageUrl} 
                                alt={discussion.user.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-bold">
                                {getUserInitials(discussion.user?.name)}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">{discussion.user?.name}</h3>
                        <p className="text-gray-400 text-sm">Posted on {formatDate(discussion.createdAt)}</p>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">{discussion.title}</h1>

                <div className="bg-[#070808] rounded-lg p-6 mb-6">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        <MarkdownPreview source={discussion.content} />
                    </div>
                </div>

                <div className="flex items-center space-x-6 mb-6">
                    <UpVote 
                        UpVoteCount={discussion.upvotes || 0}
                        discussionId={discussion.id}
                        isUpVoted={isDiscussionUpvoted(discussion)}
                        size={20}
                    />

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-2 mr-2 text-gray-400 hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>{replies?.length || 0}</span>
                    </button>

                    <div className="flex items-center space-x-2 text-gray-400 px-3 py-2">
                        <Eye className="w-5 h-5" />
                        <span>{discussion.views || 0} views</span>
                    </div>
                </div>

                {showComments && (
                    <div className="bg-[#0e1111] rounded-lg p-6">
                        <form onSubmit={handleSubmit(onSubmitReply)} className="flex items-start space-x-3 mb-6">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                {user?.imageUrl ? (
                                    <img 
                                        src={user.imageUrl} 
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-bold text-sm">
                                        {getUserInitials(user?.name)}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    {...register('content', { 
                                        required: 'Reply content is required',
                                        minLength: {
                                            value: 1,
                                            message: 'Reply must be at least 1 character long'
                                        }
                                    })}
                                    placeholder="Type comment here..."
                                    className="w-full bg-black/10 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                                    rows={3}
                                />
                                {errors.content && (
                                    <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>
                                )}
                                <div className="flex justify-end mt-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <span className='mr-2 mt-1'><SendHorizonal size={18}/></span>
                                         {isSubmitting ? 'Posting...' : 'Comment'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {replies && replies.length > 0 && (
                            <div className="border-t border-gray-700 pt-6 space-y-6">
                                {replies.map((reply) => (
                                    <div key={reply.id} className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            {reply.user?.imageUrl ? (
                                                <img 
                                                    src={reply.user.imageUrl} 
                                                    alt={reply.user.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white font-bold text-sm">
                                                    {getUserInitials(reply.user?.name)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="font-semibold text-white">{reply.user?.name}</span>
                                                <span className="text-gray-400 text-sm">{formatDate(reply.createdAt)}</span>
                                                
                                                {user?.id === reply.userId && (
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => startEditReply(reply)}
                                                            className="text-gray-400 hover:text-blue-400 text-sm cursor-pointer"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteReply(reply.id)}
                                                            className="text-gray-400 hover:text-red-400 text-sm cursor-pointer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {editingReply === reply.id ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="w-full bg-black/10 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                                                        rows={3}
                                                    />
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleUpdateReply(reply.id)}
                                                            className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-4 py-1 rounded text-sm transition-colors"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="bg-white/10 hover:bg-white/5 text-white cursor-pointer px-4 py-1 rounded text-sm transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-300 mb-3 whitespace-pre-wrap">{reply.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {replies && replies.length === 0 && (
                            <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
                                No comments yet. Be the first to comment!
                            </div>
                        )}

                        {repliesLoading && (
                            <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
                                <ClipLoader className='text-white' color="white" size={20} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionDetails;