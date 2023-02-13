import { ArrowDropDown, ArrowDropUp, Check, Delete, Loop } from "@mui/icons-material";
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
  ThemeProvider,
} from "@mui/material";
import { Arrow, Group } from "react-konva";
import { Html } from "react-konva-utils";
import useConnection from "~/components/konva/Connection/useConnection";
import { KONVA_CONNECTION_STROKE_WIDTH } from "~/constants/konva";
import { useTheme } from "~/contexts/theme/hooks";
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
    fromOptionIsDisabled,
    toOptionIsDisabled,
    handleFromMenuItemClick,
    handleToClose,
    handleToMenuItemClick,
  } = useConnection(from, to);
  const {
    data: { theme },
  } = useTheme();

  return (
    <Group>
      <Arrow
        ref={arrowRef}
        id={getConnectionId(from, to)}
        fill={theme.palette.text.primary}
        stroke={theme.palette.text.primary}
        strokeWidth={KONVA_CONNECTION_STROKE_WIDTH}
        onMouseEnter={onArrowMouseEnter}
        onMouseLeave={onArrowMouseLeave}
        onClick={onArrowClick}
        points={points}
      />
      {isOpened && (
        <Html transformFunc={htmlTransformFunc}>
          <ThemeProvider theme={theme}>
            <ButtonGroup size="small" ref={buttonGroupRef} variant="contained" aria-label="contained button group">
              <Button onClick={reverseConnection} disabled={fromOpen || toOpen}>
                <Loop fontSize="small" />
              </Button>
              <Button
                disabled={toOpen}
                aria-controls={fromOpen ? "split-button-menu" : undefined}
                aria-expanded={fromOpen ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleFromToggle}
                endIcon={fromOpen ? <ArrowDropUp /> : <ArrowDropDown />}
              >
                From
              </Button>
              <Button
                disabled={fromOpen}
                aria-controls={toOpen ? "split-button-menu" : undefined}
                aria-expanded={toOpen ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToToggle}
                endIcon={toOpen ? <ArrowDropUp /> : <ArrowDropDown />}
              >
                To
              </Button>
              <Button onClick={deleteConnection} disabled={fromOpen || toOpen}>
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
                            disabled={fromOptionIsDisabled(account)}
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
                            disabled={toOptionIsDisabled(account)}
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
          </ThemeProvider>
        </Html>
      )}
    </Group>
  );
}
