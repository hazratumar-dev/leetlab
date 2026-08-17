export const getLanguageName = (languageId) => {
  const LANGUAGE_NAME = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };

  return LANGUAGE_NAME[languageId] || "Unknown";
};

export const getLanguageId = (languageName) => {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    TypeScript: 74,
  };

  return languageMap[languageName.toUpperCase()];
};
