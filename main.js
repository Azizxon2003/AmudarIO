// allDevices is array where data ofdevices will be stored after fetchingS
let allDevices = [];
let meteostations = "";
let deviceNumber = ``;
let lastUpdate = 0;
let data_box = 0;
let latestSignal = ``;
let newestSignal = ``;
let orgColors = "";

//it is used to count number of devices with specific colors
let deviceCounter = {
  red: 0,
  green: 0,
  yellow: 0,
};

//function to give unique color
function generateRandomColor() {
  let max = 245;
  let min = 208;
  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);
  orgColors = `rgb(${r}, ${g}, ${b})`;
}
//function to calculate time difference
function getStatus(lastSignal) {
  let color = "";
  // here program will firstly split unnecessary parts of the string and prepares it for comparison
  if (lastSignal) {
    time = lastSignal.split(" ");
    if (time[1] == "сония" || time[1] == "дақиқа") {
      deviceCounter.green = deviceCounter.green + 1;
      color = "Green";
    } else if (time[0] >= 1 && time[0] <= 6 && time[1] == "соат") {
      deviceCounter.yellow = deviceCounter.yellow + 1;
      color = "Yellow";
    } else {
      deviceCounter.red = deviceCounter.red + 1;
      color = "Red";
    }
  }
  return color;
}

// this function used in order to fetch data of the devices from backend
async function getDevices(token) {
  const response = await fetch("https://oxus.amudar.io/api/meteoDevices", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const translater = await response.json();
  const dataObject = translater.data;
  for (let i = 0; i < dataObject.length; i++) {
    if (dataObject[i].last_signal != null) {
      allDevices.push(dataObject[i]); // getting all devices
    }
  }
}

function ChosenBox() {}

console.log(allDevices);
let = newList = [];
function Display() {
  // creating new list with the same properties as allDevices
  for (let i = 0; i < allDevices.length; i++) {
    newList.push(allDevices[i]);
  }
  //sorting devices by last_signal
  newList.sort(function (a, b) {
    return a.last_signal.localeCompare(b.last_signal);
  });
  //sorting allDevices by org_Id to create sorted list
  allDevices.sort((a, b) => {
    return a.org_id - b.org_id;
  });
  //DeviceBox is used to add ready box og the devices to document through div with the class " meteostations " in .html part
  let DeviceBox = ``;
  //perviousOrg is used to compare current Org name with pervious one in order to set proper border style
  let perviousOrg = "";
  //currentOrg used in order to display name of Organization in document
  let currentOrg = "";
  //DeviceBoxBorder used in order to set style of the border of the box which covers details of device
  let DeviceBoxBorder = ``;
  meteostations = document.querySelector(".box");

  //tis function is used to create pop up screen
  function PopUp() {
    const boxes = document.querySelectorAll(".DeviceBox");
    boxes.forEach((box) => {
      box.addEventListener("click", function () {
        const info = this.getAttribute("data-info");
        let chosen = boxGenerator(allDevices[info - 1]);
        const popupWindow = window.open("", "Popup", "width=140,height=200");

        popupWindow.document.body.innerHTML = boxGenerator(
          allDevices[info - 1]
        );
      });
    });
  }
  let grey = ``;
  // looping allDevices in order to get devices separarely and setting border style
  for (let i = 0; i < allDevices.length; i++) {
    let organization = allDevices[i].org.name;
    let defaultBorder = "border: 2px;";
    if (
      perviousOrg != organization &&
      organization != allDevices[i + 1].org.name
    ) {
      generateRandomColor();
      currentOrg = `<h5 class="orgName">${organization} </h5>`;
      DeviceBoxBorder = defaultBorder + `border-style: solid;`;
    } else if (i == allDevices.length - 1) {
      generateRandomColor();
      grey = `grey-left`;
      DeviceBoxBorder =
        defaultBorder +
        `border-style:solid solid solid dotted; padding-top: 20px;`;
    } else if (
      i != allDevices.length - 1 &&
      organization != allDevices[i + 1].org.name
    ) {
      grey = `grey-left`;
      DeviceBoxBorder =
        defaultBorder +
        `border-style: solid solid solid dotted; padding-top: 20px;`;
    } else if (perviousOrg == organization) {
      grey = `grey-sides`;
      DeviceBoxBorder =
        defaultBorder + `border-style: solid dotted; padding-top: 20px;`;
      currentOrg = ` `;
    } else {
      generateRandomColor();
      grey = `grey-right`;
      currentOrg = `<h5 class="orgName">${organization} </h5>`;
      DeviceBoxBorder =
        defaultBorder + `border-style: solid dotted solid solid;`;
    }

    DeviceBox = boxGenerator(allDevices[i]);
    perviousOrg = organization;
  }
  // adding ready boxes to the document
  meteostations.innerHTML += DeviceBox;
  function boxGenerator(key) {
    //
    //
    //
    //
    data_box = data_box + 1;
    let DeviceBoxColor = "";
    DeviceBoxColor = orgColors;
    let time = "";
    // cutting unnecessary part to display time
    if (key.last_signal_human == null) {
      time = ``;
    } else if (key.last_signal_human) {
      time = key.last_signal_human.replace("аввал", "");
    } else {
      time = key.last_signal_human;
    }
    let imgPath = ``;
    //analyzing battery level and setting related battery icon
    if (Math.round(key.battery) < 12) {
      imgPath = `<img src="low-battery-colored.png" alt="Low battery"></img>`;
    } else if (key.battery >= 12 && key.battery < 12.5) {
      imgPath = `<img src="half-battery-colored.png" alt="Half battery"></img>`;
    } else if (Math.round(key.battery) >= 13) {
      imgPath = `<img src="full-battery-colored.png" alt="Full battery"></img>`;
    }
    // creating box af the devices and preparing them to write in the document
    DeviceBox += `
    <div class="DeviceBox ${grey} popup-link" style="background-color:${DeviceBoxColor}; ${DeviceBoxBorder}" data-info = "${data_box}">
      ${currentOrg}
      <h6 class="${getStatus(key.last_signal_human)}">${key.serial_number}</h6>
      <h6 style="font-size:12px">${time}  (${Math.round(
      key.battery
    )}V) ${imgPath} </<h6>
    </div>
    `;
    if (key.last_signal_human == null) {
      DeviceBox = ` `;
    }

    return DeviceBox;
  }

  let LastItem = newList[0];
  let FirstItem = newList[newList.length - 1];
  //console.log(allDevices);
  deviceNumber = document.querySelector(".info");
  deviceNumber.innerHTML += `
  <img src="644606.png" alt="UpdatedAt" class="img">Last update::${lastUpdate} minutes ago</img>
  <img src="icons8-wind-gauge-96.png" alt="All" class="img">Total:${allDevices.length}</img>
  <img src="meteostation_red.png" alt="Reds" class="img">${deviceCounter.red}</img>
  <img src="meteostation_yellow.png" alt="Yellows" class="img">${deviceCounter.yellow}</img>
  <img src="meteostation_green.png" alt="Greens" class="img">${deviceCounter.green} </img>
  <img src="first.png" alt="first" class="img"> <b class="first">${FirstItem.serial_number}: ${FirstItem.last_signal_human}</b> (${FirstItem.org.name})</img>
  <img src="last.png" alt="last" class="img"> <b class="last">${LastItem.serial_number}: ${LastItem.last_signal_human}</b> (${LastItem.org.name})</img>
  `;
  PopUp();
}

// start function gives necessary token to the function getDevices and calls function Display
async function start() {
  await getDevices("1|5BJOUuyiGaVNvX5WofDZm3LFlWRWDYhOxPj8JAoK");
  Display();
}
start();
setInterval(() => {
  lastUpdate = lastUpdate + 1;
  deviceNumber.innerHTML = ``;
  let LastItem = newList[0];
  let FirstItem = newList[newList.length - 1];
  deviceNumber = document.querySelector(".info");
  deviceNumber.innerHTML += `
  <img src="644606.png" alt="UpdatedAt" class="img">Last Update:${lastUpdate} minutes ago</img>
  <img src="icons8-wind-gauge-96.png" alt="All" class="img">Total:${allDevices.length}</img>
  <img src="meteostation_red.png" alt="Reds" class="img">${deviceCounter.red}</img>
  <img src="meteostation_yellow.png" alt="Yellows" class="img">${deviceCounter.yellow}</img>
  <img src="meteostation_green.png" alt="Greens" class="img">${deviceCounter.green} </img>
  <img src="first.png" alt="first" class="img"> <b class="first">${FirstItem.serial_number}: ${FirstItem.last_signal_human}</b> (${FirstItem.org.name})</img>
  <img src="last.png" alt="last" class="img"> <b class="last">${LastItem.serial_number}: ${LastItem.last_signal_human}</b> (${LastItem.org.name})</img>
  
  `;
}, 60000);
//funtion to refresh list of devices
setInterval(() => {
  // this function will clear and then fetch new data fom backend
  lastUpdate = 0;
  deviceCounter.red = 0;
  deviceCounter.green = 0;
  deviceCounter.yellow = 0;
  deviceNumber.innerHTML = ``;
  meteostations.innerHTML = ``;
  allDevices = [];
  start();
}, 1800000); // timer:30 minutes
