import { ITableProps } from 'ka-table';

export interface ISheetComponentState {
    tableProps: ITableProps,
    lastRowId: number,
	reportsId: string | null  
}