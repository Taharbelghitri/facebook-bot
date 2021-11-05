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
  console.log("sender : " + sender);

  request(
    {
      url: "https://graph.facebook.com/v7.0/me/messages/",
      qs: {
        access_token:
          "EAAD3SH5DhBABAH2AKtYUkyfHXB4KBzqEXeN5mZAabbsob1fEPsaBmUwT2A7OcMHUa0dDOQZAKXVQUEa0LvdZAnvBAEvBpCugwgh24OkCaQa12EZCWmQRRMEwfMZADeM7m2kMenj9ZCQhcfaUecUWGlSK7yTpbyF1P8gTdjE2i8YVPXyNGV2oUW",
        //   "EAANZBQwqZAZA3ABAMltfFvokLzwaMeKPZBOVYCwTS5fZCIVzyWWy5MD3cVwf6QBKeIiMEVjTiM0deux95Ra7NIgzkZBPpeeY5N9jKYep1XXwPehzARSu0d315UvEPErULcq4j6VqT1EUCfNhqZAzqvU2shxVfjQRew5kLAGZByJHK94U4PX9ZCRUZA",
      },
      method: "POST",
      json: {
        recipient: { id: sender },
        message: { text: "hii" },
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
