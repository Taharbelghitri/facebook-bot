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
          "EAANZBQwqZAZA3ABAGIq7j1FYlAKCULIqHHDtZC5OZCqNnRX0UuQ4JgOilgFsZBe8Okrvda8ZALLuQtjjBYmDZBViqhz1CWvEblSHVCpmAMeFQPbHqimLFm9rZASEoQk039MIUFTO2IQAwQzMCcYieaCL1xKxSHKugBDOXiPkYFoFjLRMOD9K8VII2",
        // "EAANZBQwqZAZA3ABAK2mjtpltK8YtVtlzE2gakqruyIRASLL2SGd2rpIWZCbt71FtPqjg2ffVrTAwy0wq7qhMCWBjxoYlQL4a9v9Ie3Nz8mQDlTazkZA1OPiyEs5CNqm8UtZBmUfh401LqFIgrRFplaf3NI9v4khZA24QpQulLxZBilp1cdyrpG0e",
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
