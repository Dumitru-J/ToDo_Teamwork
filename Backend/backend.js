console.log("Hello Backend");

import express from 'express';
import cors from 'cors';
import fs from "fs/promises"; 
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());

//json-File Pfad von allen Nutzern. Hier sollen User gespeichert und ausgelesen werden
const users = "./users.json";



//fügt User users.json File hinzu -> POST request kommt vom Frontend und wird dann hiermit ausgeführt.
app.post('/users', async (req, res) => {
  const user = req.body;
  const allUsers = await loadUsers();
  allUsers.push(user);        
  await writeUsersToFile(allUsers);   
  console.log('Empfangene Benutzerdaten:', user);
  res.status(201).json(user);
});






//User Speicher/Write-Funktion
async function writeUsersToFile(usersArray) {
  const data = JSON.stringify(usersArray, null, 2);
  await fs.writeFile(users, data);
  console.log('Benutzerdaten in users.json gespeichert');
}

//user Load-Funktion für alle Benutzerdaten
async function loadUsers() {
  const data = await fs.readFile(users, "utf8");
  return JSON.parse(data);
}

//alle Users laden und ans Frontend schicken
<<<<<<< HEAD
app.get('/users', async (req, res) => {
    const users = await loadUsers();            //loadUsers ladet alle Users vom json-File
    res.json(users);
})
=======
app.get("/users", async (req, res) => {
  const allUsers = await loadUsers();
  res.json(allUsers);
});
>>>>>>> 4c03b20f23b6fafad8767e7a9983abe6b9b5b80f


app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
