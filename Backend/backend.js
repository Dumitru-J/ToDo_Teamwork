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
app.post('/users', (req, res) => {
    const user = req.body;
    users.push(user);
    writeUsersToFile(users);
    console.log('Empfangene Benutzerdaten:', user);
    res.status(201).send(user);
});






//User Speicher/Write-Funktion
async function writeUsersToFile(users) {
    const data = JSON.stringify(users, null, 2);
    await fs.writeFile('users.json', data);
    console.log('Benutzerdaten in user.json gespeichert');
}

//user Load-Funktion für alle Benutzerdaten
async function loadUsers() {
    const data = await fs.readFile(users.json, "utf8");
    return JSON.parse(data);
}

//alle Users laden und ans Frontend schicken
app.get('/users', async (req, res) => {
    const users = await loadUsers();            //loadUsers ladet alle Users vom json-File
    res.json(users);
})


app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
