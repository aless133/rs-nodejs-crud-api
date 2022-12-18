export interface IUserData {
  username: string;
  age: number;
  hobbies: string[];
}
export interface IUser extends IUserData {
  id: string;
}

export type TJSONValue = string | number | boolean | TJSONObject | TJSONArray;
type TJSONObject = Record<string, JSONValue>;
type TJSONArray = JSONValue[];

export interface IApi {
  code: number;
  data: TJSONValue;
}
