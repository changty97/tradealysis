import * as crypto from "crypto-js";

class AES256 {
	private static inst:AES256;
	private static theKeySize:number;
	private static theIttr:number;
	
	private constructor() {	}
	
	/** Call to get Singleton Inst **/
	public static getInstance():AES256 {
		if(!(AES256.inst)) {
			AES256.inst = new AES256();
			AES256.theKeySize = 256;
			AES256.theIttr = 1024;
		}
		return AES256.inst;
	}
	
	/** Returns Crypto Word Array  USE WHEN FIRST CREATING SKEY  **/
	public generateSalt() 
	{
		return crypto.lib.WordArray.random(128/8);
	}
	
	/** Returns Crypto Word Array USE WHEN FIRST CREATING SKEY **/
	public generateKey(password:string, 
	                   salt:crypto.lib.WordArray ) 
	{
		return crypto.PBKDF2(password, salt, { keySize: AES256.theKeySize/32, iterations: AES256.theIttr });
	}
	
	/** Takes String version of salt, key and returns cyphertext **/

	public encryption(message:string, password:string, sKey:string) 
	{
		return this.encryptionSK(message, password, sKey.substring(0,32), sKey.substring(32));
	}
	
	public encryptionSK(message:string, password:string, theSalt:string, theKey:string) 
	{
		return this.encryptionWordArray(message, password, 
								crypto.enc.Hex.parse(theSalt) as crypto.lib.WordArray, 
								crypto.enc.Hex.parse(theKey) as crypto.lib.WordArray);
	}
	
	public encryptionWordArray(message:string, password:string, 
	                  theSalt:crypto.lib.WordArray, 
					  theKey:crypto.lib.WordArray) 
	{
		console.log(crypto.lib.WordArray.random(128/8));
		var theIV = crypto.lib.WordArray.random(128/8);
		var encryptedM = crypto.AES.encrypt( message, theKey, { iv: theIV, padding: crypto.pad.Pkcs7, mode: crypto.mode.CBC } );
		return theSalt.toString()+ theIV.toString() + encryptedM.toString();
	}
	
	/** Use to Decrypt **/
	public decryption(cypherText:string, password:string) {
		var theSalt = crypto.enc.Hex.parse(cypherText.substr(0, 32));
		var theIV = crypto.enc.Hex.parse(cypherText.substr(32, 32))
		var encrypted = cypherText.substring(64);
		var theKey = crypto.PBKDF2(password, theSalt, 
		{
			keySize: AES256.theKeySize/32,
			iterations: AES256.theIttr
		});
		return crypto.AES.decrypt(encrypted, theKey,{ 
			iv: theIV, 
			padding: crypto.pad.Pkcs7,
			mode: crypto.mode.CBC
		}).toString(crypto.enc.Utf8);
	}
}
export { AES256 }