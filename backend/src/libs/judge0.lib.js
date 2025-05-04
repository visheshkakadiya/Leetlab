import axios from 'axios'

export const getJudge0LanguageId = (Language) => {
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    }

    return languageMap[Language.toUpperCase()];
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const pollBatchResults = async (tokens) => {
    while(true) {
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false,
            }
        })

        const results = data.submissions

        const isAllDOne = results.every(
            (r) => r.status.id !== 1 && r.status.id !== 2
        )

        if(isAllDOne) return results
        await sleep(1000)
    }
}

export const submitBatch = async (submissions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
        submissions
    })
    
    console.log("Submission Results: ", data)

    return data // [{token}, {token}, {token}]
}

export const getLanguageName = (languageId) => {
    const LANGUAGE_NAMES = {
        74: "Typescript",
        63: "Javascript",
        71: "Python",
        62: "Java",
    }

    return LANGUAGE_NAMES[languageId] || "Unknown Language"
}
