const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose
  .connect("mongodb://localhost:27017/test", {
    bufferCommands: false,
    autoCreate: false,
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(chalk.red(`Error : ${err.message}`)));

// check connection
const db = mongoose.connection;
db.on("disconnected", () =>
  console.log(chalk.redBright("Error : lost connection to the MongoDB server"))
);
db.on("error", (err) => {
  console.log(chalk.red(`Error : ${err.message}`));
  db.close();
});

db.on("open", () => console.log(chalk.green("_Conected to db")));

const studentSchema = mongoose.Schema({
  name: String,
  famillyName: String,
  section: Number,
  phoneNumber: Number,
  preOrder: String,
});

const student = mongoose.model("student", studentSchema);

module.exports = {
  student,
};
