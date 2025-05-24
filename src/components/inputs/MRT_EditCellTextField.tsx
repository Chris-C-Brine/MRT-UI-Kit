// src/components/inputs/MRT_EditCellTextField.tsx
/* 
  Note: This is the original implementation with slightly better type assertions
*/
import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
  useState
} from "react";
import { MenuItem, TextField, type TextFieldProps } from '@mui/material';
import {
  type MRT_Cell,
  type MRT_RowData,
  type MRT_TableInstance,
} from 'material-react-table';

import {
  getValueAndLabel,
  parseFromValuesOrFunc,
} from 'material-react-table/src/utils/utils';
import {getTextFieldProps} from "../../utils";

export interface MRT_EditCellTextFieldProps<TData extends MRT_RowData>
  extends TextFieldProps<'standard'> {
  cell: MRT_Cell<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_EditCellTextField = <TData extends MRT_RowData>({
  cell,
  table,
  ...rest
}: MRT_EditCellTextFieldProps<TData>) => {
  const {
    getState,
    options: { createDisplayMode, editDisplayMode},
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;

  const { column, row } = cell;
  const { columnDef } = column;
  const { creatingRow, editingRow } = getState();
  const { editSelectOptions, editVariant } = columnDef;

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const [value, setValue] = useState(() => cell.getValue<string>());

  const textFieldProps: TextFieldProps = {
    ...getTextFieldProps({table, cell}),
    ...rest,
  };

  const selectOptions = parseFromValuesOrFunc(editSelectOptions, {
    cell,
    column,
    row,
    table,
  });

  const isSelectEdit = editVariant === 'select' || textFieldProps?.select;

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
    if (isSelectEdit) {
      saveInputValueToRowCache(event.target.value);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    textFieldProps.onBlur?.(event);
    saveInputValueToRowCache(value);
    setEditingCell(null);
  };

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    textFieldProps.onKeyDown?.(event);
    if (event.key === 'Enter' && event.shiftKey) {
      editInputRefs.current?.[column.id]?.blur();
    }
  };

  if (columnDef.Edit) {
    return <>{columnDef.Edit?.({ cell, column, row, table })}</>;
  }

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
      select={isSelectEdit}
      size="small"
      value={value ?? ''}
      variant="standard"
      {...textFieldProps}
      slotProps={{
        input: {
          ...(textFieldProps.variant !== 'outlined'
            ? { disableUnderline: editDisplayMode === 'table' }
            : {}),
          ...textFieldProps?.slotProps?.input ?? {},
        },
        select: {
          MenuProps: { disableScrollLock: true },
          ...textFieldProps?.slotProps?.select ?? {},
        },
        htmlInput: {
          autoComplete: 'new-password', //disable autocomplete and autofill
          ...textFieldProps?.slotProps?.htmlInput ?? {},
        }
      }}
      onBlur={handleBlur}
      onChange={handleChange}
      onClick={(e) => {
        e.stopPropagation();
        textFieldProps?.onClick?.(e);
      }}
      onKeyDown={handleEnterKeyDown}
    >
      {textFieldProps.children ??
        selectOptions?.map((option) => {
          const { label, value } = getValueAndLabel(option);
          return (
            <MenuItem
              key={value}
              sx={{
                alignItems: 'center',
                display: 'flex',
                gap: '0.5rem',
                m: 0,
              }}
              value={value}
            >
              {label}
            </MenuItem>
          );
        })}
    </TextField>
  );
};

