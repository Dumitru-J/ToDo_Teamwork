

import express from 'express';    //npm install --save-dev @types/express -> IntelliSense Extention ts(7016) error solution
import cors from 'cors';          //npm i --save-dev @types/cors -> IntelliSense Extention ts(7016) error solution
import fs from "fs/promises"; 
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());

//json-File von allen Nutzern. Hier sollen User gespeichert und ausgelesen werden
const users = "./users.json";

//!USER-Routen und Funktionen!

//!USER-REGISTRIERUNG!
//fügt User users.json hinzu
app.post('/registrieren', async (req, res) => {
  const user = req.body;                                                                        //Nutzerdaten vom request-body
  const allUsers = await loadUsers();                                                           //Liste existierenter Users wird geladen

  //checkt ob neuer user bereits existiert .toLowerCase verhindert groß/klein Registrierung mit selber E-Mail 
  const exists = allUsers.some(u => u.email.toLowerCase() === user.email.toLowerCase());       //some -> array-Methode die checkt ob ein Element eine Bedingung erfüllt
  if (exists) {                                                                                //in diesem Fall: ob eine E-Mail Addresse bereits existiert
    console.log('User mit der E-Mail "', user.email, '" existiert bereits!');
    return res.status(400).json({ message: 'User existiert bereits' });                        //400 -> schickt Fehlermeldung mit Message zurück
  }

  //speichert neuen User
  allUsers.push(user);
  await writeUsersToFile(allUsers);

  //erstellt To-Do-Listen-Datei für neuen User
  const toDoPath = getToDoPath(user.email);
  await fs.writeFile(toDoPath, JSON.stringify([], null, 2));

  console.log('Neuer Benutzer gespeichert:', user.email);
  res.status(201).json({ message: 'Neuer Benutzer gespeichert', user: user.email });         //201 (created) -> schickt Erfolgsmeldung mit Message zurück und erstellt User
  res.status(201).json({ message: 'To-Do-Listen Datei für neuen Benutzer angelegt:', user: user.email });
});                                                                                          //user: user.email weil Objektliterale so nicht erlaubt (erwartet key: value)


//!USER-ANMELDUNG!
// Prüft Login-Daten und meldet User an sofern Login-Daten stimmen
app.post('/anmelden', async (req, res) => {
  const user = req.body;
  const allUsers = await loadUsers();

 
  const userexists = allUsers.find(u => u.email.toLowerCase() === user.email.toLowerCase());        //Array-Methode die nach Element mit identischer E-Mail/User sucht
                                                                                                    //und ganzes Element (Objekt mit email und passwort) zwischenspeichert
  if (!userexists) {                                                                                //wenn keine passende E-Mail Addresse gefunden wird, dann:
    console.log('Login fehlgeschlagen: User mit Email', user.email, 'nicht gefunden');
    return res.status(401).json({ message: 'Email oder Passwort falsch' });
  }

  if (user.password !== userexists.password) {                                                      //wenn das Passwort nicht übereinstimmt, dann ebenso:
    console.log('Login fehlgeschlagen: Falsches Passwort für', user.email);
    return res.status(401).json({ message: 'Email oder Passwort falsch' });
  }

  // Login erfolgreich
  console.log('User angemeldet:', user.email);
  res.status(200).json({ message: 'Login erfolgreich', user: user.email });                         //200 (OK) -> "Überprüft und OK"-Message
});

//!USER-ABMELDUNG!
app.post('/abmelden', (req, res) => {
  console.log('User abgemeldet');
  res.status(200).json({ message: 'Logout erfolgreich' });
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

//alle Users laden und als Response schicken
app.get("/users", async (req, res) => {
  const allUsers = await loadUsers();
  res.json(allUsers);
});

//!TO-DO-Liste Routen!

const toDoListen = "./ToDos";                 // Ordner für alle User-To-Do-Listen

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
  // Email -> gültiger Dateiname (z. B. alles klein, Sonderzeichen ersetzen)
  const useremail = email.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return path.join(toDoOrdner, `${useremail}.json`);
}




//Console-Check ob Server läuft
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}.`);
});