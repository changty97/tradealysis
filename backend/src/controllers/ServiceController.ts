import { FileParam, FormParam, GET, POST,  Path, QueryParam, PathParam } from "typescript-rest";
import { Produces, Response } from "typescript-rest-swagger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
import { CSVParser } from "../CSVParser";
import { getTradesByYear, removeItem, saveTable, theSaveData } from "../MongoFiles/Mongo";
import { correctLoginKey, userFromKey } from "../MongoFiles/MongoLogin";
import { createAccount } from "../MongoFiles/MongoCreateAccount";
import { getStockData, retrieveYahooData } from "../stockapi";
import { ITableData } from "../models/ITableData";
import { accountValuesFromKey, doesThisAccountExist, sameAccount, modifyAccountName, changePssd, changeUserAccount } from "../MongoFiles/MongoAccountSettings";
import { allUserSessions, createNewSession, removeSession } from "../MongoFiles/MongoReportSessions";
import { IStockData } from "../models/IStockData";

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
	 *
	 * @param sourceName
	 * @param file
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

	@Path("/stockapi/:ID")
	@GET
    public async getStockNow(@PathParam("ID") ticker: string): Promise<any>
    {
        const date: Date = new Date();
        return await this.getStockThen(ticker, date.toISOString().split('T')[0]);
    }

	@Path("/stockapi/:ID/:date")
	@GET
	public async getStockThen(@PathParam("ID") ticker: string, @PathParam("date") date: string): Promise<IStockData>
	{
	    const alphaFinData: IStockData = await getStockData(`${date}-${ticker}`);
	    const yahooData: IStockData = await retrieveYahooData(ticker);
	    
	    return {
	        ...yahooData,
	        ...alphaFinData
	    };
	}

	/**
	 * @param username:string - username entered into login page
	 * @param password:string - password entered into login page (clear text no encryption)
	 * @returns ObjectId toString value of user that maps to uname,pssd. If the username,password
	 *          does not map to a user, it returns a empty str
	 */
	@Path("/loginKeyPOST")
	@POST
	public async loginKeyPOST(body: any): Promise<string>
	{
	    return await correctLoginKey(body.theData.username, body.theData.password);
	}

	
	/**
	 *   Get a username from a key in browser local storage
     *   If the key does not match with a user, nothing is returned
     *   else the user's username is returned
     *   @returns username : string or "" : string if key does not relate to user in backend
	 */
	@Path("/usernameFromKeyGET")
	@GET
	public async usernameFromKeyGET(@QueryParam("key") key: string): Promise<string>
	{
	    return await userFromKey(key);
	}

	/**
	 * Method creates Account
	 * @returns 1 if account is created. 0 if username already exists or account not created
 	 */
	@Path("/createAccountPost")
	@POST
	public async createAccountPost(body: any) : Promise<boolean>
	{
	    return await createAccount(body.userInfo.username, body.userInfo.password, body.userInfo.fName, body.userInfo.lName, body.userInfo.email, body.userInfo.phone, body.userInfo.bdate);
	}
	
	@Path("/accountData")
	@GET
	public async accountData(@QueryParam("key") key: string):Promise<any>
	{
	    return await accountValuesFromKey(key);
	}
	
	/** For Account Settings. Sees if @param account is the same name as uname associated with @param key **/
	@Path("/sameAccountGet")
	@GET
	public async sameAccountGet(@QueryParam("key") key:string, @QueryParam("account") account:string):Promise<boolean>
	{
	    return await sameAccount(key, account);
	}
	
	@Path("/accountExists")
	@GET
	public async accountExists(@QueryParam("newAccountName") newAccountName:string):Promise<boolean>
	{
	    return await doesThisAccountExist(newAccountName);
	}
	
	@Path("/changeTheAccountName")
	@GET
	public async changeTheAccountName(@QueryParam("key") key:string, @QueryParam("newAccountName") newAccountName:string):Promise<void>
	{
	    return await modifyAccountName(key, newAccountName);
	}
	
	@Path("/changePassword")
	@GET
	public async changePassword(@QueryParam("key") key:string, @QueryParam("oldP") oldP:string, @QueryParam("newP") newP:string): Promise<boolean>
	{
	    return await changePssd(key, oldP, newP);
	}
	
	@Path("/changeExtraAccountData")
	@GET
	public async changeExtraAccountData(@QueryParam("key") key:string, @QueryParam("firstName") firstName:string, @QueryParam("lastName") lastName:string,
									    @QueryParam("email") email:string, @QueryParam("phone") phone:string, @QueryParam("bdate") bdate:string): Promise<boolean>
	{
	    return await changeUserAccount(key, firstName, lastName, email, phone, bdate);
	}
	
	/** Remove data item based on id **/
	@Path("/removeTheItemGet")
	@POST
	public async removeTheItemGet(body: any): Promise<void>
	{
	    return await removeItem(body.data.item, body.data.coll);
	}
	
	 /**
	 * @param dataArray: any - 2d array which contains data of every cell in the spreadsheet
	 * @returns the spreadsheet array as a JSON object
	 */
    @Path("/postTableDB")
    @POST
	public async postTableDB(body: any): Promise<void>
	{
	    return await saveTable(body.data.table, body.data.key, body.data.coll);
	}
	
	/** Get data from default stock table **/
	@Path("/stockdataGet")
	@GET
    public async stockdataGet(@QueryParam("key") key:string, @QueryParam("coll") coll:string):Promise<any[]>
    {
	    return await theSaveData(key, coll);
    }
	
	/** Get all user Sessions **/
	@Path("/userSessionsGet")
	@GET
	public async userSessionsGet(@QueryParam("key") key:string): Promise<string[]>
	{
	    return await allUserSessions(key);
	}


	/** Create a new session for a user. This adds a session for a user **/
	@Path("/createNewSessionForUser")
	@GET
	public async createNewSessionForUser(@QueryParam("key") key:string, @QueryParam("collectionName") collectionName:string): Promise<string>
	{
	    return await createNewSession(key, collectionName);
	}
	
	/** Remove Session  **/
	@Path("/removeSessionForUser")
	@GET
	public async removeSessionForUser(@QueryParam("key") key:string, @QueryParam("session") session:string): Promise<string>
	{
	    return await removeSession(key, session);
	}

	@Path("/getTradesByYear")
	@GET
	public async getTradesByYear(@QueryParam("key") key: string, @QueryParam("coll") coll: string, @QueryParam("year") year: string): Promise<any>
	{
	    return await getTradesByYear(key, coll, year);
	}
}










