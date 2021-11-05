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
          //  "EAAI0k6ZAYaRIBAKbNAsE3jH7guws8ytvhLQGqHSLdlzTA0HjDM6tTQZBxQr2sSAhllw6hTtTumGIie0sHZAOzKiiBwt3TLGuIsN8n7v0qVGxxRxBsow4ZAT71MSwRQGssClYS9ZCPNgOZA95H1VkY9hhfuhlNcdITniXGYRETusJa1KCZAJkW90AGuSEL61cGHkiGfH7ZBRZA5gZDZD",

          "EAAI0k6ZAYaRIBADAgFFTuhHLndMlR0hltAN0b3mx2f1LLB74NVYoc8O7nINaTR4fXdsKdrQJx0AJbbj3LwShXogZBwVgVZBZCSw8nzRozgSZCIZC6NbXjiwo609LUYrmtrMflpSkCoH11FuWjLG5C2UHRAG3o4QTC69k3WNueOL738uQkDdfZBPZBJKOGp11bPtf98824QvM82OQx0wdkREbw1TugSdWZBpAZD",
        //  "EAAI0k6ZAYaRIBAPrdyFrYxxpFvpGDGwy0QtKCwUfI62Q2MQH8ZBKxBeqnJ8jMXS4xJlafZBdaMCYWWi1F5dfowRVUyrYyx6ZAhsYZAwj6W6fQlwcUbUqQskhMPnVnFyC3HtoRPHmqnwBIr0zD0ux6ErwpXjNwstj7dsYm5rSzm3j9cmBmUjlFo9wEqmJuoZCyKZCpJwLNjNxQZDZD",
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
