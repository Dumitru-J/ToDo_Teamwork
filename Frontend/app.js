// model.js import
import * as Model from './model.js';


// view.js import
import * as View from './view.js';




// Registrieren eines Users
export async function registrieren(email, password){
    const result = await Model.registrieren(email, password);
    if(result.success){
        View.showMessage("Registrierung erfolgreich!");
    } else {
        View.showMessage(`"Registrierung fehlgeschlagen: ${result.mesage}!"`);
    }
}


// Anmeldung eines registreirten Users
export async function anmelden(email, password){
    const user = await Model.anmelden(email, password);

    if(user && user.success){
        View.showUserDashboard(user.email);
        loadToDos(user.email);
    }else {
        View.showMessage("Login fehlgeschlagen: Falsche E-Mail oder Passwort");
    }
}


// Abmeldung eines Users
export async function abmelden(){
    const result = await Model.abmelden();
    if(result.success){
        View.showLoginForm();
    }
}



// |-------------- ToDo Verwalten --------------|


// ToDo Anzeigeen und Laden
export async function loadToDos(email){
    const todos = Model.displayToDo(email);
    View.renderToDos(todos);

}


// Neues Todo erstellen
export async function addNewToDo(email, task){
    if(!task) return;
    const todos = await Model.newToDo(email, task);
    View.renderToDos(todos);
}


// Status der Aufgaben ändern (Erledigt / Nicht Erledigt)
export async function toDoStatus(email, taskId, currentStatus){
    const todos = await Model.updateToDo(email, taskId, !currentStatus);
    View.renderToDos(todos);
}


// Aufgabe endgültig löschen
export async function deleteToDo(email, taskId) {
    const todos = await Model.deleteToDo(email, taskId);
    View.renderToDos(todos);
}







document.addEventListener('DOMContentLoaded', () => {
    // Register Button
    const regBtn = document.getElementById('registrieren');
    regBtn.addEventListener('click', () => {
        const email = document.getElementById('benutzername').value;
        const password = document.getElementById('passwort').value;
        registrieren(email, password);
    });

    // Login Button
    const loginBtn = document.getElementById('anmelden');
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('passwort_anmelden').value;
        anmelden(email, password);
    });

    // Logout Button
    const logoutBtn = document.getElementById('logoutButton');
    logoutBtn.addEventListener('click', () => {
        abmelden();
    });

    // Add Task Button
    const addTaskBtn = document.getElementById('addTaskButton');
    addTaskBtn.addEventListener('click', () => {
        const task = document.getElementById('newTaskInput').value;
        // Email muss aus dem aktuell eingeloggten User kommen
        const userEmailElem = document.getElementById('userEmail');
        const email = userEmailElem ? userEmailElem.textContent : null;
        if(email && task.trim() !== ''){
            addNewToDo(email, task);
            document.getElementById('newTaskInput').value = '';
        }
    });
});






// console.log('Hallo Welt');
