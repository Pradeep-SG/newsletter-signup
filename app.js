const express = require("express");

const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
  apiKey: "6f1a3aca21d81a4e3f26957ac9e17c88-us14",
  server: "us14",
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
  console.log(firstName, lastName, userEmail);

  async function run() {
    try {
      const response = await client.lists.addListMember("5928bdcf88", {
        email_address: userEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      });
      res.sendFile(__dirname + "/success.html");
    } catch (e) {
      console.log(typeof(JSON.parse(e.response.text).title));
      console.log("Member Exists");
      if (JSON.parse(e.response.text).title === "Member Exists")
        res.sendFile(__dirname + "/exists.html");
      else
        res.sendFile(__dirname + "/failure.html");
    }
    // if (res.statusCode === 200) {
    //   res.send("Succesfully subscribing to our Newsletters");
    // } else {
    //   res.send("Subcribing failed, please try again");
    // }
  }
  run();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => console.log(`Server is up and running at port ${port}`));


//API key
// 6f1a3aca21d81a4e3f26957ac9e17c88-us14
// Audience Id = 5928bdcf88