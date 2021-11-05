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
          //"EAAD3SH5DhBABAFZCtVGvVBN71k6fzZC9ZAWyoS2XO8tQwU7627MdMRQoyJ1jJvQNhi0ioDBv16NbZCykWh2ZCgeWHeTLrvK0eODOmSmRUTS4gU7269DBzwziZC02i5VDm97Izh6E4ttZAAO1VDAOr98j0CYuAZCbVnYYGkwqOcnhjf57SrtJf8wM",

          //    "EAAsA6fD3O0oBAJYm2q6XNffl9M482KYst0l6Ye5sIKK7MuEKduK9YhhB7O61BPlvZCYlyj6xIMZCZAzpwTD5CZCvml9t83iwoxb9UXsUkkX1JdZAS7qqcTmJrqCKR6sFnZANSSf390pNB2XZBA4w9OmioNlJePoXJNIiXDU3rw9ZC5dy1TJNoHTvq1PDsadBgjfKr8FHq4CndAZDZD",

          // "EAAsA6fD3O0oBAGaOlPEwAZBxAZCX6lgPwdEvLIFU7i2GlXag1BgRlHPoZBMt9RGDdBSKFacQYymPzSUP4oP5o953yD9rmDW7YK4deM8F8VaayFoHyK7OQ9s0bZAoZBZCOFuOxFYFZBCmVZAHAb2mqf2ulMShlIGEM6JiguMce1FVsUcAwZAX7lm77w7LT1MKVWDutBsbqIZByZBygZDZD",

          process.env.PAGE_TOKEN,
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
