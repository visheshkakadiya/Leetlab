import { db } from "../libs/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getAllSubmission = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const submission = await db.submission.findMany({
        where: {
            userId: userId,
        }
    })

    if (!submission) {
        throw new ApiError(404, "No submissions found for this user");
    }

    res.status(200).json(
        new ApiResponse(200, submission, "Submissions fetched successfully")
    )
});

const getSubmissionsForProblem = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const problemId = req.params.problemId;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const submissions = await db.submission.findMany({
        where: {
            userId: userId,
            problemId: problemId,
        }
    })

    if (!submissions) {
        throw new ApiError(404, "No submissions found for this problem");
    }
    res.status(200).json(
        new ApiResponse(200, submissions, "Submissions fetched successfully")
    )
});

const totalSubmissionsForProblem = asyncHandler(async (req, res) => {

    const problemId = req.params.problemId;

    if (!problemId) {
        throw new ApiError(400, "Problem ID is required");
    }

    const submissions = await db.submission.count({
        where: {
            problemId: problemId,
        }
    })

    if (!submissions) {
        throw new ApiError(404, "No submissions found for this problem");
    }
    res.status(200).json(
        new ApiResponse(200, submissions, "Submissions fetched successfully")
    )
});

export {
    getAllSubmission,
    getSubmissionsForProblem,
    totalSubmissionsForProblem
}