import { Server, IncomingMessage, IncomingHttpHeaders } from "node:http";

export interface IUserData {
  username: string;
  age: number;
  hobbies: string[];
}
export interface IUser extends IUserData {
  id: string;
}

export type TRequestHandler = (res: IncomingMessage) => Promise<IApiReturn>;

interface IApiError {
  error: IError;
}
export interface IApiReturn {
  code: number;
  data: string | IApiError | IUser | IUser[];
  headers?: IncomingHttpHeaders;
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
type TDbMethodsList = "getAll" | "get" | "create" | "update" | "delete";
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
  params: {
    userId?: string;
  };
  data?: IUser;
}
export interface IApiCall extends IApiParams {
  method: TDbMethodsList;
}

export interface IProcessMsg {
  action: string;
  send: IApiCall;
  recv?: IDbReturn;
  resolveId?: string;
}

export type TAppStart = ({ isSingle, port }: { isSingle: boolean; port: number }) => Server;
