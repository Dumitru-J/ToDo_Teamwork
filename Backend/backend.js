

import express from 'express';                                                                  //npm install --save-dev @types/express -> IntelliSense Extention ts(7016) error solution
import cors from 'cors';                                                                        //npm i --save-dev @types/cors -> IntelliSense Extention ts(7016) error solution
import fs from "fs/promises";
import path from "path";
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());

//json-File von allen Nutzern. Hier sollen User gespeichert und ausgelesen werden
const users = "./users.json";

// Ordner für alle User-To-Do-Listen
const toDoListen = "./ToDos";                 // Ordner für alle User-To-Do-Listen


// ------------------ USER ROUTEN ------------------

//!USER-REGISTRIERUNG!
//fügt User users.json hinzu
app.post('/registrieren', async (req, res) => {
  //const user = req.body;                                                                        //Nutzerdaten vom request-body
  const { email, password } = req.body;   //besser. Holt sich nur relevantes
  const allUsers = await loadUsers();                                                             //Liste existierenter Users wird geladen

  //checkt ob neuer user bereits existiert .toLowerCase verhindert groß/klein Registrierung mit selber E-Mail 
  const exists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());               //some -> array-Methode die checkt ob ein Element eine Bedingung erfüllt
  if (exists) {                                                                                   //in diesem Fall: ob eine E-Mail Addresse bereits existiert
    console.log(`User mit der E-Mail "${email}" existiert bereits!`);
    return res.status(400).json({ message: "User existiert bereits" });                           //400 -> schickt Fehlermeldung mit Message zurück
  }

  //speichert neuen User
  const newUser = { email, password };
  allUsers.push(newUser);
  await writeUsersToFile(allUsers);

  //erstellt To-Do-Listen-Datei für neuen User
  const toDoPath = getToDoPath(email);
  await fs.writeFile(toDoPath, JSON.stringify([], null, 2));

  console.log('Neuer Benutzer gespeichert:', email);
  res.status(201).json({
    message: 'Neuer Benutzer gespeichert und To-Do-Listen Datei angelegt',user: email
  });
});
                                                                                         //user: user.email weil Objektliterale so nicht erlaubt (erwartet key: value)


//!USER-ANMELDUNG!
// Prüft Login-Daten und meldet User an sofern Login-Daten stimmen
app.post('/anmelden', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email und Passwort erforderlich" });
  }

  const allUsers = await loadUsers();
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    console.log(`Login fehlgeschlagen für: ${email}`);
    return res.status(401).json({ message: "Email oder Passwort falsch" });
  }

  console.log("User angemeldet:", email);
  res.status(200).json({ message: "Login erfolgreich", user: email });
});

//!USER-ABMELDUNG!
app.post('/abmelden', (req, res) => {
  //res.redirect("/index.html");                                                     wenn nicht über Frontend (laut MCP -> Frontend-Umleitung)
  console.log("User abgemeldet");
  res.status(200).json({ message: "Logout erfolgreich" });
});

//!USER-LISTE
app.get("/users", async (req, res) => {
  const allUsers = await loadUsers();
  res.json(allUsers);
});

//User Speicher/Write-Funktion
async function writeUsersToFile(usersArray) {
  const data = JSON.stringify(usersArray, null, 2);
  await fs.writeFile(users, data);
  console.log('Benutzerdaten in users.json gespeichert');
}

//User Load-Funktion für alle Benutzerdaten in einer Liste
async function loadUsers() {
  const data = await fs.readFile(users, "utf8");
  return JSON.parse(data);
}




// ------------------ TO-DO ROUTEN ------------------
//!TO-DO-Liste erstellen -> bei /registrieren eingebaut

//!TO-DO-Liste bei Änderungen aktualisieren
app.post("/todos/save", async (req, res) => {
  const { email, todos } = req.body;
  const toDoPath = getToDoPath(email);
  try {
    await fs.writeFile(toDoPath, JSON.stringify(todos, null, 2));
    console.log(`ToDo-Liste für ${email} gespeichert`);
    res.status(200).json({ message: "ToDo-Liste gespeichert" });
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
    res.status(500).json({ message: "Fehler beim Speichern der ToDo-Liste" });
  }
});


//Pfad zur To-Do-json.Datei eines Users
function getToDoPath(email) {
  const useremail = email.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return path.join(toDoListen, `${useremail}.json`);
}





//Console-Check ob Server läuft
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}.`);
});