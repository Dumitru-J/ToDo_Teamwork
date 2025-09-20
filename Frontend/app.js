import { getToDos, registrieren } from "./model.js";


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
});


