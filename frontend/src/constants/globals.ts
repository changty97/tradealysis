import axios, { AxiosInstance } from "axios";
import {MyCrypto} from "../Encryption/MyCrypto"
const api: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVICE_URL
});

const sources: string[] = ["TDAmeritrade", "Tradealysis"];

let FE_KEY:string = ((process.env.REACT_APP_FE_KEY) ? process.env.REACT_APP_FE_KEY:"") as string;

if(FE_KEY && FE_KEY !== "") {
	FE_KEY = MyCrypto.getInstance().decryption(FE_KEY,'873d989c3779f7497c683621a33d5a39897f0360f1e70d116f68d43267c6d00b6ec25434587d2cdab2489db0c58a3507');
}

console.log("New FE KEY:" + FE_KEY);

//console.log(mc.generateKey("68jJkhshFKf@j!G") + "\n");
//const kk = '873d989c3779f7497c683621a33d5a39897f0360f1e70d116f68d43267c6d00b6ec25434587d2cdab2489db0c58a3507';
//console.log(mc.encryption(FE_KEY,kk));
//const cText = '873d989c3779f7497c683621a33d5a396ea8e7feebdf59509dc4f57bac7ef615RKKHt/qvMJ47cSaiJXfnvxvJYSXsV2QkUDWkCAZ21XUCnhoNyGAAdHVYnKGLmXOJxY3/UB+3n9STMmNfauWEFzP2Nxgf3T4YVg/OhC0xSk/AaxuILD2v1JkYRkMpkEOmcsMjW3+XHD+upnmYZgsoRQ=='
//console.log(mc.decryption(cText,'873d989c3779f7497c683621a33d5a39897f0360f1e70d116f68d43267c6d00b6ec25434587d2cdab2489db0c58a3507'));



export { api, sources, FE_KEY };