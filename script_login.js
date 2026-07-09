/*
// Функция, которая считывает данные из текстбоксов по нажатию кнопки и передаёт их в back-end
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const UsernameInput = document.getElementById("UsernameInput");
    const PasswordInput = document.getElementById("PasswordInput");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // ОТКЛЮЧАЕМ перезагрузку страницы

        const cred_array = [
            UsernameInput.value.trim(),
            PasswordInput.value.trim()
        ];

        fetch("http://localhost:3000/login_page/credentials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cred_array)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка сервера");
            }
            return response.json();
        })
        .then(json => {
            if (json) {
                loginAnswer();
            } else {
                console.log("Пустой ответ");
            }
        })
        .catch(error => {
            console.error("Ошибка:", error);
        });
    });
});
*/



document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("loginForm");
    const UsernameInput = document.getElementById("UsernameInput");
    const PasswordInput = document.getElementById("PasswordInput");
    const SubmitBtn     = document.getElementById("SubmitBtn");
    // const output        = document.getElementById("output");

    // Отправка имени пользователя и пароля в back-end на проверку
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const response = await fetch("/login_page/credentials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: UsernameInput.value.trim(),
                password: PasswordInput.value.trim()
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("accessToken", data.accessToken);
            window.location.href = "index.html";
            // window.location.href = "http://localhost:3000/main_page.html";
        } else {
            alert(data.message);
        }
    });
});
