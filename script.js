function showUserPanel() {
    const userPanel = document.getElementById("user-panel");

    userPanel.innerHTML = `
        <button class="profile-button">Мій профіль</button>

        <div class="profile-menu">
            <a href="Profile.html">Налаштування аккаунту</a>
            <a href="personal_account.html">Особистий кабінет</a>
            <button id="LogoutBtn">Вийти</button>
        </div>
    `;

    document.getElementById("LogoutBtn").addEventListener("click", logout);
}

function showNotLoggedPanel() {
    const unauthorizedPanel = document.getElementById("user-panel");

    unauthorizedPanel.innerHTML = `<a href="login_page.html" class="user-btn">Увійти</a>`;
}

async function checkAuth() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        showNotLoggedPanel();
        return;
    }

    try {
        const res = await fetch("/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            console.log(`Authorization failed (${res.status})`);

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("accessToken");
                showNotLoggedPanel();
            }

            return;
        }

        const user = await res.json();

        showUserPanel();

    } catch (err) {
        console.error(err);
        showNotLoggedPanel();
    }
}

window.addEventListener("load", () => { checkAuth(); });

async function refresh() {
    const res = await fetch("/refresh", { method: "POST", credentials: "include" });
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
}

async function getProfile() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    console.log(data);
}

async function logout() {
    await fetch("/logout", {
        method: "POST",
        credentials: "include"
    });

    localStorage.removeItem("accessToken");
    showNotLoggedPanel();
    window.location.href = "index.html";
}
