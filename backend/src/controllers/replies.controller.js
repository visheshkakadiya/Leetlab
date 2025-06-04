import { db } from "../libs/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getDiscussionReplies = asyncHandler(async (req, res) => {

    const { discussionId } = req.params;

    const discussion = await db.discussion.findUnique({
        where: {
            id: discussionId,
        }
    })

    if (!discussion) {
        throw new ApiError(401, "Discussion not found")
    }

    const replies = await db.reply.findMany({
        where: {
            discussionId: discussionId,
        },
        include: {
            user: {
                select: {
                    name: true,
                    imageUrl: true
                }
            }
        }
    })

    if (!replies || replies.length === 0) {
        throw new ApiError(404, "No replies found")
    }

    res.status(200).json(
        new ApiResponse(200, replies, "Replies fetched successfully")
    )
})

const addReply = asyncHandler(async (req, res) => {

    const { discussionId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const discussion = await db.discussion.findUnique({
        where: {
            id: discussionId,
        }
    })

    if (!discussion) {
        throw new ApiError(401, "Discussion not found")
    }

    const reply = await db.reply.create({
        data: {
            content,
            discussionId,
            userId
        }
    })

    if (!reply) {
        throw new ApiError(500, "failed to create reply")
    }

    res.status(201).json(
        new ApiResponse(201, {
            userId: userId,
            content: content
        }, "reply created successfully")
    )
})

const updateReply = asyncHandler(async (req, res) => {

    const { replyId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const reply = await db.reply.findUnique({
        where: {
            id: replyId,
        }
    })

    if (!reply) {
        throw new ApiError(401, "Reply not found")
    }

    const updatedReply = await db.reply.update({
        where: {
            id: replyId,
        },
        data: {
            content,
        }
    })

    if (!updatedReply) {
        throw new ApiError(500, "failed to update reply")
    }

    res.status(200).json(
        new ApiResponse(200, updatedReply, "reply updated successfully")
    )
})

const deleteReply = asyncHandler(async (req, res) => {

    const { replyId } = req.params;

    const reply = await db.reply.findUnique({
        where: {
            id: replyId,
        }
    })

    if (!reply) {
        throw new ApiError(401, "Reply not found")
    }

    const deletedReply = await db.reply.delete({
        where: {
            id: replyId,
        }
    })

    if (!deletedReply) {
        throw new ApiError(500, "failed to delete reply")
    }

    res.status(200).json(
        new ApiResponse(200, "Reply deleted successfully")
    )
})

export {
    getDiscussionReplies,
    addReply,
    updateReply,
    deleteReply
}