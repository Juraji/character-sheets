export const detectDefaultLanguageFactory = (localeId: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator.language || ('userLanguage' in navigator ? navigator.userLanguage as string : localeId)).substring(0, 2)
