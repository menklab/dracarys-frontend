export enum ElementType {
  PUB_KEY = "Pubkey",
  BOOL = "bool",
  U8 = "u8",
  U16 = "u16",
  U32 = "u32",
  U64 = "u64",
  U128 = "u128",
  I8 = "i8",
  I16 = "i16",
  I32 = "i32",
  I64 = "i64",
  I128 = "i128",
  F32 = "f32",
  F64 = "f64",
  ENUM = "Enum",
  STRUCT = "Struct",
  STRING = "String",
  TN = "[T; N]",
  VECT = "Vec<T>",
}

export interface AccountElement {
  id: number;
  name: string;
  type: ElementType;
  createdAt?: string;
  updatedAt?: string;
}
