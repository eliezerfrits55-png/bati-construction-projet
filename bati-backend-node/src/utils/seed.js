const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const User = require("../models/User");
const Trade = require("../models/Trade");

const trades = [
  { name: "Maçonnerie", icon: "🧱" },
  { name: "Plomberie", icon: "🚰" },
  { name: "Électricité", icon: "⚡" },
  { name: "Peinture", icon: "🎨" },
  { name: "Menuiserie", icon: "🪚" },
  { name: "Carrelage", icon: "🔲" },
];

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI est absente du fichier .env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connexion à MongoDB : ${mongoose.connection.db.databaseName}`);

  const usersFile = path.resolve(__dirname, "../../data/users.json");
  const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));

  let usersInserted = 0;
  for (const sourceUser of users) {
    const user = {
      first_name: sourceUser.first_name,
      last_name: sourceUser.last_name,
      email: sourceUser.email,
      phone: sourceUser.phone,
      password: sourceUser.password_hash,
      role: sourceUser.role,
      city: sourceUser.city,
      status: sourceUser.status || "active",
      createdAt: sourceUser.created_at ? new Date(sourceUser.created_at) : new Date(),
    };

    const result = await User.collection.updateOne(
      { email: user.email.toLowerCase() },
      { $setOnInsert: user },
      { upsert: true },
    );
    if (result.upsertedCount) usersInserted += 1;
  }

  let tradesInserted = 0;
  for (const trade of trades) {
    const result = await Trade.updateOne(
      { name: trade.name },
      { $setOnInsert: trade },
      { upsert: true },
    );
    if (result.upsertedCount) tradesInserted += 1;
  }

  console.log(`Utilisateurs ajoutés : ${usersInserted}`);
  console.log(`Métiers ajoutés : ${tradesInserted}`);
  console.log("Seed terminé sans supprimer les données existantes.");
};

seed()
  .catch((error) => {
    console.error("Échec du seed :", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
