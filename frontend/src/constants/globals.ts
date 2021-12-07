import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVICE_URL
});

const sources: string[] = ["TDAmeritrade", "Tradealysis"];

const FE_KEY:string = ((process.env.REACT_APP_FE_KEY) ? process.env.REACT_APP_FE_KEY:"") as string;

export { api, sources, FE_KEY };