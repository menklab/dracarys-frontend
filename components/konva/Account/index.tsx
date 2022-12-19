import { Group, Rect, Text } from "react-konva";
import useAccount from "~/components/konva/Account/useAccount";
import {
  KONVA_ACCOUNT_ATTRIBUTE_FONT_SIZE,
  KONVA_ACCOUNT_CORNER_RADIUS,
  KONVA_ACCOUNT_NAME_FONT_SIZE,
  KONVA_ACCOUNT_STROKE_COLOR,
  KONVA_ACCOUNT_STROKE_WIDTH,
  KONVA_ACCOUNT_WIDTH,
} from "~/constants/konva";
import { Account } from "~/interfaces/account";
import { getAccountAttributesId, getAccountGroupId, getAccountRectId } from "~/utils/konva";

export default function KonvaAccount(account: Account) {
  const { groupRef, rectRef, nameRef, attributesGroupRef, canMove, onDragMove, onDragStart, onDragEnd } =
    useAccount(account);
  const { id, attributes, name } = account;

  return (
    <Group
      id={getAccountGroupId(id)}
      ref={groupRef}
      draggable={canMove}
      onDragMove={onDragMove}
      onDragStart={(e) => onDragStart(e.target.position())}
      onDragEnd={(e) => onDragEnd(e.target.position())}
    >
      <Rect
        id={getAccountRectId(id)}
        ref={rectRef}
        width={KONVA_ACCOUNT_WIDTH}
        stroke={KONVA_ACCOUNT_STROKE_COLOR}
        strokeWidth={KONVA_ACCOUNT_STROKE_WIDTH}
        cornerRadius={KONVA_ACCOUNT_CORNER_RADIUS}
      />
      <Text ref={nameRef} text={name} fontSize={KONVA_ACCOUNT_NAME_FONT_SIZE} />
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
