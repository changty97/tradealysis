var CryptoJS = require("crypto-js");

function getSHA3(text)
{
	if(text) {
		return CryptoJS.SHA3(text, {
			outputLength: 256
		 }).toString();
	}
	return "";
}
let myNewPassword = "newPassword"; /** Whatever your password you want to change to **/
console.log("We are hashing password '" + myNewPassword + "'");
console.log(getSHA3(myNewPassword)); /** What should be stored in user_db.userTable collection (column pssd) **/