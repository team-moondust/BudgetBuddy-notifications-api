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

const subscriptions = {};

app.post("/subscribe", (req, res) => {
  const { subscription, email } = req.body;
  subscriptions[email] = subscription;
  console.log("Added", subscription);
  res.status(201).json({ message: "Subscribed" });
});

app.post("/push", async (req, res) => {
  const { email, title, body, imageId } = req.body;
  const sub = subscriptions[email];

  if (!sub) {
    return res
      .status(404)
      .json({ error: "Subscription not found for given email" });
  }

  const payload = JSON.stringify({
    title: title || "BudgetBuddy",
    body: body || "New message!",
    image: imageId ?? 5,
  });

  try {
    const response = await webPush.sendNotification(sub, payload);
    console.log("Push sent:", response);
    res.status(200).json({ message: "Push sent successfully" });
  } catch (err) {
    console.error("Push failed", err);
    res.status(500).json({ error: "Failed to send push" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
