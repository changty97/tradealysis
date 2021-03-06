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

/** Sheet Component: Excel Like Spreadsheet **/
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
        this.updatePL = this.updatePL.bind(this);
        this.updatePLPerc = this.updatePLPerc.bind(this);
        this.updateSheetItems = this.updateSheetItems.bind(this);
        this.setLoading = this.setLoading.bind(this);
    }
	
    componentDidMount():void
    {
        this.loadSheet();
    }

    /** Loads items onto reports page **/
    private loadSheet(): Promise<void>
    {
        const theKey = localStorage.getItem("Key");

        this.setLoading(true, "Loading data");

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

                    await this.updateSheetItems(false);
                }
                else
                {
                    this.setState({
                        lastRowId: -1
                    });
                }
            }).catch((error) => console.error(error))
            .finally(() =>
            {
                this.setLoading(false);
            });
    }

    /**
		Update Sheet Component
		@param {boolean} getPastData : Whether to reload all historical data
	**/
    private async updateSheetItems(getPastData:boolean):Promise<void>
    {
        // fetch data for each loaded row
        if (this.state.tableProps.data)
        {
            const promises: any = [];

            this.setLoading(true, "Updating stock data");

            this.state.tableProps.data.forEach((row: any) =>
            {
                console.log("fetching...");
                const cell = {
                    columnKey: row["Ticker"],
                    rowKeyValue: row["id"]
                };

                promises.push(this.getTicker(cell, getPastData));
            });

            const changes = await Promise.all(promises);

            this.setLoading(false);

            this.setCells(changes);
        }
    }
	
    /**
		Generate new ID which is greater then the lastRowID
	**/
    private generateNewId(): number
    {
        const newRowId: number = this.state.lastRowId + 1;
        this.setState({
            lastRowId: newRowId
        });
        return newRowId;
    }
   
    /**
		Post Data to Mongo Database
   **/
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
	
    /** Get Ticker **/
    async getTicker(cell: any, alwaysGetPastData: boolean): Promise<any>
    {
        if (this.state.tableProps.data)
        {
            const changes: any = {
                change: {
                },
                rowId: cell.rowKeyValue
            };

            let idx = -1;
            /** Find data index that corresponds to cell.rowKeyValue **/
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

                                const todaysDate = new Date(Date.now());

                                const rowDate = (row['DOI']) ? new Date((row['DOI']).replace(/-/g, '/')) : undefined;
                                let rowDateIsTodaysDate = false;
                                if (todaysDate && rowDate)
                                {
                                    rowDateIsTodaysDate = (
                                        (todaysDate.getMonth() === rowDate.getMonth()) &&
									  (todaysDate.getDate() === rowDate.getDate()) &&
									  (todaysDate.getFullYear() === rowDate.getFullYear()));
                                }
								
                                if (todayData)
                                {
                                    /** Remove Open, HOD, VOLDOI from todays data if doi is current date because these values can change **/
                                    if (!rowDateIsTodaysDate)
                                    {
                                        Object.prototype.hasOwnProperty.call(todayData, 'Open');
                                        if (Object.prototype.hasOwnProperty.call(todayData, 'Open'))
                                        {
                                            delete todayData.Open;
                                        }
                                        if (Object.prototype.hasOwnProperty.call(todayData, 'HOD'))
                                        {
                                            delete todayData.HOD;
                                        }
                                        if (Object.prototype.hasOwnProperty.call(todayData, 'VolDOI'))
                                        {
                                            delete todayData.VolDOI;
                                        }
                                    }
                                    Object.assign(changes.change, todayData);
                                }

                                // fetch past data only if valid DOI is entered AND historical data has not yet been fetched
                                if ((row.DOI !== undefined && this.isValidDate(row.DOI) && (!row.PC || row.PC === "")) ||
								    (alwaysGetPastData && row.DOI && this.isValidDate(row.DOI)))
                                {
                                    const pastData = await this.getPastData(row.Ticker, row.DOI);
                                    if (pastData)
                                    {
                                        Object.assign(changes.change, pastData);
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
            }

            return changes;
        }
    }
	
    /** Get todays data **/
    async getTodayData(ticker: string): Promise<any>
    {
        try
        {
            return await api.get(`/stockapi/${ticker}`)
                .then((response:AxiosResponse<any>) =>
                {
                    switch (response.status)
                    {
                    case 200:
                        console.log(`Success: Got current data for ${ticker}`);
                        return response.data;
                    case 429:
                        throw new Error("HTTPS 429: Max api requests for fetching historical data");
                    case 404:
                        throw new Error("HTTPS 404: Max api requests for fetching historical data");
                    default:
                        throw new Error(`HTTPS ${  response.status  } Error`);
                    }
                });
        }
        catch (err)
        {
            console.log(`Error Message:${  err}`);
        }
    }
    
    /** Get Past Historical Data **/
    async getPastData(ticker: string, date: string): Promise<any>
    {
        try
        {
            return await api.get(`/stockapi/${ticker}/${date}`)
                .then((response:AxiosResponse<any>) =>
                {
                    switch (response.status)
                    {
                    case 200:
                        console.log(`Success: Got data for ${ticker} on ${date}`);
                        return response.data;
                    case 429:
                        throw new Error("HTTPS 429: Max api requests for fetching historical data");
                    case 404:
                        throw new Error("HTTPS 404: Max api requests for fetching historical data");
                    default:
                        throw new Error(`HTTPS ${  response.status  } Error`);
                    }
                });
        }
        catch (err)
        {
            console.log(`Error Message:${  err}`);
        }
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

    /** Set KA-TABLE Cells **/
    setCells(changes: any): void
    {
        if (!this.state.tableProps.data || !changes?.length)
        {
            return;
        }

        const newTablePropsData = [...this.state.tableProps.data];
        
        console.log("Setting cells...");

        changes.forEach((change: any) =>
        {
            const id = newTablePropsData.findIndex((el: any) => el.id === change.rowId);
            const translatedChange: any = {
            };

            if (!change.change || !~id)
            {
                return;
            }

            Object.entries(change.change).forEach(([columnName, val]: [string, any]) =>
            {
                switch (columnName)
                {
                case "LongName": translatedChange["Name"] = val; break;
                case "W52H": translatedChange["52-WH"] = val; break;
                case "W52L": translatedChange["52-WL"] = val; break;
                case "PremHigh": translatedChange["PreM High"] = val; break;
                case "HODTime": translatedChange["HOD-Time"] = val; break;
                case "LODTime": translatedChange["LOD-Time"] = val; break;
                case "VolDOI": translatedChange["Vol-DOI"] = val; break;
                case "VolPreM": translatedChange["Vol-PreM"] = val;  break;
                default: translatedChange[columnName] = val; break;
                }
            });
            
            Object.assign(newTablePropsData[id], translatedChange);

            // populate calculated data
            // Float Rotation = Volume-DOI / Float
            newTablePropsData[id]["FloatR"] = parseFloat((newTablePropsData[id]["Vol-DOI"] / newTablePropsData[id]["Float"]).toFixed(4));
            // Float Category is defined by size of float
            if ( newTablePropsData[id].Float > 0 && newTablePropsData[id].Float <= 1000000)
            {
                newTablePropsData[id]["FloatC"] = "NANO";
            }
            else if ( newTablePropsData[id].Float > 1000000 && newTablePropsData[id].Float <= 2000000)
            {
                newTablePropsData[id]["FloatC"] = "MICRO";
            }
            else if ( newTablePropsData[id].Float > 2000000 && newTablePropsData[id].Float <= 10000000)
            {
                newTablePropsData[id]["FloatC"] = "LOW";
            }
            else if ( newTablePropsData[id].Float > 10000000 && newTablePropsData[id].Float <= 20000000)
            {
                newTablePropsData[id]["FloatC"] = "MEDIUM";
            }
            else if ( newTablePropsData[id].Float > 20000000)
            {
                newTablePropsData[id]["FloatC"] = "HIGH";
            }
            // MarketCap = price * outstanding
            // to display value in millions:
            // ((Math.round(x/100000)*100000) /1000000)
            newTablePropsData[id]["MC-Current"] = (Math.round((newTablePropsData[id]["Price"] * newTablePropsData[id]["Outstanding"]) / 100000) * 100000) / 1000000;
            // MarketCap Category (in millions)
            if ( newTablePropsData[id]["MC-Current"] <= 50)
            {
                newTablePropsData[id]["MC-Cat"] = "NANO";
            }
            else if ( newTablePropsData[id]["MC-Current"] > 50 && newTablePropsData[id]["MC-Current"] <= 300)
            {
                newTablePropsData[id]["MC-Cat"] = "MICRO";
            }
            else if ( newTablePropsData[id]["MC-Current"] > 300 && newTablePropsData[id]["MC-Current"] <= 20000)
            {
                newTablePropsData[id]["MC-Cat"] = "SMALL";
            }
            else if ( newTablePropsData[id]["MC-Current"] > 20000 && newTablePropsData[id]["MC-Current"] <= 100000)
            {
                newTablePropsData[id]["MC-Cat"] = "MID";
            }
            else if ( newTablePropsData[id]["MC-Current"] > 100000)
            {
                newTablePropsData[id]["MC-Cat"] = "LARGE";
            }
        });

        this.setState(prevState => ({
            tableProps: {
                ...prevState.tableProps,
                data: newTablePropsData
            }
        }));
        this.saveTable();
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

    /** Delete a item from a reports based upon the id (or cells rowKeyValue) **/
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

    /** Update PL Cell **/
    updatePL(cell: any)
    {
        if (!this.state.tableProps.data)
        {
            return;
        }

        const id = this.state.tableProps.data.findIndex((el: any) => el.id === cell.rowKeyValue);
        const position: string = this.state.tableProps.data![id]["Position"];
        const numShares: number = parseInt(this.state.tableProps.data![id]["# Shares"]);
        const avgEntry: number = parseFloat(this.state.tableProps.data![id]["Avg Entry"]);
        const avgExit: number = parseFloat(this.state.tableProps.data![id]["Avg Exit"]);
        let PL: number;

        if (position?.toLocaleLowerCase() === "long") {
            PL = numShares * (avgExit - avgEntry);
        } else {
            PL = numShares * (avgEntry - avgExit);
        }

        if (numShares !== null && avgEntry !== null && avgExit !== null)
        {
            this.setCells([{
                change: {
                    "P/L": PL.toFixed(2)
                },
                rowId: cell.rowKeyValue
            }]);
        }

        this.updatePLPerc(cell, PL);
    }
	
    /** Update P1% **/
    updatePLPerc(cell: any, PL?: number)
    {
        if (!this.state.tableProps.data)
        {
            return;
        }
        
        const id = this.state.tableProps.data.findIndex((el: any) => el.id === cell.rowKeyValue);
        const numShares: number = parseInt(this.state.tableProps.data![id]["# Shares"]);
        const avgEntry: number = parseFloat(this.state.tableProps.data![id]["Avg Entry"]);
        PL = PL || parseFloat(this.state.tableProps.data![id]["P/L"]);

        if (PL !== null && numShares !== null && avgEntry !== null)
        {
            console.log(`Changed pl${  cell.rowKeyValue}`);
            this.setCells([{
                change: {
                    "P/L %": (100 * (PL / (numShares * avgEntry)) || 0).toFixed(2)
                },
                rowId: cell.rowKeyValue
            }]);
        }
    }

    /** Loading **/
    setLoading(isLoading: boolean, text?: string): void
    {
        this.setState(prevState => ({
            tableProps: {
                ...prevState.tableProps,
                loading: {
                    enabled: isLoading,
                    text
                }
            }
        }));
    }
	
    /** What is Displayed KA-TABLE SHEET **/
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
				
                <Reports.BUTTON onClick={ () => this.updateSheetItems(false) }> Refresh RealTime</Reports.BUTTON>
                <Reports.BUTTON onClick={ () => this.updateSheetItems(true) }> Refresh Historical</Reports.BUTTON>
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

    /** KA-TABLE DISPATCH FUNCTION TO EXECUTE ACTIONS **/
    private async dispatch(action: any)
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

            /** Actions to take if Certain Cell Cols Are Updated **/
            switch (action.columnKey)
            {
            case "DOI":
                if (this.state.tableProps.data[action.rowKeyValue] && this.state.tableProps.data[action.rowKeyValue]["Ticker"])
                {
                    this.setCells([await this.getTicker(cell, false)]);
                }
                break;
            case "Ticker":
                this.setCells([await this.getTicker(cell, false)]);
                break;
            case "P/L":
                this.updatePLPerc(cell);
                break;
            case "Position":
                this.updatePL(cell);
                break;
            case "Avg Entry":
                this.updatePL(cell);
                break;
            case "Avg Exit":
                this.updatePL(cell);
                break;
            case "# Shares":
                this.updatePL(cell);
                break;
            default:
                break;
            }
        }
    }
}
export { SheetComponent };
