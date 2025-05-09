import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

const createProblem = async (req, res) => {
    // get all data from request body
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            error: "You are not allowed to create problem"
        })
    }

    try {

        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({
                    success: false,
                    error: `language ${language} is not supported`
                })
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }))

            const submissionResults = await submitBatch(submissions)

            const tokens = submissionResults.map((res) => res.token);

            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                console.log("Result: ", results)

                if (result.status.id !== 3) {
                    return res.status(400).json({
                        error: `Testcase ${i + 1} failed for language ${language}`
                    })
                }
            }
        }

        // saving the problem to the Database

        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                referenceSolutions,
                userId: req.user.id,
            }
        });

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem: newProblem
        })

    } catch (error) {
        console.error("Error creating problem: ", error)
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        })
    }

    // check for role of user is it Admin or not
    // loop through each and every refrence solution for every languages
}

const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany()

        if (!problems) {
            return res.status(404).json({
                success: false,
                error: "No problems found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems
        })

    } catch (error) {
        console.error("Error fetching problems: ", error)
        return res.status(500).json({
            success: false,
            error: "Error While fetching problems"
        })
    }
}

const getProblemById = async (req, res) => {
    const { id } = req.params;

    try {
        const problem = await db.problem.findUnique({
            where: {
                id,
            }
        })

        if (!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            problem
        })

    } catch (error) {
        console.error("Error fetching problem: ", error)
        return res.status(500).json({
            success: false,
            error: "Error While fetching problem by id"
        })
    }
}

const updateProblem = async (req, res) => {
    const { id } = req.params;
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body;

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            error: "You are not allowed to update problem"
        })
    }

    try {
        // Check if the problem exists
        const existingProblem = await db.problem.findUnique({
            where: { id }
        });

        if (!existingProblem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found"
            });
        }

        // Validate all reference solutions using Judge0
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({
                    success: false,
                    error: `Language "${language}" is not supported`
                });
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));

            const submissionResults = await submitBatch(submissions);
            const tokens = submissionResults.map((res) => res.token);
            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result.status.id !== 3) { // 3 = Accepted
                    return res.status(400).json({
                        success: false,
                        error: `Testcase ${i + 1} failed for language "${language}"`,
                        details: result
                    });
                }
            }
        }

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

        return res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            problem: updatedProblem
        });

    } catch (error) {
        console.error("Error updating problem: ", error);
        return res.status(500).json({
            success: false,
            error: "Error while updating problem"
        });
    }
};

const deleteProblem = async (req, res) => {
    const {id} = req.params;

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            error: "You are not allowed to delete problem"
        })
    }

    try {
        const problem = await db.problem.findUnique({
            where: {
                id
            }
        })

        if (!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found"
            })
        }

        await db.problem.delete({
            where: {
                id,
            }
        })

        return res.status(200).json({
            success: true,
            message: "Problem deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting problem: ", error)
        return res.status(500).json({
            success: false,
            error: "Error While deleting problem"
        })
    }
}

const getAllProblemsSolvedByUser = async (req, res) => {
    const { id } = req.user.id

    try {
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
            return res.status(404).json({
                success: false,
                error: "No problems found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems
        })

    } catch (error) {
        console.error("Error fetching problems solved by user: ", error)
        return res.status(500).json({
            success: false,
            error: "Error While fetching problems solved by user"
        })

    }
}

export {
    createProblem,
    getAllProblems,
    getProblemById,
    updateProblem,
    deleteProblem,
    getAllProblemsSolvedByUser
}