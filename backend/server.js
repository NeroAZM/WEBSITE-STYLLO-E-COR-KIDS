import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const productsPath = path.join(process.cwd(), "catalogo", "products.json");
const usersPath = path.join(process.cwd(), "login", "users.json");

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error(`Erro ao ler ${filePath}:`, err.message);
    return null;
  }
}

app.get("/products", (req, res) => {
  const products = readJson(productsPath);
  if (!products)
    return res.status(500).json({ error: "Products data not available" });
  res.json(products);
});

app.post("/login", (req, res) => {
  const users = readJson(usersPath);
  if (!users)
    return res.status(500).json({ error: "Users data not available" });

  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Preencha todos os campos." });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    return res.json({ success: true, message: "Login realizado com sucesso!" });
  }

  return res
    .status(401)
    .json({ success: false, message: "Usuário ou senha incorretos" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
