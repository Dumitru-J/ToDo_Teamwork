// controller.js
import { getTodos, addTodo, updateTodo, deleteTodo, clearDone } from './model.js'; // Import der Datenfunktionen (API-Calls) aus model.js
import { View } from './view.js'; // Import der View-Methoden für DOM-Anzeige

// Hilfsfunktion um den aktuellen Benutzer aus localStorage zu laden
function getCurrentUser() { // Funktion beginnt
  const id = localStorage.getItem('userId'); // userId aus localStorage holen
  const email = localStorage.getItem('email'); // email aus localStorage holen
  return id && email ? { id, email } : null; // wenn beide da → Objekt zurück, sonst null
}





export const Controller = { // Controller-Objekt exportieren

  async init() { // Haupt-Initialisierungsfunktion, wird beim Laden der Seite aufgerufen

    const taskForm = document.querySelector('#taskForm'); // Formular-Element suchen
    if (!taskForm) return; // wenn kein Formular existiert → abbrechen (nicht auf Aufgaben-Seite)

    const user = getCurrentUser(); // aktuellen User holen
    if (!user) { window.location.href = 'index.html'; return; } // wenn nicht eingeloggt → zurück zur Loginseite

    const whoEl = document.querySelector('#who'); // Element mit Useranzeige suchen
    if (whoEl) whoEl.textContent = `Angemeldet als ${user.email}`; // falls vorhanden → User-E-Mail anzeigen

    await this.reload(); // aktuelle Todos vom Backend laden und anzeigen



    


    // ----------------- Neues Todo hinzufügen -----------------
    taskForm.addEventListener('submit', async (e) => { // EventListener für Formular-Submit
      e.preventDefault(); // Standard-Formularverhalten (Seite neu laden) verhindern
      const input = document.querySelector('#neueAufgabe'); // Eingabefeld suchen
      const text = input.value.trim(); // Wert lesen und Leerzeichen entfernen
      if (!text) return; // wenn leer → nichts tun
      try {
        await addTodo(user.id, text); // neues Todo beim Backend anlegen
        input.value = ''; // Eingabefeld leeren
        await this.reload(); // Todos neu laden und anzeigen
      } catch (err) {
        View.showMessage(err.message, 'err'); // Fehler anzeigen
      }
    });







    
    // ----------------- Checkbox ändern (erledigt ja/nein) -----------------
    document.querySelector('#aufgabenListe').addEventListener('change', async (e) => { // EventListener auf UL (Event Delegation)
      const tgt = e.target; // das Ziel-Element (wer die Änderung ausgelöst hat)
      if (tgt && tgt.matches('.todo-checkbox')) { // prüfen ob es eine Checkbox ist
        const id = tgt.dataset.id; // Todo-ID aus data-id lesen
        try {
          await updateTodo(id, { done: tgt.checked }); // Backend: Todo auf erledigt/nicht erledigt setzen
          await this.reload(); // Todos neu laden
        } catch (err) {
          View.showMessage(err.message, 'err'); // Fehler anzeigen
        }
      }
    });









    // ----------------- Todo löschen -----------------
    document.querySelector('#aufgabenListe').addEventListener('click', async (e) => { // EventListener für Klicks auf UL
      const tgt = e.target; // Ziel-Element
      if (tgt && tgt.matches('.todo-del')) { // prüfen ob Klick auf Löschen-Button
        const id = tgt.dataset.id; // ID aus data-id holen
        try {
          await deleteTodo(id); // Backend: Todo löschen
          await this.reload(); // Todos neu laden
        } catch (err) {
          View.showMessage(err.message, 'err'); // Fehler anzeigen
        }
      }
    });








    // ----------------- Erledigte Todos löschen -----------------
    const clearBtn = document.querySelector('#clearDone'); // Button zum Aufräumen suchen
    if (clearBtn) { // wenn vorhanden
      clearBtn.addEventListener('click', async () => { // Klick-Event
        try {
          await clearDone(user.id); // Backend: erledigte Todos löschen
          await this.reload(); // Todos neu laden
        } catch (e) {
          View.showMessage(e.message, 'err'); // Fehler anzeigen
        }
      });
    }







    // ----------------- Abmelden -----------------
    const logoutBtn = document.querySelector('#abmelden'); // Logout-Button suchen
    if (logoutBtn) { // wenn vorhanden
      logoutBtn.addEventListener('click', () => { // Klick-Event
        localStorage.removeItem('userId'); // UserID aus localStorage löschen
        localStorage.removeItem('email'); // Email aus localStorage löschen
        window.location.href = 'index.html'; // zurück zur Login-Seite
      });
    }
  },

  async reload() { // Hilfsfunktion zum Todos neu laden
    const user = getCurrentUser(); // aktuellen User laden
    const todos = await getTodos(user.id); // Todos vom Backend holen
    View.renderTodos(todos); // Todos mit View.js darstellen
  }
};



