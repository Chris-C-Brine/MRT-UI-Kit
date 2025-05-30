import {DialogTitle, DialogContent, DialogActions, Box, InputLabel} from "@mui/material";
import type {MRT_RowData, MRT_Cell, MRT_Column, MRT_Row, MRT_TableInstance} from "material-react-table";
import {AutoGrid, type AutoGridProps} from "@chris-c-brine/autogrid";
import {isValidElement, ReactElement, ReactNode, useMemo} from "react";
import {MRT_EditActionButtonsAlt, RTV} from "../buttons";
import {MRT_EditCellTextFieldProps} from "../inputs";

/**
 * Parameters for the renderViewComponent function
 * @interface RenderViewComponentParams
 * @template TData - The data type for the table row
 */
interface RenderViewComponentParams<TData extends MRT_RowData> extends Pick<RTV<TData>, 'table'> {
  /** The cell being rendered */
  cell: MRT_Cell<TData>,
  /** The title/header for the cell */
  title: string,
  /** The rendered cell content */
  renderedComponent: ReactNode,
}

/**
 * Type helper for column.Edit's params
 * @example
 * ```tsx
 *   Edit: ({ table, cell }: MRT_ColumnFunctionProps<UserType>) =>
 *     (<MRT_EditCellTextarea
 *       label="Name"
 *       key={`name-${cell.row.id}`}
 *       table={table}
 *       cell={cell}
 *     />),
 * ```
 */
export interface MRT_ColumnFunctionProps<TData extends MRT_RowData, TValue = unknown> {
  /** The cell being edited */
  cell: MRT_Cell<TData, TValue>;
  /** column definition for editing cell */
  column: MRT_Column<TData, TValue>;
  /** The row of the editing cell */
  row: MRT_Row<TData>;
  /** The current table instance */
  table: MRT_TableInstance<TData>;
}

/**
 * Props for the MRT_EditDialog component
 * @interface MRT_EditDialogProps
 * @template TData - The data type for the table row
 */
export type MRT_EditDialogProps<TData extends MRT_RowData> = AutoGridProps & RTV<TData> & {
  /**
   * Custom renderer for view mode components
   * @param params - Object containing cell, title, and renderedComponent
   * @returns ReactNode - The custom rendered component
   */
  renderViewComponent?: (params: RenderViewComponentParams<TData>) => ReactNode,
};

/**
 * MRT_EditDialog - A dialog component for editing, creating, and viewing table rows
 *
 * This component provides a full-featured dialog that can be used in three modes:
 * - Edit mode: For modifying existing rows
 * - Create mode: For adding new rows
 * - View mode: For viewing row details in a read-only format
 *
 * The component integrates with AutoGrid for responsive layouts and supports
 * custom rendering of view components through the renderViewComponent prop.
 *
 * Usage Example (2 columns):
 * ```tsx
 *   const table = useMaterialReactTable({
 *     renderEditRowDialogContent: ({ table, row, internalEditComponents }) =>
 *     (<MRT_EditDialog table={table} row={row} components={internalEditComponents} columnCount={2} />),
 *     ... rest of table options
 *   });
 * ```
 *
 * View-only mode example:
 * ```tsx
 * import { setViewingRow } from '@chris-c-brine/mrt-ui-kit';
 *
 * // Inside your component
 * <Button onClick={() => setViewingRow({ table, row })}>
 *   View Details
 * </Button>
 * ```
 **/
export const MRT_EditDialog = <TData extends MRT_RowData>(
  {
    table,
    row,
    components,
    variant = "text",
    renderViewComponent,
    ...autoGridProps
  }: MRT_EditDialogProps<TData>) => {
  const mode = row.id == "mrt-create-row" ? "create" : row.id == "mrt-view-row" ? "view" : "edit";
  const dialogTitle = mode == "create" ? "Create" : mode == "view" ? "View" : "Edit";

  const viewOnlyComponents = useMemo(() => {
    if (mode !== 'view') return [];
    return (
      table
      .getAllColumns()
      // Data only --(groups && utility columns)
      .filter((column) => column.columnDef.columnDefType == "data")
      // Make into pretty readable components
      .map((column) => {
        // Use column header as title
        const title = column.columnDef.header ?? column.header;

        // Get the cell for this column in the current row
        const cell = row.getAllCells().find((c) => c.column.id === column.id);
        if (!cell) return null;

        // Render the cell value the same way MRT would in the table
        const value = cell.getValue<TData>();
        const renderedCellValue = value !== null && value !== undefined ? String(value) : "";

        const renderedComponent: ReactNode = column.columnDef.Cell
          // If there's a custom Cell renderer, use it with all required parameters
          ? column.columnDef.Cell({
            cell,
            column,
            row,
            table,
            renderedCellValue,
          })
          // If there's a custom accessorFn, use it
          : column.columnDef.accessorFn
            ? column.columnDef.accessorFn(row.original) as ReactNode
            // Otherwise use the raw value
            : renderedCellValue;

        // Provided > Default
        if (renderViewComponent) return renderViewComponent({cell, table, title, renderedComponent});

        return (
          <Box key={column.id} sx={{mb: 2}}>
            <InputLabel id={`${column.id}-label`} sx={{fontWeight: "bold", mb: 0.5}}>
              {title}
            </InputLabel>
            <Box sx={{pt: 0.5}}>{renderedComponent}</Box>
          </Box>
        );
      })
      .filter(Boolean)
    );
  }, [table, row, mode]);

  const filteredComponents = useMemo(() => {
    if (!components) return [];

    return components.filter((component): component is ReactElement => {
      // Check if the component exists and is a valid React element with children
      if (!isValidElement(component)) return false;

      const ComponentElement = component as ReactElement;
      const props = ComponentElement.props as MRT_EditCellTextFieldProps<TData>;

      if (props === null || props === undefined) return false;

      const rendered = props.cell.column.columnDef?.Edit?.({
        cell: props.cell,
        column: props.cell.column,
        row: props.cell.row,
        table
      });

      // Check if Edit: () => null
      return rendered !== null;
    });
  }, [components]);

  return (
    <>
      <DialogTitle textAlign="center">{dialogTitle}</DialogTitle>
      <DialogContent>
        <AutoGrid
          justifyItems={"baseline"}
          {...autoGridProps}
          components={mode == "view" ? viewOnlyComponents : filteredComponents}
        />
      </DialogContent>
      <DialogActions>
        <MRT_EditActionButtonsAlt variant={variant} table={table} row={row} hideSubmitButton={mode === "view"}/>
      </DialogActions>
    </>
  );
};
