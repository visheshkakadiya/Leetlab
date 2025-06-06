import { db } from "../libs/db.js";
import { runReferenceCode } from "../libs/executeRefCode.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createProblem = asyncHandler(async (req, res) => {
    // get all data from request body
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, company, hints } = req.body

    if (!referenceSolutions || typeof referenceSolutions !== "object" || Array.isArray(referenceSolutions)) {
    throw new ApiError(400, "referenceSolutions must be a non-null object");
}

    if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, "You are not allowed to create problem")
    }

    const existedProblem = await db.problem.findFirst({
        where: {
            title,
        }
    })

    if (existedProblem) {
        throw new ApiError(400, "Problem with this title already exists")
    }
    const result = await runReferenceCode(referenceSolutions, testcases)

    // if (!result) {
    //     throw new ApiError(400, "Testcases failed")
    // }

    // saving the problem to the Database
    const newProblem = await db.problem.create({
        data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            company,
            hints,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
            userId: req.user.id,
        }
    });

    return res.status(201).json(
        new ApiResponse(201, newProblem, "Problem created successfully")
    )
});

const getAllProblems = asyncHandler(async (req, res) => {

    const problems = await db.problem.findMany({
        include: {
            solvedBy: {
                where: {
                    userId: req.user.id
                }
            }
        }
    })

    if (!problems) {
        throw new ApiError(404, "No problems found")
    }

    res.status(200).json(
        new ApiResponse(200, problems, "Problems fetched successfully")
    )
});

const getProblemById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const problem = await db.problem.findUnique({
        where: {
            id,
        }
    })

    if (!problem) {
        throw new ApiError(404, "Problem not found")
    }
    res.status(200).json(
        new ApiResponse(200, problem, "Problem fetched successfully")
    )
});

const updateProblem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body;

    if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, "You are not allowed to update problem")
    }

    // Check if the problem exists
    const CheckProblem = await db.problem.findUnique({
        where: { id }
    });

    if (!CheckProblem) {
        throw new ApiError(404, "Problem not found");
    }

    if (
        [title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions].some((field) => field === undefined)
    ) {
        throw new ApiError(400, "Please provide any one field to update");
    }

    // Validate all reference solutions using Judge0
    runReferenceCode(referenceSolutions, testcases)

    // All languages passed testcases – proceed with update
    const updatedProblem = await db.problem.update({
        where: { id },
        data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions
        }
    });

    if (!updatedProblem) {
        throw new ApiError(500, "Error updating problem");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedProblem, "Problem updated successfully")
    );
});

const deleteProblem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, "You are not allowed to delete problem")
    }

    const problem = await db.problem.findUnique({
        where: {
            id
        }
    })

    if (!problem) {
        throw new ApiError(404, "Problem not found")
    }

    const deletedProblem = await db.problem.delete({
        where: {
            id,
        }
    });

    if (!deletedProblem) {
        throw new ApiError(500, "Error deleting problem")
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Problem deleted successfully")
    )
});

const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {
    const { id } = req.user.id

    const problems = await db.problem.findMany({
        where: {
            solvedBy: {
                some: {
                    userId: id,
                }
            }
        },
        include: {
            solvedBy: {
                where: {
                    userId: id,
                }
            }
        }
    })

    if (!problems) {
        throw new ApiError(404, "No problems found")
    }

    res.status(200).json(
        new ApiResponse(200, problems, "Problems fetched successfully")
    )
});

export {
    createProblem,
    getAllProblems,
    getProblemById,
    updateProblem,
    deleteProblem,
    getAllProblemsSolvedByUser
}