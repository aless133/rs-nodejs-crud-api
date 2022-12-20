import { version as uuidVersion, validate as uuidValidate, v4 as uuidv4 } from "uuid";
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
  getAll({}) {
    return { data: Object.keys(data).map((key) => data[key]) };
  },
  get({ params: { userId } }) {
    if (userId) {
      if (!uuidValidate(userId)) {
        return { err: { code: EDbErrors.INVALID_DATA, message: "Invalid userId" } };
      } else if (data[userId]) {
        return { data: data[userId] };
      } else {
        return { err: { code: EDbErrors.NOT_FOUND, message: "User not found" } };
      }
    }
    return { err: { code: EDbErrors.INVALID_DATA, message: "No userId" } };
  },
  create({}) {
    return { err: { code: EDbErrors.INVALID_DATA, message: "No userId" } };
  },
  update({ params: { userId } }) {
    return { err: { code: EDbErrors.INVALID_DATA, message: "No userId" } };
  },
  delete({ params: { userId } }) {
    return { err: { code: EDbErrors.INVALID_DATA, message: "No userId" } };
  },
};

export const dbCall = (p: IApiCall): IDbReturn => {
  return db[p.method](p);
};

function uuidValidateV4(uuid: string) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}
