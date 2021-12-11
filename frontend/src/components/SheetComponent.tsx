import "ka-table/style.css";
import { Component, Fragment } from "react";
import { AxiosResponse } from "axios";
import { kaReducer, Table } from 'ka-table';
import { CSVLink } from 'react-csv';
import { kaPropsUtils } from 'ka-table/utils';
import { InsertRowPosition } from 'ka-table/enums';
import { ISheetComponentProps } from "../models/ISheetComponentProps";
import { ISheetComponentState } from "../models/ISheetComponentState";
import { tableProps } from "../constants/tableProps";
import { ChildComponents } from "ka-table/models";
import { clearFocused, moveFocusedDown, moveFocusedLeft,
    moveFocusedRight, moveFocusedUp, openEditor,
    setFocused, updatePageIndex, updateSortDirection,
		 insertRow, hideLoading, showLoading,
		 search, deleteRow, updateData } from 'ka-table/actionCreators';
import DeleteIcon from "../images/deleteImg.svg";
import { Reports } from "../cssComponents/Reports";
import { api } from "../constants/globals";
import Swal from 'sweetalert2';
import { LoadingComponent } from "./LoadingComponent";

class SheetComponent extends Component<ISheetComponentProps, ISheetComponentState>
{
    constructor(props: ISheetComponentProps)
    {
        super(props);
        this.state = {
            tableProps,
            lastRowId: -1,
            reportsId: localStorage.getItem('reportsId'),
            loading: false
        };
        this.dispatch = this.dispatch.bind(this);
        this.generateNewId = this.generateNewId.bind(this);
        this.saveTable = this.saveTable.bind(this);
        this.deleteItemFromDB = this.deleteItemFromDB.bind(this);
        this.updateSheetItems = this.updateSheetItems.bind(this);
    }
	
    componentDidMount():void
    {
        this.loadSheet();
    }

    /** Loads items onto reports page **/
    private async loadSheet(): Promise<void>
    {
        const theKey = localStorage.getItem("Key");

        return api.get("/stockdataGet", {
            params: {
                key: theKey,
                coll: `${this.state.reportsId}`
            }
        })
            .then(async(response: AxiosResponse<string[]>) =>
            {
                const allArrVals = []; const theArr = response.data;
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
                            const theValue = value;
                            if (theKey === '_id')
                            {
                                continue;
                            }
                            else if (theKey === 'id')
                            {
                                if (this.state.lastRowId < Number(value))
                                {
                                    this.setState({
                                        lastRowId: Number(value)
                                    });
                                }
                            }
                            Object.defineProperty(valsToInsert, theKey, {
                                value: theValue,
                                writable: true,
                                enumerable: true
                            });
                        }
                        allArrVals.push(valsToInsert);
                    }
                    this.dispatch(updateData(allArrVals));
                    this.dispatch(hideLoading());

                    this.updateSheetItems(false);
                }
                else
                {
                    this.setState({
                        lastRowId: -1
                    });
                }
            }).catch((error) => console.error(error));
    }

    private async updateSheetItems(getPastData:boolean):Promise<void>
    {
        // fetch data for each loaded row
        console.log("bEFORE IF LOOP");
        console.log(this.state.tableProps.data);
        if (this.state.tableProps.data)
        {
            const dataLen = this.state.tableProps.data.length;
            if (dataLen > 0)
            {
                const lastItemsID = Object.getOwnPropertyDescriptor(this.state.tableProps.data[dataLen - 1], 'id')!.value;
                for (let i = Object.getOwnPropertyDescriptor(this.state.tableProps.data[0], 'id')!.value, j = 0;
							     i <= lastItemsID! && j < dataLen;
								 j++)
                {
                    console.log("fetching...");
                    const cell = {
                        columnKey: this.state.tableProps.data[i]["Ticker"],
                        rowKeyValue: i
                    };
                    await this.getTicker(cell, getPastData);
                    console.log(cell);
								
                    if (j + 1 < dataLen) // data[j+1] must be valie
                    {
                        i = Object.getOwnPropertyDescriptor(this.state.tableProps.data[j + 1], 'id')!.value;
                    }
                }
            }
        }
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
        const theKey = localStorage.getItem("Key");
        api.post("postTableDB", {
            data: {
                table: tableData,
                key: theKey,
                coll: `${this.state.reportsId}`
            }
        }).catch((error)=> console.log('Error', error) );
    }
	
    async getTicker(cell: any, alwaysGetPastData: boolean): Promise<void>
    {
        if (this.state.tableProps.data)
        {
            let idx = -1;
            for (let i = this.state.tableProps.data.length - 1; i >= 0; i--)
            {
                const descriptor1 = Object.getOwnPropertyDescriptor(this.state.tableProps.data[i], 'id');
                if (descriptor1 && descriptor1.value === cell.rowKeyValue)
                {
                    idx = Number(i);
                    const row = this.state.tableProps.data[idx];
                    const obj = Object.entries(row);
                    if (row && obj)
                    {
                        for (const [key, value] of obj)
                        {
                            if (`${key}` === 'Ticker' && `${value}` !== '')
                            {
                                const todayData = await this.getTodayData(row.Ticker);
                                
								if(todayData) {
									if (todayData.hasOwnProperty('Open'))
									{
										delete todayData.Open;
									}
									if (todayData.hasOwnProperty('HOD'))
									{
										delete todayData.HOD;
									}
									if (todayData.hasOwnProperty('VolDOI'))
									{
										delete todayData.VolDOI;
									}
									
									
									this.setCells(todayData, cell);
								}
                                // fetch past data only if valid DOI is entered AND historical data has not yet been fetched
                                if ((row.DOI !== undefined && this.isValidDate(row.DOI) && row.PC === undefined) || alwaysGetPastData)
                                {
                                    const pastData = await this.getPastData(row.Ticker, row.DOI);
                                    this.setCells(pastData, cell);
                                }
                            }
                        }
                    }
                    break;
                }
            }
            /**
			TODO DONT TOUCH-------------------------------
			useEffect(() => {
									
				setInterval(async () => {
				console.log("Hello");
				this.setCells(await this.getTodayData(row.Ticker), cell, true);
				}, 2000);
			}, []);
			----------------------------------------
			**/
        }
        // save table each time new data is fetched
        this.saveTable();
    }
	
    getTodayData(ticker: string): any
    {
        return api.get(`/stockapi/${ticker}`)
            .then((response) =>
            {
                console.log(`Success: Got current data for ${ticker}`);
                return response.data;
            }).catch((error) => console.error('Error', error));
    }
    
    getPastData(ticker: string, date: string): any
    {
        return api.get(`/stockapi/${ticker}/${date}`)
            .then((response) =>
            {
                console.log(`Success: Got data for ${ticker} on ${date}`);
                return response.data;
            })
            .catch((error)=> console.log('Error', error));
    }

    // check YYYY-MM-DD format
    isValidDate(doi: any): boolean
    {
        const regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (!doi.match(regEx))
        {
            return false;
        }
        // Invalid format
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
        Promise.resolve(data).then((_value) =>
        {
            if (this.state.tableProps.data && _value)
            {
				
                let idx = -1;
                for (let crkv = this.state.tableProps.data.length - 1; crkv >= 0; crkv--)
                {
                    const descriptor1 = Object.getOwnPropertyDescriptor(this.state.tableProps.data[crkv], 'id');
                    if (descriptor1 && descriptor1.value === cell.rowKeyValue)
                    {
                        idx = Number(crkv);
						
                        const theObj = this.state.tableProps.data[idx];
                        for (const [k, v] of Object.entries(theObj))
                        {
                            const i = theObj;
                            if (`${k}` === 'Ticker' && `${v}` !== '')
                            {
                                for (const [key, val] of Object.entries(_value)) // check each alpha vantage object property
                                {
									
                                    switch (key)
                                    {
                                    case "LongName": i["Name"] = val; break;
                                    case "Price": i["Price"] = val; break;
                                    case "W52H": i["52-WH"] = val; break;
                                    case "W52L": i["52-WL"] = val; break;
                                    case "VolAvg": i["VolAvg"] = val; break;
                                    case "Outstanding": i.Outstanding = val; break;
                                    case "Float": i.Float = val; break;
                                    case "Industry": i.Industry = val; break;
                                    case "PC": i.PC = val; break;
                                    case "PremHigh": i["PreM High"] = val; break;
                                    case "Open":  i["Open"] = val; break;
                                    case "HOD": i["HOD"] = val; break;
                                    case "HODTime": i["HOD-Time"] = val; break;
                                    case "LOD": i["LOD"] = val;  break;
                                    case "LODTime": i["LOD-Time"] = val; break;
                                    case "Close": i["Close"] = val;  break;
                                    case "AH": i["AH"] = val; break;
                                    case "VolDOI": i["Vol-DOI"] = val; break;
                                    case "VolPreM": i["Vol-PreM"] = val;  break;
                                    default: break;
                                    }
                                }
                            }
                            // populate calculated data
                            // Float Rotation = Volume-DOI / Float
                            i["FloatR"] = parseFloat((i["Vol-DOI"] / i["Float"]).toFixed(4));
                            // Float Category is defined by size of float
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
                            // to display value in millions:
                            // ((Math.round(x/100000)*100000) /1000000)
                            i["MC-Current"] = (Math.round((i["Price"] * i["Outstanding"]) / 100000) * 100000) / 1000000;
                            // MarketCap Category (in millions)
                            if ( i["MC-Current"] <= 50)
                            {
                                i["MC-Cat"] = "NANO";
                            }
                            else if ( i["MC-Current"] > 50 && i["MC-Current"] <= 300)
                            {
                                i["MC-Cat"] = "MICRO";
                            }
                            else if ( i["MC-Current"] > 300 && i["MC-Current"] <= 20000)
                            {
                                i["MC-Cat"] = "SMALL";
                            }
                            else if ( i["MC-Current"] > 20000 && i["MC-Current"] <= 100000)
                            {
                                i["MC-Cat"] = "MID";
                            }
                            else if ( i["MC-Current"] > 100000)
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
                        break;
                    }
                }
            }
        });
    }

    childComponents: ChildComponents = {
        // Delete column icon (on far right)
        tableWrapper: {
            elementAttributes: () => ({
                style: {
                    maxHeight: 600
                }
            })
        },
        cellText: {
            content: props =>
            {
                if (props.column.key === ':delete')
                {
                    return ( <img src={DeleteIcon} alt="Del" onClick={() => this.deleteItemFromDB(props.rowKeyValue)} /> );
                }
                return undefined;
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
        Swal.fire({
            title: 'Are you sure you want to delete this row',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: `No`
        })
            .then((result) =>
            {
		  if (result.isConfirmed)
                {
                    Swal.fire({
                        title: 'Removed',
                        timer: 500,
                        showCancelButton: false,
                        showConfirmButton: false
                    })
                        .then(() =>
                        {
                            const theKey = localStorage.getItem("Key");
                            this.dispatch(deleteRow(val));
				
				
                            api.get("usernameFromKeyGET", {
                                params: {
                                    key: `${theKey}`
                                }
                            })
                                .then((uret: AxiosResponse<string>) =>
                                {
                                    api.post("removeTheItemGet", {
                                        data: {
                                            item: val,
                                            coll: `${uret.data}_${  this.state.reportsId}`
                                        }
                                    });
                                });
				
                            if (val === this.state.lastRowId)
                            {
                                this.setState({
                                    lastRowId: this.state.lastRowId - 1
                                });
                            }
                        });
		  }
		  else
                {
                    Swal.fire({
                        title: 'Not Removed',
                        timer: 500,
                        showConfirmButton: false
                    });
                }
            })
            .catch((err: Error) =>
            {
                console.log(err);
            });
    }
	
    public render() : JSX.Element
    {
        return (
            <Fragment>
                {this.state.loading ? <LoadingComponent /> : null}
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
                    <Reports.BUTTON style={ {
                        float: 'right',
                        backgroundColor: "gray"
                    }}>Download .csv</Reports.BUTTON>
                </CSVLink>
                {/* Add Row Button*/}
                <Reports.BUTTON
                    onClick={() =>
                    {
                        const id = this.generateNewId(); const newRow = {
                            id
                        };
                        this.dispatch(insertRow(newRow, {
                            rowKeyValue: this.state.lastRowId,
                            insertRowPosition: InsertRowPosition.after
                        }));
                    }} >
                    New Row
                </Reports.BUTTON>
				
				
                <Reports.BUTTON onClick={ () => this.updateSheetItems(false) }> RealTime</Reports.BUTTON>
                <Reports.BUTTON onClick={ () => this.updateSheetItems(true) }> Historical</Reports.BUTTON>
				
                <Reports.BUTTON onClick= {this.saveTable} style={{
                    backgroundColor: "#008CBA"
                }}>Save Table </Reports.BUTTON>
                {/* Search Sheet*/}
                <Reports.SEARCH type='search' defaultValue={tableProps.searchText} onChange={(event) =>
                {
                    this.dispatch(search(event.currentTarget.value));
                }} className='top-element' placeholder="Find a Trade" style={ {
                    float: 'right'
                }}/>
                {/* Configurable Spreadsheet */}
                <Reports.TABLE_SECTION> <Table {...this.state.tableProps} childComponents = {this.childComponents} dispatch={this.dispatch} /> </Reports.TABLE_SECTION>
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
        if (action.type === "UpdateCellValue" && this.state.tableProps.data)
        {
            const cell = {
                columnKey: action.columnKey,
                rowKeyValue: action.rowKeyValue,
                value: action.value
            };

            switch (action.columnKey)
            {
					
            case "Ticker":
                this.getTicker(cell, false);
                break;
            case "DOI":
                if (this.state.tableProps.data[action.rowKeyValue]["Ticker"])
                {
                    this.getTicker(cell, false);
                }
                break;
                /**
            case "P/L":
                // const PLPerc: number = PL / (stocksInfo[symbol].sell.totalStocks * avgEntryPrice);
                //(100 * PLPerc).toFixed(2),
                //const numShares:number = parseFloat(this.state.tableProps.data[action.rowKeyValue]["# Shares"]);
                //const numAvgEntry:number = parseFloat(this.state.tableProps.data[action.rowKeyValue]["Avg"][" Entry"]);
                break;
**/
            default:
                break;
            }
        }
    }
}
export { SheetComponent };
