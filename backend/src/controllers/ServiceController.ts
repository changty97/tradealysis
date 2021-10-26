import { FileParam, FormParam, GET, POST,  Path, QueryParam, PathParam } from "typescript-rest";
import { Produces, Response } from "typescript-rest-swagger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
import { CSVParser } from "../CSVParser";
import { ICSVData } from "../models/ICSVData";
import { exampleInsertThing, exampleRetrieveThing, genericObject, saveTable } from "../Mongo";
import { correctLoginKey, userFromKey } from "../MongoLogin";
import { createAccount } from "../MongoCreateAccount";
import { fnameFromKey } from "../MongoAccountSettings";
import { getStockData } from "../stockapi";


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
    public async postTableDB(dataArray: any): Promise<string>
    {
        return await saveTable(dataArray);
    }

	@Path("/stockapi/:ID")
	@GET
	public async getStock(@PathParam("ID") ID: string): Promise<any> {
		return await getStockData(ID);
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
	 *   Get a username from a key in browser local storage
     *   If the key does not match with a user, nothing is returned
     *   else the user's username is returned
     *   @returns username : string or "" : string if key does not relate to user in backend
	**/
	 @Path("/usernameFromKeyGET")
	 @GET
	 public async usernameFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await userFromKey(key);
	 }

	 /**
	  * Method creates Account
	  * @returns 1 if account is created. 0 if username already exists or account not created
	 **/
	 @Path("/createAccountPost")
	 @POST
	 public async createAccountPost(body: any) : Promise<number>
	 {
		 return await createAccount(body.userInfo.username, body.userInfo.password, body.userInfo.fName, body.userInfo.lName, body.userInfo.email, body.userInfo.phone, body.userInfo.bdate);
	 }
	 
	 @Path("/accountunameFromKeyGET")
	 @GET
	 public async accountunameFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await this.usernameFromKeyGET(key);
	 }
	 
	 @Path("/accountfNameFromKeyGET")
	 @GET
	 public async accountfnameFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await fnameFromKey(key, "fName");
	 }
	 
	 @Path("/accountlNameFromKeyGET")
	 @GET
	 public async accountlNameFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await fnameFromKey(key, "lName");
	 }
	 
	 @Path("/accountemailFromKeyGET")
	 @GET
	 public async accountemailFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await fnameFromKey(key, "email");
	 }
	 
	 @Path("/accountphoneFromKeyGET")
	 @GET
	 public async accountphoneFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await fnameFromKey(key, "phone");
	 }
	 
	 @Path("/accountbdateFromKeyGET")
	 @GET
	 public async accountbdateFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await fnameFromKey(key, "bdate");
	 }
}
