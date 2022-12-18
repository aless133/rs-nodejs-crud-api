import { IncomingMessage } from "node:http";

export interface IUserData {
  username: string;
  age: number;
  hobbies: string[];
}
export interface IUser extends IUserData {
  id: string;
}

export type TRequestHandler = (res: IncomingMessage) => Promise<IApiReturn>;

export interface IApiReturn {
  code: number;
  data: string | IUser | IUser[]; //TJSONValue;
}

export enum EDbErrors {
  INVALID_DATA = 1,
  NOT_FOUND = 2,
}

interface IError {
  code: number | EDbErrors;
  message: string;
}

type TDbMethod = (p: IApiParams) => IDbReturn;
type TDbMethodsList = "getAll" | "get";
export type TDb = Record<TDbMethodsList, TDbMethod>;

export interface IDbReturn {
  err?: IError;
  data?: undefined | IUser | IUser[];
}

export interface IParsedRequest {
  err?: IError;
  api?: IApiCall;
}

export interface IApiParams {
  params?: Record<string, string>;
  data?: IUser; //TJSONValue;
}
export interface IApiCall extends IApiParams {
  method: TDbMethodsList;
}

export interface IProcessMsg {
  action: string;
  payload: IDbReturn | IApiCall;
}

// export type TJSONPrimitive = string | number | boolean | null;
// // export type TJSONArray = TJSONValue[];
// // export type TJSONValue = TJSONPrimitive | TJSONObject | TJSONArray;
// export type TJSONObject = Record<string, TJSONPrimitive | TJSONPrimitive[]>;
// export type TJSONArray = TJSONObject[];
// export type TJSONValue = TJSONPrimitive | TJSONObject | TJSONArray;

// export type TJSONValue = string | number | boolean | null | TJSONObject | TJSONArray;
// type TJSONObject = Record<string, TJSONValue>;
// // type TJSONObject = { [member: string]: TJSONValue };
// type TJSONArray = TJSONValue[];

// export type TJSONPrimitive = string | number | boolean | null;
// export type TJSONValue = TJSONPrimitive | TJSONObject | TJSONArray;
// export type TJSONObject = { [member: string]: TJSONValue };
// export type TJSONArray = TJSONValue[];
// // eslint-disable-next-line
// export interface TJSONArray extends Array<TJSONValue> {}
