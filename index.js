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

const request = require("request");

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  console.log("send message");

  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: {
        access_token:
          "EAAI0k6ZAYaRIBABhpAHD7uFbwX7S4YvhFBCwYDRRw3w5v6h9bY6Gpfs9U9rnrxjLlKyRSbAZApd8sQU9Mcr0QCTlgfmvt3ZCTJF5OfBHE8XzzKwNqqv5TRCZAEjoCBHF15gPyQntLBNXBFwS238S1ctJ47Pf2we0wyP7Sa0aiICHCOGROmZAXF2Acvua5JcnT3xlKJX4d5gZDZD",
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
