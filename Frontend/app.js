// zb 
import { registrieren, anmelden, abmelden } from "./Model/model.js";



// app.js als Controller verwenden / verbindet Model und View für User
// funktionen der Model.js verwenden
// benutzername in email ändern

// vermeidet doppelten code und sorgt für schlankere architektur


let registrierButton = document.querySelector('#registrieren');
registrierButton.addEventListener('click', async function () {
    let benutzername = document.querySelector('#benutzername').value;
    let passwort = document.querySelector('#passwort').value;   
    const data = { benutzername, passwort };
    const response = await fetch('http://localhost:3000/registrieren', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },    
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (response.ok) {
        console.log('Erfolgreich registriert:', result);
        alert('Registrierung erfolgreich! Bitte melden Sie sich an.');
        window.location.href = 'index.html'; 
    } else {
        console.error('Fehler bei der Registrierung:', result.message);
        alert('Registrierung fehlgeschlagen: ' + result.message);
    }
});

let loginButton = document.querySelector('#anmelden');
loginButton.addEventListener('click', async function() {
    let benutzername = document.querySelector('#email').value;
    let passwort = document.querySelector('#passwort_anmelden').value;
    const data = { benutzername, passwort };
    const response = await fetch('http://localhost:3000/anmelden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (response.ok) {
        console.log('Erfolgreich angemeldet:', result);
        window.location.href = 'liste.html'; 
    } else {
        console.error('Fehler bei der Anmeldung:', result.message);
        alert('Anmeldung fehlgeschlagen: ' + result.message);
    }
});




