const blacklist = new Set();

module.exports = {
  add: (token) => {
    blacklist.add(token);
  },
  has: (token) => {
    return blacklist.has(token);
  },
};
