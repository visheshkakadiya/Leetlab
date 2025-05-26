import { getJudge0LanguageId, pollBatchResults, submitBatch } from "./judge0.lib.js"
import ApiError from "../utils/ApiError.js"

export const runReferenceCode = async (referenceSolutions, testcases) => {

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
        const languageId = getJudge0LanguageId(language);
        if (!languageId) {
            throw new ApiError(400, `language ${language} is not supported`)
        }

        const submissions = testcases.map(({ input, output }) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,
        }))

        const submissionResults = await submitBatch(submissions);

        const tokens = submissionResults.map((res) => res.token);

        const results = await pollBatchResults(tokens);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            if (result.status.id !== 3) {
                throw new ApiError(400, `Testcase ${i + 1} failed for language ${language}`)
            }
        }
    }
}

export const runCode = async (source_code, language_id, stdin) => {
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

    return results;
}