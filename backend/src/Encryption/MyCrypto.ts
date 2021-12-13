import * as crypto from "crypto-js";

/**
    private encryptTest(): void
    {
	    const mssg = `Hello How are you doing today?`;
        const pssd = "pass1";
        const hashPssd = crypto.SHA3(pssd, {outputLength: 128}).toString();
		
		const aes:MyCrypto = MyCrypto.getInstance();
        const sKey = aes.generateKey(hashPssd);  // we will store this in our db. First 32 chars is salt val, followed by 64 key vals
        
		//Ecrypted version of sKey which is the value stored in our database
		const hashKeyForKey = crypto.SHA3("QqgVW)3gkrigkri482gdkj@ldsgkjldslkutkdsj)!JF2@vn.tBA/_rd", {outputLength: 128}).toString() // a constant/key for the key. This will be sored in a .env fule or in a method aytomatically
		console.log("Key For Key Begin");
		console.log(hashKeyForKey);
		console.log("End Key For Key");
		
		const ecKey = aes.encryption(sKey, hashKeyForKey);
		console.log("Stored in Database\n\t" + ecKey.toString());
		
		// this is how we decrypt it. The decrypted value will be used for encrypting anu user data
		const dcKey = aes.decryption(ecKey, hashKeyForKey);
		console.log("Decrypted key is " + dcKey.toString());
	
		console.log("sKey:" + sKey.toString());                      // key to encrypt
		const ec = aes.encryption(mssg, dcKey);                       // cyphertext
		console.log("This is ec: " + ec.toString());
		const dcb = aes.decryption(ec, dcKey);                        //plaintext
        console.log(`CypherText: ${  ec}\nDecrypt: ${  dcb}`);

	}
**/

/**
 const myCrypt:MyCrypto = MyCrypto.getInstance();
				
                const theNewPssdStored:string = myCrypt.getSHA3(password, 128);  // shaw password stored
                console.log(`SHA PSSD ${  theNewPssdStored}`);
				
                const newKey = myCrypt.generateKey(theNewPssdStored);            // decrypted key for each user
                console.log(`New unencrypted Key ${   newKey}`);
				
				
                const frontEndPssdKey = "c39c07f7ee1a763a9ef57c81ef721f0b1ee3e7b1de26830e1c560e2481e2dac4869a699a8bc7f98e62f223252ba04f2c";
                console.log(`Front End Shaw Key: ${   frontEndPssdKey}`);
				
                const encryptedKey = myCrypt.encryption(newKey, frontEndPssdKey);
                console.log(`2.0. The Encrypted Key is =>${  encryptedKey}`);
				
				
			    const decryptedKey = myCrypt.decryption(encryptedKey, frontEndPssdKey);
                console.log(`2.1. The Decryption Key is =>${  encryptedKey}`);


				
                const encryptedUsername = myCrypt.encryption(username, decryptedKey);
				
                const theUserNameIs = myCrypt.decryption(encryptedUsername,  myCrypt.decryption(encryptedKey, frontEndPssdKey));
				
                console.log(`@@@@@@@@@@@@ => ${  theUserNameIs}`);
                console.log(`Wrong${  myCrypt.decryption(encryptedUsername,  myCrypt.decryption(encryptedKey, newKey))}`);


**/

/** Uses CryptJS JS Library **/
class MyCrypto
{
	private static inst:MyCrypto;
	private static theKeySize:number;
	private static theIttr:number;
	
	/**
		@constructor:
		Instantiates keySice, theIttr, 
		(Singleton Instance)
	**/
	private constructor()
	{
	    MyCrypto.theKeySize = 256;
	    MyCrypto.theIttr = 1024;
	}
	
	/** 
		Call to get Singleton Inst 
		@return {MyCrypto} MyCrypto.inst;
	**/
	public static getInstance():MyCrypto
	{
	    if (!(MyCrypto.inst))
	    {
	        MyCrypto.inst = new MyCrypto();
	    }
	    return MyCrypto.inst;
	}
	
	/**
	 * Get SHA3 256Bit Hash of @param text
	 * @param {string} text: text to hashKeyForKey
	 * return {string} hash of @param text 
	 */
	public getSHA3(text:string):string
	{
	    return crypto.SHA3(text, {
	        outputLength: 256
	    }).toString();
	}
	
	/**
	 * @param {string} message: plaintext 
	 * @param {string} sKey: key to encrypt plaintext with 
	 * @return {string} cypherText 
	**/
	public encryption(message:string, sKey:string):string
	{
	   let retVal = "";
	   try
	    {
		   if (!message || !sKey || message.length === 0 || sKey.length === 0)
	        {
			   return retVal;
		   }
		   retVal = this.encryptionUTF(message, sKey);
	   }
	   catch (err)
	    {
		   retVal =  "";
	   }
	   return retVal;
	}
	
	/**
	 * @param {string} cypherText: cypherText to decrypt 
	 * @param {string} sKey: key to decrypt plaintext with 
	 * @return {string} plainText if Key is correct. Else, either random data or empty str  
	**/
	public decryption(cypherText:string, sKey:string):string
	{
	   let retVal = "";
	   try
	    {
		   if (!cypherText || !sKey || cypherText.length === 0 || sKey.length === 0)
	        {
	            return retVal;
		   }
		   retVal = this.decryptionUTF(cypherText, sKey);
	   }
	   catch (err)
	    {
		   retVal =  "";
	   }
	   return retVal;
	}
	
	/**
	 * Encrypt with 2 keys 
	 * @param {string} plainText: cypherText to encrypt 
	 * @param {string[]} sKey: cypherText to encrypt 
	 * @returns {string} cypherText 
	**/
	public encryptMultKeys(plainText:string, sKey:string[]):string
	{
	    let txt:string = plainText;
	    for (let i = 0; i < sKey.length; i++)
	    {
	        txt = this.encryption(txt, sKey[i]);
	    }
	    return txt;
	}
	
	/**
	 * Decrypt with 2 keys 
	 * @param {string} cypherText: cypherText 
	 * @param {string[]} sKey: cypherText to decrypt 
	 * @returns {string} plaintext  
	**/
	public decryptMultKeys(cypherText:string, sKey:string[]):string
	{
	    let txt:string = cypherText;
	    for (let i = sKey.length - 1; i >= 0; i--)
	    {
	        txt = this.decryption(txt, sKey[i]);
	    }
	    return txt;
	}
	
	/** 
     * Generate Key based on plaintext
	 * @param {string} password: plainText used to generate Key with salt 
	**/
	public generateKey(password:string)
	{
	    return this.generateKeyWithSalt(password, this.generateSalt());
	}

	/** DONT USE METHOD BELOW THIS LINE UNLESS YOU UNDERSTAND CRYPTJS LIB, SHA3 AES 256 INTERNALS **/

	/** Returns Crypto Word Array  USE WHEN FIRST CREATING SKEY  **/
	private generateSalt()
	{
	    return crypto.lib.WordArray.random(128 / 8);
	}
	
	/** Returns Crypto Word Array USE WHEN FIRST CREATING SKEY **/
	private generateKeyWithSalt(password:string, salt:crypto.lib.WordArray )
	{
	    return salt.toString() + crypto.PBKDF2(password, salt, {
	        keySize: MyCrypto.theKeySize / 32,
	        iterations: MyCrypto.theIttr
	    }).toString();
	}

	/** Encrypt with message, salt, and key **/
	private encryptionSK(message:string, theSalt:string, theKey:string)
	{
	    return this.encryptionWordArray(message, crypto.enc.Hex.parse(theSalt) as crypto.lib.WordArray, crypto.enc.Hex.parse(theKey) as crypto.lib.WordArray);
	}
	
	/** Encrypt Word Array Used in CryptJS **/
	private encryptionWordArray(message:string, theSalt:crypto.lib.WordArray, theKey:crypto.lib.WordArray)
	{
	    const theIV = crypto.lib.WordArray.random(128 / 8);
	    const encryptedM = crypto.AES.encrypt( message, theKey, {
	        iv: theIV,
	        padding: crypto.pad.Pkcs7,
	        mode: crypto.mode.CBC
	    } );
	    return theSalt.toString() + theIV.toString() + encryptedM.toString();
	}
	
	/** Encrypt UTF8 Standard **/
	private encryptionUTF(message:string, sKey:string):string
	{
	    return this.encryptionSK(message, sKey.substring(0, 32), sKey.substring(32)).toString();
	}
	
	/** Decrypt UTF8 Standard **/
	private decryptionUTF(cypherText:string, sKey:string):string
	{
	    const theIV = crypto.enc.Hex.parse(cypherText.substr(32, 32));
	    const encrypted = cypherText.substring(64);
	    const theKey = crypto.enc.Hex.parse(sKey.substring(32)) as crypto.lib.WordArray;
	    return crypto.AES.decrypt(encrypted, theKey, {
	        iv: theIV,
	        padding: crypto.pad.Pkcs7,
	        mode: crypto.mode.CBC
	    }).toString(crypto.enc.Utf8).toString();
	}
}
export { MyCrypto };
