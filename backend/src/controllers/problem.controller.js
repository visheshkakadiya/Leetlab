import { db } from "../libs/db.js";
import { getJudge0LanguageId, submitBatch } from "../libs/judge0.lib.js";

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

                if (results.status !== 3) {
                    return res.status(400).json({
                        error: `Testcase ${i + 1} failed for language ${language}`
                    })
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

            return res.status(201).json(newProblem)
        }

    } catch (error) {

    }

    // check for role of user is it Admin or not
    // loop through each and every refrence solution for every languages
}