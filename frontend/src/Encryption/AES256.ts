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
	private generateSalt() 
	{
		return crypto.lib.WordArray.random(128/8);
	}
	
	public generateKey(password:string) {
		return this.generateKeyWithSalt(password, this.generateSalt());
	}
	
	/** Returns Crypto Word Array USE WHEN FIRST CREATING SKEY **/
	public generateKeyWithSalt(password:string, 
	                   salt:crypto.lib.WordArray ) 
	{
		let val = salt.toString();
		val += crypto.PBKDF2(password, salt, {keySize: AES256.theKeySize/32,iterations: AES256.theIttr}).toString();
		return val;
	}
	
	/** Takes String version of salt, key and returns cyphertext **/

	public encryption(message:string, sKey:string) 
	{
		return this.encryptionSK(message, sKey.substring(0,32), sKey.substring(32));
	}
	
	private encryptionSK(message:string, theSalt:string, theKey:string) 
	{
		return this.encryptionWordArray(message, 
								crypto.enc.Hex.parse(theSalt) as crypto.lib.WordArray, 
								crypto.enc.Hex.parse(theKey) as crypto.lib.WordArray);
	}
	
	private encryptionWordArray(message:string, 
	                  theSalt:crypto.lib.WordArray, 
					  theKey:crypto.lib.WordArray) 
	{
		var theIV = crypto.lib.WordArray.random(128/8);
		var encryptedM = crypto.AES.encrypt( message, theKey, { iv: theIV, padding: crypto.pad.Pkcs7, mode: crypto.mode.CBC } );
		return theSalt.toString()+ theIV.toString() + encryptedM.toString();
	}
	
	/** Use to Decrypt **/
	public decryption(cypherText:string, password:string) {
		var theSalt = crypto.enc.Hex.parse(cypherText.substr(0, 32));
		var theIV = crypto.enc.Hex.parse(cypherText.substr(32, 32))
		console.log(theIV);
		
		var encrypted = cypherText.substring(64);
		
		var theKey = crypto.PBKDF2(password, theSalt, {keySize: AES256.theKeySize/32,iterations: AES256.theIttr});
		
		return crypto.AES.decrypt(encrypted, theKey,{iv: theIV, padding: crypto.pad.Pkcs7, mode: crypto.mode.CBC }).toString(crypto.enc.Utf8);
	}
}
export { AES256 }