import { Component, Fragment } from "react";
import { kaReducer, Table } from 'ka-table';
import { CSVLink } from 'react-csv';
import { kaPropsUtils } from 'ka-table/utils';
import { hideNewRow, saveNewRow, showNewRow, search } from 'ka-table/actionCreators';
import { ISheetComponentState } from "../models/ISheetComponentState";
import { tableProps } from "../constants/tableProps";

class SheetComponent extends Component<any, ISheetComponentState>
{
  
    constructor(props: any)
    {
        super(props);
        this.state = {
            tableProps,
            lastRowId: 0
        };
        
        this.dispatch = this.dispatch.bind(this);
        this.generateNewId = this.generateNewId.bind(this);
        this.saveNewData = this.saveNewData.bind(this);
    }

    componentDidMount() : void
    {
        /* Calculate the initial row id. */
        const dataArray = Array(4) // default # of rows
            .fill(undefined)
            .map((_, index) => ({
                column1: `column:1 row:${index}`,
                column2: `c2r${index}`,
                id: index
            }));

        this.setState({
            lastRowId: Math.max(...dataArray.map(i => i.id))
        });
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

    public render() : JSX.Element
    {
        return (
            <Fragment>
                {/* Allows export to .csv file*/}
                <CSVLink
                    data={kaPropsUtils.getData(tableProps)}
                    headers={tableProps.columns.map(c => ({
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
                    childComponents={{
                        cellEditor:
                        {
                            content: props =>
                            {
                                if (props.column.key === "addColumn")
                                {
                                    return (
                                        <div className="verify-trade-entry-button">
                                            <button
                                                onClick={this.saveNewData}
                                            >
                                                Confirm
                                            </button>
                                            <button onClick={() => this.dispatch(hideNewRow())}>
                                                Cancel
                                            </button>
                                        </div>
                                    );
                                }
                                else
                                {
                                    return;
                                }
                            }
                        },
                        headCell:
                        {
                            content: props =>
                            {
                                if (props.column.key === "addColumn")
                                {
                                    return (
                                        <div className="new-trade-button">
                                            <button
                                                onClick={() => this.dispatch(showNewRow())}>
                                                    New Trade
                                            </button>
                                        </div>
                                    );
                                }
                                else
                                {
                                    return;
                                }
                            }
                        }
                    }}
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
