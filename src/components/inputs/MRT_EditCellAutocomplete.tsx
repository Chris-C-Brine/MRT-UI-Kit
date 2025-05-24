// src/components/inputs/MRT_EditCellAutocomplete.tsx
import {Autocomplete, TextField, type TextFieldProps} from "@mui/material";
import type { AutocompleteProps, AutocompleteValue } from "@mui/material";
import {getTextFieldProps, updateEditingRow } from "../../utils"
import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from "material-react-table";
import { useState, SyntheticEvent } from "react";


/**
 * Props for the MRT_EditCellAutocomplete component.
 *
 * @template TData - The type of data in the table row
 * @template TOption - The type of data in the options array
 * @template Multiple - Boolean flag for multiple selection support
 * @template DisableClearable - Boolean flag for disabling clearable functionality
 * @template FreeSolo - Boolean flag for enabling free text entry
 */
export interface MRT_EditCellAutocompleteProps<
  TData extends MRT_RowData,
  TOption = unknown,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> extends Partial<
  Omit<
    AutocompleteProps<TOption, Multiple, DisableClearable, FreeSolo>,
    "onChange"
  >
> {
  /** The cell to be edited. */
  cell: MRT_Cell<TData>;
  /** The table instance. */
  table: MRT_TableInstance<TData>;
  /** The options for the autocomplete. */
  options: readonly TOption[];
  /** Whether to show the label. */
  showLabel?: boolean;
}

/**
 * @file MRT_EditCellAutocomplete.tsx
 * @description A customized Autocomplete component for Material React Table cell editing.
 *
 * This component provides enhanced autocomplete functionality within MRT table cells,
 * allowing for single or multiple selection, custom rendering, and seamless integration
 * with Material React Table's editing workflow.
 *
 * @example
 * ```jsx
 * <MRT_EditCellAutocomplete
 *   cell={cell}
 *   table={table}
 *   options={['Option 1', 'Option 2', 'Option 3']}
 *   showLabel
 * />
 * ```
 *
 * @since 1.0.0
 */
export const MRT_EditCellAutocomplete = <
  TData extends MRT_RowData,
  TOption = unknown,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>({
  cell,
  showLabel,
  table,
  ...AutocompleteProps
}: MRT_EditCellAutocompleteProps<TData, TOption, Multiple, DisableClearable, FreeSolo>) => {
  const { columnDef } = cell.column;

  const defaultValue = !AutocompleteProps?.multiple
    ? cell.getValue<TData["options"][number]>() // Single option type
    : cell.getValue<TData["options"]>() || ([] as TData["options"]); // Multiple options type (same as options)

  const [value, setValue] = useState(defaultValue);

  const handleOnChange = (_e: SyntheticEvent, newValue: AutocompleteValue<TOption, Multiple, DisableClearable, FreeSolo>) => {
    updateEditingRow(table, cell, newValue);
    setValue(newValue);
  };

  const textFieldProps: TextFieldProps = getTextFieldProps({cell, table});

  return (
    <Autocomplete
      disabled={
        (columnDef.enableEditing instanceof Function
          ? columnDef.enableEditing(cell.row)
          : columnDef.enableEditing) === false
      }
      renderInput={(params) => (
        <TextField
          label={showLabel ? columnDef.header : undefined}
          margin="none"
          {...textFieldProps}
          {...params}
        />
      )}
      value={value}
      onChange={handleOnChange}
      {...AutocompleteProps}
    />
  );
};
