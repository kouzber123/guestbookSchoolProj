const form = document.getElementById("ajaxForm");

//create event and prevent submit from launcing
form.addEventListener("submit", (e) => {
  e.preventDefault();

  //then select input values and invoke postMessage function
  var user = document.getElementById("username").value;
  var country = document.getElementById("country").value;
  var message = document.getElementById("message").value;

  postMessage(user, country, message);
  fetchData();
  //empty input values
  user = document.getElementById("username").value = "";
  country = document.getElementById("country").value = "";
  message = document.getElementById("message").value = "";
});

//create async await function to send POST request to the selected route and add input values as part of the body
async function postMessage(user, country, message) {
  try {
    await fetch("/ajaxMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user,
        country: country,
        message: message,
      }),
    });
  } catch (err) {
    console.log(err + " Something wrong with the PostMessage");
  }
}
//start function handles ajax request to the endpoint /json to get json file content then call displayMessages
async function fetchData() {
  try {
    const response = await fetch("/json");
    const data = await response.json();
    disPlayMessages(data);
  } catch (err) {
    console.log(err + " Something wrong with Fetching data");
  }
}
//this function will handle the html rendering with json data object.values  creates an object from data and its values
function disPlayMessages(data) {
  document.getElementById(
    "messages"
  ).innerHTML = `<table class="table table-inverse tstyle">
  <thead>
      <tr>
          <th>#</th>
          <th>Name</th>
          <th>Country</th>
          <th>Message</th>
      </tr>
  </thead>
        ${Object.values(data)
          .map((datas) => {
            return `<tbody>
            <tr>
            <td>${datas.id}</td>
            <td>${datas.username}</td>
            <td>${datas.country}</td> 
            <td>${datas.message}</td>
            </tr
            </tbody>
            `;
          })
          .join("")}
          </table>
          `;
}
