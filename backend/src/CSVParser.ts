import { sourcePatterns } from "./constants/sourcePatterns";
import { ICSVData } from "./models/ICSVData";
import { ISectionedContent } from "./models/ISectionedContent";
import csv from "csvtojson/v2";
import { ITableData } from "./models/ITableData";

class CSVParser
{
    private source: string = null;
    private parsedData: ICSVData = {
    };

    constructor(source: string)
    {
        if (!Object.keys(sourcePatterns).includes(source))
        {
            throw new Error(`"${source}" is not a recognized source.`);
        }

        this.source = source;
    }

    public async parse(file: Express.Multer.File): Promise<void>
    {
        const sectionedData: ISectionedContent = {
        };
        const promises: PromiseLike<void>[] = [];
        let focus: string = null;

        /* Section out content */
        file.buffer.toString().split('\r').forEach((line: string) =>
        {
            line = line.trim();
            if (line === '')
            {
                focus = null;
            }

            if (focus)
            {
                if (!sectionedData[focus])
                {
                    sectionedData[focus] = "";
                }

                sectionedData[focus] += `${line}\n`;
            }

            if (sourcePatterns[this.source].sections.includes(line))
            {
                focus = line;
            }
        });

        /* Parse sections into JSON */
        Object.entries(sectionedData).forEach(([section, content]: [string, string]) =>
        {
            promises.push(csv({
                ignoreEmpty: true
            })
                .fromString(content)
                .then((json: ITableData[]) =>
                {
                    this.parsedData[section] = json;
                }));
        });

        await Promise.all(promises);
    }

    public filter(): ITableData[]
    {
        const result: ITableData[] = [];

        Object.values(this.parsedData).forEach((section: ITableData[]) =>
        {
            section.reverse().forEach((row: ITableData) =>
            {
                if (row["Side"] === "SELL")
                {
                    result.push({
                        DOI: row[sourcePatterns[this.source].translations["DOI"]] || "",
                        Ticker: row[sourcePatterns[this.source].translations["Ticker"]] || "",
                        "# Shares": row[sourcePatterns[this.source].translations["# Shares"]] ? row[sourcePatterns[this.source].translations["# Shares"]].slice(1) : "",
                        Price: row[sourcePatterns[this.source].translations["Price"]] || ""
                    });
                }

            });
        });

        return result;
    }
}

export { CSVParser };
