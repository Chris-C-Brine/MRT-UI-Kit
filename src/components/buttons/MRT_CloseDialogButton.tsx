import {MRT_RowData} from "material-react-table";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {RTV} from "./MRT_EditActionsButtonsAlt";
import Button from "@mui/material/Button";

/**
 * Close/Cancel button component for edit actions.
 *
 * Renders a button that cancels the current row creation or editing operation.
 *
 * @template TData - The type of data in the table rows
 * @param props - The component props containing row, table, and variant
 * @returns A React component for canceling edit operations
 *
 * @example
 * ```tsx
 * // Icon button variant
 * <MRT_CloseDialogButton row={row} table={table} variant="icon" />
 *
 * // Text button variant
 * <MRT_CloseDialogButton row={row} table={table} variant="text" />
 * ```
 *
 * @todo Extend props based on variant
 */
export const MRT_CloseDialogButton = <TData extends MRT_RowData>({row, table, variant}: RTV<TData>) => {
  const {
    getState,
    options: {
      icons: {CancelIcon},
      localization,
      onCreatingRowCancel,
      onEditingRowCancel,
    },
    setCreatingRow,
    setEditingRow,
  } = table;
  const {creatingRow, editingRow} = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  /**
   * Handles the submit action for row creation or editing.
   * Gathers all input values from the form and calls the appropriate callback.
   *
   * @private
   */
  const handleCancel = () => {
    if (isCreating) {
      onCreatingRowCancel?.({row, table});
      setCreatingRow(null);
    } else if (isEditing) {
      onEditingRowCancel?.({row, table});
      setEditingRow(null);
    }
    row._valuesCache = {} as any; //reset values cache
  };

  return variant === 'icon'
    ? (
      <Tooltip title={localization.cancel}>
        <IconButton aria-label={localization.cancel} onClick={handleCancel}>
          <CancelIcon/>
        </IconButton>
      </Tooltip>
    )
    : (
      <Button onClick={handleCancel} sx={{minWidth: '100px'}}>
        {localization.cancel}
      </Button>
    );
}