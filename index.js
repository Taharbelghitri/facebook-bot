const axios = require("axios");
const request = require("request");
const express = require("express");
const app = express();

const db = require("./data").student;

const jsonData = require("./answers.json");
const tags = Object.keys(jsonData);

app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] && req.query["hub.verify_token"] === "tuxedo_cat") {
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post("/webhook", (req, res) => {
  console.log(req.body);
  if (req.body.object === "page") {
    console.log("it's page");
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
  console.log("message sented");
});

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;
  if (tags.includes(text)) sendFunction(sender, jsonData(tags.toString()));
  db.findOne({ id: sender }, (err, data) => {
    if (err || !data)
      sendFunction(
        sender,
        "please try to register again or wait a second and send the message again\ntype info for more details"
      );
    else {
    }
  });

  console.log("id : " + sender);
}

const sendFunction = (sender, text) => {
  request(
    {
      url: "https://graph.facebook.com/v7.0/me/messages/",
      qs: {
        access_token: process.env.PAGE_TOKEN,
      },
      method: "POST",
      json: {
        recipient: { id: sender },
        message: { text: text },
      },
    },
    function (error, response) {
      if (error) {
        console.log("Error sending message: ", error);
      } else if (response.body.error) {
        console.log("Error: ", response.body.error);
      }
    }
  );
};

// const message = "f";
// const data = ["infos", "register"];
// let fakeData = { name: "", number: 0 };

// data.forEach((element) => {
//   let pChars = 0;
//   element = element.split("");
//   element.forEach((item) => {
//     if (message.includes(item)) pChars++;
//   });

//   if (pChars > fakeData.number)
//     fakeData = { name: element.join(""), number: pChars };
// });

// console.log("result ... " + fakeData.name);

// console.log(tags);

// console.log(jsonData[tags.toString()]);

app.listen(process.env.PORT || 5000, () =>
  console.log("servevr started at 5000")
);
