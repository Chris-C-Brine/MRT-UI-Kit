// src/utils/material-react-table.ts
import {isDayjs} from 'dayjs';
import {
  MRT_TableInstance,
  MRT_Cell,
  MRT_RowData,
} from 'material-react-table';
import type {TextFieldProps} from "@mui/material";
import {parseFromValuesOrFunc} from "material-react-table/src/utils/utils";
import {RTV} from "./components";

/**
 * Updates the editing row in a Material React Table with a new value
 *
 * This utility function is used by editing components to update the value
 * in the row's cache and handle save operations for cell editing mode.
 *
 * @template TData - The data type for the table row
 * @param table - The Material React Table instance
 * @param cell - The cell being edited
 * @param newValue - The new value to set (can be any type, including Dayjs objects)
 */
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

/**
 * Parameters for the getTextFieldProps function
 *
 * @template T - The data type for the table row
 */
interface GetMRT_TextFieldProps<T extends MRT_RowData> {
  cell: MRT_Cell<T>;
  table: MRT_TableInstance<T>;
}

/**
 * Gets consistent TextField props for editing components
 *
 * This utility combines TextField props from table options and column definition,
 * as well as ensures consistent behavior across different editing components.
 *
 * @template T - The data type for the table row
 * @param options - Object containing cell and table
 * @returns TextFieldProps - The combined TextField props
 */
export const getTextFieldProps = <T extends MRT_RowData>(
  {
    cell,
    table
  }: GetMRT_TextFieldProps<T>): TextFieldProps => {
  const {column, row} = cell;
  const {columnDef} = column;

  return {
    variant: 'standard', //can override with columnDef.muiEditTextFieldProps: { variant: "outlined" },
    ...parseFromValuesOrFunc(table.options.muiEditTextFieldProps, {cell, column, row, table}),
    ...parseFromValuesOrFunc(columnDef.muiEditTextFieldProps, {cell, column, row, table})
  };
}

/**
 * Sets the current row to view-only mode in the table
 *
 * This utility function transforms a regular row into a "view" row by setting its ID
 * to 'mrt_view_row', which is recognized by MRT_EditDialog to render in view-only mode.
 *
 * @example
 * ```tsx
 * import { setViewingRow } from '@chris-c-brine/mrt-ui-kit';
 *
 * // Inside your component
 * <Button onClick={() => setViewingRow({ table, row })}>
 *   View Details
 * </Button>
 * ```
 *
 * @template TData - The data type for the table row
 * @param options - Object containing table and row
 * @param options.table - The Material React Table instance
 * @param options.row - The row to be viewed
 */
export const setViewingRow = <TData extends MRT_RowData>(
  {table, row}: Pick<RTV<TData>, 'row' | 'table'>
) => table.setEditingRow({...row, id: 'mrt-row-view' });