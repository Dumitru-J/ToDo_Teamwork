// model.js

// Basis-URL deines Backends (läuft auf localhost:3000/api)
const API = 'http://localhost:3000/api';



//  |-------------Anlegen und speichern von Usern-------------|


/**
 * Nutzer registrieren, anmelden, abmelden
 * @param {string} email - Die Email adresse der Nutzer
 * @param {string} password - Das hinterlegte Passwort der Nutzer
 * @returns {Promise<Object>} Antwort vom Server asl JSON (Erfolg oder Fehler) zB existiert, passwort falsch
 */



// Nutzer anlegen

export async function register(email, password) {                   // Funktion für Registrierung
  const res = await fetch(`${API}/users/registrieren`, {            // POST-Request an /users/registrieren
    method: 'POST',                                                 // HTTP-Methode POST
    headers: { 'Content-Type': 'application/json' },                // Sagen: Wir senden JSON
    body: JSON.stringify({ email, password })                       // Request-Body mit E-Mail und Passwort
  });
  const data = await res.json();                                    // Antwort als JSON parsen
  if (!res.ok) throw new Error(data.error || 'Registrierung fehlgeschlagen');           // Wenn Status != 200-299 → Fehler werfen
  return data;                                                      // Erfolgreich → Daten zurückgeben ({id, email})
}




// Nutzer anmelden (gleich wie regisitreiren)

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







/**
 * Nur Emails der Nutzer in der Konsole ausgeben. test Ausgabe
 * @returns {Promise<void>} Keine Rückgabe!
 */


// Alle nutzer Anzeigen (console.table)
// export async function userAnzeigen(){
//     const res = await fetch(`${API}/users`);
//     const users = await res.json();

//     // Um Passwörter nicht im klartext anzeigen zu lassen
//     const emailsOnly = users.map(user => ({ email: user.email}));
//     console.table(emailsOnly);

// }









//  |-------------Anlegen und verwalten der ToDos der registrierten User-------------|


/**
 * Aufgaben abrufen, anlegen, aktualisieren, löschen
 * @param {string} email - E-mail des Users
 * @param {string} aufgabe - Text der Aufgabe
 * @param {string|number} taskId - Eindeutuge Aufgabennummer 
 * @param {boolean} status - Erledigt / Unerledigt (True / False)
 * 
 * @returns {Promise<Array>} Array der Aufgaben
 * @returns {Promise<Object>} Antwort vom Server
 */



// Alle ToDos eines Users Anzeigen
export async function getTodos(userId) {                            // Funktion: Todos für User laden
  if (!userId) throw new Error('Kein userId – erst einloggen!');     // Sicherheit: ohne userId nicht möglich
  const res = await fetch(`${API}/todos?userId=${encodeURIComponent(userId)}`); // GET-Request an /todos mit Query userId
  if (!res.ok) throw new Error(`Todos laden fehlgeschlagen (${res.status})`);   // Fehler abfangen
  return res.json();                                                 // Erfolgreich → Array von Todos zurück
}



// ToDo anlegen     [eine Angelegte Aufgabe ist Standardmäßig als false (unerledigt) festgelegt]
export async function addTodo(userId, text) {                       // Funktion: neues Todo anlegen
  const res = await fetch(`${API}/todos`, {                         // POST an /todos
    method: 'POST',                                                 // HTTP POST
    headers: { 'Content-Type': 'application/json' },                // JSON senden
    body: JSON.stringify({ userId, text })                          // Body mit User-ID und Text
  });
  if (!res.ok) throw new Error('Todo anlegen fehlgeschlagen');       // Fehler prüfen
  return res.json();                                                 // Antwort = neues Todo-Objekt
}



// // ToDo aktualisieren   -> Erledigt / Offen
export async function updateTodo(id, patch) {                       // Funktion: Todo updaten
  const res = await fetch(`${API}/todos/${encodeURIComponent(id)}`, { // PATCH an /todos/:id
    method: 'PATCH',                                                // HTTP PATCH
    headers: { 'Content-Type': 'application/json' },                // JSON senden
    body: JSON.stringify(patch)                                     // Body mit Feldern {text?, done?}
  });
  if (!res.ok) throw new Error('Todo update fehlgeschlagen');        // Fehler prüfen
  return res.json();                                                 // Antwort = aktualisiertes Todo
}



// ToDo löschen bei Bedarf
export async function deleteTodo(id) {                              // Funktion: Todo löschen
  const res = await fetch(`${API}/todos/${encodeURIComponent(id)}`, { // DELETE an /todos/:id
    method: 'DELETE'                                                // HTTP DELETE
  });
  if (!res.ok) throw new Error('Todo löschen fehlgeschlagen');       // Fehler prüfen
  return res.json();                                                 // Antwort = gelöschtes Todo
}


// Alle erledigten Todos eines Users löschen
export async function clearDone(userId) {                           // Funktion: erledigte Todos löschen
  const res = await fetch(`${API}/todos?userId=${encodeURIComponent(userId)}&done=true`, { // DELETE an /todos?userId=..&done=true
    method: 'DELETE'                                                // HTTP DELETE
  });
  if (!res.ok) throw new Error('Erledigte löschen fehlgeschlagen');  // Fehler prüfen
  return res.json();                                                 // Antwort = {removed: n}
}




