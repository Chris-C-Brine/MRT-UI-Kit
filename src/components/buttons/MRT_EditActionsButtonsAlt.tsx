/**
 * @file MRT_EditActionsButtonsAlt.tsx
 * @description Alternative edit action buttons for Material React Table.
 *
 * This module provides customized action buttons for row editing operations
 * in Material React Table (MRT). It includes a main component that renders
 * both cancel and submit buttons, as well as individual button components.
 */

import Box, {type BoxProps} from '@mui/material/Box';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from 'material-react-table';
import {parseFromValuesOrFunc} from "material-react-table/src/utils/utils";
import {MRT_CloseDialogButton} from "./MRT_CloseDialogButton";
import {MRT_SubmitDialogButton} from "./MRT_SubmitDialogButton";

/**
 * Base type for components that need row, table, and variant information.
 *
 * @template TData - The type of data in the table rows
 */
export type RTV<TData extends MRT_RowData> = {
  /** The current row being edited */
  row: MRT_Row<TData>;
  /** The table instance */
  table: MRT_TableInstance<TData>;
  /** Button display style - either icon buttons or text buttons */
  variant?: 'icon' | 'text';
}

/**
 * Props for the MRT_EditActionButtonsAlt component.
 *
 * @template TData - The type of data in the table rows
 * @extends BoxProps - Inherits all properties from MUI Box component
 * @extends RTV<TData> - Includes row, table, and variant properties
 */
export interface MRT_EditActionButtonsAltProps<TData extends MRT_RowData> extends BoxProps, RTV<TData> {
  /** Option to hide the submit-button (useful for view-only mode) */
  hideSubmitButton?: boolean;
}
/**
 * Alternative edit action buttons component for Material React Table.
 *
 * Renders a container with cancel and submit buttons for row editing operations.
 * The buttons can be displayed as either icon buttons or text buttons based on the variant prop.
 *
 * @template TData - The type of data in the table rows
 * @param props - The component props
 * @returns A React component with edit action buttons
 *
 * @example
 * ```tsx
 * <MRT_EditActionButtonsAlt
 *   row={row}
 *   table={table}
 *   variant="text"
 *   hideSubmitButton={isViewOnly}
 * />
 * ```
 */
export const MRT_EditActionButtonsAlt = <TData extends MRT_RowData>(
  {
    row,
    table,
    variant = 'icon',
    hideSubmitButton,
    ...rest
  }: MRT_EditActionButtonsAltProps<TData>) => {

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={(theme) => ({
        display: 'flex',
        gap: '0.75rem',
        ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
      })}
    >
      <MRT_CloseDialogButton row={row} table={table} variant={variant}/>
      {!hideSubmitButton && <MRT_SubmitDialogButton row={row} table={table} variant={variant}/>}
    </Box>
  );
};



