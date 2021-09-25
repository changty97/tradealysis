import { ITableProps } from 'ka-table';
import { DataType, EditingMode, SortingMode } from 'ka-table/enums';

const tableProps: ITableProps = {
    columns: [
        {
            key: 'addColumn',
            style: {
                width: 100
            }
        },
        {
            key: 'column1',
            title: 'DOI',
            dataType: DataType.String,
        },
        {
            key: 'column2',
            title: 'P/L',
            dataType: DataType.String
        },
        {
            key: 'column3',
            title: 'Broker',
            dataType: DataType.String
        },
        {
            key: 'column4',
            title: 'Position',
            dataType: DataType.String
        },
        {
            key: 'column5',
            title: 'Graph',
            dataType: DataType.String
        },
        {
            key: 'column6',
            title: 'Pattern',
            dataType: DataType.String
        },
        {
            key: 'column7',
            title: 'Name',
            dataType: DataType.String
        },
        {
            key: 'column8',
            title: 'Ticker',
            dataType: DataType.String
        },
        {
            key: 'column9',
            title: 'Price',
            dataType: DataType.String
        },
        {
            key: 'column10',
            title: '52-WH',
            dataType: DataType.String
        },
        {
            key: 'column11',
            title: '52-WL',
            dataType: DataType.String
        },
        {
            key: 'column12',
            title: 'VolAvg',
            dataType: DataType.String
        },
        {
            key: 'column13',
            title: 'Outstanding',
            dataType: DataType.String
        },
        {
            key: 'column14',
            title: 'Float',
            dataType: DataType.String
        },
        {
            key: 'column15',
            title: 'FloatR',
            dataType: DataType.String
        },
        {
            key: 'column16',
            title: 'FloatC',
            dataType: DataType.String
        },
        {
            key: 'column17',
            title: 'MC-Cat',
            dataType: DataType.String
        },
        {
            key: 'column18',
            title: 'MC-Current',
            dataType: DataType.String
        },
        {
            key: 'column19',
            title: 'Vol-DOI',
            dataType: DataType.String
        },
        {
            key: 'column20',
            title: 'Vol-PreM',
            dataType: DataType.String
        },
        {
            key: 'column21',
            title: 'PC',
            dataType: DataType.String
        },
        {
            key: 'column22',
            title: 'PreM High',
            dataType: DataType.String
        },
        {
            key: 'column23',
            title: 'Open',
            dataType: DataType.String
        },
        {
            key: 'column24',
            title: 'HOD',
            dataType: DataType.String
        }
    ],
    editingMode: EditingMode.Cell,
    rowKeyField: 'id',
    sortingMode: SortingMode.Single
};

export { tableProps };