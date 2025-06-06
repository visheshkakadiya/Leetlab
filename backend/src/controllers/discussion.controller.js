import { db } from "../libs/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createDiscussion = asyncHandler(async (req, res) => {

    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const discussion = await db.discussion.create({
        data: {
            title,
            content,
            userId,
        }
    })

    if (!discussion) {
        throw new ApiError(500, "failed to create deiscussion")
    }

    res.status(201).json(
        new ApiResponse(201, discussion, "discussion created successfully")
    )
})

const updateDiscussion = asyncHandler(async (req, res) => {

    const { title, content } = req.body;
    const { discussionId } = req.params;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const discussion = await db.discussion.findUnique({
        where: {
            id: discussionId,
        }
    })

    if (!discussion) {
        throw new ApiError(401, "Discussion not found")
    }

    const updatedDiscussion = await db.discussion.update({
        where: {
            id: discussionId,
        },
        data: {
            title,
            content
        }
    });

    if (!updatedDiscussion) {
        throw new ApiError(500, "failed to update discussion")
    }

    res.status(200).json(
        new ApiResponse(200, updatedDiscussion, "discussion updated successfully")
    )
})

const deleteDiscussion = asyncHandler(async (req, res) => {
    const { discussionId } = req.params;

    const discussion = await db.discussion.findUnique({
        where: {
            id: discussionId,
        }
    })

    if (!discussion) {
        throw new ApiError(401, "Discussion not found")
    }

    const deletedDiscussion = await db.discussion.delete({
        where: {
            id: discussionId
        }
    })

    if (!deletedDiscussion) {
        throw new ApiError(500, "failed to delete Discussion")
    }

    res.status(200).json(
        new ApiResponse(200, "Discussion deleted successfully")
    )
})

const getAllDiscussions = asyncHandler(async (req, res) => {
    const { sort } = req.query;

    const fetchDiscussions = async (orderBy = undefined) => {
        const discussions = await db.discussion.findMany({
            orderBy,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                    },
                },
                upVotes: true,
                replies: true,
            },
        });

        if (!discussions || discussions.length === 0) {
            throw new ApiError(404, "No discussions found");
        }

        const discussionsWithReplies = await Promise.all(
            discussions.map(async (discussion) => {
                const replyCount = await db.reply.count({
                    where: { discussionId: discussion.id },
                });

                return {
                    ...discussion,
                    repliesCount: replyCount,
                };
            })
        );

        return discussionsWithReplies;
    };

    const discussions = sort === "upvotes"
        ? await fetchDiscussions({ upvotes: "desc" })
        : await fetchDiscussions();
    res
        .status(200)
        .json(
            new ApiResponse(200, discussions, "Discussions fetched successfully")
        );
});


const getDiscussionById = asyncHandler(async (req, res) => {

    const { discussionId } = req.params;

    const discussion = await db.discussion.update({
        where: {
            id: discussionId,
        },
        data: {
            views: {
                increment: 1
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                }
            },
            replies: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true,
                        }
                    }
                }
            }
        }
    })

    if (!discussion) {
        throw new ApiError(404, "Discussion not found")
    }

    res.status(200).json(
        new ApiResponse(200, discussion, "Discussion fetched successfully")
    )
})

export {
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    getAllDiscussions,
    getDiscussionById
}