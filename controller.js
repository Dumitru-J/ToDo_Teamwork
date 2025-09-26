// controller.js
import { getTodos, addTodo, updateTodo, deleteTodo, clearDone, getUserLists, addList } from './model.js';
import { View } from './view.js';

/**
 * Hilfsfunktion, um den aktuellen Benutzer aus localStorage zu laden
 * @returns {{id: string, email: string} | null} aktueller Benutzer oder null wenn nicht eingeloggt
 */
function getCurrentUser() {
  const id = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  return id && email ? { id, email } : null;
}

export const Controller = {
  /** @type {string|null} ID der aktuell aktiven To-Do-Liste */
  activeListId: null,

  /**
   * Initialisiert Controller, bindet Events und lädt initial Daten.
   * @returns {Promise<void>}
   */
  async init() {
    const taskForm = document.querySelector('#taskForm');
    const listeForm = document.querySelector('#listeForm');
    const listeAuswahl = document.querySelector('#listeAuswahl');

    if (!taskForm || !listeForm || !listeAuswahl) return;

    const user = getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return;
    }

    const whoEl = document.querySelector('#who');
    if (whoEl) whoEl.textContent = `Angemeldet als ${user.email}`;

    // Liste der To-Do-Listen des Benutzers laden
    const listen = await getUserLists(user.id);
    this.populateListeAuswahl(listen);

    // Aktive Liste auf erste setzen, falls vorhanden
    this.activeListId = listen.length > 0 ? listen[0].id : null;

    if (this.activeListId) {
      await this.reload();
    }

    // Event: Auswahl der aktiven Liste ändern
    listeAuswahl.addEventListener('change', async (e) => {
      /** @type {HTMLSelectElement} */
      const target = e.target;
      this.activeListId = target.value;
      await this.reload();
    });





    // Event: Neue To-Do-Liste hinzufügen
    listeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const neueListeInput = document.querySelector('#neueListe');
      const neueListeName = neueListeInput.value.trim();
      if (!neueListeName) return;

      try {
        /** @type {{id: string, name: string}} */
        const neueListe = await addList(user.id, neueListeName);
        neueListeInput.value = '';
        const updatedListen = await getUserLists(user.id);
        this.populateListeAuswahl(updatedListen);
        this.activeListId = neueListe.id;
        await this.reload();
      } catch (err) {
        View.showMessage(err.message, 'err');
      }
    });





    // Event: Neue Aufgabe hinzufügen
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.querySelector('#neueAufgabe');
      const text = input.value.trim();
      if (!text || !this.activeListId) return;

      try {
        await addTodo(user.id, text, this.activeListId);
        input.value = '';
        await this.reload();
      } catch (err) {
        View.showMessage(err.message, 'err');
      }
    });





    // Event: Checkbox geändert (erledigt / nicht erledigt)
    document.querySelector('#aufgabenListe').addEventListener('change', async (e) => {
      const tgt = e.target;
      if (tgt && tgt.matches('.todo-checkbox')) {
        const id = tgt.dataset.id;
        try {
          await updateTodo(id, { done: tgt.checked });
          await this.reload();
        } catch (err) {
          View.showMessage(err.message, 'err');
        }
      }
    });





    // Event: ToDo löschen
    document.querySelector('#aufgabenListe').addEventListener('click', async (e) => {
      const tgt = e.target;
      if (tgt && tgt.matches('.todo-del')) {
        const id = tgt.dataset.id;
        try {
          await deleteTodo(id);
          await this.reload();
        } catch (err) {
          View.showMessage(err.message, 'err');
        }
      }
    });

    // Event: Erledigte ToDos löschen
    const clearBtn = document.querySelector('#clearDone');
    if (clearBtn) {
      clearBtn.addEventListener('click', async () => {
        try {
          await clearDone(user.id, this.activeListId);
          await this.reload();
        } catch (e) {
          View.showMessage(e.message, 'err');
        }
      });
    }






    // Event: Abmelden
    const logoutBtn = document.querySelector('#abmelden');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        window.location.href = 'index.html';
      });
    }
  },









  /**
   * Befüllt das Dropdown mit den To-Do-Listen
   * @param {Array<{id: string, name: string}>} listen Array von Listenobjekten
   */
  populateListeAuswahl(listen) {
    const listeAuswahl = document.querySelector('#listeAuswahl');
    listeAuswahl.innerHTML = '';
    listen.forEach(liste => {
      const option = document.createElement('option');
      option.value = liste.id;
      option.textContent = liste.name;
      listeAuswahl.appendChild(option);
    });
  },






  /**
   * Lädt die ToDos der aktiven Liste neu und rendert sie
   * @returns {Promise<void>}
   */
  async reload() {
    const user = getCurrentUser();
    if (!user || !this.activeListId) return;

    const todos = await getTodos(user.id, this.activeListId);
    View.renderTodos(todos);
  }
};
