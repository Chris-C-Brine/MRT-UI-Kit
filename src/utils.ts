// src/utils/material-react-table.ts
import {isDayjs} from 'dayjs';
import {
  MRT_TableInstance,
  MRT_Cell,
  MRT_RowData, MRT_TableOptions,
} from 'material-react-table';
import type {TextFieldProps} from "@mui/material";
import {parseFromValuesOrFunc} from "material-react-table/src/utils/utils";

export const updateEditingRow = <TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
  cell: MRT_Cell<TData>,
  newValue: unknown
) => {
  const {editingRow, creatingRow} = table.getState();
  const {row} = cell;

  //@ts-expect-error row._valuesCache is keyed by cell.column.id
  row._valuesCache[cell.column.id] = isDayjs(newValue)
    ? newValue.format('YYYY-MM-DD')
    : newValue;

  if (editingRow?.id) {
    table.setEditingRow(row);
    if (table.options.editDisplayMode === 'cell') {
      void table.options?.onEditingRowSave?.({
        table,
        row,
        values: row._valuesCache,
        exitEditingMode: () => table.setEditingCell(null),
      });
    }
  } else if (creatingRow?.id) {
    table.setCreatingRow(row);
  }
};

interface GetMRT_TextFieldProps<T extends MRT_RowData> {
  cell: MRT_Cell<T>;
  table: MRT_TableInstance<T>;
}

export const getTextFieldProps = <T extends MRT_RowData>(
  {
    cell,
    table
  }: GetMRT_TextFieldProps<T>): TextFieldProps => {
  const {column, row} = cell;
  const {columnDef} = column;

  return {
    ...parseFromValuesOrFunc(table.options.muiEditTextFieldProps, {cell, column, row, table}),
    ...parseFromValuesOrFunc(columnDef.muiEditTextFieldProps, {cell, column, row, table})
  };
}