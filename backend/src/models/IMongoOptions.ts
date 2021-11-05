/** Kept this here incase being used by someone else **/
export interface IMongoOptions {
    uri: string;
    db: string;
    collection: string;
}
/** This is the one being used by MongoLogin, MongoCreateAccount **/
export interface IMongoOptionsMult {
    uri: string;
    db: string;
    collections: {
        [name: string]: string;
    };
}
