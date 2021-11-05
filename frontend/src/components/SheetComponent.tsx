import "ka-table/style.css";
import { Component, Fragment } from "react";
import axios from "axios";
import { kaReducer, Table } from 'ka-table';
import { CSVLink } from 'react-csv';
import { kaPropsUtils } from 'ka-table/utils';
import { InsertRowPosition } from 'ka-table/enums';  /** new **/
import { ISheetComponentState } from "../models/ISheetComponentState";
import { tableProps, initialReportItems } from "../constants/tableProps";
import { ChildComponents } from "ka-table/models";
import { clearFocused, moveFocusedDown, moveFocusedLeft,
    moveFocusedRight, moveFocusedUp, openEditor,
    setFocused, updatePageIndex, updateSortDirection,
		 insertRow, hideLoading, showLoading,
		 search, deleteRow } from 'ka-table/actionCreators';
import DeleteIcon from "../images/deleteImg.svg";

class SheetComponent extends Component<any, ISheetComponentState>
{
    constructor(props: any)
    {
        super(props);
        this.state = {
            tableProps,
            lastRowId: initialReportItems
        };
        this.dispatch = this.dispatch.bind(this);
        this.generateNewId = this.generateNewId.bind(this);
        this.saveTable = this.saveTable.bind(this);
        //this.deleteItemFromDB = this.deleteItemFromDB.bind(this);
    }
	
    componentDidMount():void
    {
        this.loadSheet();
    }

    /** Loads items onto reports page **/
    private loadSheet(): void
    {
        this.dispatch(showLoading());
        const delay = ((ms:number) => new Promise( resolve => setTimeout(resolve, ms) ));
        delay(300).then(() =>
        {
            axios.get('http://localhost:3001/stockdataGet')
                .then((response) =>
                {
                    const theArr = response.data as Array<any>;
                    for (let i = 0; i < theArr.length; i++)
                    {
                        const valsToInsert = {
                        };
                        for (const [key, value] of Object.entries(theArr[i]))
                        {
                            const theKey = key; const theValue = value;
                            if (theKey === '_id')
                            {
                                continue;
                            }
                            Object.defineProperty(valsToInsert, theKey, {
							   value: theValue,
							   writable: true,
							   enumerable: true
                            });
                        }
                        const theidDesc = Object.getOwnPropertyDescriptor(valsToInsert, 'id');
                        if (this.state.lastRowId < theidDesc!.value)
                        {
                            this.setState({
                                lastRowId: theidDesc!.value
                            });
                        }
                        this.dispatch(insertRow(valsToInsert, {
                            rowKeyValue: this.props.rowKeyValue,
                            insertRowPosition: InsertRowPosition.after
                        }));
                    }
                    this.dispatch(hideLoading());
                })
                .catch(function(error)
                {
                    console.log('Error', error);
                });
        });
    }

    private generateNewId(): number
    {
        const newRowId: number = this.state.lastRowId + 1;
        this.setState({
            lastRowId: newRowId
        });
        return newRowId;
    }
   
    private saveTable(): void
    {
        const tableData = this.state.tableProps.data;
        console.log(tableData);
        console.log(tableData!.length);
        axios.post(`http://localhost:3001/postTableDB`, {
            data: tableData
        }).then(function(response)
        {
            return;
        }).catch(function(error)
        {
            console.log('Error', error);
        });
    }

    childComponents: ChildComponents = {
        // Delete column icon (on far right)
        cellText: {
            content: props =>
            {
                if (props.column.key === ':delete')
                {
                    return ( <img src={DeleteIcon} onClick={() => this.deleteItemFromDB(props.rowKeyValue)} alt="Del" /> );
                }
                return;
            }
        },
        // Allows keyboard tab navigation
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
                        switch (e.key)
                        {
                        case "ArrowRight": this.dispatch(moveFocusedRight({
                            end: e.ctrlKey
                        })); break;
                        case "ArrowLeft": this.dispatch(moveFocusedLeft({
                            end: e.ctrlKey
                        })); break;
                        case "ArrowUp": this.dispatch(moveFocusedUp({
                            end: e.ctrlKey
                        })); break;
                        case "ArrowDown": this.dispatch(moveFocusedDown({
                            end: e.ctrlKey
                        })); break;
                            // opens the editor for the selected cell
                        case "Enter":
                            this.dispatch(openEditor(cell.rowKeyValue, cell.columnKey));
                            this.dispatch(setFocused({
                                cellEditorInput: cell
                            }));
                            break;
                        }
                    },
                    onFocus: () => !isFocused &&  this.dispatch(setFocused({
                        cell: {
                            columnKey: column.key,
                            rowKeyValue
                        }
                    })),
                    onKeyDown: (e) => e.key !== "Tab" && e.preventDefault(),
                    onBlur: () => isFocused && this.dispatch(clearFocused())
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
                    onKeyUp: (e) => e.key === "Enter" && this.dispatch(setFocused({
                        cell
                    })),
                    onBlur: (e, {
                        baseFunc
                    }) =>
                    {
                        baseFunc();
                        this.dispatch(clearFocused());
                    },
                    onFocus: () => !isFocused && this.dispatch(setFocused({
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
                onKeyUp: (e) => e.key === "Enter" && this.dispatch(updatePageIndex(props.pageIndex))
            }),
        },
        headCell: {
            elementAttributes: (props) => ({
                tabIndex: 0,
                onKeyUp: (e) => e.key === "Enter" && this.dispatch(updateSortDirection(props.column.key))
            }),
        },
    };

    private deleteItemFromDB(val:number): void
    {
        this.dispatch(deleteRow(val));
        axios.post('http://localhost:3001/removeTheItemGet',
            {
                data: {
                    item: val,
                }
	    })
            .catch((err: Error) =>
            {
                return Promise.reject(err);
            });
			
        /**
		axios.get('http://localhost:3001/removeTheItemGet', {
            params: {
                item: `${val}`
            }
	    })
            .catch((err: Error) =>
            {
                return Promise.reject(err);
            });
**/
    }
	
    public render() : JSX.Element
    {
        return (
            <Fragment>
                {/* Allows export to .csv file*/}
                <CSVLink
                    data={kaPropsUtils.getData(this.state.tableProps)}
                    headers={this.state.tableProps.columns.map(c => ({
                        label: c.title!,
                        key: c.key!
                    }))}
                    filename='ka-table.data.csv'
                    enclosingCharacter={''}
                    separator={','}>
                    {/* Move style to .css later*/}
                    <button style={ {
                        float: 'right'
                    }}>Download .csv</button>
                </CSVLink>
                {/* Add Row Button*/}
                <button
                    onClick={() =>
                    {
                        const id = this.generateNewId();
                        const newRow = {
                            id
                        };
                        this.dispatch(insertRow(newRow, {
                            rowKeyValue: this.props.rowKeyValue,
                            insertRowPosition: InsertRowPosition.after
                        }));
                    }} >
                    New Row
                </button>
                <button
                    onClick= {this.saveTable}>Save Table
                </button>
                {/* Search Sheet*/}
                <input type='search' defaultValue={tableProps.searchText} onChange={(event) =>
                {
                    this.dispatch(search(event.currentTarget.value));
                }} className='top-element' placeholder="Find a Trade" style={ {
                    float: 'right'
                }}/>
                {/* Configurable Spreadsheet */}
                <Table
                    {...this.state.tableProps}
                    childComponents = {this.childComponents}
                    dispatch={this.dispatch}
                />
            </Fragment>
        );
    }

    private dispatch(action: any)
    {
        this.setState((prevState) => ({
            ...prevState,
            ...{
                tableProps: kaReducer(prevState.tableProps, action)
            }
        }));
    }
}
export { SheetComponent };
