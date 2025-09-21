# ToDo_Teamwork

Gruppenarbeit User-Management (registrieren, anmelden und abmelden) + To-Do-Listen (erstellen, als erledigt markieren, löschen)

## Gruppen
- 3-4 Personen
- 6 Stunden geplante Arbeitszeit (nach Klaus)
- Abgabe: Unterricht nächsten Freitag (26.09.2025)

## Projekt Details (Frontend nach MVC-Pattern + Backend, kein Hashing etc.)
- **User Management**
  - registrieren
  - anmelden
  - abmelden
- **To-Do Listen**
  - jeder User hat voneinander unabhängige To-Do Listen
  - To-Do Listen sollen erstellt und gelöscht werden können
  - Tasks in To-Do Listen sollen hinzugefügt und also erledigt markiert werden können
- **Testfälle**
  - sollen überlegt und nachweislich dokumentiert werden (fetch oder test.http Datei)
- **Präsentation**
  - soll(?) auch erstellt werden und präsentiert werden

## Vorgeschlagene Herangehensweise zum Projekt
1. Arbeitsaufteilung (wer macht was)
2. Frontend-Backend definieren
   - Route: `/users`
     - Methoden: GET, POST
   - Route: `/users/:userid` (<-path Parameter)
   - Route: `/users/:userid/todolists`
3. Umsetzung in kleinst mögliche Teile auftrennen und Schritt-für-Schritt ausführen

## Strukturidee (von Oliver)

```
Backend/
├─ users.json
├─ todo/ # Ordner für alle To-Dos
│ ├─ max@mail.de.json
│ ├─ lisa@mail.de.json
│ └─ ...
└─ backend.js

Frontend/
├─ index.html
├─ login.html
├─ todo.html
├─ model/ # Datenmodelle / fetch-Methoden
│ ├─ userModel.js
│ └─ todoModel.js
├─ view/ # DOM-Rendering
│ ├─ loginView.js
│ └─ todoView.js
└─ controller/ # Verbindet Model + View (reagiert auf Events)
├─ loginController.js
└─ todoController.js
```


