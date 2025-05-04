import { db } from "../libs/db.js";
import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

const executeCode = async (req, res) => {
    try {
        const {source_code, language_id, stdin, expected_outputs, problemId} = req.body;

        const userId = req.user.id;

        // 1. Validate test cases which are coming in array format

        if(!Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        ) {
            return res.status(400).json({
                success: false,
                error: "Invalid or Missing Testcases"
            })
        }

        // 2. Prepare each test cases for judge0 batch submission
        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input,         
        }))

        // 3. Send batch of submissions to judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token);

        // 4. Poll the results for each submission
        const results = await pollBatchResults(tokens);
        console.log('Result-------------')
        console.log(results);

        // Analyze test case results
        let allPassed = true;
        const detailedResults = results.map((result, i) => {
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[i]?.trim();
            const passed = stdout === expected_output;

            if(!passed) allPassed = false; 

            return {
                testCase: i=1,
                passed,
                stdout,
                expected: expected_output,
                stderr: result.stderr || null,
                compile_output: result.compile_output || null,
                status: result.status.description,
                memeory: result.memory ? `${result.memory} KB` : undefined,
                time: result.time ? `${result.time} sec` : undefined,
            }

            // console.log(`Testcase ${i+1}`);
            // console.log(`Input ${stdin[i]}`);
            // console.log(`Expected Output for testcase ${expected_output}`);
            // console.log(`Actual Output ${stdout}`);

            // console.log(`Matched: ${passed}`);
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
                complieOutput: detailedResults.some((r) => r.compile_output)
                ? JSON.stringify(detailedResults.map((r) => r.compile_output)) : null,
                status: allPassed ? "Accepted" : "Wrong Answer",
                memory: detailedResults.some((r) => r.memory)
                ? JSON.stringify(detailedResults.map((r) => r.memory)) : null,
                time: detailedResults.some((r) => r.time)
                ? JSON.stringify(detailedResults.map((r) => r.time)) : null,
            }
        })

        // If All passed = true then mark the problem as solved for the current user
        if(allPassed) {
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

        res.status(200).json({
            success: true,
            message: "Code executed successfully",
        })

    } catch (error) {
        console.error("Error executing code: ", error);
        return res.status(500).json({
            success: false,
            error: "Error executing code",
        })
    }
}

export { executeCode };