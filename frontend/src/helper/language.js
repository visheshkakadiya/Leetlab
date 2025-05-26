export function getLanguageName(languageId) {
    const LANGUAGE_NAME = {
        74: "Typescript",
        63: "Javascript",
        71: "Python",
        62: "Java",
    }

    return LANGUAGE_NAME[languageId] || "Unknown Language";
}

export function getLanguageId(language) {
    const languageMap = {
        "TYPESCRIPT": 74,
        "JAVASCRIPT": 63,
        "PYTHON": 71,
        "JAVA": 62
    }
    return languageMap[language.toUpperCase()];
}