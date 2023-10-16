require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
require("./mongo/connect");

app.use(require("cors")());
app.use(express.json());
app.use("/auth", require("./routes/auth.routes"));
app.use("/employees", require("./routes/employee.routes"));

app.listen(port, () => {
  console.log(`App is runnning on http://localhost:${port}`);
});
