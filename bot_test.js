const { mnet } = require("./src/JS/handler");

var options = {
  host: "nocom.pw",
  port: "",
};

const client = new mnet(options);

client.on('login', () => {
    client.chat(`I have logged in on version: ${client.version}`)
})

client.on('position', (data) => {
    client.chat(`New yaw: ${client.position.yaw} New pitch: ${client.position.pitch}`)
})

client._client.on('pchat', (data) => {
    console.log(data.ansi)
})
