import { DialogTitle, DialogContent, DialogActions, Box, InputLabel } from "@mui/material";
import {
  MRT_EditActionButtons,
  type MRT_Row,
  type MRT_TableInstance,
  type MRT_RowData,
} from "material-react-table";
import { AutoGrid, type AutoGridProps } from "@chris-c-brine/autogrid";
import { ReactNode, useMemo } from "react";

export type MRT_EditDialogProps<TData extends MRT_RowData> = AutoGridProps & {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
};

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
export const MRT_EditDialog = <TData extends MRT_RowData>({
  table,
  row,
  components,
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
              ? column.columnDef.accessorFn(value) as ReactNode
              // Otherwise use the raw value
              : renderedCellValue;

          return (
            <Box key={column.id} sx={{ mb: 2 }}>
              <InputLabel id={`${column.id}-label`} sx={{ fontWeight: "bold", mb: 0.5 }}>
                {header}
              </InputLabel>
              <Box sx={{ pt: 0.5 }}>{displayContent}</Box>
            </Box>
          );
        })
        .filter(Boolean)
    );
  }, [table, row]);

  return (
    <>
      <DialogTitle textAlign="center">{dialogTitle}</DialogTitle>
      <DialogContent>
        <AutoGrid
          justifyItems={"baseline"}
          columnSpacing={5}
          {...autoGridProps}
          components={mode == "view" ? viewOnlyComponents : components}
        />
      </DialogContent>
      <DialogActions>
        <MRT_EditActionButtons variant="text" table={table} row={row} />
      </DialogActions>
    </>
  );
};
