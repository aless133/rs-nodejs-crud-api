import { IUser } from "./types";

const data: Record<string, IUser> = {
  "12": {
    id: "12",
    username: "Вася",
    age: 12,
    hobbies: ["игры", "тусовки"],
  },
};

export enum errors {
  INVALID_DATA = 1,
  NOT_FOUND = 2,
}

// const db = new EventEmitter();

const db = {
  getAll() {
    return data;
  },
  get(userId: string) {
    return data[userId];
  },
};

export default db;
