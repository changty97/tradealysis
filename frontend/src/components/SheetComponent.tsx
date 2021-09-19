import { Component, Fragment} from "react";
import "react-datasheet/lib/react-datasheet.css";
import { ITableProps, kaReducer, Table } from 'ka-table';
import { DataType, EditingMode, SortingMode } from 'ka-table/enums';
import { CSVLink } from 'react-csv';
import { kaPropsUtils } from 'ka-table/utils';
import { hideNewRow, saveNewRow, showNewRow, search } from 'ka-table/actionCreators';
import { ICellEditorProps, IHeadCellProps } from 'ka-table/props';

const dataArray = Array(4) // default # of rows
    .fill(undefined)
    .map((_, index) => ({
        column1: `column:1 row:${index}`,
        column2: `c2r${index}`,
        id: index
    }));

let maxValue = Math.max(...dataArray.map(i => i.id));
const generateNewId = () => {
  maxValue++;
  return maxValue;
};

const AddButton: React.FC<IHeadCellProps> = ({ dispatch }) => {
  return (
    <div className="new-trade-button">
      <button
        onClick={() => dispatch(showNewRow())}>New Trade
      </button>
    </div>
  );
};

const SaveButton: React.FC<ICellEditorProps> = ({ dispatch }) => {
  const saveNewData = () => {
    const rowKeyValue = generateNewId();
    dispatch(
      saveNewRow(rowKeyValue, {
        validate: true
      })
    );
  };
  return (
    <div className="verify-trade-entry-button">
      <button
        onClick={saveNewData}>Confirm
      </button>
      <button onClick={() => dispatch(hideNewRow())}>Cancel
      </button>
    </div>
  );
};

const tableProps: ITableProps = {
  columns: [
      { key: 'addColumn', style: {width: 100} },
      { key: 'column1', title: 'DOI', dataType: DataType.String },
      { key: 'column2', title: 'P/L', dataType: DataType.String },
      { key: 'column3', title: 'Broker', dataType: DataType.String},
      { key: 'column4', title: 'Position', dataType: DataType.String},
      { key: 'column5', title: 'Graph', dataType: DataType.String},
      { key: 'column6', title: 'Pattern', dataType: DataType.String},
      { key: 'column7', title: 'Name', dataType: DataType.String},
      { key: 'column8', title: 'Ticker', dataType: DataType.String},
      { key: 'column9', title: 'Price', dataType: DataType.String},
      { key: 'column10', title: '52-WH', dataType: DataType.String},
      { key: 'column11', title: '52-WL', dataType: DataType.String},
      { key: 'column12', title: 'VolAvg', dataType: DataType.String},
      { key: 'column13', title: 'Outstanding', dataType: DataType.String},
      { key: 'column14', title: 'Float', dataType: DataType.String},
      { key: 'column15', title: 'FloatR', dataType: DataType.String},
      { key: 'column16', title: 'FloatC', dataType: DataType.String},
      { key: 'column17', title: 'MC-Cat', dataType: DataType.String},
      { key: 'column18', title: 'MC-Current', dataType: DataType.String},
      { key: 'column19', title: 'Vol-DOI', dataType: DataType.String},
      { key: 'column20', title: 'Vol-PreM', dataType: DataType.String},
      { key: 'column21', title: 'PC', dataType: DataType.String},
      { key: 'column22', title: 'PreM High', dataType: DataType.String},
      { key: 'column23', title: 'Open', dataType: DataType.String},
      { key: 'column24', title: 'HOD', dataType: DataType.String}
  ],
  data: dataArray,
  editingMode: EditingMode.Cell,
  rowKeyField: 'id',
  sortingMode: SortingMode.Single
};


class SheetComponent extends Component<any, { tableProps: ITableProps }> {
  
  constructor(props: any) {
    super(props);
    this.state = { tableProps };
    this.dispatch = this.dispatch.bind(this);
  }

  public render() : JSX.Element {
    return (
      <Fragment>
        {/* Allows export to .csv file*/}
        <CSVLink
          data={kaPropsUtils.getData(tableProps)}
          headers={tableProps.columns.map(c => ({ label: c.title!, key: c.key! }))}
          filename='ka-table.data.csv'
          enclosingCharacter={''}
          separator={','}>
            {/* Move style to .css later*/}
            <button style={ {float: 'right'}}>Download .csv</button>
        </CSVLink>

        {/* Search Sheet*/}
        <input type='search' defaultValue={tableProps.searchText} onChange={(event) => {
        this.dispatch(search(event.currentTarget.value));
      }} className='top-element' placeholder="Find a Trade" style={ {float: 'right'}}/>
        {/* Configurable Spreadsheet */}
        <Table
        {...this.state.tableProps}
        childComponents={{
          cellEditor: {
            content: props => 
            {
              if (props.column.key === "addColumn") 
              {
                return <SaveButton {...props} />;
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
                return <AddButton {...props} />;
              }
              else 
              {
                return;
              }
            }
          }
        }}
        dispatch={this.dispatch} />

      </Fragment>
    );
  }

  private dispatch(action: any) {
    this.setState((prevState) => ({
      ...prevState,
      ...{tableProps: kaReducer(prevState.tableProps, action)}
    }));
  }
}
export { SheetComponent };
