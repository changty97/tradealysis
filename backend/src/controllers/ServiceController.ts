import { FileParam, FormParam, GET, POST,  Path, QueryParam, PathParam } from "typescript-rest";
import { Produces, Response } from "typescript-rest-swagger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
import { CSVParser } from "../CSVParser";
import { removeItem, saveTable, theSaveData } from "../MongoFiles/Mongo";
import { correctLoginKey, userFromKey } from "../MongoFiles/MongoLogin";
import { createAccount } from "../MongoFiles/MongoCreateAccount";
import { accountValuesFromKey, doesThisAccountExist, sameAccount, modifyAccountName, changePssd, changeUserAccount } from "../MongoFiles/MongoAccountSettings";
import { allUserSessions, createNewSession, removeSession, changeTheSessionName } from "../MongoFiles/MongoReportSessions";
import { getStockData, retrieveYahooData } from "../stockapi";
import { ITableData } from "../models/ITableData";
import { IStockData } from "../models/IStockData";
import { Mutex, Semaphore, withTimeout } from 'async-mutex';
import { MyCrypto } from "../Encryption/MyCrypto";
import { BE_KEY } from "../constants/globals";
import * as crypto from "crypto-js";

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
	private modifyAccountMutex: Mutex;
	private modifySessionName: Mutex;
	
	/** Instantiate Mutex Locks, Service Controller Instance **/
	constructor()
	{
	    this.modifyAccountMutex = new Mutex(); /** 1 person can modify account name at a time to avoid account name issues **/
	    this.modifySessionName = new Mutex();  /** 1 Session can be created at a time. Not really needed, but if 2 people are using 1 account, and delete/modify session name, no issues arise **/
	}
	
    /**
	 * Used to Parse a CSV File
	 *
	 * @param {string} sourceName: filename to parse into a reports session
	 * @param {File} file: File Object
	 * @returns {ITableData} Table data for Reports Session
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
	 * Retrieve Stock Data Now
	 * @param {string} ID (ticker): Stock Ticker
	 * @returns {object}: Stock Data now
	 * @throws {Error}: 500 Internal Server Error If Not Valid ticker or api doesnt have a record of this stock ticker
	**/
	@Path("/stockapi/:ID")
	@GET
    public async getStockNow(@PathParam("ID") ticker: string): Promise<any>
    {
        return await retrieveYahooData(ticker);
    }
	
	/**
	 * Retrieve Stock Data Historical Data
	 * @param {string} ID (ticker): Stock Ticker
	 * @param {string} date: Current Date in format YYYY-MM-DD
	 * @returns {IStockData}: Historical Stock Data
	 * @throws {Error}: If invalid request or FinHub/AlphaVantage Changes. Otherwise Obj with price=0, name= @param 'ID'
	**/
	@Path("/stockapi/:ID/:date")
	@GET
	public async getStockThen(@PathParam("ID") ticker: string, @PathParam("date") date: string): Promise<IStockData>
	{
	    return await getStockData(`${date}-${ticker}`);
	}

	/**
	 * Used in Program to Determine if someone is logged in by returning ObjectId toString value of user
	 *
	 * @param {object} body containing attribute theData. the data contains attributes
	 * @param {string} username: username entered into login page
	 * @param {string} password- password entered into login page (clear text no encryption)
	 * 		body {
	 *			theData: { username: @param username, password: @param password},
	 * 		}
	 * @returns {string}: ObjectId toString value of user that maps to uname,pssd. If the username,password
	 *          does not map to a user, it returns ''
	 */
	@Path("/loginKeyPOST")
	@POST
	public async loginKeyPOST(body: any): Promise<string>
	{
	    return await correctLoginKey(body.theData.username, body.theData.password);
	}
	
	/**
	 *   Get username from a key stored in browser local storage
     *   If the key does not match with a user, nothing is returned
     *   else the user's username is returned
	 *
	 *	 @param {string} key: encrypted key stored in browser local storage
     *   @returns {string} username : string if key does not relate to user in backend
	 *
	 *   Note: returning "" is the same as not being logged in (invalid key in browser or not logged in )
	 */
	@Path("/usernameFromKeyGET")
	@GET
	public async usernameFromKeyGET(@QueryParam("key") key: string): Promise<string>
	{
	    return await userFromKey(key);
	}

	/**
	 * Method creates Account
	 * @param {object} body: js object containing FE_KEY, username, password, fName, lName, email, phohe, bdate
	 * @returns {boolean} true/false if account is created (or not)
 	 */
	@Path("/createAccountPost")
	@POST
	public async createAccountPost(body: any) : Promise<boolean>
	{
	    let res = false;
	    try
	    {
	        await this.modifyAccountMutex.acquire();
	        res = await createAccount(body.userInfo.FE_KEY,  body.userInfo.username, body.userInfo.password, body.userInfo.fName, body.userInfo.lName, body.userInfo.email, body.userInfo.phone, body.userInfo.bdate);
	        return res;
	    }
	    catch (err)
	    {
	        return Promise.reject(err);
	    }
	    finally
	    {
	        if (this.modifyAccountMutex.isLocked)
	        {
	            await this.modifyAccountMutex.release(); /** Release Modify Account Lock so others can create/modify their account **/
	        }
	    }
	}
	
	/**
	 * Get All Encrypted Personal Account Information Stored in Account Settings
	 * @param {string} FE_KEY: AES Key For Front End
	 * @param {string} key: encrypted key for user using application
	 * @returns {object} : data stored in account settings
	**/
	@Path("/accountData")
	@GET
	public async accountData(@QueryParam("FE_KEY") FE_KEY: string, @QueryParam("key") key: string):Promise<any>
	{
	    return await accountValuesFromKey(FE_KEY, key);
	}
	
	/**
	 * @param {string} key: user key
	 * @param {string} account: user Account Name
	 * @returns {boolean} true/false: Determine if trying to change uname to current uname
	**/
	@Path("/sameAccountGet")
	@GET
	public async sameAccountGet(@QueryParam("key") key:string, @QueryParam("account") account:string):Promise<boolean>
	{
	    return await sameAccount(key, account);
	}
	
	/**
	 * See if an account with @param newAccountName already exists
	 *
	 * @param {string} newAccountName: Possible new Account
	 * @returns {boolean} true/false regarding if account exists or not
	**/
	@Path("/accountExists")
	@GET
	public async accountExists(@QueryParam("newAccountName") newAccountName:string):Promise<boolean>
	{
	    return await doesThisAccountExist(newAccountName);
	}
	
	/**
	 * Change an account name
	 * @param {string} key: key stored in browser local storage
	 * @param {string} newAccountName" new userName
	 *
	**/
	@Path("/changeTheAccountName")
	@GET
	public async changeTheAccountName(@QueryParam("key") key:string, @QueryParam("newAccountName") newAccountName:string):Promise<void>
	{
	    try
	    {
	        await this.modifyAccountMutex.acquire();
	        return await modifyAccountName(key, newAccountName);
	    }
	    catch (err)
	    {
	        return Promise.reject(err);
	    }
	    finally
	    {
	        if (this.modifyAccountMutex.isLocked)
	        {
	            await this.modifyAccountMutex.release(); /** Release Mutext Lock **/
	        }
	    }
	}
	
	/**
	 * Change a Users Password
	 * @param {string} key: key stored in browser local storage which identifies user
	 * @param {string} oldP: old password
	 * @param {string} newP: new password
	 * @returns {boolean} true/false if password changed. Passwords must consist of 1 character
	**/
	@Path("/changePassword")
	@GET
	public async changePassword(@QueryParam("key") key:string, @QueryParam("oldP") oldP:string, @QueryParam("newP") newP:string): Promise<boolean>
	{
	    return await changePssd(key, oldP, newP);
	}
	
	/**
	 * Change User Data
	 * @param {string} FE_KEY:    Secret AES Key held by Front End of Application
	 * @param {string} key:       Users Encrypted Key Which is in Local Storage of Browser
	 * @param {string} firstName: First Name to Change to
	 * @param {string} lastName   Last Name to Change to
	 * @param {string} email:     Email Name to Change to
	 * @param {string} phone:     Phone Number to Change to
	 * @param {string} bdate:     BDate to Change to
	 *
	 * @returns {boolean} true/false regarding if account info is changed
	**/
	@Path("/changeExtraAccountData")
	@GET
	public async changeExtraAccountData(@QueryParam("FE_KEY") FE_KEY:string,
										@QueryParam("key") key:string, @QueryParam("firstName") firstName:string, @QueryParam("lastName") lastName:string,
									    @QueryParam("email") email:string, @QueryParam("phone") phone:string, @QueryParam("bdate") bdate:string): Promise<boolean>
	{
	    return await changeUserAccount(FE_KEY, key, firstName, lastName, email, phone, bdate);
	}
	
	/**
     * Remove item from collection
	 * @param {object} body: body obj containing:
	 *                       @param {number} item : id or rowkey value of item to remove from collection
	 *                       @param {string} coll : collection to remove item from
	**/
	@Path("/removeTheItemGet")
	@POST
	public async removeTheItemGet(body: any): Promise<void>
	{
	    return await removeItem(body.data.item, body.data.coll);
	}
	
	 /**
	 * @param body: contains
	 *				{any[]} table: data Array
	 *              {string} key: user Key
	 *				{string} coll: collectionName to Store Reports Data for particular session
	 */
    @Path("/postTableDB")
    @POST
	public async postTableDB(body: any): Promise<void>
	{
	    return await saveTable(body.data.table, body.data.key, body.data.coll);
	}
	
	/**
	 * Userd to retrieve data from the stock collection database.
	 * All stock files in Mongo are named with userName + "_" + sessionID
	 * userName is retrieved from the key. Nothing is returned if invalid key
	 *
	 * @param {string} key: key in local storage (Front End)
	 * @param  {string} coll: collection/sessio name
	 * @returns {any[]} all data from a specific session associated with a user or empty array if invalid params
	**/
	@Path("/stockdataGet")
	@GET
    public async stockdataGet(@QueryParam("key") key:string, @QueryParam("coll") coll:string):Promise<any[]>
    {
	    return await theSaveData(key, coll);
    }
	
	/**
	 * Get All user Sessions
	 * @param {string} key: key associated with user
	 * @returns {string[]} all sessions/files associated with users
	**/
	@Path("/userSessionsGet")
	@GET
	public async userSessionsGet(@QueryParam("key") key:string): Promise<string[]>
	{
	    return await allUserSessions(key);
	}

	/**
	 * Create a new session for a user. This adds a session for a user
	 * @param {string} key: userKey
	 * @param {string} newCollectionName
	 * @returns {string} : name of new session name based upon newCollectionName
	**/
	@Path("/createNewSessionForUser")
	@GET
	public async createNewSessionForUser(@QueryParam("key") key:string, @QueryParam("collectionName") collectionName:string): Promise<string>
	{
	    return await createNewSession(key, collectionName);
	}
	
	/**
	 * Remove Session For User (Report)
     * @param {string} key: userKey
	 * @param {string} session: user session to be removed
	**/
	@Path("/removeSessionForUser")
	@GET
	public async removeSessionForUser(@QueryParam("key") key:string, @QueryParam("session") session:string): Promise<string>
	{
	    return await removeSession(key, session);
	}

	/**
	 * Change a Session/Report File name
	 * @param {string} key: userKey
	 * @param {string} sid: current SessionName
	 * @param {string} sid: new SessionName
	 * @returns true/false session was able to be renamed. If old session dne, returns false
	**/
	@Path("/changeSessionName")
	@GET
	public async changeSessionName(@QueryParam("key") key:string, @QueryParam("sid") sid:string, @QueryParam("newSid") newSid:string): Promise<boolean>
	{
	    let res = false;
	    try
	    {
	        await this.modifySessionName.acquire();
	        res = await changeTheSessionName(key, sid, newSid);
	        return res;
	    }
	    catch (err)
	    {
	        return Promise.reject(err);
	    }
	    finally
	    {
	        if (this.modifySessionName.isLocked)
	        {
	            await this.modifySessionName.release();
	        }
	    }
	}

    /**
		DEV METHOD (TO BE REMOVED)
		
		IF YOUR PASSWORD IN USERTABLE COLLECTION IS PLAINTEXT, DO THE FOLLOWING:
			PASS CLEARTEXT PSSD INTO THIS Method
			WHATEVER IS RETURNED SHOULD BE INSERTED WHERE YOUR CLEARTEXT PASSWORD IS
			IN THE USER TABLE
	**/
/***
	@Path("/tempGetHashPassword")
	@GET
	public async tempGetHashPassword(@QueryParam("pssd") pssd:string):Promise<string>
	{
	    let res = "";
	    try
	    {
	        res = MyCrypto.getInstance().getSHA3(pssd);
	    }
	    catch (err)
	    {
	        return Promise.reject(err);
	    }
	    return res;
	}
	@Path("/testencryptKEY")
	@GET
	public async testencryptKEY(@QueryParam("FE_KEY")FE_KEY:string, @QueryParam("mssg")mssg:string):Promise<string>
	{
	    return MyCrypto.getInstance().encryptMultKeys(mssg, [FE_KEY, BE_KEY]);
	}
	@Path("/testdecryptKEY")
	@GET
	public async testdecryptKEY(@QueryParam("FE_KEY")FE_KEY:string, @QueryParam("mssg")mssg:string):Promise<string>
	{
	    return MyCrypto.getInstance().decryptMultKeys(mssg, [FE_KEY, BE_KEY]);
	}
**/
}










