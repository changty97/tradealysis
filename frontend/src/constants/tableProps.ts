
import { DataType, EditingMode, SortingMode } from 'ka-table/enums';
import { Column } from 'ka-table/models';
//import React, { useState } from 'react';

import { ITableProps/*, kaReducer, Table*/ } from 'ka-table';
//import { clearFocused, moveFocusedDown, moveFocusedLeft, moveFocusedRight, moveFocusedUp, openEditor, setFocused, updatePageIndex, updateSortDirection } from 'ka-table/actionCreators';
////import { DispatchFunc } from 'ka-table/types';
//import React from 'react';

const defaultRowCount = 5;
const columnTitles = ['DOI', 'P/L', 'Broker', 'Position',
    'Pattern', 'Name', 'Ticker', 'Price',
    '52-WH', '52-WL', 'VolAvg', 'Outstanding',
    'Float', 'FloatR', 'FloatC', 'MC-Cat',
    'MC-Current', 'Vol-DOI', 'Vol-PreM', 'PC',
    'PreM High', 'Open', 'HOD', 'HOD-Time', 'LOD', 'LOD-Time', 'Close', 'AH'];

const columns: Column[] = Array(28).fill(undefined).map(
    (_, index) => ({
        key: columnTitles[index],
        width: 120,
        title: columnTitles[index],
        type: DataType.String,
    }),
);

const dataArray = Array(defaultRowCount).fill(undefined).map(
    (_, index) => columns.reduce((previousValue: any, currentValue) =>
    {
        previousValue[currentValue.key] = ``;
        return previousValue;
    }, {
        id: index
    }),
);
  
const tableProps: ITableProps = {
    columns,
    columnResizing: true,
    data: dataArray,
    editingMode: EditingMode.Cell,
    rowKeyField: 'id',
    sortingMode: SortingMode.Single,
    paging: {
        enabled: true,
        pageIndex: 0,
        pageSize: 10,
    },
    focused: {
        cell: {
            columnKey: columnTitles[0],
            rowKeyValue: 1
        }
    }
};



export { tableProps };
