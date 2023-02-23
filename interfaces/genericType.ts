export interface GenericCustomSubType {
  id: number;
  name: string;
  type: string;
}

export interface GenericSubType {
  id: null;
  name: string;
  type: string;
}

export interface GenericType {
  predefinedProgramOptions: {
    name: string;
    options: GenericSubType[];
  };
  predefinedAccountOptions: {
    name: string;
    options: GenericSubType[];
  };
  predefinedSysvarOptions: {
    name: string;
    options: GenericSubType[];
  };
  customAccountOptions: {
    name: string;
    options: GenericCustomSubType[];
  };
}
