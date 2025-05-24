/**
 * @file MRT_EditCellTextarea.tsx
 * @description A multiline text input component for Material React Table cell editing.
 *
 * This component extends MUI's TextField to provide multiline text editing capabilities
 * within Material React Table cells. It handles state management, keyboard navigation,
 * and integrates with Material React Table's row editing workflow.
 */

import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type  RefObject
} from "react";
import TextField from '@mui/material/TextField';
import {type TextFieldProps} from '@mui/material/TextField';
import {
  type MRT_Cell,
  type MRT_RowData,
  type MRT_TableInstance,
} from 'material-react-table';
import {getTextFieldProps, updateEditingRow} from '../../utils';
import {type SystemStyleObject} from '@mui/system';
import {parseFromValuesOrFunc} from 'material-react-table/src/utils/utils';
import type {Theme} from '@mui/material';

/**
 * Props for the MRT_EditCellTextarea component.
 */
export type MRT_EditCellTextareaProps<TData extends MRT_RowData> =
  Omit<TextFieldProps<'standard'>, 'select' | 'multiline' | 'children'> & {
  /** The cell to be edited. */
  cell: MRT_Cell<TData>;
  /** The table instance. */
  table: MRT_TableInstance<TData>;
};

/**
 * A multiline text input component for editing text values in Material-React-Table cells.
 *
 * Features:
 * - Supports multiline text editing with appropriate styling
 * - Integrates with Material React Table's row/cell editing state management
 * - Handles keyboard navigation (e.g., Shift+Enter to complete editing)
 * - Preserves cursor position and selection state
 * - Automatically updates the editing row in the table state
 *
 * @example
 * ```jsx
 * <MRT_EditCellTextarea
 *   cell={cell}
 *   table={table}
 *   minRows={3}
 *   maxRows={10}
 * />
 * ```
 */
export const MRT_EditCellTextarea = <TData extends MRT_RowData>(
  {cell, table, ...rest}: MRT_EditCellTextareaProps<TData>) => {
  const {
    getState,
    options: {createDisplayMode, editDisplayMode},
    refs: {editInputRefs},
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const {column, row} = cell;
  const {columnDef} = column;
  const {creatingRow, editingRow} = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const [value, setValue] = useState(() => cell.getValue<string>());

  /**
   * Merge TextField props from various sources in the correct priority order:
   * 1. Global table-level props
   * 2. Column-specific props
   * 3. Props passed directly to this component
   */
  const textFieldProps: TextFieldProps = {...getTextFieldProps({table, cell}), ...rest};

  const saveInputValueToRowCache = (newValue: string) => {
    //@ts-expect-error row._valuesCache is keyed by column.id
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      setCreatingRow(row);
    } else if (isEditing) {
      setEditingRow(row);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    textFieldProps.onChange?.(event);
    setValue(event.target.value);
    updateEditingRow(table, cell, event.target.value);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    textFieldProps.onBlur?.(event);
    saveInputValueToRowCache(value);
    setEditingCell(null);
  };

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    textFieldProps.onKeyDown?.(event);
    if (event.key === 'Enter' && event.shiftKey && editInputRefs.current) {
      editInputRefs.current[column.id]?.blur();
    }
  };

  return (
    <TextField
      disabled={parseFromValuesOrFunc(columnDef.enableEditing, row) === false}
      fullWidth
      inputRef={(inputRef: RefObject<HTMLInputElement>) => {
        if (inputRef && editInputRefs.current) {
          editInputRefs.current[column.id] = inputRef.current;
          if (textFieldProps.inputRef) {
            textFieldProps.inputRef = inputRef;
          }
        }
      }}
      multiline={true}
      label={
        ['custom', 'modal'].includes(
          (isCreating ? createDisplayMode : editDisplayMode) as string
        )
          ? columnDef.header
          : undefined
      }
      margin="none"
      name={column.id}
      placeholder={
        !['custom', 'modal'].includes(
          (isCreating ? createDisplayMode : editDisplayMode) as string
        )
          ? columnDef.header
          : undefined
      }
      select={false}
      size="small"
      value={value ?? ''}
      variant="standard"
      autoComplete="off"
      {...textFieldProps}
      onBlur={handleBlur}
      onChange={handleChange}
      onClick={(e) => {
        e.stopPropagation();
        textFieldProps?.onClick?.(e);
      }}
      onKeyDown={handleEnterKeyDown}
    />
  );
};
