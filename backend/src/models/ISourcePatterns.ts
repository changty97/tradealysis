export interface ISourcePatterns {
    [patternName: string]: {
        translations: {
            [key: string]: string;
        },
        sections: string[];
    }
}
