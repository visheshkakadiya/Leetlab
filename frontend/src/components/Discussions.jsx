import React, { useEffect, useState } from "react";
import {
  ArrowUp,
  Eye,
  MessageCircle,
  MoreVertical,
  Plus,
} from "lucide-react";
import { getAllDiscussions } from "@/store/Slices/discussionSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleUpVotes } from "@/store/Slices/toggleSlice";

const Discussions = () => {
  const dispatch = useDispatch();
  const discussions = useSelector((state) => state.discussion?.discussions) || [];
  console.log(discussions);
  const user = useSelector((state) => state.auth?.user);
  const [activeTab, setActiveTab] = useState("");
  const [localVotesCount, setLocalVotesCount] = useState(discussions?.upvotes || 0);

  const handleSort = (filter, tabName) => {
    if (activeTab === tabName) {
      setActiveTab("");
      dispatch(getAllDiscussions());
    } else {
      setActiveTab(tabName);
      if (filter === "sort") {
        dispatch(getAllDiscussions({ sort: "upvotes" }));
      }
    }
  };

  // Fixed function - now checks if a single discussion is upvoted by the current user
  const isDiscussionUpvoted = (discussion) => {
    return user && discussion?.upVotes?.some((vote) => vote?.userId === user?.id);
  };

  // Optional: Keep the original function if you need it elsewhere for arrays
  const handleUpVotedDiscussions = (discussions) => {
    return user
      ? discussions.map((d) =>
          d?.upVotes?.some((vote) => vote?.userId === user?.id)
        )
      : [];
  };
  
  console.log("handleUpVotedDiscussions", handleUpVotedDiscussions(discussions));
  
  const handleToggle = (discussionId) => {
    dispatch(toggleUpVotes(discussionId));
  };

  useEffect(() => {
    dispatch(getAllDiscussions());
  }, [dispatch]);

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-semibold text-lg">LeetDiscuss</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex items-center space-x-8 mb-6 border-b border-gray-700">
          <button
            onClick={() => handleSort("sort", "active")}
            className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
              activeTab === "active"
                ? "border-blue-400 text-blue-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <ArrowUp className="w-4 h-4" />
            <span>Most Votes</span>
          </button>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {discussions.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No discussions found.
            </div>
          ) : (
            discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {discussion.user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-300">
                        {discussion.user?.name || "Anonymous"}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(discussion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Owner Dropdown */}
                  {user?.id === discussion.userId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-500 hover:text-gray-300 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40 bg-gray-800 border border-gray-700 text-white">
                        <DropdownMenuItem
                          onClick={() => console.log("Edit", discussion.id)}
                          className="hover:bg-gray-700 cursor-pointer"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => console.log("Delete", discussion.id)}
                          className="text-red-400 hover:bg-red-500/20 cursor-pointer"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Post Title */}
                <h3 className="text-lg font-semibold mb-3 text-white hover:text-blue-400 cursor-pointer">
                  {discussion.title}
                </h3>
                
                {/* Post Content */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {discussion.content}
                </p>
                
                {/* Post Stats */}
                <div className="flex items-center space-x-6 text-gray-500">
                  <button 
                    className={`flex items-center space-x-1 transition-colors hover:text-green-300 ${
                      isDiscussionUpvoted(discussion) ? "text-green-400" : "text-gray-500"
                    }`}
                    onClick={() => handleToggle(discussion.id)}
                  >
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm">
                      {formatNumber(discussion.upvotes || 0)}
                    </span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">
                      {formatNumber(discussion.views || 0)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">
                      {formatNumber(discussion.repliesCount || 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Discussions;