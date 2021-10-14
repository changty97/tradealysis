import { sourcePatterns } from "./constants/sourcePatterns";
import { ICSVData } from "./models/ICSVData";
import { ISectionedContent } from "./models/ISectionedContent";
import csv from "csvtojson/v2";

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

    public async parse(file: Express.Multer.File): Promise<ICSVData>
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

            if (sourcePatterns[this.source].includes(line))
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
                .then((json: {[key: string]: string}[]) =>
                {
                    this.parsedData[section] = json;
                }));
        });

        await Promise.all(promises);

        return this.parsedData;
    }
}

export { CSVParser };
