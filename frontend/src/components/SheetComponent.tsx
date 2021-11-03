import "ka-table/style.css";
import { Component, Fragment } from "react";
import { kaReducer, Table } from 'ka-table';
import { CSVLink } from 'react-csv';
import { kaPropsUtils } from 'ka-table/utils';
import { saveNewRow, showNewRow, search } from 'ka-table/actionCreators';
import { ISheetComponentState } from "../models/ISheetComponentState";
import { tableProps, defaultRowCount } from "../constants/tableProps";
import { ChildComponents } from "ka-table/models";
import { clearFocused, moveFocusedDown, moveFocusedLeft, moveFocusedRight, moveFocusedUp, openEditor,
    setFocused, updatePageIndex, updateSortDirection } from 'ka-table/actionCreators';
import axios from "axios";
/*
const api = axios.create({
    baseURL: 'http://localhost:3001/'
});
*/
class SheetComponent extends Component<any, ISheetComponentState>
{
    constructor(props: any)
    {
        super(props);
        this.state = {
            tableProps,
            lastRowId: defaultRowCount, // verify that dataArray in tableProps.ts is same size
        };
        
        this.dispatch = this.dispatch.bind(this);
        this.generateNewId = this.generateNewId.bind(this);
        this.saveNewData = this.saveNewData.bind(this);
        this.createNewRow = this.createNewRow.bind(this);
        this.saveTable = this.saveTable.bind(this);
        this.setCells = this.setCells.bind(this);
    }

    componentDidMount() : void
    {
        const idStr = "6181d5f66e3b90d069cca50c";
        axios.get(`http://localhost:3001/getTableDB`, {
            params: {
                objId: idStr
            }
        }).then((response) =>
        {
            // console.log(response.data[0]["table_data"]["dataArray"][0]["Name"]);
            // response is an object
            // response.data is an object property
            // response.data[0] refers to another object
            // response.data[0]["table_data"] refers to table_data object
            // response.data[0]["table_data"]["dataArray"] refers to our table. it's an array where each index is an object representing a row of data
            // access the table nested within the mongoDB document with the provided document id
            // console.log(response.data[0]["table_data"]["dataArray"]);
            this.setState((prevState) => ({
                tableProps: {
                    ...prevState.tableProps,
                    data: response.data[0]["table_data"]["dataArray"]
                }
            }));
            // console.log("Current Values:");
            // console.log(this.state.tableProps.data);
        }).catch(function(error)
        {
            console.log('Error', error);
        });
        return;
    }

    generateNewId(): number
    {
        const newRowId: number = this.state.lastRowId + 1;

        this.setState({
            lastRowId: newRowId
        });

        return newRowId;
    }

    saveNewData(): void
    {
        const rowKeyValue = this.generateNewId();

        this.dispatch(saveNewRow(rowKeyValue, {
            validate: true
        }));
    }

    createNewRow(): void
    {
        this.dispatch(showNewRow());
        this.saveNewData();
    }

    saveTable(): void
    {
        // TODO: fetch stock API data and insert it into table before Posting table
        const tableData = this.state.tableProps.data;
        if (this.state.tableProps.data)
        {
            // console.log("Ticker Symbol: " + this.state.tableProps.data[0]["Ticker"]);
            axios.get(`http://localhost:3001/stockapi/`, {
                params: {
                    ID: this.state.tableProps.data[0]["Ticker"]
                }
            }).then((response) =>
            {
                console.log(response.data);
            }).catch(function(error)
            {
                console.log('Error', error);
            });
            
        }

        // save the displayed data to mongo
        axios.post(`http://localhost:3001/postTableDB`, {
            dataArray: tableData
        }).then(function(response)
        {
            return;
        }).catch(function(error)
        {
            console.log('Error', error);
        });
    }

    // create new row upon updating the last existing row
    increaseRows() : void
    {
        // increase the number of rows when the table is updated with a new value
        // this will be changed to increase only when the LAST row is updated
        const dataArray = Array(9).fill(undefined).map(
            (_, index) => this.state.tableProps.columns.reduce((previousValue: any, currentValue) =>
            {
                if (previousValue[currentValue.key] !== ``)
                {
                    return previousValue;
                }
                else
                {
                    previousValue[currentValue.key] = ``;
                }
                return previousValue;
            }, {
                id: index
            }),
        );
        this.setState((prevState) => ({
            tableProps: {
                ...prevState.tableProps,
                data: dataArray
            }
        }));
    }

    getTicker(cell: any): void
    {
        if (this.state.tableProps.data)
        {
            const i = this.state.tableProps.data[cell.rowKeyValue];
            for (const [key, value] of Object.entries(i))
            {
                if (`${key}` === 'Ticker' && `${value}` !== '')
                {
                    const yahooData = this.getAlphaVantageData(i.Ticker);
                    this.setCells(yahooData, cell);
                    // const finvizData = this.getFinvizData();
                    // this.setCells(finvizData, cell);
                }
            }
        }
    }

    getAlphaVantageData(ticker: string): any
    {
        return axios.get(`http://localhost:3001/stockapi/`, {
            params: {
                ID: ticker
            }
        }).then((response) =>
        {
            return response.data;
        }).catch(function(error)
        {
            console.log('Error', error);
        });
    }

    setCells(data: any, cell: any): void
    {
        Promise.resolve(data).then((value) =>
        {
            if (this.state.tableProps.data)
            {
                for (const [k, v] of Object.entries(this.state.tableProps.data[cell.rowKeyValue]))
                {
                    const i = this.state.tableProps.data[cell.rowKeyValue];
                    if (`${k}` === 'Ticker' && `${v}` !== '')
                    {
                        console.log(value);
                        for (const [key, val] of Object.entries(value))
                        {
                            switch (key)
                            {
                            case "Price": i["Price"] = val;
                                break;
                            case "W52H": i["52-WH"] = val;
                                break;
                            case "L52H": i["52-WL"] = val;
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
                            case "HOD-Time": i["HOD-Time"] = val;
                                break;
                            case "LOD": i["LOD"] = val;
                                break;
                            case "LOD-Time": i["LOD-Time"] = val;
                                break;
                            case "Close": i["Close"] = val;
                                break;
                            case "AH": i["AH"] = val;
                                break;
                            default:
                            }
                        }
                    }
                }
            }
        });
    }

    childComponents: ChildComponents = {
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
                        this.dispatch(showNewRow()); this.dispatch(saveNewRow(Math.random()));
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
            this.getTicker(cell);
        }

    }
}
export { SheetComponent };
