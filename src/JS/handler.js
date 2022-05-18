const { createClient } = require("minecraft-protocol");
const mcdata = require("minecraft-data");
const EventEmitter = require("events");
const fs = require('fs')
const reload = require('require-reload')(require)
const path = require('path')
const Vec3 = require("vec3");
const { parse } = require("path");
const { inject } = require("./plugins/chat");

class mnet extends EventEmitter {
  constructor(options = {}) {
    super();

    options.host ??= "localhost";
    options.port ??= "25565";
    options.username ??= "Minenet_User";
    options.password ??= null;

    const client = createClient(options);

    this.host = options.host;
    this.port = options.port;
    this.server = `${options.host}:${options.port}`;
    this.version = client.version;
    this._client = client;
    (this.position = new Vec3({
      x: null,
      y: null,
      z: null,
    })),
      {
        yaw: null,
        pitch: null,
      };

    client.once("login", (packet) => {
      this.entityId = packet.entityId;
      this.emit("login", packet);
    });

    client.on("position", (data) => {
      this.position.x = data.x;
      this.position.y = data.y;
      this.position.z = data.z;
      this.position.yaw = data.yaw;
      this.position.pitch = data.pitch;

      this.position = data;
      this.emit("position", data);
    });

    client.once("end", (reason) => {
      this.emit("session_finished", reason, "end");
    });

    client.once("kick_disconnect", (data) => {
      const parsed = JSON.parse(data.reason);

      this.emit("session_finished", parsed, "kick_disconnect");
    });

    client.once("disconnect", (data) => {
      const parsed = JSON.parse(data.reason);

      this.emit("session_finished", parsed, "disconnect");
    });

    loadPlugins('./plugins/', client)

    function loadPlugins (directory, client) {
      for (const filename of fs.readdirSync(path.join(__dirname, directory))) {
        const fullpath = path.join(__dirname, directory, filename)
    
        let plugin
    
        try {
          plugin = reload(fullpath)
    
          plugin.inject(client)
        } catch (error) {
          console.error(`[${filename}] ${error}`)
        }
      }
    }

  }

  write(name, params) {
    this._client.write(name, params);
  }

  chat(message) {
    this.write("chat", { message });
  }
}

module.exports = { mnet };
