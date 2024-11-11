import { firebaseConfig } from './firebaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const userRef = ref(database, "GatidispensadorRegistro/" + username);

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            alert("El usuario ya existe");
        } else {
            set(userRef, { username: username, password: password, }).then(() => {
                alert("Usuario registrado con éxito");
                window.location.reload();
            })
                .catch((error) => {
                    console.error("Error al registrar el usuario:", error);
                });
        }
    })
        .catch((error) => {
            console.error("Error al verificar el usuario:", error);
        });
});

document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const userRef = ref(database, "GatidispensadorRegistro/" + username);

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const storedData = snapshot.val();
            if (storedData.password === password) {
                alert("Inicio de sesión exitoso");
                localStorage.setItem("loggedInUser", username);
                window.location.href = "Horarios.html";
            } else {
                alert("Contraseña incorrecta");
            }
        } else {
            alert("El usuario no existe");
        }
    })
        .catch((error) => {
            console.error("Error al iniciar sesión:", error);
        });
});

window.addEventListener("scroll", function () {
    const sections = document.querySelectorAll(".section-container");
    const triggerBottom = window.innerHeight * 0.8;

    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.classList.add("visible");
        } else {
            section.classList.remove("visible");
        }
    });
});

document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const message = document.getElementById("contact-message").value;

    const newContactRef = ref(database, "GatidispensadorContactos/" + Date.now());

    set(newContactRef, {
        name: name,
        email: email,
        message: message,
    }).then(() => {
        alert("Mensaje enviado con éxito");
        document.getElementById("contact-form").reset();
    }).catch((error) => {
        console.error("Error al enviar el mensaje:", error);
    });
});
