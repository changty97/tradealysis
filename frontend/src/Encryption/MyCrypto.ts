import * as crypto from "crypto-js";

class MyCrypto
{
	private static inst:MyCrypto;
	
	private constructor()
	{
	    // empty 
	}
	
	/** Call to get Singleton Inst **/
	public static getInstance():MyCrypto
	{
	    if (!(MyCrypto.inst))
	    {
	        MyCrypto.inst = new MyCrypto();
	    }
	    return MyCrypto.inst;
	}

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
