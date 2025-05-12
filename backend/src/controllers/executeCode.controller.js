import { db } from "../libs/db.js";
import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { runCode } from "../libs/executeRefCode.js";


const executeCode = asyncHandler(async (req, res) => {

    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;

    const userId = req.user.id;

    // 1. Validate test cases which are coming in array format

    if (!Array.isArray(stdin) ||
        stdin.length === 0 ||
        !Array.isArray(expected_outputs) ||
        expected_outputs.length !== stdin.length
    ) {
        throw new ApiError(400, "Test cases are not valid");
    }

    const results = await runCode(source_code, language_id, stdin);

    // Analyze test case results
    let allPassed = true;
    const detailedResults = results.map((result, i) => {
        const stdout = result.stdout?.trim();
        const expected_output = expected_outputs[i]?.trim();
        const passed = stdout === expected_output;

        if (!passed) allPassed = false;

        return {
            testCase: i + 1,
            passed,
            stdout,
            expected: expected_output,
            stderr: result.stderr || null,
            compile_output: result.compile_output || null,
            status: result.status.description,
            memory: result.memory ? `${result.memory} KB` : undefined,
            time: result.time ? `${result.time} sec` : undefined,
        }
    })

    // store the results in the database
    const submission = await db.submission.create({
        data: {
            userId,
            problemId,
            sourceCode: source_code,
            language: getLanguageName(language_id),
            stdin: stdin.join("\n"),
            stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
            stderr: detailedResults.some((r) => r.stderr)
                ? JSON.stringify(detailedResults.map((r) => r.stderr)) : null,
            compileOutput: detailedResults.some((r) => r.compile_output)
                ? JSON.stringify(detailedResults.map((r) => r.compile_output)) : null,
            status: allPassed ? "Accepted" : "Wrong Answer",
            memory: detailedResults.some((r) => r.memory)
                ? JSON.stringify(detailedResults.map((r) => r.memory)) : null,
            time: detailedResults.some((r) => r.time)
                ? JSON.stringify(detailedResults.map((r) => r.time)) : null,
        }
    })

    // If All passed = true then mark the problem as solved for the current user
    if (allPassed) {
        await db.problemSolved.upsert({
            where: {
                userId_problemId: {
                    userId,
                    problemId,
                }
            },
            update: {},
            create: {
                userId,
                problemId,
            }
        })
    }

    // 8. Save individual test case results using detailedResults

    const testCaseResults = detailedResults.map((result) => ({
        submissionId: submission.id,
        testCase: result.testCase,
        passed: result.passed,
        stdout: result.stdout,
        expected: result.expected,
        stderr: result.stderr,
        compileOutput: result.compile_output,
        status: result.status,
        memory: result.memory,
        time: result.time
    }))

    await db.testCaseResult.createMany({
        data: testCaseResults,
    })

    const submissionWithTestCase = await db.submission.findUnique({
        where: {
            id: submission.id,
        },
        include: {
            testCases: true,
        }
    })

    res.status(200).json(
        new ApiResponse(200, submissionWithTestCase, "Code executed successfully")
    )
});

export { executeCode };