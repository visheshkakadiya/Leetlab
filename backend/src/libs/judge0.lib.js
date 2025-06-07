import axios from "axios"

export const getJudge0LanguageId = (language)=>{
    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }

    return languageMap[language.toUpperCase()]
}

const sleep  = (ms)=> new Promise((resolve)=> setTimeout(resolve , ms))


const isRapidApi = !!process.env.JUDGE0_RAPID_API_URL
const apiUrl = isRapidApi ? process.env.JUDGE0_RAPID_API_URL : process.env.JUDGE0_API_URL

export const pollBatchResults = async (tokens)=>{
    while(true){
        let config = {
            params:{
                tokens: tokens.join(","),
                base64_encoded: false,
            }
        }

        // Add RapidAPI headers if using RapidAPI
        if(isRapidApi) {
            config.headers = {
                'x-rapidapi-key': process.env.JUDGE0_RAPID_API_KEY,
                'x-rapidapi-host': process.env.JUDGE0_RAPID_API_HOST
            }
        }
        
        const {data} = await axios.get(`${apiUrl}/submissions/batch`, config)

        const results = data.submissions;

        const validResults = results.filter(r => r !== null)
        
        if(validResults.length === 0) {
            console.error('All submissions are null - tokens may be invalid')
            return results
        }

        const isAllDone = validResults.every(
            (r)=> r && r.status && r.status.id !== 1 && r.status.id !== 2
        )

        if(isAllDone) return results
        await sleep(1000)
    }
}

export const submitBatch = async (submissions)=>{
    let config = {}

    if(isRapidApi) {
        config.headers = {
            'x-rapidapi-key': process.env.JUDGE0_RAPID_API_KEY,
            'x-rapidapi-host': process.env.JUDGE0_RAPID_API_HOST
        }
    }

    const {data} = await axios.post(`${apiUrl}/submissions/batch?base64_encoded=false`, {
        submissions
    }, config)

    return data // [{token} , {token} , {token}]
}

export function getLanguageName(languageId){
    const LANGUAGE_NAMES = {
        74: "TypeScript",
        63: "JavaScript",
        71: "Python",
        62: "Java",
    }

    return LANGUAGE_NAMES[languageId] || "Unknown"
}