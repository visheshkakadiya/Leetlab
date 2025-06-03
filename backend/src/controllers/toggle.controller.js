import { db } from "../libs/db.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleReputation = asyncHandler(async (req, res) => {

    const {userId} = req.params;

    const ReputedAlready = await db.reputation.findFirst({
        where: {
            userId: userId,
        }
    })

    if (ReputedAlready) {
        await db.reputation.delete({
            where: {
                id: ReputedAlready?.id
            }
        })

        return res.status(200).json(
            new ApiResponse(200, { isReputed: false }, "Reputation removed successfully")
        )
    }

    await db.reputation.create({
        data: {
            userId: userId,
        }
    })

    return res.status(200).json(
        new ApiResponse(200, { isReputed: true }, "Reputation added successfully")
    )
})

const toggleUpVotes = asyncHandler(async (req, res) => {

    const {discussionId} = req.params;
    const userId = req.user?.id

    const upVotedAlready = await db.upVotes.findFirst({
        where: {
            discussionId: discussionId,
            userId: userId
        }
    })

    if (upVotedAlready) {
        await db.upVotes.delete({
            where: {
                id: upVotedAlready?.id
            }
        })

        return res.status(200).json(
            new ApiResponse(200, { isUpVoted: false }, "Upvote removed successfully")
        )
    }

    await db.upVotes.create({
        data: {
            discussionId: discussionId,
            userId
        }
    })

    return res.status(200).json(
        new ApiResponse(200, { isUpVoted: true }, "Upvote added successfully")
    )
})

const toggleDownVotes = asyncHandler(async (req, res) => {

    const {discussionId} = req.params;
    const userId = req.user?.id

    const downVotedAlready = await db.downVotes.findFirst({
        where: {
            discussionId: discussionId,
            userId
        }
    })

    if (downVotedAlready) {
        await db.downVotes.delete({
            where: {
                id: downVotedAlready?.id
            }
        })

        return res.status(200).json(
            new ApiResponse(200, { isDownVoted: false }, "Downvote removed successfully")
        )
    }

    await db.downVotes.create({
        data: {
            discussionId: discussionId,
            userId
        }
    })

    return res.status(200).json(
        new ApiResponse(200, { isDownVoted: true }, "Downvote added successfully")
    )
})

export {
    toggleReputation,
    toggleUpVotes,
    toggleDownVotes,
}
