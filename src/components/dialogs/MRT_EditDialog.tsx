import {DialogTitle, DialogContent, DialogActions, Box, InputLabel} from "@mui/material";
import type {MRT_RowData} from "material-react-table";
import {AutoGrid, type AutoGridProps} from "@chris-c-brine/autogrid";
import {isValidElement, ReactElement, ReactNode, useMemo} from "react";
import {MRT_EditActionButtonsAlt, RTV} from "../buttons";
import {MRT_EditCellTextFieldProps} from "../inputs";

export type MRT_EditDialogProps<TData extends MRT_RowData> = AutoGridProps & RTV<TData>;

/**
 * Usage Example (2 columns):
 * ```tsx
 *   const table = useMaterialReactTable({
 *     renderEditRowDialogContent: ({ table, row, internalEditComponents }) =>
 *     (<MRT_EditDialog table={table} row={row} components={internalEditComponents} columnCount={2} />),
 *     ...
 *   });
 * ```
 **/
export const MRT_EditDialog = <TData extends MRT_RowData>(
  {
    table,
    row,
    components,
    variant = "text",
    ...autoGridProps
  }: MRT_EditDialogProps<TData>) => {
  const mode = row.id == "mrt_create_row" ? "create" : row.id.endsWith("_view") ? "view" : "edit";
  const dialogTitle = mode == "create" ? "Create" : mode == "view" ? "View" : "Edit";

  const viewOnlyComponents = useMemo(() => {
    return (
      table
      .getAllColumns()
      // Data only --(groups && utility columns)
      .filter((column) => column.columnDef.columnDefType == "data")
      // Make into pretty readable components
      .map((column) => {
        // Use column header as title
        const header = column.columnDef.header ?? column.header;

        // Get the cell for this column in the current row
        const cell = row.getAllCells().find((c) => c.column.id === column.id);
        if (!cell) return null;

        // Render the cell value the same way MRT would in the table
        const value = cell.getValue<TData>();
        const renderedCellValue = value !== null && value !== undefined ? String(value) : "";

        const displayContent: ReactNode = column.columnDef.Cell
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

        return (
          <Box key={column.id} sx={{mb: 2}}>
            <InputLabel id={`${column.id}-label`} sx={{fontWeight: "bold", mb: 0.5}}>
              {header}
            </InputLabel>
            <Box sx={{pt: 0.5}}>{displayContent}</Box>
          </Box>
        );
      })
      .filter(Boolean)
    );
  }, [table, row]);

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

      return rendered !== null;
    });
  }, [components]);

  return (
    <>
      <DialogTitle textAlign="center">{dialogTitle}</DialogTitle>
      <DialogContent>
        <AutoGrid
          justifyItems={"baseline"}
          columnSpacing={5}
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
