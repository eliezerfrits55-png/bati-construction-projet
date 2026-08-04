const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;
const jwtSecret = process.env.JWT_SECRET || "bati-connect-local-secret";
const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");

const ensureDataFile = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]", "utf8");
  }
};

const readUsers = () => {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(usersFile, "utf8"));
};

const writeUsers = (users) => {
  ensureDataFile();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");
};

const publicUser = (user) => {
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

const createToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: "7d" });

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    req.auth = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ message: "Session expirée ou invalide" });
  }
};

app.use(helmet());
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "BatiConnect API opérationnelle" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    password_confirmation,
    city,
    role = "client",
  } = req.body;

  const errors = {};

  if (!first_name?.trim()) errors.first_name = ["Prénom requis"];
  if (!last_name?.trim()) errors.last_name = ["Nom requis"];
  if (!email?.trim()) errors.email = ["Email requis"];
  if (!phone?.trim()) errors.phone = ["Téléphone requis"];
  if (!city?.trim()) errors.city = ["Ville requise"];
  if (!password) errors.password = ["Mot de passe requis"];
  if (password && password.length < 8) errors.password = ["Minimum 8 caractères"];
  if (password !== password_confirmation) {
    errors.password_confirmation = ["Les mots de passe ne correspondent pas"];
  }
  if (!["client", "technician", "admin"].includes(role)) {
    errors.role = ["Rôle invalide"];
  }

  const users = readUsers();
  const normalizedEmail = email?.trim().toLowerCase();

  if (normalizedEmail && users.some((user) => user.email === normalizedEmail)) {
    errors.email = ["Cet email est déjà utilisé"];
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ message: "Données invalides", errors });
  }

  const user = {
    id: Date.now().toString(),
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    city: city.trim(),
    role,
    status: role === "technician" ? "pending" : "active",
    password_hash: await bcrypt.hash(password, 10),
    created_at: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);

  res.status(201).json({
    token: createToken(user),
    user: publicUser(user),
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(
    (currentUser) => currentUser.email === email?.trim().toLowerCase(),
  );

  if (!user || !(await bcrypt.compare(password || "", user.password_hash))) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  res.json({
    token: createToken(user),
    user: publicUser(user),
  });
});

app.post("/api/auth/admin-access", (req, res) => {
  const accessCode = String(req.body?.access_code || "").trim();

  if (accessCode !== "22052") {
    return res.status(401).json({ message: "Code administrateur incorrect" });
  }

  const admin = {
    id: "admin-local",
    first_name: "Administrateur",
    last_name: "BatiConnect",
    email: "admin@baticonnect.local",
    role: "admin",
    status: "active",
  };

  res.json({ token: createToken(admin), user: admin });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  const users = readUsers();
  const user = users.find((currentUser) => currentUser.id === req.auth.id);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  res.json(publicUser(user));
});

app.post("/api/auth/forgot-password", (req, res) => {
  res.json({ message: "Demande de réinitialisation reçue" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

app.listen(port, () => {
  console.log(`BatiConnect API démarrée sur http://localhost:${port}`);
});
