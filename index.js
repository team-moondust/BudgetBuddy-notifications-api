const express = require("express");
const bodyParser = require("body-parser");
const webPush = require("web-push");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

webPush.setVapidDetails(
  "mailto:raghav.m2014@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

console.log("VAPID Public Key:", process.env.VAPID_PUBLIC_KEY);

app.use(cors());
app.use(bodyParser.json());

const subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscribed" });
});

// Send a test push
app.get("/push", async (req, res) => {
  const payload = JSON.stringify({
    title: "Server says hi!",
    body: "This is a push from the backend.",
  });

  for (const sub of subscriptions) {
    try {
      await webPush.sendNotification(sub, payload);
    } catch (err) {
      console.error("Push failed", err);
    }
  }

  res.send("Push triggered");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
