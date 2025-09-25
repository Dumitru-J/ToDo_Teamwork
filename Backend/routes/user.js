// backend/routes/user.js

// Express importieren (Framework für HTTP-Server)
const express = require('express');

// FileSystem-Promises importieren, um JSON-Dateien asynchron zu lesen/schreiben
const fs = require('fs/promises');

// existsSync aus fs importieren, um zu prüfen, ob eine Datei existiert
const { existsSync } = require('fs');

// path importieren, um Dateipfade plattformunabhängig zusammenzubauen
const path = require('path');

// Einen neuen Router erstellen (kleiner Express-Server nur für diese Routen)
const router = express.Router();

// Pfad zur Datei users.json -> speichert alle Benutzer
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

// Pfad zur Datei todos.json -> speichert alle Todos
const todosPath = path.join(__dirname, '..', 'data', 'todos.json');

// ---------------------------------------------------------
// Hilfsfunktionen für Dateizugriff
// ---------------------------------------------------------

// Prüft, ob Datei existiert, und legt sie an falls nicht oder leer
async function ensureFile(p, initial = '[]') {         // Funktion mit Pfad + Initialinhalt
  if (!existsSync(p)) {                                // Falls Datei nicht existiert
    await fs.writeFile(p, initial, 'utf8');            // Neue Datei mit [] schreiben
    return;                                            // Beenden
  }
  const txt = await fs.readFile(p, 'utf8');            // Datei-Inhalt lesen
  if (!txt.trim()) {                                   // Falls leer oder nur Leerzeichen
    await fs.writeFile(p, initial, 'utf8');            // Mit [] überschreiben
  }
}

// Lädt JSON-Inhalt aus Datei p
async function loadJSON(p) {                           // Funktion mit Dateipfad
  await ensureFile(p);                                 // Erst sicherstellen, dass Datei existiert
  return JSON.parse(await fs.readFile(p, 'utf8'));     // Datei lesen und in Objekt/Array umwandeln
}

// Speichert JSON-Inhalt in Datei p
async function saveJSON(p, data) {                     // Funktion mit Pfad + Daten
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8'); // Schön formatiert in Datei schreiben
}

// Generiert eine eindeutige ID (Präfix + Zeit + Zufallsanteil)
const newId = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;

// ---------------------------------------------------------
// User-Routen (Registrieren / Anmelden)
// ---------------------------------------------------------

// Registrierung: POST /api/users/registrieren
router.post('/users/registrieren', async (req, res) => {
  const { email, password } = req.body || {};              // email und password aus Request-Body
  if (!email || !password)                                 // Wenn eins fehlt
    return res.status(400).json({ error: 'email und password erforderlich' }); // Fehler 400 zurück

  const users = await loadJSON(usersPath);                 // Alle User aus Datei laden

  // Prüfen, ob Email schon existiert (case-insensitive)
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'Benutzer existiert bereits' }); // Fehler 409 zurück
  }

  // Neuen Benutzer erstellen
  const user = {
    id: newId('u'),                                        // Neue ID generieren
    email,                                                 // Email speichern
    password,                                              // Passwort im Klartext (nur Demo!)
    createdAt: new Date().toISOString(),                   // Zeitstempel
  };

  users.push(user);                                        // User zur Liste hinzufügen
  await saveJSON(usersPath, users);                        // Liste in Datei zurückschreiben

  res.status(201).json({ id: user.id, email: user.email }); // Antwort mit ID und Email (ohne Passwort)
});

// Anmelden: POST /api/users/anmelden
router.post('/users/anmelden', async (req, res) => {
  const { email, password } = req.body || {};              // email und password aus Request-Body
  if (!email || !password)                                 // Wenn eins fehlt
    return res.status(400).json({ error: 'email und password erforderlich' }); // Fehler 400 zurück

  const users = await loadJSON(usersPath);                 // Alle User laden

  // Prüfen, ob User existiert und Passwort passt
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&     // Email gleich (case-insensitive)
      u.password === password                              // Passwort gleich
  );

  if (!user) return res.status(401).json({ error: 'Ungültige Anmeldedaten' }); // Fehler 401 zurück

  res.json({ id: user.id, email: user.email });            // Erfolg → ID + Email zurück
});

// ---------------------------------------------------------
// Todo-Routen (CRUD: Create, Read, Update, Delete)
// ---------------------------------------------------------

// Todos eines Users abrufen: GET /api/todos?userId=...
router.get('/todos', async (req, res) => {
  const { userId } = req.query;                            // userId aus Query-Parameter holen
  if (!userId) return res.status(400).json({ error: 'userId erforderlich' }); // Wenn fehlt → Fehler 400

  const todos = await loadJSON(todosPath);                 // Todos laden
  res.json(todos.filter((t) => t.userId === userId));      // Nur Todos von diesem User zurückgeben
});

// Neues Todo erstellen: POST /api/todos
router.post('/todos', async (req, res) => {
  const { userId, text } = req.body || {};                 // userId und Text aus Body
  if (!userId || !text?.trim())                            // Wenn fehlt oder leer
    return res.status(400).json({ error: 'userId und text erforderlich' }); // Fehler 400

  const todos = await loadJSON(todosPath);                 // Todos laden

  const todo = {
    id: newId('t'),                                        // Neue Todo-ID generieren
    userId,                                                // User-ID speichern
    text: text.trim(),                                     // Text speichern (Trim = Leerzeichen entfernen)
    done: false,                                           // Anfangsstatus = unerledigt
    createdAt: new Date().toISOString(),                   // Zeitstempel
  };

  todos.push(todo);                                        // Neues Todo in Liste packen
  await saveJSON(todosPath, todos);                        // Todos zurückschreiben

  res.status(201).json(todo);                              // Antwort mit neuem Todo
});

// Todo ändern (Text/Status): PATCH /api/todos/:id
router.patch('/todos/:id', async (req, res) => {
  const { id } = req.params;                               // ID aus URL-Parameter holen
  const { text, done } = req.body || {};                   // Felder aus Body (optional)

  const todos = await loadJSON(todosPath);                 // Todos laden
  const idx = todos.findIndex((t) => t.id === id);         // Index des Todos mit passender ID
  if (idx < 0) return res.status(404).json({ error: 'Todo nicht gefunden' }); // Wenn nicht gefunden → 404

  if (typeof text === 'string') todos[idx].text = text;    // Text aktualisieren, falls vorhanden
  if (typeof done === 'boolean') todos[idx].done = done;   // Status aktualisieren, falls vorhanden

  await saveJSON(todosPath, todos);                        // Liste zurückschreiben
  res.json(todos[idx]);                                    // Geändertes Todo zurückgeben
});

// Todo löschen: DELETE /api/todos/:id
router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;                               // ID aus URL
  const todos = await loadJSON(todosPath);                 // Todos laden
  const idx = todos.findIndex((t) => t.id === id);         // Index suchen
  if (idx < 0) return res.status(404).json({ error: 'Todo nicht gefunden' }); // Wenn nicht da → Fehler 404

  const [removed] = todos.splice(idx, 1);                  // Todo aus Array entfernen
  await saveJSON(todosPath, todos);                        // Rest speichern
  res.json(removed);                                       // Gelöschtes Todo zurückgeben
});

// Alle erledigten Todos löschen: DELETE /api/todos?userId=...&done=true
router.delete('/todos', async (req, res) => {
  const { userId, done } = req.query;                      // userId und done aus Query
  if (!userId || done !== 'true')                          // Wenn Parameter fehlen
    return res.status(400).json({ error: 'userId und done=true erforderlich' }); // Fehler 400

  const todos = await loadJSON(todosPath);                 // Todos laden
  const remaining = todos.filter(                          // Nur Todos behalten, die NICHT erledigt sind
    (t) => !(t.userId === userId && t.done === true)
  );
  const removed = todos.length - remaining.length;         // Anzahl der entfernten Todos berechnen

  await saveJSON(todosPath, remaining);                    // Gefilterte Todos speichern
  res.json({ removed });                                   // Anzahl der gelöschten Todos zurückgeben
});

// Router exportieren, damit server.js ihn einbinden kann
module.exports = router;
