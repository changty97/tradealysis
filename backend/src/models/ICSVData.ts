import { ITableData } from "./ITableData";

export interface ICSVData {
    [section: string]: ITableData[];
}
