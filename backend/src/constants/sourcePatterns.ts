import { ISourcePatterns } from "../models/ISourcePatterns";

const sourcePatterns: ISourcePatterns = {
    TDAmeritrade: {
        translations: {
            "DOI": "Exec Time",
            "Action": "Side",
            "Ticker": "Symbol",
            "# Shares": "Qty",
            "Price": "Price"
        },
        sections: [
            // "Cash Balance",
            "Account Trade History",
            // "Profits and Losses",
            // "Account Summary"
        ]
    },
    Tradealysis: {
        translations: {
        },
        sections: []
    }
};

export { sourcePatterns };
