import "ka-table/style.css";
import { Component, Fragment } from "react";
import axios from "axios";
import { kaReducer, Table } from 'ka-table';
import { CSVLink } from 'react-csv';
import { kaPropsUtils } from 'ka-table/utils';
import { InsertRowPosition } from 'ka-table/enums';
import { ISheetComponentProps } from "../models/ISheetComponentProps";
import { ISheetComponentState } from "../models/ISheetComponentState";
import { tableProps, initialReportItems } from "../constants/tableProps";
import { ChildComponents } from "ka-table/models";
import { clearFocused, moveFocusedDown, moveFocusedLeft,
    moveFocusedRight, moveFocusedUp, openEditor,
    setFocused, updatePageIndex, updateSortDirection,
		 insertRow, hideLoading, showLoading,
		 search, deleteRow, updateData } from 'ka-table/actionCreators';
import DeleteIcon from "../images/deleteImg.svg";

class SheetComponent extends Component<ISheetComponentProps, ISheetComponentState>
{
    constructor(props: ISheetComponentProps)
    {
        super(props);
        this.state = {
            tableProps,
            lastRowId: initialReportItems,
            reportsId: localStorage.getItem('reportsId')
        };
        this.dispatch = this.dispatch.bind(this);
        this.generateNewId = this.generateNewId.bind(this);
        this.saveTable = this.saveTable.bind(this);
        this.deleteItemFromDB = this.deleteItemFromDB.bind(this);
    }
	
    componentDidMount():void
    {
        this.loadSheet();
    }

    /** Loads items onto reports page **/
    private loadSheet(): void
    {
        axios.get('http://localhost:3001/stockdataGet', {
            params: {
                coll: `${this.state.reportsId }_stock_data`,
            }
        })
            .then((response) =>
            {
                const allArrVals = [];
                const theArr = response.data as Array<any>;
                if (theArr && theArr.length > 0)
                {
                    this.dispatch(showLoading());
                    for (let i = 0; i < theArr.length; i++)
                    {
                        const valsToInsert = {
                        };
                        for (const [key, value] of Object.entries(theArr[i]))
                        {
                            const theKey = key;
                            if (theKey === '_id')
                            {
                                continue;
                            }
                            const theValue = value;
                            Object.defineProperty(valsToInsert, theKey, {
                                value: theValue,
                                writable: true,
                                enumerable: true
                            });
                        }
                        allArrVals.push(valsToInsert);
                    }
                    const theidDesc = Object.getOwnPropertyDescriptor(allArrVals[allArrVals.length - 1], 'id');
                    this.setState({
                        lastRowId: theidDesc!.value
                    });
                    this.dispatch(updateData(allArrVals));
                    this.dispatch(hideLoading());
                }
                else
                {
                    this.setState({
                        lastRowId: -1
                    });
                }
            })
            .catch(function(error)
            {
                console.log('Error', error);
				
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
        axios.post(`http://localhost:3001/postTableDB`, {
            data: {
                table: tableData,
                coll: `${this.state.reportsId  }_stock_data`,
            }
        }).then(function(response)
        {
            return;
        }).catch(function(error)
        {
            console.log('Error', error);
        });
    }

    getTicker(cell: any): void
    {
        if (this.state.tableProps.data)
        {
            // i is each table row
            const i = this.state.tableProps.data[cell.rowKeyValue];
            for (const [key, value] of Object.entries(i))
            {
                // return past data using Ticker and DOI value in current row
                if (`${key}` === 'Ticker' && `${value}` !== '' && this.isValidDate(i.DOI))
                {
                    console.log(`getting past data for ${i.Ticker} on ${i.DOI}`);
                    const pastData = this.getPastData(i.Ticker, i.DOI);
                    console.log(pastData);
                    this.setCells(pastData, cell);
                }
                // return today's data
                if (`${key}` === 'Ticker' && `${value}` !== '' && i.DOI === '')
                {
                    console.log("Getting today's data");
                    const todayData = this.getTodayData(i.Ticker);
                    console.log(todayData);
                    this.setCells(todayData, cell);
                }
            }
        }
        // save table each time new data is fetched
        this.saveTable();
    }

    getTodayData(ticker: string): any
    {
        return axios.get(`http://localhost:3001/stockapi/${ticker}`, {
            params: {
                ID: ticker
            }
        }).then((response) =>
        {
            console.log("getTodayData returned: ");
            console.log(response.data);
            return response.data;
        }).catch(function(error)
        {
            console.log('Error', error);
        });
    }
    
    getPastData(ticker: string, date: string): any
    {
        return axios.get(`http://localhost:3001/stockapi/${ticker}/${date}`, {
            params: {
                ID: ticker
            }
        }).then((response) =>
        {
            console.log("getPastData returned: ");
            console.log(response.data);
            return response.data;
        }).catch(function(error)
        {
            console.log('Error', error);
        });
    }

    // check YYYY-MM-DD format
    isValidDate(doi: any): boolean
    {
        const regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (!doi.match(regEx))
        {
            return false;
        }  // Invalid format
        const d = new Date(doi);
        const dNum = d.getTime();
        if (!dNum && dNum !== 0)
        {
            return false;
        } // NaN value, Invalid date
        return d.toISOString().slice(0, 10) === doi;
    }

    setCells(data: any, cell: any): void
    {
        Promise.resolve(data).then((value) =>
        {
            if (this.state.tableProps.data)
            {
                // check each row
                for (const [k, v] of Object.entries(this.state.tableProps.data[cell.rowKeyValue]))
                {
                    const i = this.state.tableProps.data[cell.rowKeyValue];
                    if (`${k}` === 'Ticker' && `${v}` !== '')
                    {
                        console.log(value);
                        // check each alpha vantage object property
                        for (const [key, val] of Object.entries(value))
                        {
                            switch (key)
                            {
                            case "Price": i["Price"] = val;
                                break;
                            case "W52H": i["52-WH"] = val;
                                break;
                            case "W52L": i["52-WL"] = val;
                                break;
                            case "VolAvg": i["VolAvg"] = val;
                                break;
                            case "Outstanding": i.Outstanding = val;
                                break;
                            case "Float": i.Float = val;
                                break;
                            case "Industry": i.Industry = val;
                                break;
                            case "PC": i.PC = val;
                                break;
                            case "PremHigh": i["PreM High"] = val;
                                break;
                            case "Open": i["Open"] = val;
                                break;
                            case "HOD": i["HOD"] = val;
                                break;
                            case "HODTime": i["HOD-Time"] = val;
                                break;
                            case "LOD": i["LOD"] = val;
                                break;
                            case "LODTime": i["LOD-Time"] = val;
                                break;
                            case "Close": i["Close"] = val;
                                break;
                            case "AH": i["AH"] = val;
                                break;
                            case "VolDOI": i["Vol-DOI"] = val;
                                break;
                            case "VolPreM": i["Vol-PreM"] = val;
                                break;
                            default:
                            }
                        }
                    }
                    // populate calculated data
                    // Float Rotation = Volume-DOI / Float
                    i["FloatR"] = parseFloat((i["Vol-DOI"] / i["Float"]).toFixed(4));
                    // Float Category is defined by size of float
                    console.log(i.Float);
                    if ( i.Float > 0 && i.Float <= 1000000)
                    {
                        i["FloatC"] = "NANO";
                    }
                    else if ( i.Float > 1000000 && i.Float <= 2000000)
                    {
                        i["FloatC"] = "MICRO";
                    }
                    else if ( i.Float > 2000000 && i.Float <= 10000000)
                    {
                        i["FloatC"] = "LOW";
                    }
                    else if ( i.Float > 10000000 && i.Float <= 20000000)
                    {
                        i["FloatC"] = "MEDIUM";
                    }
                    else if ( i.Float > 20000000)
                    {
                        i["FloatC"] = "HIGH";
                    }
                    // MarketCap = price * outstanding
                    i["MC-Current"] = i["Price"] * i["Outstanding"];
                    // MarketCap Category
                    if ( i["MC-Current"] <= 50000000)
                    {
                        i["MC-Cat"] = "NANO";
                    }
                    else if ( i["MC-Current"] > 50000000 && i["MC-Current"] <= 300000000)
                    {
                        i["MC-Cat"] = "MICRO";
                    }
                    else if ( i["MC-Current"] > 300000000 && i["MC-Current"] <= 20000000000)
                    {
                        i["MC-Cat"] = "SMALL";
                    }
                    else if ( i["MC-Current"] > 20000000000 && i["MC-Current"] <= 100000000000)
                    {
                        i["MC-Cat"] = "MID";
                    }
                    else if ( i["MC-Current"] > 100000000000)
                    {
                        i["MC-Cat"] = "LARGE";
                    }

                    this.setState((prevState) => ({
                        tableProps: {
                            ...prevState.tableProps,
                            data: this.state.tableProps.data
                        }
                    }));
                }
            }
        });
    }

    childComponents: ChildComponents = {
        // Delete column icon (on far right)
        cellText: {
            content: props =>
            {
                if (props.column.key === ':delete')
                {
                    return ( <img src={DeleteIcon} alt="Del" onClick={() => this.deleteItemFromDB(props.rowKeyValue)} /> );
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
                const isFocused = cell.columnKey === this.state.tableProps.focused?.cell?.columnKey &&
              cell.rowKeyValue === this.state.tableProps.focused?.cell?.rowKeyValue;
                return {
                    tabIndex: 0,
                    ref: (ref: any) => isFocused && ref?.focus(),
                    onKeyDown: (e) =>
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
                        case "ArrowDown":
                            console.log("arrow down");
                            this.dispatch(moveFocusedDown({
                                end: e.ctrlKey
                            })); break;
                            // opens the editor for the selected cell
                        case "Enter":
                            this.dispatch(openEditor(cell.rowKeyValue, cell.columnKey));
                            
                            this.dispatch(setFocused({
                                cellEditorInput: cell
                            }));
                            
                            console.log("enter key pressed");
                            break;
                        }
                        
                    },
                    onFocus: () => !isFocused &&  this.dispatch(setFocused({
                        cell: {
                            columnKey: column.key,
                            rowKeyValue
                        }
                    })),
                    //onKeyUp: (e) => e.key !== "Tab" && this.dispatch(closeEditor(cell.rowKeyValue, cell.columnKey)) && console.log("closed"),
                    onBlur: () => isFocused && this.dispatch(clearFocused())
                };
            },
        },
        cellEditorInput: {
            elementAttributes: ({
                column, rowKeyValue
            }) =>
            {
                const isFocused = column.key === this.state.tableProps.focused?.cellEditorInput?.columnKey &&
                rowKeyValue === this.state.tableProps.focused?.cellEditorInput?.rowKeyValue;
                const cell = {
                    columnKey: column.key,
                    rowKeyValue
                };
                return {
                    ref: (ref: any) => isFocused && ref?.focus(),
                    onKeyUp: (e) =>
                    {
                        if (e.key === "Enter")
                        {
                            this.dispatch(setFocused({
                                cell
                            }));
                            console.log("Enter key released");
                        }
                    },
                    onBlur: (e, {
                        baseFunc
                    }) =>
                    {
                        console.log("Blur");
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
        axios.post('http://localhost:3001/removeTheItemGet', {
            data: {
                item: val,
                coll: `${this.state.reportsId  }_stock_data`,
            }
	    })
            .catch((err: Error) =>
            {
                return Promise.reject(err);
            });
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
                            rowKeyValue: this.state.lastRowId,
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

        if (action.columnKey === "Ticker" && action.type === "UpdateCellValue")
        {
            const cell = {
                columnKey: action.columnKey,
                rowKeyValue: action.rowKeyValue
            };
            console.log("Cell: ");
            console.log(cell);
            this.getTicker(cell);
        }
        if (action.columnKey === "DOI" && action.type === "UpdateCellValue")
        {
            const cell = {
                columnKey: action.columnKey,
                rowKeyValue: action.rowKeyValue
            };
            this.getTicker(cell);
        }
    }
}
export { SheetComponent };
