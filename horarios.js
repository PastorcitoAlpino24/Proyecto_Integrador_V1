import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCI1iTUhJGDkKp3MO9jBQhjZ1QxkICW2tU",
    authDomain: "gatidispensador.firebaseapp.com",
    databaseURL: "https://gatidispensador-default-rtdb.firebaseio.com",
    projectId: "gatidispensador",
    storageBucket: "gatidispensador.appspot.com",
    messagingSenderId: "1062267157601",
    appId: "1:1062267157601:web:9cd323b126e9c22629be20"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function saveSchedule(username, time) {
    const userRef = ref(database, `GatidispensadorRegistro/${username}`);
    
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const schedulesRef = ref(database, `GatidispensadorRegistro/${username}/horarios`);
            const newScheduleRef = push(schedulesRef);

            set(newScheduleRef, { time: time })
                .then(() => {
                    alert('Horario añadido con éxito');
                    displaySchedules(username);
                });
        } else {
            console.error('Usuario no encontrado');
        }
    });
}

function modifySchedule(username, scheduleId, newTime) {
    if (newTime) {
        const scheduleRef = ref(database, `GatidispensadorRegistro/${username}/horarios/${scheduleId}`);
        update(scheduleRef, {
            time: newTime
        }).then(() => {
            displaySchedules(username);
        });
    }
}

function deleteSchedule(username, scheduleId) {
    const scheduleRef = ref(database, `GatidispensadorRegistro/${username}/horarios/${scheduleId}`);
    remove(scheduleRef).then(() => {
        displaySchedules(username);
    });
}

function displaySchedules(username) {
    const schedulesRef = ref(database, `GatidispensadorRegistro/${username}/horarios`);
    get(schedulesRef).then((snapshot) => {
        if (snapshot.exists()) {
            const schedules = snapshot.val();
            const scheduleList = document.getElementById('schedule-list');
            scheduleList.innerHTML = '';

            for (const scheduleId in schedules) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${schedules[scheduleId].time}</span>
                    <button onclick="modifySchedule('${username}', '${scheduleId}', prompt('Nuevo horario:'))">Modificar</button>
                    <button onclick="deleteSchedule('${username}', '${scheduleId}')">Eliminar</button>
                `;
                scheduleList.appendChild(li);
            }
        } else {
            document.getElementById('schedule-list').innerHTML = '<li>No hay horarios registrados.</li>';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('loggedInUser');
    if (username) {
        displaySchedules(username);

        document.getElementById('add-schedule-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const time = document.getElementById('schedule-time').value;
            saveSchedule(username, time);
        });
    } else {
        alert('No se encontró un usuario registrado.');
        window.location.href = 'index.html';
    }
});

window.modifySchedule = modifySchedule;
window.deleteSchedule = deleteSchedule;