import DeleteOutline from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { IconButton } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import type { Identifier, XYCoord } from "dnd-core";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Controller } from "react-hook-form";
import { useInstructionPage } from "~/components/pages/InstructionPage/context";
import { useTheme } from "~/contexts/theme/hooks";
import { AccountType } from "~/enums/instructionElementTypes";
import { GenericCustomSubType, GenericSubType, GenericType } from "~/interfaces/genericType";

interface TableLineProps {
  id: number;
  idx: number;
  fieldsLength: number;
  field: any;
  errors: any;
  register: any;
  control: any;
  isLoading: boolean;
  onDelete: (idx: number) => Promise<void>;
  moveRow: (dragIndex: number, hoverIndex: number) => void | null;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export default function TableLine({
  id,
  idx,
  fieldsLength,
  field,
  errors,
  register,
  control,
  isLoading,
  moveRow,
  onDelete,
}: TableLineProps) {
  const { genericTypes } = useInstructionPage();

  const ref = useRef(null);
  const {
    data: { theme },
  } = useTheme();

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover: function (item, monitor) {
      if (!item.id || fieldsLength - 1 === idx) {
        return;
      }
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = idx;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      // @ts-ignore
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      dragIndex !== undefined && moveRow(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, idx };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <TableRow
      data-handler-id={handlerId}
      ref={ref}
      key={`instruction-element-${idx}`}
      sx={{
        ...(fieldsLength - 1 === idx ? { backgroundColor: theme.palette.divider } : {}),
        "&:last-child ttyped, &:last-child th": { border: 0 },
      }}
    >
      <TableCell align="center">
        <DragIndicatorIcon />
      </TableCell>
      <TableCell align="center" sx={{ width: "20%" }}>
        <TextField
          fullWidth
          inputProps={{ style: { textAlign: "center" } }}
          error={!!errors.elements?.[idx]?.name}
          helperText={errors.elements?.[idx]?.name?.message}
          {...register(`elements.${idx}.name`)}
        />
      </TableCell>
      <TableCell align="center" sx={{ width: "20%" }}>
        <FormControl fullWidth error={!!errors.elements?.[idx]?.accountType}>
          <Select native fullWidth defaultValue={field.accountType} {...register(`elements.${idx}.accountType`)}>
            <option aria-label="None" value="" disabled />
            {Object.keys(AccountType).map((keyAccountLabel) => (
              <option
                key={`account-type-${keyAccountLabel}`}
                value={AccountType[keyAccountLabel as keyof typeof AccountType]}
              >
                {AccountType[keyAccountLabel as keyof typeof AccountType]}
              </option>
            ))}
          </Select>
          <FormHelperText>{errors.elements?.[idx]?.accountType?.message}</FormHelperText>
        </FormControl>
      </TableCell>
      <TableCell align="center" sx={{ width: "20%" }}>
        <FormControl fullWidth error={!!errors.elements?.[idx]?.genericType}>
          <Select native fullWidth defaultValue={field.genericType} {...register(`elements.${idx}.genericType`)}>
            <option aria-label="None" value="" disabled />
            {Object.keys(genericTypes).map((genType) => (
              <optgroup key={`generic-type-${genType}`} label={genericTypes[genType as keyof GenericType].name}>
                {genericTypes[genType as keyof GenericType].options.map(
                  (subType: GenericSubType | GenericCustomSubType) => (
                    <option
                      key={`generic-subtype-${genericTypes[genType as keyof GenericType].name}-${subType.name}`}
                      value={subType.name}
                    >
                      {subType.name}
                    </option>
                  )
                )}
              </optgroup>
            ))}
          </Select>
          <FormHelperText>{errors.elements?.[idx]?.genericType?.message}</FormHelperText>
        </FormControl>
      </TableCell>
      <TableCell align="center" sx={{ width: "10%" }}>
        <Controller
          name={`elements.${idx}.mut`}
          control={control}
          defaultValue={field.mut}
          render={({ field: mutField }) => (
            <FormControlLabel
              control={<Checkbox inputProps={{ style: { textAlign: "center" } }} {...mutField} checked={!!field.mut} />}
              label={!!field.mut ? "Yes" : "No"}
              labelPlacement="start"
            />
          )}
        />
      </TableCell>
      <TableCell align="center" sx={{ width: "20%" }}>
        <TextField
          fullWidth
          inputProps={{ style: { textAlign: "center" } }}
          error={!!errors.elements?.[idx]?.description}
          helperText={errors.elements?.[idx]?.description?.message}
          {...register(`elements.${idx}.description`)}
        />
      </TableCell>
      <TableCell align="center" sx={{ width: "5%" }}>
        <IconButton disabled={idx === fieldsLength - 1 || isLoading} onClick={() => onDelete(idx)}>
          <DeleteOutline />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
