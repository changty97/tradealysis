import { sourcePatterns } from "./constants/sourcePatterns";
import { ICSVData } from "./models/ICSVData";
import { ISectionedContent } from "./models/ISectionedContent";

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

    public parse(file: Express.Multer.File): void
    {
        const sectionedData: ISectionedContent = {
        };
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
                    sectionedData[focus] = [];
                }

                sectionedData[focus].push(line);
            }

            if (sourcePatterns[this.source].includes(line))
            {
                focus = line;
            }
        });

        /* Parse sections into JSON */
        Object.entries(sectionedData).forEach(([section, content]: [string, string[]]) =>
        {
            const headers: string[] = content[0].split(',');
            const colsToIgnore: number[] = [];

            if (!this.parsedData[section])
            {
                this.parsedData[section] = [];
            }

            headers.forEach((header: string, col: number) =>
            {
                // Make a list of columns to ignore where the header is empty.
                if (!header || header === '')
                {
                    colsToIgnore.push(col);
                }
            });

            content.slice(1).forEach((row: string) =>
            {
                // Holy shit, you don't understand how hard it is to deal with commas within data that's separated by commas.
                const parsedRow: string[] = row.match(/(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g);

                /*if (parsedRow.length >= headers.length - colsToIgnore.length)
                {
                    throw new Error("Not enough headers to contain provided data.");
                }*/

                const convertedRow: {[key: string]: string} = {
                };

                parsedRow.forEach((data: string, col: number) =>
                {
                    if (col >= headers.length - colsToIgnore.length)
                    {
                        throw new Error("Not enough headers to contain provided data.");
                    }

                    if (!colsToIgnore.includes(col))
                    {
                        if (data.startsWith(','))
                        {
                            data = data.slice(1);
                        }

                        convertedRow[headers[col]] = data;
                    }
                });

                this.parsedData[section].push(convertedRow);
            });
        });
    }

    public toJSON(): ICSVData
    {
        return this.parsedData;
    }
}

export { CSVParser };
