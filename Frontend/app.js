import { getToDos, registrieren } from "./model";

let registrierButton = document.querySelector('#registrieren');

registrierButton.addEventListener('click', function() {
    let benutzername = document.querySelector('#benutzername').value;
    let passwort = document.querySelector('#passwort').value;
    registrieren(benutzername, passwort).then(response => {
        if (response.success) {
            alert('Registrierung erfolgreich!');
        } else {
            alert('Fehler bei der Registrierung: ' + response.error);
        }
    }).catch (err => {
        alert('Server nicht erreichbar: ' + err.message);
    });
});

let todo_list;

let loginButton = document.querySelector('#anmelden');
loginButton.addEventListener('click', function() {
    let benutzername = document.querySelector('#email').value;
    let passwort = document.querySelector('#passwort_anmelden').value;
    anmelden(benutzername, passwort).then(response => {
        if (response.success) {
            alert('Anmeldung erfolgreich!');
            window.location.href = 'liste.html';
            todo_list = getToDos(benutzername);
        } else {
            alert('Fehler bei der Anmeldung: ' + response.error);
        }
    }).catch (err => {
        alert('Server nicht erreichbar: ' + err.message);
    });
});


