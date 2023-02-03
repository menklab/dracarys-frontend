import { Group, Rect, Text } from "react-konva";
import useAccount from "~/components/konva/Account/useAccount";
import {
  KONVA_ACCOUNT_ATTRIBUTE_FONT_SIZE,
  KONVA_ACCOUNT_CORNER_RADIUS,
  KONVA_ACCOUNT_CROWN_HEIGHT,
  KONVA_ACCOUNT_CROWN_OFFSET_X,
  KONVA_ACCOUNT_CROWN_OFFSET_Y,
  KONVA_ACCOUNT_CROWN_SHADOW_BLUR,
  KONVA_ACCOUNT_CROWN_STROKE,
  KONVA_ACCOUNT_CROWN_WIDTH,
  KONVA_ACCOUNT_FILL,
  KONVA_ACCOUNT_NAME_FONT_SIZE,
  KONVA_ACCOUNT_STROKE_COLOR,
  KONVA_ACCOUNT_STROKE_WIDTH,
  KONVA_ACCOUNT_WIDTH,
} from "~/constants/konva";
import { Account } from "~/interfaces/account";
import { getAccountAttributesId, getAccountCrownId, getAccountGroupId, getAccountRectId } from "~/utils/konva";

export default function KonvaAccount(account: Account) {
  const {
    groupRef,
    rectRef,
    crownRef,
    nameRef,
    attributesGroupRef,
    canMove,
    onDragMove,
    onDragStart,
    onDragEnd,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onCrownMouseEnter,
    onCrownMouseLeave,
  } = useAccount(account);
  const { id, attributes, name } = account;

  return (
    <Group
      id={getAccountGroupId(id)}
      ref={groupRef}
      draggable={canMove}
      onDragMove={onDragMove}
      onDragStart={(e) => onDragStart(e.target.position())}
      onDragEnd={(e) => onDragEnd(e.target.position())}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Rect
        id={getAccountCrownId(id)}
        ref={crownRef}
        offsetX={KONVA_ACCOUNT_CROWN_OFFSET_X}
        offsetY={KONVA_ACCOUNT_CROWN_OFFSET_Y}
        width={KONVA_ACCOUNT_CROWN_WIDTH}
        height={KONVA_ACCOUNT_CROWN_HEIGHT}
        cornerRadius={KONVA_ACCOUNT_CORNER_RADIUS}
        strokeWidth={KONVA_ACCOUNT_STROKE_WIDTH}
        shadowBlur={KONVA_ACCOUNT_CROWN_SHADOW_BLUR}
        stroke={KONVA_ACCOUNT_CROWN_STROKE}
        onMouseEnter={onCrownMouseEnter}
        onMouseLeave={onCrownMouseLeave}
      />
      <Rect
        id={getAccountRectId(id)}
        ref={rectRef}
        onClick={onClick}
        fill={KONVA_ACCOUNT_FILL}
        width={KONVA_ACCOUNT_WIDTH}
        stroke={KONVA_ACCOUNT_STROKE_COLOR}
        strokeWidth={KONVA_ACCOUNT_STROKE_WIDTH}
        cornerRadius={KONVA_ACCOUNT_CORNER_RADIUS}
      />
      <Text
        ref={nameRef}
        text={name}
        onClick={onClick}
        fontSize={KONVA_ACCOUNT_NAME_FONT_SIZE}
        width={KONVA_ACCOUNT_WIDTH}
        align="center"
        wrap="none"
        ellipsis
      />
      <Group id={getAccountAttributesId(id)} ref={attributesGroupRef}>
        {attributes?.map((attribute) => (
          <Text
            key={`${id}-${attribute.name}`}
            text={`${attribute.name}: ${attribute.type}`}
            fontSize={KONVA_ACCOUNT_ATTRIBUTE_FONT_SIZE}
          />
        ))}
      </Group>
    </Group>
  );
}
