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
async function ensureFile(p, initial = '[]') {
  if (!existsSync(p)) {
    await fs.writeFile(p, initial, 'utf8');
    return;
  }
  const txt = await fs.readFile(p, 'utf8');
  if (!txt.trim()) {
    await fs.writeFile(p, initial, 'utf8');
  }
}


// Lädt JSON-Inhalt aus Datei p
async function loadJSON(p) {
  await ensureFile(p);
  return JSON.parse(await fs.readFile(p, 'utf8'));
}


// Speichert JSON-Inhalt in Datei p
async function saveJSON(p, data) {
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8');
}


// Generiert eine eindeutige ID (Präfix + Zeit + Zufallsanteil)
const newId = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;



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

  const user = {
    id: newId('u'),                                        // Neue ID generieren
    email,                                                 // Email speichern
    password,                                              // Passwort im Klartext (nur Demo!)
    createdAt: new Date().toISOString(),                   // Zeitstempel
  };

  users.push(user);                                        // User zur Liste hinzufügen
  await saveJSON(usersPath, users);                        // Liste in Datei zurückschreiben

  res.status(201).json({ id: user.id, email: user.email });
});


// Anmelden: POST /api/users/anmelden
router.post('/users/anmelden', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: 'email und password erforderlich' });

  const users = await loadJSON(usersPath);

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) return res.status(401).json({ error: 'Ungültige Anmeldedaten' });

  res.json({ id: user.id, email: user.email });
});


// ---------------------------------------------------------
// Todo-Routen (CRUD: Create, Read, Update, Delete)
// ---------------------------------------------------------


// Todos eines Users pro Liste abrufen: GET /api/todos?userId=...&listId=...
router.get('/todos', async (req, res) => {
  const { userId, listId } = req.query;
  if (!userId || !listId)
    return res.status(400).json({ error: 'userId und listId erforderlich' });

  const todos = await loadJSON(todosPath);
  const filteredTodos = todos.filter((t) => t.userId === userId && t.listId === listId);
  res.json(filteredTodos);
});


// Neues Todo erstellen: POST /api/todos
router.post('/todos', async (req, res) => {
  const { userId, listId, text } = req.body || {};
  if (!userId || !listId || !text?.trim())
    return res.status(400).json({ error: 'userId, listId und text erforderlich' });

  const todos = await loadJSON(todosPath);

  const todo = {
    id: newId('t'),
    userId,
    listId,
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(todo);
  await saveJSON(todosPath, todos);

  res.status(201).json(todo);
});


// Todo ändern (Text/Status): PATCH /api/todos/:id
router.patch('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body || {};

  const todos = await loadJSON(todosPath);
  const idx = todos.findIndex((t) => t.id === id);
  if (idx < 0) return res.status(404).json({ error: 'Todo nicht gefunden' });

  if (typeof text === 'string') todos[idx].text = text;
  if (typeof done === 'boolean') todos[idx].done = done;

  await saveJSON(todosPath, todos);
  res.json(todos[idx]);
});


// Todo löschen: DELETE /api/todos/:id
router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todos = await loadJSON(todosPath);
  const idx = todos.findIndex((t) => t.id === id);
  if (idx < 0) return res.status(404).json({ error: 'Todo nicht gefunden' });

  const [removed] = todos.splice(idx, 1);
  await saveJSON(todosPath, todos);
  res.json(removed);
});


// Alle erledigten Todos löschen: DELETE /api/todos?userId=...&done=true
router.delete('/todos', async (req, res) => {
  const { userId, done } = req.query;
  if (!userId || done !== 'true')
    return res.status(400).json({ error: 'userId und done=true erforderlich' });

  const todos = await loadJSON(todosPath);
  const remaining = todos.filter((t) => !(t.userId === userId && t.done === true));
  const removed = todos.length - remaining.length;

  await saveJSON(todosPath, remaining);
  res.json({ removed });
});



// ---------------------------------------------------------
// Listen-Routen (CRUD für To-Do-Listen)
// ---------------------------------------------------------

/**
 * Alle To-Do-Listen eines Nutzers abrufen
 * GET /api/lists?userId=...
 * @param {string} userId - ID des Nutzers (Query-Parameter)
 * @returns {Array} Array mit Listen-Objekten
 */
router.get('/lists', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId erforderlich' });
  }

  try {
    await ensureFile(listsPath);
    const lists = await loadJSON(listsPath);
    const userLists = lists.filter((list) => list.userId === userId);
    res.json(userLists);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Listen' });
  }
});


/**
 * Neue To-Do-Liste anlegen
 * POST /api/lists
 * @param {string} userId - ID des Nutzers
 * @param {string} name - Name der neuen To-Do-Liste
 * @returns {object} Das neu erstellte Listen-Objekt mit id und name
 */
router.post('/lists', async (req, res) => {
  const { userId, name } = req.body || {};
  if (!userId || !name?.trim()) {
    return res.status(400).json({ error: 'userId und name erforderlich' });
  }

  try {
    await ensureFile(listsPath);
    const lists = await loadJSON(listsPath);

    const list = {
      id: newId('l'),
      userId,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };

    lists.push(list);
    await saveJSON(listsPath, lists);

    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern der Liste' });
  }
});



// Router exportieren, damit server.js ihn einbinden kann
module.exports = router;
