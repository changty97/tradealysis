
import { DataType, EditingMode, SortingMode } from 'ka-table/enums';
import { Column } from 'ka-table/models';
//import React, { useState } from 'react';

import { ITableProps } from 'ka-table';
//import { clearFocused, moveFocusedDown, moveFocusedLeft, moveFocusedRight, moveFocusedUp, openEditor, setFocused, updatePageIndex, updateSortDirection } from 'ka-table/actionCreators';
//import { DispatchFunc } from 'ka-table/types';
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

/*const KeyboardNav: React.FC = () =>
{
    const [tablePropsInit, changeTableProps] = useState(tableProps);
    const dispatch: DispatchFunc = (action) =>
    {
        changeTableProps((prevState: ITableProps) => kaReducer(prevState, action));
    };
    return (
        <div className='keyboard-navigation-demo'>
            <Table
                {...tablePropsInit}
                childComponents={{
                    cell: {
                        elementAttributes: ({
                            column, rowKeyValue, isEditableCell
                        }) =>
                        {
                            if (isEditableCell)
                            {
                                return undefined;
                            }
  
                            const cell = {
                                columnKey: column.key,
                                rowKeyValue
                            };
                            const isFocused = cell.columnKey === tableProps.focused?.cell?.columnKey &&
                  cell.rowKeyValue === tableProps.focused?.cell?.rowKeyValue;
                            return {
                                tabIndex: 0,
                                ref: (ref: any) => isFocused && ref?.focus(),
                                onKeyUp: (e) =>
                                {
                                    switch (e.keyCode)
                                    {
                                    case 39: dispatch(moveFocusedRight({
                                        end: e.ctrlKey
                                    })); break;
                                    case 37: dispatch(moveFocusedLeft({
                                        end: e.ctrlKey
                                    })); break;
                                    case 38: dispatch(moveFocusedUp({
                                        end: e.ctrlKey
                                    })); break;
                                    case 40: dispatch(moveFocusedDown({
                                        end: e.ctrlKey
                                    })); break;
                                    case 13:
                                        dispatch(openEditor(cell.rowKeyValue, cell.columnKey));
                                        dispatch(setFocused({
                                            cellEditorInput: cell
                                        }));
                                        break;
                                    }
                                },
                                onFocus: () => !isFocused &&  dispatch(setFocused({
                                    cell: {
                                        columnKey: column.key,
                                        rowKeyValue
                                    }
                                })),
                                onKeyDown: (e) => e.keyCode !== 9 && e.preventDefault(),
                                onBlur: () => isFocused && dispatch(clearFocused())
                            };
                        },
                    },
                    cellEditorInput: {
                        elementAttributes: ({
                            column, rowKeyValue
                        }) =>
                        {
                            const isFocused = column.key === tableProps.focused?.cellEditorInput?.columnKey &&
                  rowKeyValue === tableProps.focused?.cellEditorInput?.rowKeyValue;
                            const cell = {
                                columnKey: column.key,
                                rowKeyValue
                            };
                            return {
                                ref: (ref: any) => isFocused && ref?.focus(),
                                onKeyUp: (e) => e.keyCode === 13 && dispatch(setFocused({
                                    cell
                                })),
                                onBlur: (e, {
                                    baseFunc
                                }) =>
                                {
                                    baseFunc();
                                    dispatch(clearFocused());
                                },
                                onFocus: () => !isFocused && dispatch(setFocused({
                                    cell: {
                                        columnKey: column.key,
                                        rowKeyValue
                                    }
                                })),
                            };
                        },
                    },
                    pagingIndex: {
                        elementAttributes: (props) => ({
                            tabIndex: 0,
                            onKeyUp: (e) => e.keyCode === 13 && dispatch(updatePageIndex(props.pageIndex))
                        }),
                    },
                    headCell: {
                        elementAttributes: (props) => ({
                            tabIndex: 0,
                            onKeyUp: (e) => e.keyCode === 13 && dispatch(updateSortDirection(props.column.key))
                        }),
                    },
                }}
                dispatch={dispatch}
            />
        </div>
    );
};*/

export { tableProps };
