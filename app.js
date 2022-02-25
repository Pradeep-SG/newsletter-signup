const express = require("express");
require('dotenv').config();

const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({
  extended: true
}));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});



app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const userEmail = req.body.email;

  async function run() {
    try {
      const response = await client.lists.addListMember(process.env.LIST_ID, {
        email_address: userEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      });
      res.sendFile(__dirname + "/success.html");
    } catch (e) {
      if (JSON.parse(e.response.text).title === "Member Exists")
        res.sendFile(__dirname + "/exists.html");
      else
        res.sendFile(__dirname + "/failure.html");
    }
  }
  run();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => console.log(`Server is up and running at port ${port}`));