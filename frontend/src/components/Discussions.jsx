import React, { useEffect, useState } from "react";
import {
  ArrowUp,
  Eye,
  MessageCircle,
  MoreVertical,
  Pen,
} from "lucide-react";
import {
  deleteDiscussion,
  getAllDiscussions,
} from "@/store/Slices/discussionSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpVote from "./UpVote";
import LoaderDefault from "./LoaderDefault";
import { useNavigate } from "react-router-dom";

const Discussions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const discussions = useSelector((state) => state.discussion?.discussions) || [];
  const loading = useSelector((state) => state.discussion?.loading);
  const user = useSelector((state) => state.auth?.user);
  const [activeTab, setActiveTab] = useState("");

  const handleSort = (filter, tabName) => {
    if (activeTab === tabName) {
      setActiveTab("");
      dispatch(getAllDiscussions());
    } else {
      setActiveTab(tabName);
      if (filter === "sort") {
        dispatch(getAllDiscussions("upvotes"));
      }
    }
  };

  const isDiscussionUpvoted = (discussion) => {
    return (
      user &&
      discussion?.upVotes?.some((vote) => vote?.userId === user?.id)
    );
  };

  useEffect(() => {
    dispatch(getAllDiscussions());
  }, [dispatch]);

  const handleDiscussionDelete = (discussionId) => {
    dispatch(deleteDiscussion(discussionId))
      .unwrap()
      .then(() => {
        dispatch(getAllDiscussions());
      });
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  return (
    <div className="min-h-screen bg-[#0e1111] text-white w-full">
      <header className="border-b border-gray-700 bg-[#0e1111]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-semibold text-lg">NexDiscuss</span>
            </div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 cursor-pointer rounded-lg flex items-center space-x-2 transition-colors"
              onClick={() => navigate("/discuss/post")}
            >
              <Pen className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-8 mb-6 border-b border-gray-700">
          <button
            onClick={() => handleSort("sort", "active")}
            className={`cursor-pointer flex items-center space-x-2 pb-3 border-b-2 transition-colors ${activeTab === "active"
                ? "border-green-500 text-green-500"
                : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
          >
            <ArrowUp className="w-4 h-4" />
            <span>Most Votes</span>
          </button>
        </div>

        <div className="space-y-4 min-h-[300px]">
          {loading ? (
            <div className="flex justify-center py-20 mt-[100px]">
              <LoaderDefault />
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No discussions found.
            </div>
          ) : (
            discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="bg-[#0e1111] rounded-xl p-6 border border-gray-800 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => navigate(`/discuss/${discussion.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                      {discussion.user?.imageUrl ? (
                        <img
                          className="w-full h-full object-cover"
                          src={discussion.user?.imageUrl}
                          alt={discussion.user?.name?.charAt(0).toUpperCase()}
                        />
                      ) : (
                        <span className="text-xs font-medium">
                          {discussion.user?.name?.charAt(0).toUpperCase() ||
                            "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-300">
                        {discussion.user?.name || "Anonymous"}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(
                          discussion.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {user?.id === discussion.userId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="text-gray-300 hover:text-gray-300 transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-40 bg-white/5 border border-gray-700 text-white mr-[100px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/discuss/edit/${discussion.id}`);
                          }}
                          className="hover:bg-gray-700 cursor-pointer"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDiscussionDelete(discussion?.id);
                          }}
                          className="text-red-400 hover:bg-red-500/20 cursor-pointer"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-3 text-white hover:text-green-400 transition-colors cursor-pointer">
                  {discussion.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {discussion.content.replace(/<[^>]+>/g, "")}
                </p>

                <div className="flex items-center space-x-6 text-gray-500">
                  <span onClick={(e) => e.stopPropagation()}>
                    <UpVote
                      UpVoteCount={discussion.upvotes}
                      isUpVoted={isDiscussionUpvoted(discussion)}
                      discussionId={discussion.id}
                    />
                  </span>
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
      </div>
    </div>
  );
};

export default Discussions;