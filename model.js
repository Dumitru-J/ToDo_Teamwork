// model.js

// Basis-URL deines Backends (läuft auf localhost:3000/api)
const API = 'http://localhost:3000/api';






/**
 * Holt alle To-Do-Listen eines Nutzers
 * @param {string} userId - ID des Nutzers
 * @returns {Promise<Array<{id: string, name: string}>>} Array mit To-Do-Listen Objekten
 */
export async function getUserLists(userId) {
  if (!userId) throw new Error('Kein userId – erst einloggen!');
  const res = await fetch(`${API}/lists?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Listen laden fehlgeschlagen (${res.status})`);
  return res.json();
}





/**
 * Neue To-Do-Liste für einen Nutzer anlegen
 * @param {string} userId - ID des Nutzers
 * @param {string} name - Name der neuen To-Do-Liste
 * @returns {Promise<{id: string, name: string}>} Das neu erstellte Listen-Objekt
 */
export async function addList(userId, name) {
  const res = await fetch(`${API}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, name })
  });
  if (!res.ok) throw new Error('Liste anlegen fehlgeschlagen');
  return res.json();
}






/**
 * Holt alle ToDos eines Nutzers für eine spezifische Liste
 * @param {string} userId - ID des Nutzers
 * @param {string} listId - ID der To-Do-Liste
 * @returns {Promise<Array>} Array der ToDos
 */
export async function getTodos(userId, listId) {
  if (!userId || !listId) throw new Error('userId und listId erforderlich');
  const res = await fetch(`${API}/todos?userId=${encodeURIComponent(userId)}&listId=${encodeURIComponent(listId)}`);
  if (!res.ok) throw new Error(`Todos laden fehlgeschlagen (${res.status})`);
  return res.json();
}






/**
 * Neues Todo anlegen in einer bestimmten Liste
 * @param {string} userId - ID des Nutzers
 * @param {string} text - Beschreibung der Aufgabe
 * @param {string} listId - ID der Liste, zu der die Aufgabe gehört
 * @returns {Promise<Object>} Das neu angelegte Todo
 */
export async function addTodo(userId, text, listId) {
  const res = await fetch(`${API}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, text, listId })
  });
  if (!res.ok) throw new Error('Todo anlegen fehlgeschlagen');
  return res.json();
}






/**
 * Aktualisiert ein Todo
 * @param {string} id - ID des Todos
 * @param {Object} patch - Teilobjekt mit Änderungen (z.B. { done: true })
 * @returns {Promise<Object>} Das aktualisierte Todo
 */
export async function updateTodo(id, patch) {
  const res = await fetch(`${API}/todos/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error('Todo update fehlgeschlagen');
  return res.json();
}






/**
 * Löscht ein Todo
 * @param {string} id - ID des Todos
 * @returns {Promise<Object>} Antwort vom Server
 */
export async function deleteTodo(id) {
  const res = await fetch(`${API}/todos/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Todo löschen fehlgeschlagen');
  return res.json();
}










/**
 * Löscht alle erledigten Todos eines Nutzers in einer bestimmten Liste
 * @param {string} userId - ID des Nutzers
 * @param {string} listId - ID der Liste
 * @returns {Promise<Object>} Antwort vom Server (z.B. Anzahl gelöschter Einträge)
 */
export async function clearDone(userId, listId) {
  const res = await fetch(`${API}/todos?userId=${encodeURIComponent(userId)}&listId=${encodeURIComponent(listId)}&done=true`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erledigte löschen fehlgeschlagen');
  return res.json();
}

/**
 * Anmelde funktion
 * @param {string} email - Die Email-Adresse des Nutzers.
 * @param {string} password - Das Passwort des Nutzers.
 * @returns {Promise<Object>} Ein Promise, das die Daten des angemeldeten Nutzers zurückgibt.
 * @throws {Error} Wenn der Login fehlschlägt, wird ein Fehler geworfen.
 */

export async function login(email, password) {            
  const res = await fetch(`${API}/users/anmelden`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login fehlgeschlagen');
  return data;
}
/** regisrtriern Email und passwort
 * @param {string} email - Die Email-Adresse des neuen Nutzers.
 * @param {string} password - Das Passwort des neuen Nutzers.
 * @returns {Promise<Object>} Ein Promise, das die Daten des neu registrierten Nutzers zurückgibt.
 * @throws {Error} Wenn die Registrierung fehlschlägt, wird ein Fehler geworfen.
 */

export async function register(email, password) {
  const res = await fetch(`${API}/users/registrieren`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registrierung fehlgeschlagen');
  return data;
}
