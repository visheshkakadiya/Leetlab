import { db } from "../libs/db.js";

const getAllSubmission = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required"
            });
        }

        const submission = await db.submission.findMany({
            where: {
                userId: userId,
            }
        })

        res.status(200).json({
            success: true,
            message: "All submissions fetched successfully",
            submission: submission,
        })

    } catch (error) {
        console.error("Error fetching submissions: ", error);
        return res.status(500).json({
            success: false,
            error: "Error fetching submissions",
        })
    }
}

const getSubmissionsForProblem = async (req, res) => {
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required"
            });
        }

        const submissions = await db.submission.findMany({
            where: {
                userId: userId,
                problemId: problemId,
            }
        })

        if (!submissions) {
            return res.status(404).json({
                success: false,
                error: "No submissions found for this problem"
            });
        }
        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissions: submissions,
        })

    } catch (error) {
        console.error("Error fetching submissions for problem: ", error);
        return res.status(500).json({
            success: false,
            error: "Error fetching submissions for problem",
        })
    }
}

const getAllTheSubmissionsForProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId;

        if (!problemId) {
            return res.status(400).json({
                success: false,
                error: "Problem ID is required"
            });
        }

        const submissions = await db.submission.count({
            where: {
                problemId: problemId,
            }
        })

        if (!submissions) {
            return res.status(404).json({
                success: false,
                error: "No submissions found for this problem"
            });
        }
        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissions: submissions,
        })
    } catch (error) {
        console.error("Error fetching submissions for problem: ", error);
        return res.status(500).json({
            success: false,
            error: "Error fetching submissions for problem",
        })
    }
}

export {
    getAllSubmission,
    getSubmissionsForProblem,
    getAllTheSubmissionsForProblem
}