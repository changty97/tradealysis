import { IMongoOptions } from "../models/IMongoOptions";
const PATH_TO_CONTROLLERS = "./dist/controllers/*.js";
const PORT = process.env.PORT;

const mongoOptions: IMongoOptions = {
    uri: process.env.DB_URI,
    db: process.env.DB_DB,
    collection: process.env.DB_COLLECTION
};

/** Used for Login Authentication **/
const mongoOptionsLogin: IMongoOptions = {
    uri: process.env.DB_URI2,
    db: process.env.DB_DB2,
    collection: process.env.DB_COLLECTION2
};
export { PATH_TO_CONTROLLERS, PORT, mongoOptions, mongoOptionsLogin };


/** .env file: **/
/** (NOTE: I DONT USE DB_URI, DB_DB, DB_COLLECTION)
PORT = "3001"
DB_URI = "mongodb://mongoAdmin:916..S%40cTowN%21@52.37.185.66:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false"
DB_DB = "Test"
DB_COLLECTION = "Stuff"
DB_URI2 = "mongodb://mongoAdmin:916..S%40cTowN%21@52.37.185.66:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false"
DB_DB2 = "db_kevin"
DB_COLLECTION2 = "userTable"
**/

/** 
	Data you can import into collection userTable 
	(As a json file in Mongo Compass for local db)
**/
/*****************************************************
[{
  "_id": {
    "$oid": "615d3e5750f3d196b7ecf097"
  },
  "uname": "admin",
  "pssd": "password"
},{
  "_id": {
    "$oid": "615d4f6b4954a5f2b537c9a0"
  },
  "uname": "admin2",
  "pssd": "password2"
}]

*****************************************************/
