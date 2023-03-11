const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");

const server = jsonServer.create();

const router = jsonServer.router(path.resolve(__dirname, "db.json"));

server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

server.use(async (req, res, next) => {
  await new Promise((res) => setTimeout(res, 800));
  next();
});

server.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    const dbPath = path.resolve(__dirname, "db.json");
    const dbJSON = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbJSON);

    const { users = [] } = db;

    const userFromBd = users.find(
      (user) => user.username === username && user.password === password
    );

    if (userFromBd) {
      return res.json(userFromBd);
    }

    return res.status(403).json({ message: "User not found" });
  } catch ({ message }) {
    console.log(message);
    return res.status(500).json({ message });
  }
});

server.use((req, res, next) => {
  // if (req.path === "/public/path") {
  //   return next();
  // }

  if (!req.headers.authorization) {
    return res.status(403).json({ message: "AUTH ERROR" });
  }

  next();
});

server.use(router);

server.listen(8000, () => {
  console.log("server is running on 8000 port");
});
