import express from "express";
import axios from "axios";
import convert from "xml-js";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'static')))

app.use("/news", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
  const response = await axios.get("https://lenta.ru/rss/last24");
  const xml = convert.xml2json(response.data, {
    compact: true,
    spaces: 4,
  });
  const xmlJson = JSON.parse(xml);
  const items = xmlJson.rss.channel.item;
  res.json(items);
});
app.get(/.*/, (req, res) => res.sendFile(__dirname + "index.html"));
app.listen(5000, () => console.log("Server started"));
