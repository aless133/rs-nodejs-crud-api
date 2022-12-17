const data = {};

const db = {
  get(userId = null) {
    if (userId === null) {
      return data;
    } else {
      return data[userId];
    }
  },
};

export default db;
