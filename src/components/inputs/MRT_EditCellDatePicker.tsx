// src/components/inputs/MRT_EditCellDatePicker.tsx
import {
  DatePicker,
  type DatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import type {
  MRT_Cell,
  MRT_RowData,
  MRT_TableInstance,
} from 'material-react-table';
import { XDateLocalizationProvider } from '../../state';
import {getTextFieldProps, updateEditingRow } from '../../utils';
import { useState } from 'react';
import type { TextFieldProps } from '@mui/material';
import type {
  PickerChangeHandlerContext,
  DateValidationError,
} from '@mui/x-date-pickers';

export type MRT_EditCellDatePickerProps<
  TData extends Record<string | number, unknown>
> = Omit<DatePickerProps<Dayjs>, 'onChange' | 'value' | 'defaultValue'> & {
  /** The cell to be edited. */
  cell: MRT_Cell<TData>;
  /** The table instance. */
  table: MRT_TableInstance<TData>;
  /** Whether to show the field label. Defaults to false. */
  showLabel?: boolean;
};

/**
 * Type alias for DatePicker value
 * A Dayjs object or null when no date is selected
 */
type DatePickerDate = Dayjs | null;

/**
 * @file MRT_EditCellDatePicker.tsx
 * @description A DatePicker component for Material React Table cell editing.
 *
 * This component integrates MUI X Date Pickers with Material React Table
 * to provide date selection functionality within editable table cells.
 *
 * @example
 * ```jsx
 * <MRT_EditCellDatePicker
 *   cell={cell}
 *   table={table}
 *   showLabel
 *   format="MM/DD/YYYY"
 * />
 * ```
 *
 * @since 1.0.0
 */
export const MRT_EditCellDatePicker = <TData extends MRT_RowData>({
  cell,
  showLabel,
  table,
  ...DatePickerProps
}: MRT_EditCellDatePickerProps<TData>) => {
  const { column, row } = cell;
  const { columnDef } = column;

  const defaultValue = cell.getValue<string>() || null;

  const [value, setValue] = useState<Dayjs | null>(
    defaultValue === null
      ? dayjs(String(row._valuesCache[columnDef.id]))
      : dayjs(defaultValue)
  );

  const label = !showLabel
    ? undefined
    : DatePickerProps?.label ?? columnDef.header;

  const handleDateChange = (newValue: DatePickerDate) => {
    updateEditingRow(table, cell, newValue);
    if (dayjs.isDayjs(newValue)) setValue(newValue);
  };
  const isCellEdit = table.options.editDisplayMode === 'cell';
  const onAccept = (
    value: DatePickerDate,
    context: PickerChangeHandlerContext<DateValidationError>
  ) => {
    handleDateChange(value);
    if (isCellEdit) {
      table.setEditingCell(null);
    }
    DatePickerProps?.onAccept?.(value, context);
  };

  const textFieldProps: TextFieldProps = getTextFieldProps({cell, table});

  return (
    <XDateLocalizationProvider>
      <DatePicker
        format="MM/DD/YYYY"
        sx={{ width: '100%' }}
        minDate={dayjs('01/01/1700')} // allows for before 1900
        {...DatePickerProps}
        slotProps={{
          textField: textFieldProps,
        }}
        value={value}
        onChange={handleDateChange}
        onAccept={onAccept}
        label={label}
      />
    </XDateLocalizationProvider>
  );
};