const express = require("express");
const app = express();

import { db } from "./db";

import { getToken } from "./Spotify";

const DbClient = new db();

app.listen(4000, () => {
  console.log("listening on port 4000");
});

app.get("/api/spotify/playlist", async (req: any, res: any) => {
  const token = await getToken();

  const playlistId = req.query.playlistId;

  if (playlistId) {
    await DbClient.addPlaylistTodb(token, playlistId as string);
    res.send("ok");
  } else {
    res.send("bad request");
  }
});

process.on("exit", () => {
  console.log("exit");
  DbClient.destroy();
});

process.on("SIGINT", () => {
  process.exit(0);
});
