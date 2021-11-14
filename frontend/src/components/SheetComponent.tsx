import "ka-table/style.css";
import { Component, Fragment } from "react";
import { kaReducer, Table } from 'ka-table';
import { CSVLink } from 'react-csv';
import { kaPropsUtils } from 'ka-table/utils';
import { saveNewRow, showNewRow, search } from 'ka-table/actionCreators';
import { ISheetComponentState } from "../models/ISheetComponentState";
import { tableProps } from "../constants/tableProps";
import { ChildComponents } from "ka-table/models";
import { clearFocused, moveFocusedDown, moveFocusedLeft, moveFocusedRight, moveFocusedUp, openEditor,
    setFocused, updatePageIndex, updateSortDirection } from 'ka-table/actionCreators';
import axios from "axios";

class SheetComponent extends Component<any, ISheetComponentState>
{
    constructor(props: any)
    {
        super(props);
        this.state = {
            tableProps,
            lastRowId: 3, // verify that dataArray in tableProps.ts is same size
        };

        this.dispatch = this.dispatch.bind(this);
        this.generateNewId = this.generateNewId.bind(this);
        this.saveNewData = this.saveNewData.bind(this);
        this.createNewRow = this.createNewRow.bind(this);
        this.saveTable = this.saveTable.bind(this);
        this.getTicker = this.getTicker.bind(this);
        this.getYahooData = this.getYahooData.bind(this);
        this.setCells = this.setCells.bind(this);
    }

    componentDidMount() : void
    {
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
        const tableData = this.state.tableProps.data;
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

    getTicker(cell: any): void
    {
        if (this.state.tableProps.data)
        {
            const i = this.state.tableProps.data[cell.rowKeyValue];
            for (const [key, value] of Object.entries(i))
            {
                if (`${key}` === 'Ticker' && `${value}` !== '')
                {
                    const yahooData = this.getYahooData(i.Ticker);
                    this.setCells(yahooData, cell);
                }
            }
        }
    }

    getYahooData(ticker: string): any
    {
        return axios.get(`http://localhost:3001/getYahooData`, {
            params: {
                ticker: ticker
            }
        })
            .then((response) =>
            {
                return response.data;
            }, (error) =>
            {
                return error;
            });
    }

    setCells(data: any, cell: any): void
    {
        // Promise for retrieving data from API
        Promise.resolve(data).then((value) =>
        {
            // Check if data exists
            if (this.state.tableProps.data)
            {
                const i = this.state.tableProps.data[cell.rowKeyValue];

                // Loop through each key: value pair within the tableProps data
                for (const [k, v] of Object.entries(i))
                {
                    // Check if cell is Ticker and is not empty
                    if (`${k}` === 'Ticker' && `${v}` !== '')
                    {
                        // Loop through each key: value pair within the API data
                        for (const [key, val] of Object.entries(value))
                        {
                            // Set each Real-Time data cell with corresponding data
                            switch (key)
                            {
                            case "regularMarketPrice": i.Price = val;
                                break;
                            case "longName": i.Name = val;
                                break;
                            case "fiftyTwoWeekHigh": i["52-WH"] = val;
                                break;
                            case "fiftyTwoWeekLow": i["52-WL"] = val;
                                break;
                            case "averageDailyVolume3Month": i.VolAvg = val;
                                break;
                            case "sharesOutstanding": i.Outstanding = val;
                                break;
                            case "regularMarketVolume": i["Vol-DOI"] = val;
                                break;
                            case "regularMarketOpen": i.Open = val;
                                break;
                            case "regularMarketDayHigh": i.HOD = val;
                                break;
                            }
                        }
                        this.setState((prevState) => ({
                            tableProps: {
                                ...prevState.tableProps,
                                data: this.state.tableProps.data
                            }
                        }));
                    }
                }
            }
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
