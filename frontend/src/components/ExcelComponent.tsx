
import { Component, Fragment } from "react";
import ReactDataSheet from 'react-datasheet';
import "react-datasheet/lib/react-datasheet.css";

export interface GridElement extends ReactDataSheet.Cell<GridElement, number> {
  value: number | null;
}

class MyReactDataSheet extends ReactDataSheet<GridElement, number>
{ }

interface AppState {
  grid: GridElement[][];
}

//You can also strongly type all the Components or SFCs that you pass into ReactDataSheet.
const cellRenderer: ReactDataSheet.CellRenderer<GridElement, number> = (props) =>
{
    const backgroundStyle = props.cell.value && props.cell.value < 0 ? {
        color: 'red'
    } : undefined;
    return (
        <td style={backgroundStyle} onMouseDown={props.onMouseDown} onMouseOver={props.onMouseOver} onDoubleClick={props.onDoubleClick}  className="cell">
            {props.children}
        </td>
    );
};

class ExcelComponent extends Component<any, AppState>
{
    constructor(props: any)
    {
        super(props);
        this.state = {
            grid: [
                [{
                    value: 1324234
                }, {
                    value: -3
                }],
                [{
                    value: -2
                }, {
                    value: 4
                }]
            ]
        };
    }
    render()
    {
        return (
            <Fragment>
                <MyReactDataSheet
                    data={this.state.grid}
                    valueRenderer={(cell) => cell.value}
                    onCellsChanged={changes =>
                    {
                        const grid = this.state.grid.map(row => [...row]);
                        changes.forEach(({
                            cell, row, col, value
                        }) =>
                        {
                            grid[row][col] = {
                                ...grid[row][col],
                                value
                            };
                        });
                        this.setState({
                            grid
                        });
                    }}
                    cellRenderer={cellRenderer}
                />
            </Fragment>
        );
    }
}
export { ExcelComponent };
