import Konva from "konva";
import { IRect } from "konva/lib/types";
import {
  KONVA_ACCOUNT_ATTRIBUTES_MAKER_ID,
  KONVA_ACCOUNT_ATTRIBUTE_FONT_SIZE,
  KONVA_ACCOUNT_ATTRIBUTE_HEIGHT,
  KONVA_ACCOUNT_CROWN_MAKER_ID,
  KONVA_ACCOUNT_GROUP_MAKER_ID,
  KONVA_ACCOUNT_HEADER_HEIGHT,
  KONVA_ACCOUNT_NAME_FONT_SIZE,
  KONVA_ACCOUNT_RECT_MAKER_ID,
  KONVA_CONNECTION_MAKER_ID,
  KONVA_CONNECTION_OFFSET,
} from "~/constants/konva";
import { Cursor } from "~/enums/cursor";
import { Account } from "~/interfaces/account";
import { Connection } from "~/interfaces/connection";
import { Position } from "~/interfaces/position";
import { Line } from "~/types/konva";

export const getAccountGroupId = (accountId: number) => `${KONVA_ACCOUNT_GROUP_MAKER_ID}-${accountId}`;
export const getAccountRectId = (accountId: number) => `${KONVA_ACCOUNT_RECT_MAKER_ID}-${accountId}`;
export const getAccountCrownId = (accountId: number) => `${KONVA_ACCOUNT_CROWN_MAKER_ID}-${accountId}`;
export const getAccountAttributesId = (accountId: number) => `${KONVA_ACCOUNT_ATTRIBUTES_MAKER_ID}-${accountId}`;
export const getConnectionId = (from: number, to: number) => `${KONVA_CONNECTION_MAKER_ID}-${from}-${to}`;

export const calculateAccountRectHeight = (attributesCount: number): number => {
  if (attributesCount <= 0) return KONVA_ACCOUNT_HEADER_HEIGHT;
  return attributesCount * KONVA_ACCOUNT_ATTRIBUTE_HEIGHT + KONVA_ACCOUNT_HEADER_HEIGHT;
};

export const calculateCenteredAccountNamePosition = (rect: Konva.Rect, name: Konva.Text): Position => {
  return {
    x: rect.width() / 2 - name.width() / 2,
    y: rect.y() + KONVA_ACCOUNT_HEADER_HEIGHT / 2 - KONVA_ACCOUNT_NAME_FONT_SIZE / 2,
  };
};

export const calculateCenteredAttributeNamePosition = (rect: Konva.Rect, attributeOrder: number): Position => {
  return {
    x: rect.x() + KONVA_ACCOUNT_ATTRIBUTE_HEIGHT,
    y:
      rect.y() +
      attributeOrder * KONVA_ACCOUNT_ATTRIBUTE_HEIGHT +
      KONVA_ACCOUNT_HEADER_HEIGHT / 2 -
      KONVA_ACCOUNT_ATTRIBUTE_FONT_SIZE / 2,
  };
};

const calculatePointsForConnection_QUADRANT_BASED = (from: IRect, to: IRect): Line => {
  const origin: Position = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
  const coords: Position = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
  // 45 is a rotational offset to shift quadrants by 45 degrees
  const degrees = (360 + 45 - (Math.atan2(coords.y - origin.y, coords.x - origin.x) * 180) / Math.PI) % 360;
  const quadrant = Math.trunc(degrees / 90) + 1;

  switch (quadrant) {
    case 1:
      return [
        from.x + from.width + KONVA_CONNECTION_OFFSET,
        from.y + from.height / 2,
        to.x - KONVA_CONNECTION_OFFSET,
        to.y + to.height / 2,
      ];
    case 2:
      return [
        from.x + from.width / 2,
        from.y - KONVA_CONNECTION_OFFSET,
        to.x + to.width / 2,
        to.y + to.height + KONVA_CONNECTION_OFFSET,
      ];
    case 3:
      return [
        from.x - KONVA_CONNECTION_OFFSET,
        from.y + from.height / 2,
        to.x + to.width + KONVA_CONNECTION_OFFSET,
        to.y + to.height / 2,
      ];
    case 4:
      return [
        from.x + from.width / 2,
        from.y + from.height + KONVA_CONNECTION_OFFSET,
        to.x + to.width / 2,
        to.y - KONVA_CONNECTION_OFFSET,
      ];
    default:
      throw new Error("Invalid quadrant");
  }
};

const calculateRectangleBorderPoint = (radians: number, size: IRect, sideOffset: number = 0) => {
  const width = size.width + sideOffset * 2;
  const height = size.height + sideOffset * 2;

  radians %= 2 * Math.PI;
  if (radians < 0) radians += Math.PI * 2;

  const phi = Math.atan(height / width);
  let x, y;
  if ((radians >= 2 * Math.PI - phi && radians <= 2 * Math.PI) || (radians >= 0 && radians <= phi)) {
    x = width / 2;
    y = Math.tan(radians) * x;
  } else if (radians >= phi && radians <= Math.PI - phi) {
    y = height / 2;
    x = y / Math.tan(radians);
  } else if (radians >= Math.PI - phi && radians <= Math.PI + phi) {
    x = -width / 2;
    y = Math.tan(radians) * x;
  } else if (radians >= Math.PI + phi && radians <= 2 * Math.PI - phi) {
    y = -height / 2;
    x = y / Math.tan(radians);
  }

  return { x: -Math.round(x || 0), y: Math.round(y || 0) };
};

const calculatePointsForConnection_SHAPE_BASED = (from: IRect, to: IRect): Line => {
  const origin: Position = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
  const coords: Position = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
  const dx = origin.x - coords.x;
  const dy = origin.y - coords.y;
  const angle = Math.atan2(-dy, dx);
  const startOffset = calculateRectangleBorderPoint(angle + Math.PI, from, KONVA_CONNECTION_OFFSET);
  const endOffset = calculateRectangleBorderPoint(angle, to, KONVA_CONNECTION_OFFSET);
  return [origin.x - startOffset.x, origin.y - startOffset.y, coords.x - endOffset.x, coords.y - endOffset.y];
};

export const calculatePointsForConnection = (from: IRect, to: IRect): Line => {
  return calculatePointsForConnection_SHAPE_BASED(from, to);
};

export const setCursorOnStage = (stage: Konva.Stage, cursor: Cursor) => {
  stage.container().style.cursor = cursor;
};

export const getUnrelatedConnections = (accounts: Account[], fromAccountId: number, toAccountId: number) =>
  accounts.reduce(
    (prev: Connection[], curr) =>
      [fromAccountId, toAccountId].includes(curr.id) ||
      curr.linkedAccounts.includes(fromAccountId) ||
      curr.linkedAccounts.includes(toAccountId)
        ? prev
        : [...prev, ...curr.linkedAccounts.map((to) => ({ from: curr.id, to }))],
    []
  );
