import { FileParam, FormParam, GET, POST,  Path, QueryParam } from "typescript-rest";
import { Produces, Response } from "typescript-rest-swagger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
import { CSVParser } from "../CSVParser";
import { ICSVData } from "../models/ICSVData";
import { ITableData } from "../models/ITableData";
import { exampleInsertThing, exampleRetrieveThing, genericObject, saveTable } from "../Mongo";
import { correctLogin } from "../MongoLogin";

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

    /**
     * Parses a given csv file according to a predefined pattern specified by the sourceName.
     *
     * @param sourceName Pattern to parse by
     * @param file csv file to parse data from.
     *
     * @returns
     */
    @Path("/parseCSV")
    @POST
    public async parseCSV(@FormParam("sourceName") sourceName: string, @FileParam("file") file: Express.Multer.File): Promise<ITableData[]>
    {
        const parser: CSVParser = new CSVParser(sourceName);

        await parser.parse(file);

        return parser.filter();
    }
	
    /**
      * @param dataArray: any - 2d array which contains data of every cell in the spreadsheet
      * @returns the spreadsheet array as a JSON object
    **/
    @Path("/postTableDB")
    @POST
    public async postTableDB(dataArray: any)
    {
        return await saveTable(dataArray);
    }
	
    /**
	  * @param username:string - username entered into login page
	  * @param password:string - password entered into login page (clear text no encryption)
	  * @returns 1 if username, password pair in db. otherwuse returns 0 (str character 1, 0)
	 **/
	 @Path("/loginGet")
	 @GET
    public async loginGet(@QueryParam("username") username: string, @QueryParam("password") password: string) : Promise<number>
    {
        return await correctLogin(username, password);
    }
	 
}
