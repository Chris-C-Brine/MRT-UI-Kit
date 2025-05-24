import {MRT_RowData} from "material-react-table";
import {RTV} from "./MRT_EditActionsButtonsAlt";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

/**
 * Submit button component for edit and create operations in dialog mode.
 *
 * This component renders either an icon button or a text button based on the variant prop.
 * It handles saving data for both creating new rows and editing existing ones.
 *
 * @template TData - The type of data in the table rows
 * @param props - Component props including row, table, and display variant
 * @returns A React component that renders a submit button appropriate for the current context
 *
 * @example
 * ```tsx
 * // Icon button variant
 * <MRT_SubmitDialogButton row={row} table={table} variant="icon" />
 *
 * // Text button variant
 * <MRT_SubmitDialogButton row={row} table={table} variant="text" />
 * ```
 *
 * @todo Extend props based on variant
 */
export const MRT_SubmitDialogButton = <TData extends MRT_RowData>({row, table, variant}: RTV<TData>) => {
  const {
    getState,
    options: {
      icons: {SaveIcon},
      localization,
      onCreatingRowSave,
      onEditingRowSave,
    },
    refs: {editInputRefs},
    setCreatingRow,
    setEditingRow,
  } = table;
  const {creatingRow, editingRow, isSaving} = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  /**
   * Handles the submission of row data.
   *
   * This function:
   * 1. Collects autofilled input values
   * 2. Calls the appropriate save handler based on the current mode (create/edit)
   * 3. Provides callbacks to exit the editing/creating mode
   *
   * @private
   */
  const handleSubmitRow = () => {
    //look for autofilled input values
    Object.values(editInputRefs.current ?? {})
    .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
    ?.forEach((input) => {
      if (
        input.value !== undefined &&
        Object.hasOwn(row?._valuesCache as object, input.name)
      ) {
        // @ts-expect-error
        row._valuesCache[input.name] = input.value;
      }
    });
    if (isCreating)
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    else if (isEditing) {
      onEditingRowSave?.({
        exitEditingMode: () => setEditingRow(null),
        row,
        table,
        values: row?._valuesCache,
      });
    }
  }

  return variant === 'icon' ? (
    <>
      {(
        (isCreating && onCreatingRowSave) || (isEditing && onEditingRowSave)
      ) && (
        <Tooltip title={localization.save}>
          <IconButton
            aria-label={localization.save}
            color="info"
            disabled={isSaving}
            onClick={handleSubmitRow}
          >
            {isSaving ? <CircularProgress size={18}/> : <SaveIcon/>}
          </IconButton>
        </Tooltip>
      )}
    </>
  ) : (
    <>
      <Button
        disabled={isSaving}
        onClick={handleSubmitRow}
        sx={{minWidth: '100px'}}
        variant="contained"
      >
        {isSaving && <CircularProgress color="inherit" size={18}/>}
        {localization.save}
      </Button>
    </>
  );
}