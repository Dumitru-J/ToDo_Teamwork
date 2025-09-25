// view.js
// "View" = Alles was im DOM/Frontend angezeigt wird
// Diese Datei kümmert sich nur um Darstellung, KEINE Datenlogik.

// Ein Objekt "View" mit zwei Funktionen: renderTodos() und showMessage()
export const View = {

  // ----------------------------------------------------
  // Funktion: renderTodos(todos)
  // Rendert alle Todos als <li>-Liste in das UL #aufgabenListe
  // ----------------------------------------------------
  renderTodos(todos) {
    const ul = document.querySelector('#aufgabenListe'); // Sucht die UL-Liste im DOM
    ul.innerHTML = ''; // Löscht alte Inhalte, damit die Liste frisch aufgebaut wird

    todos.forEach(t => { // Geht jedes Todo-Objekt aus dem Array durch

      const li = document.createElement('li'); // Erstellt ein <li>-Element
      li.dataset.id = t.id; // Speichert die Todo-ID als data-id Attribut (für später z. B. Löschen)
      li.className = t.done ? 'todo-item done' : 'todo-item'; // CSS-Klasse setzen (done = durchgestrichen)

      const cb = document.createElement('input'); // Erstellt eine Checkbox
      cb.type = 'checkbox'; // Typ = Checkbox
      cb.checked = !!t.done; // Wert: erledigt = true/false
      cb.className = 'todo-checkbox'; // Klasse für Styling + EventListener
      cb.dataset.id = t.id; // ID auch hier speichern

      const span = document.createElement('span'); // Erstellt ein <span>-Element
      span.className = 'todo-text'; // CSS-Klasse
      span.textContent = t.text; // Text-Inhalt aus Todo

      const del = document.createElement('button'); // Erstellt einen Button
      del.className = 'todo-del'; // CSS-Klasse
      del.textContent = 'Löschen'; // Beschriftung
      del.dataset.id = t.id; // ID speichern, damit klar ist welches Todo gelöscht werden soll

      li.append(cb, span, del); // Hängt Checkbox, Text und Button ins <li>
      ul.appendChild(li); // Fügt das fertige <li> in die UL ein
    });
  },

  // ----------------------------------------------------
  // Funktion: showMessage(text, type)
  // Zeigt eine Nachricht im #msg-Element an
  // type = "ok" (grün?) oder "err" (rot?)
  // ----------------------------------------------------
  showMessage(text, type = 'ok') {
    const msg = document.querySelector('#msg'); // Sucht das Element mit ID msg
    if (!msg) return; // Wenn nicht vorhanden, brich ab
    msg.textContent = text; // Nachrichtentext einfügen
    msg.className = `msg show ${type}`; // CSS-Klasse setzen: "msg show ok" oder "msg show err"
  }
};
