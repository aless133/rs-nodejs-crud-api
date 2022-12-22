import { version as uuidVersion, validate as uuidValidate, v4 as uuidv4 } from "uuid";
import { IUser, IApiCall, TDb, IDbReturn, EDbErrors } from "./types";

const database: Record<string, IUser> = {
  // const data: { [member: string]: IUser } = {
  // "12": {
  //   id: "12",
  //   username: "Вася",
  //   age: 12,
  //   hobbies: ["игры", "тусовки"],
  // },
};

// export enum errors {
//   INVALID_DATA = 1,
//   NOT_FOUND = 2,
// }

// const db = new EventEmitter();

const db: TDb = {
  getAll({}) {
    return { data: Object.keys(database).map((key) => database[key]) };
  },
  get({ params: { userId } }) {
    if (!userId) {
      return { err: { code: EDbErrors.INVALID_DATA, message: "No userId" } };
    } else if (!uuidValidate(userId)) {
      return { err: { code: EDbErrors.INVALID_DATA, message: "Invalid userId" } };
    } else if (!database[userId]) {
      return { err: { code: EDbErrors.NOT_FOUND, message: "User not found" } };
    } else {
      return { data: database[userId] };
    }
  },
  create({ data }) {
    if (!data || !isValidUserData(data)) {
      return { err: { code: EDbErrors.INVALID_DATA, message: "Invalid user data" } };
    } else {
      const userId = uuidv4();
      database[userId] = { ...data, id: userId };
      return { data: database[userId] };
    }
  },
  update({ params: { userId }, data }) {
    if (!userId) {
      return { err: { code: EDbErrors.INVALID_DATA, message: "No userId" } };
    } else if (!uuidValidate(userId)) {
      return { err: { code: EDbErrors.INVALID_DATA, message: "Invalid userId" } };
    } else if (!database[userId]) {
      return { err: { code: EDbErrors.NOT_FOUND, message: "User not found" } };
    } else if (!data || !isValidUserData(data)) {
      return { err: { code: EDbErrors.INVALID_DATA, message: "Invalid user data" } };
    } else {
      database[userId] = data;
      return { data: database[userId] };
    }
  },
  delete({ params: { userId } }) {
    if (!userId) {
      return { err: { code: EDbErrors.INVALID_DATA, message: "No userId" } };
    } else if (!uuidValidate(userId)) {
      return { err: { code: EDbErrors.INVALID_DATA, message: "Invalid userId" } };
    } else if (!database[userId]) {
      return { err: { code: EDbErrors.NOT_FOUND, message: "User not found" } };
    } else {
      delete database[userId];
      return {};
    }
  },
};

export const dbCall = (p: IApiCall): IDbReturn => {
  return db[p.method](p);
};

function uuidValidateV4(uuid: string) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidUserData(obj: any) {
  return (
    typeof obj === "object" &&
    Object.keys(obj).length == 3 &&
    "username" in obj &&
    typeof obj.username === "string" &&
    !!obj.username &&
    "age" in obj &&
    typeof obj.age === "number" &&
    !!obj.age &&
    "hobbies" in obj &&
    Array.isArray(obj.hobbies) &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj.hobbies.every((h: any) => typeof h === "string")
  );
}
