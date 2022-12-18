import { IUser, IApiCall, TDb, IDbReturn, EDbErrors } from "./types";

const data: Record<string, IUser> = {
  // const data: { [member: string]: IUser } = {
  "12": {
    id: "12",
    username: "Вася",
    age: 12,
    hobbies: ["игры", "тусовки"],
  },
};

// export enum errors {
//   INVALID_DATA = 1,
//   NOT_FOUND = 2,
// }

// const db = new EventEmitter();

const db: TDb = {
  getAll({ params }) {
    return { data: Object.keys(data).map((key) => data[key]) };
  },
  get({ params }) {
    if (params && params.userId) {
      if (data[params.userId]) {
        return { data: data[params.userId] };
      } else {
        return { err: { code: EDbErrors.NOT_FOUND, message: "User not found" } };
      }
    }
    return { err: { code: EDbErrors.INVALID_DATA, message: "No userId" } };
  },
};

export const dbCall = (p: IApiCall): IDbReturn => {
  return db[p.method](p);
};
