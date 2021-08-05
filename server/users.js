const users = [];

const addUser = (id, user) => {
  const userObj = { userId: id, ...user };
  const salesUser = getUsers();
  if (typeof salesUser === "object" && user.id === "SALES") {
    return {
      error:
        "Sales person is already login. You won't be able to receive any call.",
    };
  } else {
    users.push(userObj);
    return { user };
  }
};

const deleteUser = (id) => {
  const index = users.findIndex((user) => user.userId === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUsers = () => {
  const user =
    users &&
    users.find((u) => {
      return u.id === "SALES";
    });

  return user;
};

const updateAvailability = (val) => {
  users.find((v) => v.id === "SALES").isAvailable = val;
};

module.exports = { addUser, deleteUser, getUsers, updateAvailability };
