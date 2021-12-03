import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVICE_URL
});

const sources: string[] = ["TDAmeritrade", "Tradealysis"];

export { api, sources };