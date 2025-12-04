import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("YOUR_MONGODB_URL_HERE");

const User = mongoose.model("User", { name: String });

app.get("/", async (req, res) => res.json(await User.find()));
app.post("/", async (req, res) => res.json(await User.create(req.body)));

app.listen(3000);