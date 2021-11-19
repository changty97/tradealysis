import "ka-table/style.css";
import { Component, Fragment } from "react";
import { AxiosResponse } from "axios";
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
import { Reports } from "../cssComponents/Reports";
import { api } from "../constants/globals";
import Swal from 'sweetalert2';

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
        const theKey = localStorage.getItem("Key");
        api.get("usernameFromKeyGET", {
            params: {
                key: `${theKey}`,
            }
        }).then((uret: AxiosResponse<string>) =>
        {
            api.get("stockdataGet", {
                params: {
                    coll: `${uret.data}_${  this.state.reportsId}`,
                }
            })
                .then((response: AxiosResponse<string[]>) =>
                {
                    const allArrVals = [];
                    const theArr = response.data;
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
                });
        })
            .catch((error) =>
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
        const theKey = localStorage.getItem("Key");
        api.get("usernameFromKeyGET", {
            params: {
                key: `${theKey}`,
            }
        })
            .then((uret: AxiosResponse<string>) =>
            {
                api.post("postTableDB", {
                    data: {
                        table: tableData,
                        coll: `${uret.data  }_${  this.state.reportsId}`,
                    }
                }).then(function(response)
                {
                    return;
                });
            })
            .catch((error)=>
            {
                console.log('Error', error);
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
		  denyButtonText: `No`,
		}).then((result) => {
		  if (result.isConfirmed) {
			Swal.fire({title:'Removed', timer:500})
			.then(() => {
				const theKey = localStorage.getItem("Key");
				this.dispatch(deleteRow(val));
				api.get("usernameFromKeyGET", {
					params: {
						key: `${theKey}`,
					}
				})
					.then((uret: AxiosResponse<string>) =>
					{
						api.post("removeTheItemGet", {
							data: {
								item: val,
								coll: `${uret.data}_${  this.state.reportsId}`,
							}
						});
					});
			});
		  } 
		  else {
			Swal.fire({title:'Not Removed', timer:500})
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
                    <Reports.BUTTON style={ {
                        float: 'right',
                        backgroundColor: "gray"
                    }}>Download .csv</Reports.BUTTON>
                </CSVLink>
                {/* Add Row Button*/}
                <Reports.BUTTON
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
                </Reports.BUTTON>
                <Reports.BUTTON
                    onClick= {this.saveTable} style={{
                        backgroundColor: "#008CBA"
                    }}>Save Table
                </Reports.BUTTON>
                {/* Search Sheet*/}
                <Reports.SEARCH type='search' defaultValue={tableProps.searchText} onChange={(event) =>
                {
                    this.dispatch(search(event.currentTarget.value));
                }} className='top-element' placeholder="Find a Trade" style={ {
                    float: 'right'
                }}/>
                {/* Configurable Spreadsheet */}
                <Reports.TABLE_SECTION>
                    <Table
                        {...this.state.tableProps}
                        childComponents = {this.childComponents}
                        dispatch={this.dispatch}
                    />
                </Reports.TABLE_SECTION>
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
