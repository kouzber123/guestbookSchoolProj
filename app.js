const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
//------------------------------- Acquiring necessary functionalities

//date options
const options = {
  dateStyle: "full",
  timeStyle: "full",
};
const date = new Date().toLocaleString("en-GB", options);
//------------------------------- Ports and dates tuning

//------------------------------- File handling
//to prevent empty files we need to check the len of json file if 0 then create object else parse current data
var dataObj;
fs.readFile("guestbook.json", "utf-8", (err, data) => {
  if (data.length === 0) {
    console.log("its empty");
    fs.writeFile("guestbook.json", JSON.stringify([]), (err) => {
      console.log(err);
    });
  } else {
    dataObj = JSON.parse(data);
  }
});

//----------------------------ROUTES > GETS for rendering html and POSTS for catching data
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/guestbook", (req, res) => {
  res.render("guestbook", { messages: dataObj });
});
app.get("/newMessage", (req, res) => {
  res.render("newMessage");
});
app.get("/ajaxMessage", (req, res) => {
  res.render("ajaxMessage");
});
//http for json file /endpoint
app.get("/json", (req, res) => {
  res.sendFile(`${__dirname}/guestbook.json`);
});

//catch data and push message into dataObj //construct object
app.post("/newMessage", (req, res) => {
  newMessage(req.body);
  res.redirect("/guestbook");
});
app.post("/ajaxMessage", (req, res) => {
  newMessage(req.body);
});

//function that handles of constructing the object from user input
function newMessage(req_body) {
  const newMessage = {
    id: JSON.stringify(dataObj.length + 1),
    username: req_body.username,
    country: req_body.country,
    date: date,
    message: req_body.message,
  };
  WriteJsonFile(newMessage);
}
//function that handles updating the json file //push new object to the dataObj variable then Writefile
function WriteJsonFile(message) {
  dataObj.push(message);
  fs.writeFile("guestbook.json", JSON.stringify(dataObj), (err) => {
    console.log(err);
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("running on 3000");
});
