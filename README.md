# Minenet

A minecraft bot handler made my me. This is currently a one person project and just my take on a bot handler similar to mineflayer. Do not expect this to
 any good. I will give some documentation in the future  but for now here is just the files. :slight_smile:
 
:arrow_down: Small example :arrow_down:
 
 ```js
const { mnet } = require("./src/JS/handler");

var options = {
  host: "nocom.pw",
  port: "",
};

const client = new mnet(options);

client.on('login', () => {
    client.chat(`I have logged in on version: ${client.version}`)
})
```
