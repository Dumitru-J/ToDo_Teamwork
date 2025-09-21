















































/*let registrierButton = document.querySelector('#registrieren');

registrierButton.addEventListener('click', async function () {
    let benutzername = document.querySelector('#benutzername').value;
    let passwort = document.querySelector('#passwort').value;

    try {
        let res = await fetch('http://localhost:3000/registrieren', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ benutzername, passwort })
        });

        if (res.ok) {
            alert('Registrierung erfolgreich! Bitte melden Sie sich an.');
            window.location.href = 'liste.html';
        } else {
            let error = await res.text();
            alert('Fehler bei der Registrierung: ' + error);
        }
    } catch (err) {
        alert('Server nicht erreichbar: ' + err.message);
    }
});

let loginButton = document.querySelector('#anmelden');

loginButton.addEventListener('click', async function () {
    let benutzername = document.querySelector('#benutzername').value;
    let passwort = document.querySelector('#passwort').value;

    try {
        let res = await fetch('http://localhost:3000/anmelden', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ benutzername, passwort })
        });

        if (res.ok) {
            alert('Anmeldung erfolgreich! Willkommen zurück.');
            window.location.href = 'liste.html';
        } else {
            let error = await res.text();
            alert('Fehler bei der Anmeldung: ' + error);
        }
    } catch (err) {
        alert('Server nicht erreichbar: ' + err.message);
    }
});
*/
