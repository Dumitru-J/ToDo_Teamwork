

//  |-------------Anlegen und speichern von Usern-------------|


/**
 * Nutzer registrieren, anmelden, abmelden
 * @param {string} email - Die Email adresse der Nutzer
 * @param {string} password - Das hinterlegte Passwort der Nutzer
 * @returns {Promise<Object>} Antwort vom Server asl JSON (Erfolg oder Fehler) zB existiert, passwort falsch
 */


// Nutzer anlegen
export async function registrieren(email, password){
    const res = await fetch('http://localhost:3000/registireren', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password})
    });
    return await res.json();
}


// Nutzer anmelden (gleich wie regisitreiren)
export async function anmelden(email, password){
    const res = await fetch('http://localhost:3000/anmelden', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password})
    });
    return await res.json();
}




// Nutzer Abmelden (die Route wird im Backend 'gelöscht', keine email oder pasword nötig)
export async function abmelden(){
    const res = await fetch('http://localhost:3000/abmelden', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    });
    return await res.json();
}







/**
 * Nur Emails der Nutzer in der Konsole ausgeben. test Ausgabe
 * @returns {Promise<void>} Keine Rückgabe!
 */


// Alle nutzer Anzeigen (console.table)
export async function userAnzeigen(){
    const res = await fetch('http://localhost:3000/users');
    const users = await res.json();

    // Um Passwörter nicht im klartext anzeigen zu lassen
    const emailsOnly = users.map(user => ({ email: user.email}));
    console.table(emailsOnly);

}








//  |-------------Anlegen und verwalten der ToDos der registrierten User-------------|


/**
 * Aufgaben abrufen, anlegen, aktualisieren, löschen
 * @param {string} email - E-mail des Users
 * @param {string} aufgabe - Text der Aufgabe
 * @param {string|number} taskId - Eindeutuge Aufgabennummer 
 * @param {boolean} status - Erledigt / Unerledigt (True / False)
 * 
 * @returns {Promise<Array>} Array der Aufgaben
 * @returns {Promise<Object>} Antwort vom Server
 */



// Alle ToDos eines Users Anzeigen
export async function displayToDo(email){
    const res = await fetch(`http://localhost:3000/todo/${encodeURIComponent(email)}`);             //encodeURIComponent erlaubt Sonderzeichen bei E-mail Adressen
    return await res.json();
}

// ToDo anlegen     [eine Angelegte Aufgabe ist Standardmäßig als false (unerledigt) festgelegt]
export async function newToDo(email, aufgabe){
    const res = await fetch(`http://localhost:3000/todo/${encodeURIComponent(email)}`,{
        method : 'POST',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify({task: aufgabe, completed: false})
    });

    return await res.json();
}


// ToDo aktualisieren   -> Erledigt / Offen
export async function updateToDo(email, taskId, status){
    const res = await fetch(`http://localhost:3000/todo/${encodeURIComponent(email)}/${taskId}`,{
        method : 'PUT',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify({completed: status})
    });

    return await res.json();
}


// ToDo löschen bei Bedarf
export async function deleteToDo(email, taskId){
     const res = await fetch(`http://localhost:3000/todo/${encodeURIComponent(email)}/${taskId}`,{
        method : 'DELETE',
    });

    return await res.json();
}

















































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

