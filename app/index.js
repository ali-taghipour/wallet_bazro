const express = require("express")
const app = express()
const sequelize = require("./database/db");

(async () => {
  const data = {}
  if (app.get("env") === "development") {
    data["force"] = true
  }
  require("./models")
  await sequelize.sync(data);
})();


app.use(express.json())
app.use(express.urlencoded({ extended: false }));

require("./routers")(app)



module.exports = app
