import { FileParam, FormParam, GET, POST,  Path, QueryParam } from "typescript-rest";
import { Produces, Response } from "typescript-rest-swagger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
import { CSVParser } from "../CSVParser";
import { ICSVData } from "../models/ICSVData";
import { exampleInsertThing, exampleRetrieveThing, genericObject } from "../Mongo";

const badRequestExampleResponse: BadRequestError = {
    name: "BadRequestError",
    message: "Your request payload was not in the expected format.",
    statusCode: 400
};

@Produces("application/json")
@Response<BadRequestError>(400, "Bad Request", badRequestExampleResponse)
@Path("/")
export class ServiceController
{
    /**
     * @param test
     *
     * @returns The item
     */
    @Path("/testGET")
    @GET
    public async testGET(@QueryParam("key") key: string, @QueryParam("value") value: number): Promise<genericObject[]>
    {
        return await exampleRetrieveThing({
            [key]: value
        });
    }

    /**
     * @param test
     *
     * @returns The objectId of the inserted item.
     */
    @Path("/testPOST")
    @POST
    public async testPOST(@QueryParam("test") test: number): Promise<string>
    {
        return await exampleInsertThing(test);
    }

    @Path("/parseCSV")
    @POST
    public async parseCSV(@FormParam("sourceName") sourceName: string, @FileParam("file") file: Express.Multer.File): Promise<ICSVData>
    {
        const parser: CSVParser = new CSVParser(sourceName);

        return await parser.parse(file);
    }
}
