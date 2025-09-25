// app.js

// Controller importieren (steuert die Todo-Seite)
import { Controller } from './controller.js';

// login() und register() aus model.js importieren (API-Calls für Auth)
import { login, register } from './model.js';

// Warten, bis das komplette DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------
  // Login- und Registrierungs-Formulare (index.html)
  // -------------------------------

  // Login-Formular im DOM suchen
  const loginForm = document.querySelector('#loginForm');

  // Registrierungs-Formular im DOM suchen
  const registerForm = document.querySelector('#registerForm');

  // Wenn ein Login-Formular existiert (also auf index.html)
  if (loginForm) {
    // EventListener für Submit (Anmelden-Button drücken)
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Standard-Submit (Seitenreload) verhindern

      // Eingaben auslesen
      const email = document.querySelector('#email').value.trim(); // E-Mail aus Feld holen
      const password = document.querySelector('#passwort_anmelden').value; // Passwort aus Feld holen

      try {
        // API-Aufruf: Benutzer anmelden → liefert id und email zurück
        const { id, email: em } = await login(email, password);

        // Daten im localStorage speichern (für spätere API-Calls)
        localStorage.setItem('userId', id);   // User-ID speichern
        localStorage.setItem('email', em);    // E-Mail speichern

        // Erfolgreich → weiterleiten zur Aufgaben-Seite
        window.location.href = 'aufgaben.html';
      } catch (err) {
        // Fehler (z. B. falsches Passwort) → als Alert anzeigen
        alert(err.message);
      }
    });
  }

  // Wenn ein Registrierungs-Formular existiert (also auf index.html)
  if (registerForm) {
    // EventListener für Submit (Registrieren-Button drücken)
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Standard-Submit verhindern

      // Eingaben auslesen
      const email = document.querySelector('#benutzername').value.trim(); // E-Mail aus Feld holen
      const password = document.querySelector('#passwort').value;         // Passwort aus Feld holen

      try {
        // API-Aufruf: Benutzer registrieren
        await register(email, password);

        // Hinweis für User
        alert('Registrierung erfolgreich. Bitte anmelden.');
      } catch (err) {
        // Fehler (z. B. Benutzer existiert schon) → anzeigen
        alert(err.message);
      }
    });
  }

  // -------------------------------
  // Aufgaben-Seite (aufgaben.html)
  // -------------------------------

  // Egal ob index.html oder aufgaben.html geladen ist,
  // Controller.init() wird aufgerufen → prüft selbst, ob #taskForm da ist
  Controller.init();
});
