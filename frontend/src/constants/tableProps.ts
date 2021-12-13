import { ITableProps } from 'ka-table';
import { DataType, EditingMode, SortingMode } from 'ka-table/enums';
import { Column } from 'ka-table/models';
import {openAllEditors}  from 'ka-table/actionCreators';

const initialReportItems: number = 0;

/** Column Titles **/
const columnTitles = ['DOI', 'P/L', 'P/L %', 'Broker', 'Position', 
                      'Pattern', 'Name', 'Ticker', 'Price',
                      '52-WH', '52-WL', 'VolAvg', 'Outstanding', 
                      'Float', 'FloatR', 'FloatC', 'MC-Cat', 
                      'MC-Current', 'Vol-DOI', 'Vol-PreM', 'PC', 
                      'PreM High', 'Open', 'HOD', 'LOD', '# Shares', 'Avg Entry', 'Avg Exit', 'Comments', ':delete'];
/** Columns **/
const columns: Column[] = Array(columnTitles.length).fill(undefined).map(
  (_, index) => ({
    key: columnTitles[index],
    width: ((columnTitles[index] === ':delete')? 60 : 120),
    title: ((columnTitles[index] === ':delete')? "":columnTitles[index]),
    type: ((columnTitles[index] === ':delete')? null: DataType.String),
  }),
);

/** KA-TABLE data array **/
const dataArray = Array(initialReportItems).fill(undefined).map(
    (_, index) => columns.reduce((previousValue: any, currentValue) => {
      previousValue[currentValue.key] = ``;
      return previousValue;
    }, { id: index }),
  );

/** KA-TABLE tableProps **/
const tableProps: ITableProps = {
    columns,
    columnResizing: true,
    data: dataArray,
    editingMode: EditingMode.Cell,
    rowKeyField: 'id',
    sortingMode: SortingMode.Single,
	singleAction: openAllEditors(),
	virtualScrolling: {
		enabled: true
	},
};

export { tableProps, initialReportItems, dataArray };