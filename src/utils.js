const fs = require("fs");

function detectVersionControlSystem() {
  if (fs.existsSync(".git")) {
    return "git";
  } else if (fs.existsSync(".svn")) {
    return "svn";
  } else {
    return null;
  }
}

module.exports = {
  detectVersionControlSystem,
};
