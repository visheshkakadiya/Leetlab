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

    // const problemId = req.params.problemId;
    const {problemIds} = req.body;

    if (!problemIds || !Array.isArray(problemIds)) {
        throw new ApiError(400, "An array of problem IDs is required");
    }

    // if (!problemId) {
    //     throw new ApiError(400, "Problem ID is required");
    // }

    // const submissions = await db.submission.count({
    //     where: {
    //         problemId: problemId,
    //     }
    // })

    // if (!submissions) {
    //     throw new ApiError(404, "No submissions found for this problem");
    // }
    // res.status(200).json(
    //     new ApiResponse(200, submissions, "Submissions fetched successfully")
    // )

     const submissionsCount = {};

    for (const id of problemIds) {
        const count = await db.submission.count({
            where: {
                problemId: id,
            },
        });
        submissionsCount[id] = count;
    }

    res.status(200).json(
        new ApiResponse(200, submissionsCount, "Submissions count fetched successfully")
    );
});

export {
    getAllSubmission,
    getSubmissionsForProblem,
    totalSubmissionsForProblem
}