import { FileParam, FormParam, GET, POST,  Path, QueryParam } from "typescript-rest";
import { Produces, Response } from "typescript-rest-swagger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
import { CSVParser } from "../CSVParser";
import { ICSVData } from "../models/ICSVData";
import { exampleInsertThing, exampleRetrieveThing, genericObject, saveTable } from "../Mongo";
import { correctLogin, correctLoginKey, userFromKey } from "../MongoLogin";

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
	
	 /**
	  * @param username:string - username entered into login page
	  * @param password:string - password entered into login page (clear text no encryption)
	  * @returns ObjectId toString value of user that maps to uname,pssd. If the username,password
	  *          does not map to a user, it returns a empty str
	 **/
	 @Path("/loginKeyGET")
	 @GET
	 public async loginKeyGET(@QueryParam("username") username: string, @QueryParam("password") password: string) : Promise<string>
	 {
	     return await correctLoginKey(username, password);
	 }
	 
	 /**
	  * @param key:string - key that is in local storage
	  * @return uname:Promise<string> if key matches with user in db. else returns empty str
	 **/
	 @Path("/usernameFromKeyGET")
	 @GET
	 public async usernameFromKeyGET(@QueryParam("key") key: string) : Promise<string>
	 {
	     return await userFromKey(key);
	 }
	 
}
