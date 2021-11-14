const axios = require("axios");
const request = require("request");
const express = require("express");
const app = express();
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

  // axios({
  //   method: "POST",
  //   url: "https://graph.facebook.com/v7.0/me/messages/",
  //   headers: {
  //     access_token: process.env.PAGE_TOKEN,
  //   },
  //   data: {
  //     recipient: { id: sender },
  //     message: { text: text },
  //   },
  // })
  //   .then((data) => {
  //     if (data.body.error) console.log("Error: ", response.body.error);
  //     else {
  //       console.log("message sented ");
  //     }
  //   })
  //   .catch((err) => console.log(err));

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
}

app.listen(process.env.PORT || 5000, () =>
  console.log("servevr started at 5000")
);
