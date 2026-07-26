export const UserRoleEnum = {
    USER: "user",
    ADMIN: "admin",
}

export const AvailableUserRole = Object.values(UserRoleEnum)

export const difficultyLevel = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard"
}

export const AvailableDifficultylevel = Object.values(difficultyLevel);

export const codeLanguage = {
    JAVASCRIPT: "javascript",
    JAVA: "java",
    PYTHON: "python"
}

export const AvailableCodeLanguage = Object.values(codeLanguage)

export const getLanguageName = (languageId) => {
    const LANGUAGE_NAME = {
        63: "JavaScript",
        71: "Python",
        62: "Java"
    }

    return LANGUAGE_NAME[languageId] || "Unknown"
}