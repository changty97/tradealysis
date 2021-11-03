import { FileParam, FormParam, GET, POST,  Path, QueryParam, PathParam } from "typescript-rest";
import { Produces, Response } from "typescript-rest-swagger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
import { CSVParser } from "../CSVParser";
import { ICSVData } from "../models/ICSVData";
import { ITableData } from "../models/ITableData";
import { exampleInsertThing, exampleRetrieveThing, genericObject, saveTable, getTableData } from "../MongoFiles/Mongo";
import { correctLoginKey, userFromKey } from "../MongoFiles/MongoLogin";
import { createAccount } from "../MongoFiles/MongoCreateAccount";
import { accountValueFromKey } from "../MongoFiles/MongoAccountSettings";
import { getStockData } from "../stockapi";
import { convertToTableFormat } from "../importedDataToTable";

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
		 * @param dataArray: any - 2d array which contains data of every cell in the spreadsheet
		 * @returns the spreadsheet array as a JSON object
		**/
	@Path("/getTableDB")
	@GET
    public async getTableDB(@QueryParam("objId") objId: string) : Promise<any>
    {
        const retValue = getTableData(objId);
        return await retValue;
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
     * @returns Currently this returns an array of objects containing the DOI, ticker, position, P/L, P/L%, Avg. entry price and Avg. exit price.
     */
	 @Path("/parseCSV")
	 @POST
	 public async parseCSV(@FormParam("sourceName") sourceName: string, @FileParam("file") file: Express.Multer.File): Promise<ITableData[]>
	 {
		 console.log(file);
		 const parser: CSVParser = new CSVParser(sourceName);
 
		 await parser.parse(file);
        // TODO: Create a new table and insert each object from the parsed array into a row
		 // console.log(parser.filter());
		 return parser.filter();
	 }
 

	/**
     * @param ID
     * @returns JSON object of stock API data
     */
	@Path("/stockapi/")
	@GET
	 public async getStock(@QueryParam("ID") ID: string): Promise<any>
	 {
	     // console.log(getStockData(ID));
	     const stockData = getStockData(ID);
	     return await stockData;
	 }

	
    /**
      * @param dataArray: any - 2d array which contains data of every cell in the spreadsheet
      * @returns the spreadsheet array as a JSON object
    **/
    @Path("/postTableDB")
    @POST
	public async postTableDB(dataArray: any)
	{
	    // TODO: fetch stock api and insert it into the table BEFORE posting

	    // uncomment below to test table contents without saving
	    // return await console.log(dataArray);
	    return await saveTable(dataArray);
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
	 public async createAccountPost(body: any) : Promise<boolean>
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
		 return await accountValueFromKey(key, "fName");
	 }
	 
	 @Path("/accountlNameFromKeyGET")
	 @GET
	 public async accountlNameFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await accountValueFromKey(key, "lName");
	 }
	 
	 @Path("/accountemailFromKeyGET")
	 @GET
	 public async accountemailFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await accountValueFromKey(key, "email");
	 }
	 
	 @Path("/accountphoneFromKeyGET")
	 @GET
	 public async accountphoneFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await accountValueFromKey(key, "phone");
	 }
	 
	 @Path("/accountbdateFromKeyGET")
	 @GET
	 public async accountbdateFromKeyGET(@QueryParam("key") key: string):Promise<string>
	 {
		 return await accountValueFromKey(key, "bdate");
	 }
}
