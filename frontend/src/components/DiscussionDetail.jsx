import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getDiscussionById } from '../store/Slices/discussionSlice.js';
import { getDiscussionReplies, addReply, updateReply, deleteReply } from "../store/Slices/repliesSlice.js";
import { toggleUpVotes, toggleDownVotes } from '../store/Slices/toggleSlice.js';
import { 
  ChevronUp, 
  ChevronDown, 
  MessageCircle, 
  Share2, 
  Eye, 
  Code,
  Link,
  AtSign,
  CornerUpLeft
} from 'lucide-react';

const DiscussionDetail = () => {
  const [newComment, setNewComment] = useState('');
  const { discussionId } = useParams();
  const dispatch = useDispatch();

  const discussion = useSelector((state) => state.discussion?.discussion);
  const replies = useSelector((state) => state.replies?.replies);
  const user = useSelector((state) => state.auth?.user);

  console.log("discussion detail", discussion);
  console.log("replies", replies);

  useEffect(() => {
    dispatch(getDiscussionById(discussionId));
    dispatch(getDiscussionReplies(discussionId));
  }, [dispatch, discussionId]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      dispatch(addReply({
        discussionId,
        content: newComment
      }));
      setNewComment('');
    }
  };

  const handleUpvote = (replyId) => {
    dispatch(toggleUpVotes(replyId));
  };

  const handleDiscussionUpvote = () => {
    dispatch(toggleUpVotes(discussionId));
  };

  const handleDiscussionDownvote = () => {
    dispatch(toggleDownVotes(discussionId));
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (!discussion) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold text-white mb-2">
          {discussion?.title}
        </h1>
        
        {/* User Info */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              {discussion?.user?.imageUrl ? (
                <img 
                  src={discussion.user.imageUrl} 
                  alt={discussion.user.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-medium">
                  {discussion?.user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span>{discussion?.user?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{discussion?.views}</span>
          </div>
          <span>{formatDate(discussion?.createdAt)}</span>
          <span>{formatDate(discussion?.updatedAt)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Discussion Content */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              {discussion?.content}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-6 mb-6 text-gray-400">
          <button 
            onClick={handleDiscussionUpvote}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
            <span>{discussion?.upvotes}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{replies?.length || 0}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          {/* Comments Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-medium">Comments ({replies?.length || 0})</h2>
            </div>
          </div>

          {/* Comment Input */}
          <div className="bg-gray-800 rounded-lg p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type comment here..."
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none"
              rows="1"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
              <button
                onClick={handleSubmitComment}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {replies?.map((reply) => (
              <div key={reply.id} className="flex gap-4">
                {/* Avatar */}
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {reply?.user?.imageUrl ? (
                    <img 
                      src={reply.user.imageUrl} 
                      alt={reply.user.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-medium text-sm">
                      {reply?.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium">{reply?.user?.name}</span>
                    <span className="text-gray-400 text-sm">{formatDate(reply?.createdAt)}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-3 leading-relaxed">
                    {reply?.content}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Empty state */}
            {(!replies || replies.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DiscussionDetail };