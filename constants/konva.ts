import { Position } from "~/interfaces/position";

export const KONVA_ACCOUNT_WIDTH = 200;
export const KONVA_ACCOUNT_STROKE_WIDTH = 2;
export const KONVA_ACCOUNT_CORNER_RADIUS = 4;
export const KONVA_ACCOUNT_HEADER_HEIGHT = 40;

export const KONVA_ACCOUNT_CROWN_OFFSET_X = 10;
export const KONVA_ACCOUNT_CROWN_OFFSET_Y = 10;
export const KONVA_ACCOUNT_CROWN_STROKE_WIDTH = 6;
export const KONVA_ACCOUNT_CROWN_WIDTH = KONVA_ACCOUNT_WIDTH + KONVA_ACCOUNT_CROWN_OFFSET_X * 2;
export const KONVA_ACCOUNT_CROWN_HEIGHT = KONVA_ACCOUNT_HEADER_HEIGHT + KONVA_ACCOUNT_CROWN_OFFSET_Y * 2;
export const KONVA_ACCOUNT_CROWN_SHADOW_BLUR = 4;
export const KONVA_ACCOUNT_DEFAULT_POSITION: Position = { x: 10, y: 10 };
export const KONVA_ACCOUNT_NAME_FONT_SIZE = 16;
export const KONVA_ACCOUNT_ATTRIBUTE_HEIGHT = 20;
export const KONVA_ACCOUNT_ATTRIBUTE_FONT_SIZE = 12;
export const KONVA_CONNECTION_STROKE_WIDTH = 6;
export const KONVA_CONNECTION_OFFSET = 10;
export const KONVA_ACCOUNT_GROUP_MAKER_ID = "account-group";
export const KONVA_ACCOUNT_RECT_MAKER_ID = "account-rect";
export const KONVA_ACCOUNT_CROWN_MAKER_ID = "account-crown";
export const KONVA_ACCOUNT_ATTRIBUTES_MAKER_ID = "account-attributes";
export const KONVA_CONNECTION_MAKER_ID = "connection";
export const KONVA_DEFAULT_STAGE_POSITION: Position = { x: 0, y: 0 };
export const KONVA_DEFAULT_STAGE_SCALE = 1;
