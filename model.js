// model.js

// Basis-URL deines Backends (läuft auf localhost:3000/api)
const API = 'http://localhost:3000/api';

// ----------------------------------------------
// Benutzer registrieren
// ----------------------------------------------
export async function register(email, password) {                   // Funktion für Registrierung
  const res = await fetch(`${API}/users/registrieren`, {            // POST-Request an /users/registrieren
    method: 'POST',                                                 // HTTP-Methode POST
    headers: { 'Content-Type': 'application/json' },                // Sagen: Wir senden JSON
    body: JSON.stringify({ email, password })                       // Request-Body mit E-Mail und Passwort
  });
  const data = await res.json();                                    // Antwort als JSON parsen
  if (!res.ok) throw new Error(data.error || 'Registrierung fehlgeschlagen'); // Wenn Status != 200-299 → Fehler werfen
  return data;                                                      // Erfolgreich → Daten zurückgeben ({id, email})
}

// ----------------------------------------------
// Benutzer anmelden (Login)
// ----------------------------------------------
export async function login(email, password) {                      // Funktion für Login
  const res = await fetch(`${API}/users/anmelden`, {                // POST-Request an /users/anmelden
    method: 'POST',                                                 // HTTP-Methode POST
    headers: { 'Content-Type': 'application/json' },                // JSON als Format
    body: JSON.stringify({ email, password })                       // Request-Body
  });
  const data = await res.json();                                    // Antwort parsen
  if (!res.ok) throw new Error(data.error || 'Login fehlgeschlagen'); // Fehler wenn Status != ok
  return data;                                                      // Erfolgreich → {id, email}
}

// ----------------------------------------------
// Todos eines Users laden
// ----------------------------------------------
export async function getTodos(userId) {                            // Funktion: Todos für User laden
  if (!userId) throw new Error('Kein userId – erst einloggen!');     // Sicherheit: ohne userId nicht möglich
  const res = await fetch(`${API}/todos?userId=${encodeURIComponent(userId)}`); // GET-Request an /todos mit Query userId
  if (!res.ok) throw new Error(`Todos laden fehlgeschlagen (${res.status})`);   // Fehler abfangen
  return res.json();                                                 // Erfolgreich → Array von Todos zurück
}

// ----------------------------------------------
// Neues Todo anlegen
// ----------------------------------------------
export async function addTodo(userId, text) {                       // Funktion: neues Todo anlegen
  const res = await fetch(`${API}/todos`, {                         // POST an /todos
    method: 'POST',                                                 // HTTP POST
    headers: { 'Content-Type': 'application/json' },                // JSON senden
    body: JSON.stringify({ userId, text })                          // Body mit User-ID und Text
  });
  if (!res.ok) throw new Error('Todo anlegen fehlgeschlagen');       // Fehler prüfen
  return res.json();                                                 // Antwort = neues Todo-Objekt
}

// ----------------------------------------------
// Todo aktualisieren (Text oder erledigt-Status ändern)
// ----------------------------------------------
export async function updateTodo(id, patch) {                       // Funktion: Todo updaten
  const res = await fetch(`${API}/todos/${encodeURIComponent(id)}`, { // PATCH an /todos/:id
    method: 'PATCH',                                                // HTTP PATCH
    headers: { 'Content-Type': 'application/json' },                // JSON senden
    body: JSON.stringify(patch)                                     // Body mit Feldern {text?, done?}
  });
  if (!res.ok) throw new Error('Todo update fehlgeschlagen');        // Fehler prüfen
  return res.json();                                                 // Antwort = aktualisiertes Todo
}

// ----------------------------------------------
// Todo löschen
// ----------------------------------------------
export async function deleteTodo(id) {                              // Funktion: Todo löschen
  const res = await fetch(`${API}/todos/${encodeURIComponent(id)}`, { // DELETE an /todos/:id
    method: 'DELETE'                                                // HTTP DELETE
  });
  if (!res.ok) throw new Error('Todo löschen fehlgeschlagen');       // Fehler prüfen
  return res.json();                                                 // Antwort = gelöschtes Todo
}

// ----------------------------------------------
// Alle erledigten Todos eines Users löschen
// ----------------------------------------------
export async function clearDone(userId) {                           // Funktion: erledigte Todos löschen
  const res = await fetch(`${API}/todos?userId=${encodeURIComponent(userId)}&done=true`, { // DELETE an /todos?userId=..&done=true
    method: 'DELETE'                                                // HTTP DELETE
  });
  if (!res.ok) throw new Error('Erledigte löschen fehlgeschlagen');  // Fehler prüfen
  return res.json();                                                 // Antwort = {removed: n}
}
