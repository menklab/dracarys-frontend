import { ArrowDropDown, Check, Delete, Loop } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { Arrow, Group } from "react-konva";
import { Html } from "react-konva-utils";
import useConnection from "~/components/konva/Connection/useConnection";
import {
  KONVA_CONNECTION_FILL_COLOR,
  KONVA_CONNECTION_STROKE_COLOR,
  KONVA_CONNECTION_STROKE_WIDTH,
} from "~/constants/konva";
import { getConnectionId } from "~/utils/konva";

interface ConnectionProps {
  from: number;
  to: number;
}

export default function KonvaConnection({ from, to }: ConnectionProps) {
  const {
    arrowRef,
    onArrowMouseEnter,
    onArrowMouseLeave,
    onArrowClick,
    points,
    isOpened,
    htmlTransformFunc,
    buttonGroupRef,
    reverseConnection,
    fromOpen,
    handleFromToggle,
    toOpen,
    handleToToggle,
    deleteConnection,
    handleFromClose,
    accounts,
    handleFromMenuItemClick,
    handleToClose,
    handleToMenuItemClick,
  } = useConnection(from, to);

  return (
    <Group>
      <Arrow
        ref={arrowRef}
        id={getConnectionId(from, to)}
        stroke={KONVA_CONNECTION_STROKE_COLOR}
        strokeWidth={KONVA_CONNECTION_STROKE_WIDTH}
        fill={KONVA_CONNECTION_FILL_COLOR}
        onMouseEnter={onArrowMouseEnter}
        onMouseLeave={onArrowMouseLeave}
        onClick={onArrowClick}
        points={points}
      />
      {isOpened && (
        <Html transformFunc={htmlTransformFunc}>
          <ButtonGroup
            size="small"
            ref={buttonGroupRef}
            variant="outlined"
            sx={{ bgcolor: "white" }}
            aria-label="contained button group"
          >
            <Button onClick={reverseConnection}>
              <Loop fontSize="small" />
            </Button>
            <Button
              aria-controls={fromOpen ? "split-button-menu" : undefined}
              aria-expanded={fromOpen ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleFromToggle}
              endIcon={<ArrowDropDown />}
            >
              From
            </Button>
            <Button
              aria-controls={toOpen ? "split-button-menu" : undefined}
              aria-expanded={toOpen ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToToggle}
              endIcon={<ArrowDropDown />}
            >
              To
            </Button>
            <Button onClick={deleteConnection}>
              <Delete fontSize="small" />
            </Button>
          </ButtonGroup>
          <Popper
            sx={{ zIndex: 1 }}
            open={fromOpen}
            anchorEl={buttonGroupRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleFromClose}>
                    <MenuList id="split-button-menu" dense autoFocusItem>
                      {accounts.map((account) => (
                        <MenuItem
                          key={account.id}
                          disabled={account.id === from || account.id === to}
                          selected={account.id === from}
                          onClick={() => handleFromMenuItemClick(account.id)}
                        >
                          {account.id === from ? (
                            <>
                              <ListItemIcon>
                                <Check />
                              </ListItemIcon>
                              {account.name}
                            </>
                          ) : (
                            <ListItemText inset>{account.name}</ListItemText>
                          )}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <Popper
            sx={{ zIndex: 1 }}
            open={toOpen}
            anchorEl={buttonGroupRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleToClose}>
                    <MenuList id="split-button-menu" dense autoFocusItem>
                      {accounts.map((account) => (
                        <MenuItem
                          key={account.id}
                          disabled={account.id === to || account.id === from}
                          selected={account.id === to}
                          onClick={() => handleToMenuItemClick(account.id)}
                        >
                          {account.id === to ? (
                            <>
                              <ListItemIcon>
                                <Check />
                              </ListItemIcon>
                              {account.name}
                            </>
                          ) : (
                            <ListItemText inset>{account.name}</ListItemText>
                          )}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Html>
      )}
    </Group>
  );
}
