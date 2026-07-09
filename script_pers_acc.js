// --- Утиліти для UI (Toast, Modal, Confirm) ---

function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    
    container.appendChild(toast);
    
    // Плавна поява та зникнення
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Функція-обгортка для виклику модального вікна редагування (заміна prompt)
function openEditModal(title, currentData) {
    return new Promise((resolve) => {
        const modal = document.getElementById("editModal");
        const form = document.getElementById("editModalForm");
        
        document.getElementById("modalTitle").innerText = title;
        document.getElementById("modalStatus").value = currentData.status || "";

        const handleCancel = () => {
            modal.close();
            cleanup();
            resolve(null); // Користувач скасував дію
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            modal.close();
            cleanup();
            resolve({
                //name: document.getElementById("modalName").value.trim(),
                //surname: document.getElementById("modalSurname").value.trim(),
                //patronymic: document.getElementById("modalPatronymic").value.trim(),
                //email: document.getElementById("modalEmail").value.trim(),
                //phone: document.getElementById("modalPhone").value.trim(),
                status: document.getElementById("modalStatus").value.trim()
            });
        };

        const cleanup = () => {
            form.removeEventListener("submit", handleSubmit);
            document.getElementById("modalCancelBtn").removeEventListener("click", handleCancel);
        };

        document.getElementById("modalCancelBtn").addEventListener("click", handleCancel);
        form.addEventListener("submit", handleSubmit);
        
        modal.showModal();
    });
}

// Функція-обгортка для підтвердження дій (заміна confirm)
function openConfirmModal(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById("confirmModal");
        document.getElementById("confirmMessage").innerText = message;

        const handleCancel = () => { modal.close(); cleanup(); resolve(false); };
        const handleConfirm = () => { modal.close(); cleanup(); resolve(true); };

        const cleanup = () => {
            document.getElementById("confirmCancelBtn").removeEventListener("click", handleCancel);
            document.getElementById("confirmConfirmBtn").removeEventListener("click", handleConfirm);
        };

        document.getElementById("confirmCancelBtn").addEventListener("click", handleCancel);
        document.getElementById("confirmConfirmBtn").addEventListener("click", handleConfirm);

        modal.showModal();
    });
}


// --- Основна логіка системи ---

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

function showManagerPanel() {
    const adminPanel = document.getElementById("adminPanel");
    
    adminPanel.innerHTML = `
        <div class="adminGrid">
            <div class="dashboard-card">
                <h2>Клієнти</h2>

                <button class="action-btn add" id="addClientBtn">Додати особовий запис</button>
                <button class="action-btn add" id="addClientDiseaseBtn">Додати запис захворювання</button>
                <button class="action-btn edit" id="clientListBtn">Переглянути/Змінити статус</button>
                <button class="action-btn edit" id="clientDiseasesListBtn">Переглянути захворювання</button>
            </div>

            <div class="dashboard-card">
                <h2>Доглядальники</h2>

                <button class="action-btn add" id="addCaregiverBtn">Додати особовий запис</button>
                <button class="action-btn add" id="addCaregiverMaterialBtn">Додати запис матеріалів</button>
                <button class="action-btn edit" id="caregiverListBtn">Переглянути/Змінити статус</button>
                <button class="action-btn edit" id="caregiverMaterialsListBtn">Переглянути/Змінити матеріали</button>
                <button class="action-btn edit" id="caregiversReportsListBtn">Переглянути звіти доглядальників</button>
            </div>

            <div class="dashboard-card">
                <h2>Договори</h2>

                <button class="action-btn add" id="addContractBtn">Додати запис</button>
                <button class="action-btn edit" id="contractListBtn">Переглянути/Змінити</button>
            </div>

            <div class="dashboard-card">
                <h2>Послуги клієнтам</h2>

                <button class="action-btn add" id="addReqServBtn">Додати запис</button>
                <button class="action-btn edit" id="reqServListBtn">Переглянути/Змінити</button>
            </div>

            <div class="dashboard-card">
                <h2>Призначення доглядальників</h2>

                <button class="action-btn add" id="addAssignmentBtn">Додати запис</button>
                <button class="action-btn edit" id="assignmentListBtn">Переглянути/Змінити</button>
            </div>

            <div class="dashboard-card">
                <h2>Плани-графіки</h2>

                <button class="action-btn add" id="addScheduleBtn">Створити план-графік</button>
                <button class="action-btn edit" id="reviewSchedulesBtn">Переглянути плани-графіки</button>
                <button class="action-btn edit" id="reviewVisitServicesBtn">Переглянути надані послуги</button>
            </div>

            <div class="dashboard-card">
                <h2>Обліки та статистика</h2>

                <button class="action-btn add" id="reviewClientRatingsBtn">Антирейтинги клієнтів</button>
                <button class="action-btn add" id="reviewCaregiverRatingsBtn">Рейтинги доглядальників</button>
                <button class="action-btn edit" id="reviewFeedbacksBtn">Відгуки</button>
                <button class="action-btn edit" id="reviewIncidentsBtn">Скарги та відмови</button>
            </div>
        </div>
    `;

    document.getElementById("addClientBtn").addEventListener("click", addClient);
    document.getElementById("addClientDiseaseBtn").addEventListener("click", addClientDisease);
    document.getElementById("clientListBtn").addEventListener("click", clientList);
    document.getElementById("clientDiseasesListBtn").addEventListener("click", clientDiseasesList);

    document.getElementById("addCaregiverBtn").addEventListener("click", addCaregiver);
    document.getElementById("addCaregiverMaterialBtn").addEventListener("click", addCaregiverMaterial);
    document.getElementById("caregiverListBtn").addEventListener("click", caregiverList);
    document.getElementById("caregiverMaterialsListBtn").addEventListener("click", caregiverMaterialsList);
    document.getElementById("caregiversReportsListBtn").addEventListener("click", caregiversReportsList);

    document.getElementById("addContractBtn").addEventListener("click", addContract);
    document.getElementById("contractListBtn").addEventListener("click", contractList);

    document.getElementById("addReqServBtn").addEventListener("click", addReqServ);
    document.getElementById("reqServListBtn").addEventListener("click", reqServList);

    document.getElementById("addAssignmentBtn").addEventListener("click", addAssignment);
    document.getElementById("assignmentListBtn").addEventListener("click", assignmentList);

    document.getElementById("addScheduleBtn").addEventListener("click", addSchedule);
    document.getElementById("reviewSchedulesBtn").addEventListener("click", reviewAllSchedules);
    document.getElementById("reviewVisitServicesBtn").addEventListener("click", reviewVisitServices);

    document.getElementById("reviewClientRatingsBtn").addEventListener("click", reviewClientRatings);
    document.getElementById("reviewCaregiverRatingsBtn").addEventListener("click", reviewCaregiverRatings);
    document.getElementById("reviewFeedbacksBtn").addEventListener("click", reviewFeedbacks);
    document.getElementById("reviewIncidentsBtn").addEventListener("click", reviewIncidents);
}


function showCaregiverPanel() {
    const caregiverPanel = document.getElementById("caregiverPanel");
    
    caregiverPanel.innerHTML = `
        <div class="userGrid">
            <div class="dashboard-card">
                <h2>Графіки та звіти</h2>

                <button class="action-btn edit" id="reviewAllCaregiverSchedulesBtn">Переглянути графіки</button>
                <button class="action-btn add" id="addReportBtn">Створити звіт з роботи</button>
            </div>

            <div class="dashboard-card">
                <h2>Клієнти</h2>

                <button class="action-btn edit" id="selectedClientDiseasesListBtn">Переглянути захворювання призначених клієнтів</button>
            </div>

            <div class="dashboard-card">
                <h2>Відгуки та інциденти</h2>

                <button class="action-btn add" id="addFeedbackBtn">Залишити відгук</button>
                <button class="action-btn add" id="addIncidentBtn">Додати скаргу або відмову</button>
            </div>
        </div>
    `;

    document.getElementById("reviewAllCaregiverSchedulesBtn").addEventListener("click", reviewAllCaregiverSchedules);
    document.getElementById("addReportBtn").addEventListener("click", addReport);

    document.getElementById("selectedClientDiseasesListBtn").addEventListener("click", selectedClientDiseasesList);

    document.getElementById("addFeedbackBtn").addEventListener("click", addFeedback);
    document.getElementById("addIncidentBtn").addEventListener("click", addIncident);
}

function showClientPanel() {
    const clientPanel = document.getElementById("clientPanel");
    
    clientPanel.innerHTML = `
        <div class="userGrid">
            <div class="dashboard-card">
                <h2>Плани</h2>

                <button class="action-btn edit" id="reviewAllClientSchedulesBtn">Переглянути плани</button>
            </div>

            <div class="dashboard-card">
                <h2>Відгуки та інциденти</h2>

                <button class="action-btn add" id="addFeedbackBtn">Залишити відгук</button>
                <button class="action-btn add" id="addIncidentBtn">Додати скаргу або відмову</button>
            </div>
        </div>
    `;

    document.getElementById("reviewAllClientSchedulesBtn").addEventListener("click", reviewAllClientSchedules);

    document.getElementById("addFeedbackBtn").addEventListener("click", addFeedback);
    document.getElementById("addIncidentBtn").addEventListener("click", addIncident);
}

function notLoggedIn() {
    window.location.href = "index.html";
}

async function checkAuth() {
    const token = localStorage.getItem("accessToken");
    if (!token) { return notLoggedIn(); }

    try {
        const res = await fetch("/me", { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) {
            console.log("Unauthorized");
            return;
        }
        const user = await res.json();
        showUserPanel();
        /*
        if (user.rights === "Admin" || user.rights === "Einsatzleiter") {
            showManagerPanel();
        } else {
            if (typeof showCommonUserPanel === "function") showCommonUserPanel();
        }
        */

        /*
        if (user.rights === "Admin" || user.rights === "Einsatzleiter") {
            showManagerPanel();
        } else if (user.rights === "Caregiver") {
            if (typeof showCaregiverPanel === "function") showCaregiverPanel();
        } else {
            if (typeof showClientPanel === "function") showClientPanel();
        }
        */
        
        if (user.rights === "Admin" || user.rights === "Einsatzleiter") {
            showManagerPanel();
        }
        if (user.rights === "Caregiver") {
            showCaregiverPanel();
        }
        if (user.rights === "Client") {
            showClientPanel();
        }

    } catch (err) {
        console.error("Помилка авторизації:", err);
    }
}

window.addEventListener("load", checkAuth);

async function refresh() {
    const res = await fetch("/refresh", { method: "POST", credentials: "include" });
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
}

async function logout() {
    await fetch("/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("accessToken");
    window.location.href = "index.html";
}

// admin panel

async function addClient() {
    const adminPanel = document.getElementById("adminPanel");
    adminPanel.innerHTML = `
        <form class="panel-form" id="createClientForm">
            <h2>Створення особового запису клієнта</h2>

            <label for="clientName">Ім'я клієнта</label>
            <input type="text" id="clientNameInput" name="clientName" required>

            <label for="clientSurname">Прізвище клієнта</label>
            <input type="text" id="clientSurnameInput" name="clientSurname" required>

            <label for="clientPatronymic">По батькові клієнта</label>
            <input type="text" id="clientPatronymicInput" name="clientPatronymic">

            <label for="clientEmail">Електронна пошта клієнта</label>
            <input type="email" id="clientEmailInput" name="clientEmail" required>

            <label for="clientPhoneNumber">Номер телефона клієнта</label>
            <input type="tel" id="clientPhoneNumberInput" name="clientPhoneNumber" required>

            <label for="clientRegistrationDate">Дата реєстрації клієнта</label>
            <input type="date" id="clientRegistrationDateInput" name="clientRegistrationDate" required>

            <label for="clientUsername">Ім'я користувача клієнта</label>
            <input type="text" id="clientUsernameInput" name="clientUsername" required>

            <label for="clientPassword">Пароль клієнта</label>
            <input type="password" id="clientPasswordInput" name="clientPassword" required>


            <label for="clientCountry">Країна</label>
            <input type="text" id="clientCountryInput" name="clientCountry" required>

            <label for="clientRegion">Область</label>
            <input type="text" id="clientRegionInput" name="clientRegion" required>

            <label for="clientCity">Місто</label>
            <input type="text" id="clientCityInput" name="clientCity" required>

            <label for="clientDistrict">Район</label>
            <input type="text" id="clientDistrictInput" name="clientDistrict" required>

            <label for="clientStreet">Вулиця</label>
            <input type="text" id="clientStreetInput" name="clientStreet" required>

            <label for="clientHouseNumber">Номер будинку</label>
            <input type="text" id="clientHouseNumberInput" name="clientHouseNumber" required>

            <label for="clientEntrance">Номер під'їзду</label>
            <input type="number" id="clientEntranceInput" name="clientEntrance">

            <label for="clientFloor">Поверх</label>
            <input type="number" id="clientFloorInput" name="clientFloor">

            <label for="clientFlat">Номер квартири</label>
            <input type="number" id="clientFlatInput" name="clientFlat">

            <label for="clientPostalCode">Поштовий індекс</label>
            <input type="number" id="clientPostalCodeInput" name="clientPostalCode" required>


            <label for="clientDateOfBirth">Дата народження клієнта</label>
            <input type="date" id="clientDateOfBirthInput" name="clientDateOfBirth">

            <label for="clientStatus">Статус клієнта</label>
            <input list="clientStatuses" id="clientStatusInput" name="clientStatus" required>

            <datalist id="clientStatuses">
                <option value="Assigned">
                <option value="Expexting">
                <option value="Free">
            </datalist>

            <button type="submit">Створити запис клієнта</button>
        </form>
    `;

    document.getElementById("createClientForm").addEventListener("submit", createClient);
}

async function createClient(event) {
    event.preventDefault();
    try {
        const response = await fetch("/create_client", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: document.getElementById("clientNameInput").value.trim(),
                surname: document.getElementById("clientSurnameInput").value.trim(),
                patronymic: document.getElementById("clientPatronymicInput").value.trim(),
                email: document.getElementById("clientEmailInput").value.trim(),
                phone_number: document.getElementById("clientPhoneNumberInput").value.trim(),
                registration_date: document.getElementById("clientRegistrationDateInput").value,
                username: document.getElementById("clientUsernameInput").value.trim(),
                password: document.getElementById("clientPasswordInput").value.trim(),
                country: document.getElementById("clientCountryInput").value.trim(),
                region: document.getElementById("clientRegionInput").value.trim(),
                city: document.getElementById("clientCityInput").value.trim(),
                district: document.getElementById("clientDistrictInput").value.trim(),
                street: document.getElementById("clientStreetInput").value.trim(),
                house_number: document.getElementById("clientHouseNumberInput").value.trim(),
                entrance: document.getElementById("clientEntranceInput").value.trim(),
                floor: document.getElementById("clientFloorInput").value.trim(),
                flat: document.getElementById("clientFlatInput").value.trim(),
                postal_code: document.getElementById("clientPostalCodeInput").value.trim(),
                date_of_birth: document.getElementById("clientDateOfBirthInput").value,
                client_status: document.getElementById("clientStatusInput").value.trim()
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        showToast(data.message, "success");
        clientList(); // Повертаємось до списку
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}

async function clientList() {
    const response = await fetch("/change_client");
    const clients = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <h2>Клієнти</h2>
        <table id="clientsTable">
            <thead>
                <tr><th>ПІБ клієнта</th><th>E-Mail</th><th>Телефон</th><th>Статус</th><th>Дії</th></tr>
            </thead>
            <tbody id="clientsTableBody"></tbody>
        </table>
    `;

    // Безпечний рендеринг елементів (Захист від XSS + винесення функцій з Window)
    const tbody = document.getElementById("clientsTableBody");
    clients.forEach(client => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${client.surname} ${client.name} ${client.patronymic}</td>
            <td>${client.email}</td>
            <td>${client.phone_number}</td>
            <td>${client.client_status}</td>
            <td style="display: flex; flex-direction: column;">
                <button class="edit-btn" 
                        style="
                            background-color: #2563eb; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Змінити
                </button>
                <button class="delete-btn" 
                        style="
                            background-color: #ef4444; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Видалити
                </button>
            </td>
        `;
        tr.querySelector(".edit-btn").addEventListener("click", () => editClient(client));
        tr.querySelector(".delete-btn").addEventListener("click", () => deleteClient(client.id_user));
        tbody.appendChild(tr);
    });
}

async function editClient(client) {
    const newData = await openEditModal("Редагування клієнта", client);
    if (!newData) return; // Користувач скасував дію

    const response = await fetch("/change_client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_user: Number(client.id_user),
            // name: newData.name,
            // surname: newData.surname,
            // patronymic: newData.patronymic,
            // email: newData.email,
            // phone_number: newData.phone,
            client_status: newData.status
        })
    });

    const data = await response.json();
    if (!response.ok) return showToast(data.error, "error");

    showToast(data.message, "success");
    clientList();
}

async function deleteClient(id) {
    const confirmed = await openConfirmModal("Ви дійсно хочете видалити цього клієнта?");
    if (!confirmed) return;

    const response = await fetch("/remove_client", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: Number(id) })
    });

    const data = await response.json();
    if (!response.ok) return showToast(data.error, "error");

    showToast(data.message, "success");
    clientList();
}


async function addClientDisease() {
    const response = await fetch("/client_names");
    const client_names = await response.json();

    const options = client_names.map(row => `<option value="${row[0]}">`).join("");

    const adminPanel = document.getElementById("adminPanel");
    
    adminPanel.innerHTML = `
        <form class="panel-form" id="createClientDiseaseForm">
            <h2>Створення запису захворювання клієнта</h2>

            <label for="clientName">Ім'я клієнта</label>
            <input list="clientNames" id="clientNameInput" name="clientName" required>

            <datalist id="clientNames">
                 ${options}
            </datalist>

            <label for="diseaseName">Назва захворювання</label>
            <input list="diseaseNames" id="diseaseNameInput" name="diseaseName" required>

            <datalist id="diseaseNames">
                <option value="Гіпертонія">
                <option value="Ішемічна хвороба серця">
                <option value="Цукровий діабет 2 типу">
                <option value="Артроз">
                <option value="Остеопороз">
                <option value="Серцева недостатність">
                <option value="Атеросклероз">
                <option value="Деменція">
                <option value="Хвороба Паркінсона">
                <option value="Стан після інсульту">
                <option value="Пневмонія">
                <option value="Катаракта">
                <option value="Онкологія">
                <option value="Хронічна хвороба нирок">
                <option value="Нетримання сечі">
                <option value="Стан після перелому кістки">
            </datalist>

            <label for="diagnosisDate">Дата встановлення діагнозу</label>
            <input type="date" id="diagnosisDateInput" name="clientRegistrationDate">

            <label for="diseaseSeverity">Ступіть важкості захворювання</label>
            <input type="text" id="diseaseSeverityInput" name="diseaseSeverity">

            <label for="notes">Додаткові нотатки</label>
            <input type="text" id="notesInput" name="notes">

            <button type="submit">Створити запис захворювання клієнта</button>
        </form>
    `;

    document.getElementById("createClientDiseaseForm").addEventListener("submit", createClientDisease);
}

async function createClientDisease(event) {
    event.preventDefault();
    try {
        const response = await fetch("/create_client_disease", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_name: document.getElementById("clientNameInput").value.trim(),
                disease_name: document.getElementById("diseaseNameInput").value.trim(),
                diagnosis_date: document.getElementById("diagnosisDateInput").value,
                severity: document.getElementById("diseaseSeverityInput").value.trim(),
                notes: document.getElementById("notesInput").value.trim(),
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        showToast(data.message, "success");
        clientDiseasesList();
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}

async function clientDiseasesList() {
    const response = await fetch("/change_client_diseases");
    const client_diseases = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <h2>Захворювання клієнтів</h2>
        <table id="clientsTable">
            <thead>
                <tr><th>ПІБ клієнта</th><th>Назва захворювання</th><th>Дата встановлення</th><th>Важкість</th><th>Нотатки</th></tr>
            </thead>
            <tbody id="clientDiseasesTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("clientDiseasesTableBody");
    client_diseases.forEach(client_disease => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${client_disease.surname} ${client_disease.name} ${client_disease.patronymic}</td>
            <td>${client_disease.disease_name}</td>
            <td style="text-align: center">${client_disease.diagnosis_date ?? "-"}</td>
            <td style="text-align: center">${client_disease.severity ?? "-"}</td>
            <td style="text-align: center">${client_disease.notes ?? "-"}</td>
        `;
        tbody.appendChild(tr);
    });
}


async function addCaregiver() {
    const adminPanel = document.getElementById("adminPanel");
    adminPanel.innerHTML = `
        <form class="panel-form" id="createCaregiverForm">
            <h2>Створення особового запису доглядальника</h2>

            <label for="caregiverName">Ім'я доглядальника</label>
            <input type="text" id="caregiverNameInput" name="caregiverName" required>

            <label for="caregiverSurname">Прізвище доглядальника</label>
            <input type="text" id="caregiverSurnameInput" name="caregiverSurname" required>

            <label for="caregiverPatronymic">По батькові доглядальника</label>
            <input type="text" id="caregiverPatronymicInput" name="caregiverPatronymic">

            <label for="caregiverEmail">Електронна пошта доглядальника</label>
            <input type="email" id="caregiverEmailInput" name="caregiverEmail" required>

            <label for="caregiverPhoneNumber">Номер телефона доглядальника</label>
            <input type="tel" id="caregiverPhoneNumberInput" name="caregiverPhoneNumber" required>

            <label for="caregiverRegistrationDate">Дата реєстрації доглядальника</label>
            <input type="date" id="caregiverRegistrationDateInput" name="caregiverRegistrationDate" required>

            <label for="caregiverUsername">Ім'я користувача доглядальника</label>
            <input type="text" id="caregiverUsernameInput" name="caregiverUsername" required>

            <label for="caregiverPassword">Пароль доглядальника</label>
            <input type="password" id="caregiverPasswordInput" name="caregiverPassword" required>


            <label for="caregiverQualification">Кваліфікація доглядальника</label>
            <input type="text" id="caregiverQualificationInput" name="caregiverQualification" required>

            <label for="caregiverAreaOfApplication">Область призначення доглядальника</label>
            <input type="text" id="caregiverAreaOfApplicationInput" name="caregiverAreaOfApplication" required>

            <label for="caregiverStatus">Статус доглядальника</label>
            <input list="caregiverStatuses" id="caregiverStatusInput" name="caregiverStatus" required>

            <datalist id="caregiverStatuses">
                <option value="Busy">
                <option value="Expexting">
                <option value="Free">
                <option value="Unavailable">
            </datalist>

            <button type="submit">Створити запис доглядальника</button>
        </form>
    `;

    document.getElementById("createCaregiverForm").addEventListener("submit", createCaregiver);
}

async function createCaregiver(event) {
    event.preventDefault();
    const response = await fetch("/create_caregiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("caregiverNameInput").value.trim(),
            surname: document.getElementById("caregiverSurnameInput").value.trim(),
            patronymic: document.getElementById("caregiverPatronymicInput").value.trim(),
            email: document.getElementById("caregiverEmailInput").value.trim(),
            phone_number: document.getElementById("caregiverPhoneNumberInput").value.trim(),
            registration_date: document.getElementById("caregiverRegistrationDateInput").value,
            username: document.getElementById("caregiverUsernameInput").value.trim(),
            password: document.getElementById("caregiverPasswordInput").value.trim(),
            qualification: document.getElementById("caregiverQualificationInput").value.trim(),
            area_of_application: document.getElementById("caregiverAreaOfApplicationInput").value.trim(),
            caregiver_status: document.getElementById("caregiverStatusInput").value.trim()
        })
    });

    const data = await response.json();
    if (!response.ok) return showToast(data.error, "error");

    showToast(data.message, "success");
    caregiverList();
}

async function caregiverList() {
    const response = await fetch("/change_caregiver");
    const caregivers = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <h2>Доглядальники</h2>
        <table id="caregiversTable">
            <thead>
                <tr><th>ПІБ доглядальника</th><th>E-Mail</th><th>Телефон</th><th>Кваліфікація</th><th>Спеціалізація</th><th>Статус</th><th>Дії</th></tr>
            </thead>
            <tbody id="caregiversTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("caregiversTableBody");
    caregivers.forEach(caregiver => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${caregiver.surname} ${caregiver.name} ${caregiver.patronymic}</td>
            <td>${caregiver.email}</td>
            <td>${caregiver.phone_number}</td>
            <td>${caregiver.qualification}</td>
            <td>${caregiver.area_of_application}</td>
            <td>${caregiver.caregiver_status}</td>
            <td style="display: flex; flex-direction: column;">
                <button class="edit-btn" 
                        style="
                            background-color: #2563eb; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Змінити
                </button>
                <button class="delete-btn" 
                        style="
                            background-color: #ef4444; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Видалити
                </button>
            </td>
        `;
        tr.querySelector(".edit-btn").addEventListener("click", () => editCaregiver(caregiver));
        tr.querySelector(".delete-btn").addEventListener("click", () => deleteCaregiver(caregiver.id_user));
        tbody.appendChild(tr);
    });
}

async function editCaregiver(caregiver) {
    const newData = await openEditModal("Редагування доглядальника", caregiver);
    if (!newData) return;

    const response = await fetch("/change_caregiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_user: Number(caregiver.id_user),
            // name: newData.name,
            // surname: newData.surname,
            // patronymic: newData.patronymic,
            // email: newData.email,
            // phone_number: newData.phone,
            caregiver_status: newData.status
        })
    });

    const data = await response.json();
    if (!response.ok) return showToast(data.error, "error");

    showToast(data.message, "success");
    caregiverList();
}

async function deleteCaregiver(id) {
    const confirmed = await openConfirmModal("Ви дійсно хочете видалити цього доглядальника?");
    if (!confirmed) return;

    const response = await fetch("/remove_caregiver", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: Number(id) })
    });

    const data = await response.json();
    if (!response.ok) return showToast(data.error, "error");

    showToast(data.message, "success");
    caregiverList();
}


async function addCaregiverMaterial() {
    const response = await fetch("/caregiver_names");
    const caregiver_names = await response.json();

    const options = caregiver_names.map(row => `<option value="${row[0]}">`).join("");

    const adminPanel = document.getElementById("adminPanel");
    adminPanel.innerHTML = `
        <form class="panel-form" id="createCaregiverMaterialForm">
            <h2>Створення запису матеріалу для доглядальника</h2>
            
            <label for="caregiverName">Ім'я доглядальника</label>
            <input list="caregiverNames" id="caregiverNameInput" name="caregiverName" required>

            <datalist id="caregiverNames">
                 ${options}
            </datalist>

            <label for="materialName">Назва матеріалу</label>
            <input list="materialNames" id="materialNameInput" name="materialName" required>

            <datalist id="materialNames">
                <option value="Одноразові рукавички">
                <option value="Дезінфікуючі засоби">
                <option value="Бинти та пов'язки">
                <option value="Одноразові шприци">
            </datalist>

            <label for="quantity">Кількість/Об'єм</label>
            <input type="number" id="quantityInput" name="quantity" required>

            <label for="unit">Одиниці вимірювання</label>
            <input type="text" id="unitInput" name="unit" required>

            <label for="materUsageFreq">Частота використання матеріалу (разів на тиждень)</label>
            <input type="number" id="materUsageFreqInput" name="materUsageFreq" required>

            <button type="submit">Створити запис матеріалу для доглядальника</button>
        </form>
    `;

    document.getElementById("createCaregiverMaterialForm").addEventListener("submit", createCaregiverMaterial);
}

async function createCaregiverMaterial(event) {
    event.preventDefault();
    try {
        const response = await fetch("/create_required_material", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                caregiver_name: document.getElementById("caregiverNameInput").value.trim(),
                material_name: document.getElementById("materialNameInput").value.trim(),
                quantity: document.getElementById("quantityInput").value,
                unit: document.getElementById("unitInput").value.trim(),
                mater_usage_freq: document.getElementById("materUsageFreqInput").value.trim()
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        showToast(data.message, "success");
        caregiverMaterialsList();
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}

async function caregiverMaterialsList() {
    const response = await fetch("/change_required_materials");
    const required_materials = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <h2>Матеріали для доглядальників</h2>
        <table id="requiredMaterialsTable">
            <thead>
                <tr><th>ПІБ доглядальника</th><th>Назва матеріалу</th><th>Кількість/Об'єм та одиниці вимірювання</th><th>Частота використання на тиждень</th></tr>
            </thead>
            <tbody id="requiredMaterialsTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("requiredMaterialsTableBody");
    required_materials.forEach(required_material => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${required_material.surname} ${required_material.name} ${required_material.patronymic}</td>
            <td>${required_material.mater_name}</td>
            <td style="text-align: center;">${required_material.quantity} ${required_material.unit}</td>
            <td style="text-align: center;">${required_material.mater_usage_freq}</td>
            <td style="display: flex; flex-direction: column;">
                <button class="delete-btn" 
                        style="
                            background-color: #ef4444; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Видалити
                </button>
            </td>
        `;
        tr.querySelector(".delete-btn").addEventListener("click", () => deleteRequiredMaterial(required_material.id_required_material));
        tbody.appendChild(tr);
    });
}

async function deleteRequiredMaterial(id) {
    const confirmed = await openConfirmModal("Ви дійсно хочете видалити запис матеріалу для доглядальника?");
    if (!confirmed) return;

    const response = await fetch("/remove_required_material", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_required_material: Number(id) })
    });

    const data = await response.json();
    if (!response.ok) return showToast(data.error, "error");

    showToast(data.message, "success");
    caregiverMaterialsList();
}


async function caregiversReportsList() {
    const response = await fetch("/review_caregivers_reports");
    const caregivers_reports = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <h2>Звіти доглядальників</h2>
        <table id="caregiversReportsTable">
            <thead>
                <tr><th>Дата звіту</th><th>ПІБ доглядальника</th><th>ПІБ клієнта</th><th>Зміст звіту доглядальника</th></tr>
            </thead>
            <tbody id="caregiversReportsTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("caregiversReportsTableBody");
    caregivers_reports.forEach(caregivers_report => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align: center;">${caregivers_report.creation_date}</td>
            <td style="text-align: center;">${caregivers_report.caregiver_name}</td>
            <td style="text-align: center;">${caregivers_report.client_name}</td>
            <td>${caregivers_report.report_text}</td>
        `;
        tbody.appendChild(tr);
    });
}



async function addSchedule() {
    const adminPanel = document.getElementById("adminPanel");
    adminPanel.innerHTML = `
        <form class="panel-form" id="createScheduleForm">
            <h2>Створення плану-графіку</h2>

            <label for="startDateInput">Дата початку плану</label>
            <input type="date" id="startDateInput" name="startDateInput" required>

            <label for="endDateInput">Дата кінця плану</label>
            <input type="date" id="endDateInput" name="endDateInput" required>

            <label for="scheduleStatus">Статус плану-графіку</label>
            <input list="scheduleStatuses" id="scheduleStatusInput" name="scheduleStatus" required>

            <datalist id="scheduleStatuses">
                <option value="Active">
                <option value="Deferred">
            </datalist>

            <label for="scheduleType">Тип плану-графіку</label>
            <input list="scheduleTypes" id="scheduleTypeInput" name="scheduleType" required>

            <datalist id="scheduleTypes">
                <option value="Constant">
                <option value="Temporary">
                <option value="Test">
            </datalist>

            <button type="submit">Створити план-графік</button>
        </form>
    `;

    document.getElementById("createScheduleForm").addEventListener("submit", createSchedule);
}

async function createSchedule(event) {
    event.preventDefault();

    const startDate = document.getElementById("startDateInput").value;
    const endDate = document.getElementById("endDateInput").value;

    if (new Date(startDate) > new Date(endDate)) {
        return showToast("Дата початку не може бути пізніше дати завершення", "error");
    }

    const token = localStorage.getItem("accessToken");
    if (!token) { return notLoggedIn(); }

    let userId;

    try {
        const res = await fetch("/me", { headers: { Authorization: `Bearer ${token}` } });
        
        if (res.status === 401) {
            console.log("Unauthorized");
            return;
        }

        const user = await res.json();
        userId = user.id;
    } catch (err) {
        console.error("Помилка авторизації:", err);
    }

    try {
        const response = await fetch("/create_schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                start_date: startDate,
                end_date: endDate,
                schedule_status: document.getElementById("scheduleStatusInput").value.trim(),
                schedule_type: document.getElementById("scheduleTypeInput").value.trim(),
                id_user: userId
            })
        });

        let data;

        try { data = await response.json(); }
        catch { throw new Error("Некоректна відповідь сервера"); }
        if (!response.ok) return showToast(data.error, "error");
        
        showToast(data.message, "success");
        reviewAllSchedules(); // Повертаємось до списку
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}

async function reviewAllSchedules() {
    const response = await fetch("/review_all_schedules");
    const schedules = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    
    adminPanel.innerHTML = `
        <h2>Плани-графіки</h2>
        <table id="schedulesTable">
            <thead>
                <tr><th>Дата початку</th><th>Дата завершення</th><th>Статус</th><th>Тип</th><th>Дії</th></tr>
            </thead>
            <tbody id="schedulesTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("schedulesTableBody");
    schedules.forEach(schedule => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align: center;">${schedule.start_date}</td>
            <td style="text-align: center;">${schedule.end_date ?? "-"}</td>
            <td style="text-align: center;">${schedule.schedule_status}</td>
            <td style="text-align: center;">${schedule.schedule_type}</td>
            <td style="display: flex; flex-direction: column;">
                <button class="review-btn" 
                        style="
                            background-color: #10b981; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Переглянути
                </button>
                <button class="edit-btn" 
                        style="
                            background-color: #2563eb; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Змінити
                </button>
                <button class="delete-btn" 
                        style="
                            background-color: #ef4444; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Видалити
                </button>
            </td>
        `;
        tr.querySelector(".review-btn").addEventListener("click", () => reviewSchedule(schedule.id_schedule));
        tr.querySelector(".edit-btn").addEventListener("click", () => editSchedule(schedule));
        tr.querySelector(".delete-btn").addEventListener("click", () => deleteSchedule(schedule.id_schedule));
        tbody.appendChild(tr);
    });
}

async function reviewSchedule(id) {
    const response = await fetch("/review_schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_schedule: Number(id) })
    });

    const plannedVisits = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    
    adminPanel.innerHTML = `
        <h2>Плани-графіки</h2>
        <table id="plannedVisitsTable">
            <thead style="text-align: left;">
                <tr><th>Клієнт</th><th>Послуга</th><th>Дата</th><th>Запланований початок</th><th>Заплановане завершення</th></tr>
            </thead>
            <tbody id="plannedVisitsTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("plannedVisitsTableBody");
    /*
    plannedVisits.forEach(visit => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${visit.caregiver_name}</td>
            <td>${visit.client_name}</td>
            <td>${visit.service_name}</td>
            <td>${visit.planned_date}</td>
            <td>${visit.planned_start_time}</td>
            <td>${visit.planned_end_time}</td>
        `;

        tbody.appendChild(tr);
    });
    */
    let lastDate = null;
    let lastCaregiver = null;
    let alternate = false;

    plannedVisits.forEach(visit => {

        if (lastDate !== visit.planned_date){
            const dayRow=document.createElement("tr");

            dayRow.innerHTML = `<td colspan="6" class="day-header">${visit.planned_date}</td>`;

            tbody.appendChild(dayRow);

            lastDate = visit.planned_date;
            lastCaregiver = null;
        }

        if (lastCaregiver !== visit.id_caregiver){
            const caregiverRow=document.createElement("tr");

            caregiverRow.innerHTML = `<td colspan="6" class="caregiver-header"><h2>${visit.caregiver_name}</h2></td>`;

            tbody.appendChild(caregiverRow);

            alternate =! alternate;
            lastCaregiver = visit.id_caregiver;
        }

        const tr = document.createElement("tr");

        //if (alternate) { tr.classList.add("group-even"); }
        //else { tr.classList.add("group-odd"); }
        tr.classList.add("group-odd");

        tr.innerHTML = `
            <td>${visit.client_name}</td>
            <td>${visit.service_name}</td>
            <td>${visit.planned_date}</td>
            <td>${visit.planned_start_time}</td>
            <td>${visit.planned_end_time}</td>
        `;

        tbody.appendChild(tr);
    });
}

async function editSchedule(schedule) {
    const newData = await openEditModal("Редагування плану-графіку", schedule);
    if (!newData) return;

    const response = await fetch("/change_schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_schedule: Number(schedule.id_schedule),
            schedule_status: newData.status
        })
    });

    const data = await response.json();
    if (!response.ok) return showToast(data.error, "error");

    showToast(data.message, "success");
    reviewAllSchedules();
}

async function deleteSchedule(id) {
    const confirmed = await openConfirmModal("Ви дійсно хочете видалити цей план-графік?");
    if (!confirmed) return;

    const response = await fetch("/remove_schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_schedule: Number(id) })
    });

    const data = await response.json();
    if (!response.ok) return showToast(data.error, "error");

    showToast(data.message, "success");
    reviewAllSchedules();
}


async function reviewVisitServices() {
    const response = await fetch("/review_visit_services");
    const schedules = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <h2>Плани-графіки наданих послуг</h2>
        <table id="schedulesForVisitServicesTable">
            <thead>
                <tr><th>Дата початку</th><th>Дата завершення</th><th>Статус</th><th>Тип</th><th>Дії</th></tr>
            </thead>
            <tbody id="schedulesForVisitServicesTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("schedulesForVisitServicesTableBody");
    schedules.forEach(schedule => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align: center;">${schedule.start_date}</td>
            <td style="text-align: center;">${schedule.end_date  ?? "-"}</td>
            <td style="text-align: center;">${schedule.schedule_status}</td>
            <td style="text-align: center;">${schedule.schedule_type}</td>
            <td style="display: flex; flex-direction: column;">
                <button class="review-btn" 
                        style="
                            background-color: #10b981; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Переглянути
                </button>
            </td>
        `;
        tr.querySelector(".review-btn").addEventListener("click", () => reviewScheduleWithVisitServices(schedule.id_schedule));
        tbody.appendChild(tr);
    });
}

async function reviewScheduleWithVisitServices(id) {
    const response = await fetch("/review_visit_services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_schedule: Number(id) })
    });

    const visitServices = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    
    adminPanel.innerHTML = `
        <h2>Плани-графіки з наданими послугами</h2>
        <table id="visitServicesTable">
            <thead style="text-align: left;">
                <tr><th>Клієнт</th><th>Послуга</th><th>Дата</th><th>Запланований початок</th><th>Заплановане завершення</th><th>Звітований початок</th><th>Звітоване завершення</th><th>Статус</th></tr>
            </thead>
            <tbody id="visitServicesTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("visitServicesTableBody");
    
    let lastDate = null;
    let lastCaregiver = null;
    let alternate = false;

    visitServices.forEach(visit => {

        if (lastDate !== visit.planned_date){
            const dayRow=document.createElement("tr");

            dayRow.innerHTML = `<td colspan="8" class="day-header">${visit.planned_date}</td>`;

            tbody.appendChild(dayRow);

            lastDate = visit.planned_date;
            lastCaregiver = null;
        }

        if (lastCaregiver !== visit.id_caregiver){
            const caregiverRow=document.createElement("tr");

            caregiverRow.innerHTML = `<td colspan="8" class="caregiver-header"><h2>${visit.caregiver_name}</h2></td>`;

            tbody.appendChild(caregiverRow);

            alternate =! alternate;
            lastCaregiver = visit.id_caregiver;
        }

        const tr = document.createElement("tr");

        tr.classList.add("group-odd");

        tr.innerHTML = `
            <td>${visit.client_name}</td>
            <td>${visit.service_name}</td>
            <td>${visit.planned_date}</td>
            <td>${visit.planned_start_time}</td>
            <td>${visit.planned_end_time}</td>
            <td style="font-weight: bold;">${visit.actual_start_time}</td>
            <td style="font-weight: bold;">${visit.actual_end_time}</td>
            <td style="font-weight: bold;">${visit.visit_serv_status}</td>
        `;

        tbody.appendChild(tr);
    });
}



async function addContract() {
    const response = await fetch("/client_names");
    const client_names = await response.json();

    const options = client_names.map(row => `<option value="${row[0]}">`).join("");

    const adminPanel = document.getElementById("adminPanel");
    adminPanel.innerHTML = `
        <form class="panel-form" id="createContractForm">
            <h2>Створення запису договору</h2>

            <label for="clientName">Ім'я клієнта</label>
            <input list="clientNames" id="clientNameInput" name="clientName" required>

            <datalist id="clientNames">
                 ${options}
            </datalist>

            <label for="dateOfSigning">Дата підписання договору</label>
            <input type="date" id="dateOfSigningInput" name="dateOfSigning" required>

            <label for="expirationDate">Дата закінчення дії договору</label>
            <input type="date" id="expirationDateInput" name="expirationDate">

            <label for="careScheduleType">Тип розкладу</label>
            <input list="careScheduleTypes" id="careScheduleTypeInput" name="careScheduleType" required>

            <datalist id="careScheduleTypes">
                 <option value="Звичайний розклад">
                 <option value="Щоденний догляд">
                 <option value="Цілодобовий догляд">
            </datalist>

            <label for="contractDetails">Деталі договору</label>
            <input type="text" id="contractDetailsInput" name="contractDetails">

            <button type="submit">Створити запис договору</button>
        </form>
    `;

    document.getElementById("createContractForm").addEventListener("submit", createContract);
}

async function createContract(event) {
    event.preventDefault();
    try {
        const response = await fetch("/create_contract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_name: document.getElementById("clientNameInput").value.trim(),
                date_of_signing: document.getElementById("dateOfSigningInput").value,
                expiration_date: document.getElementById("expirationDateInput").value,
                care_schedule_type: document.getElementById("careScheduleTypeInput").value.trim(),
                contract_details: document.getElementById("contractDetailsInput").value.trim()
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        showToast(data.message, "success");
        contractList();
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}

async function contractList() {
    const response = await fetch("/change_contract");
    const contracts = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <h2>Записи договорів</h2>
        <table id="contractsTable">
            <thead>
                <tr><th>ПІБ клієнта</th><th>Дата підпису</th><th>Дата закінчення</th><th>Статус</th></tr>
            </thead>
            <tbody id="contractsTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("contractsTableBody");
    contracts.forEach(contract => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${contract.surname} ${contract.name} ${contract.patronymic}</td>
            <td style="text-align: center">${contract.date_of_signing}</td>
            <td style="text-align: center">${contract.expiration_date ?? "-"}</td>
            <td style="text-align: center">${contract.care_schedule_type}</td>
        `;
        tbody.appendChild(tr);
    });
}


async function addReqServ() {
    const response = await fetch("/client_names");
    const client_names = await response.json();

    const options = client_names.map(row => `<option value="${row[0]}">`).join("");

    const adminPanel = document.getElementById("adminPanel");
    adminPanel.innerHTML = `
        <form class="panel-form" id="createRequiredServiceForm">
            <h2>Створення запису послуги клієнту</h2>

            <label for="clientName">Ім'я клієнта</label>
            <input list="clientNames" id="clientNameInput" name="clientName" required>

            <datalist id="clientNames">
                 ${options}
            </datalist>

            <label for="serviceName">Назва послуги</label>
            <input list="serviceNames" id="serviceNameInput" name="serviceName" required>

            <datalist id="serviceNames">
                <option value="Приготування їжї">
                <option value="Годування">
                <option value="Прибирання">
                <option value="Супровід до лікарні">
                <option value="Покупка продуктів та ліків">
                <option value="Прання та прасування">
                <option value="Гігієнічні процедури">
                <option value="Косметичні послуги">
                <option value="Психологічна терапія">
                <option value="Прогулянка">
                <option value="Легкі медичні послуги">
                <option value="Уколи/забір крові">
            </datalist>

            <label for="frequency">Частота надання послуги (днів на тиждень)</label>
            <input type="number" id="frequencyInput" name="frequency" required>

            <label for="priority">Приорітет</label>
            <input list="priorities" id="priorityInput" name="priority" required>

            <datalist id="priorities">
                <option value="Low">
                <option value="Medium">
                <option value="High">
                <option value="Critical">
            </datalist>

            <label for="startDate">Дата початку надання постуги</label>
            <input type="date" id="startDateInput" name="startDate" required>

            <label for="endDate">Дата закінчення надання постуги</label>
            <input type="date" id="endDateInput" name="endDate">

            <label for="reqServStatus">Статус</label>
            <input list="reqServStatuses" id="reqServStatusInput" name="reqServStatus" required>

            <datalist id="reqServStatuses">
                <option value="Active">
                <option value="Cancelled">
            </datalist>

            <label for="notes">Додаткові нотатки</label>
            <input type="text" id="notesInput" name="notes">

            <button type="submit">Створити запис послуги клієнту</button>
        </form>
    `;

    document.getElementById("createRequiredServiceForm").addEventListener("submit", createReqServ);
}


async function createReqServ(event) {
    event.preventDefault();
    try {
        const response = await fetch("/create_req_serv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_name: document.getElementById("clientNameInput").value.trim(),
                service_name: document.getElementById("serviceNameInput").value.trim(),
                frequency: document.getElementById("frequencyInput").value.trim(),
                priority: document.getElementById("priorityInput").value.trim(),
                start_date: document.getElementById("startDateInput").value,
                end_date: document.getElementById("endDateInput").value,
                req_serv_status: document.getElementById("reqServStatusInput").value.trim(),
                notes: document.getElementById("notesInput").value.trim()
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        showToast(data.message, "success");
        reqServList(); 
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}

async function reqServList() {
    const response = await fetch("/change_req_serv");
    const req_servs = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <h2>Необхідні клієнтам послуги</h2>
        <table id="reqServsTable">
            <thead>
                <tr><th>ПІБ клієнта</th><th>Послуга</th><th>Необхідна кваліфікація</th><th>Частота</th><th>Приорітет</th><th>Статус</th><th>Дії</th></tr>
            </thead>
            <tbody id="reqServsTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("reqServsTableBody");
    req_servs.forEach(req_serv => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${req_serv.surname} ${req_serv.name} ${req_serv.patronymic}</td>
            <td>${req_serv.service_name}</td>
            <td>${req_serv.required_qualification}</td>
            <td>${req_serv.frequency}</td>
            <td>${req_serv.priority}</td>
            <td>${req_serv.req_serv_status}</td>
            <td style="display: flex; flex-direction: column;">
                <button class="delete-btn" 
                        style="
                            background-color: #ef4444; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Видалити
                </button>
            </td>
        `;
        tr.querySelector(".delete-btn").addEventListener("click", () => deleteReqServ(req_serv.id_required_service));
        tbody.appendChild(tr);
    });
}

async function deleteReqServ(id) {
    const confirmed = await openConfirmModal("Ви дійсно хочете видалити послугу для клієнта?");
    if (!confirmed) return;

    const response = await fetch("/remove_req_serv", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_required_service: Number(id) })
    });

    const data = await response.json();
    if (!response.ok) return showToast(data.error, "error");

    showToast(data.message, "success");
    reqServList();
}


async function addAssignment() {
    const response1 = await fetch("/curr_assign");
    const curr_assigns = await response1.json();

    const response2 = await fetch("/client_names");
    const client_names = await response2.json();
    const cl_options = client_names.map(row => `<option value="${row[0]}">`).join("");

    const response3 = await fetch("/caregiver_names");
    const caregiver_names = await response3.json();
    const cg_options = caregiver_names.map(row => `<option value="${row[0]}">`).join("");
    
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <div class="container">
            <h2 style="margin-bottom: 30px;">Кваліфікації та навантаженості доглядальників</h2>
            <table id="caregiversStatsTable">
                <thead style="margin-bottom: 15px;">
                    <tr><th>ПІБ</th><th>Кваліфікація</th><th>Навантаженність (год.)</th></tr>
                </thead>
                <tbody id="caregiversStatsTableBody"></tbody>
            </table>
        </div>
        <form class="panel-form" id="createAssignmentForm">
            <h2>Призначення доглядальника клієнту</h2>

            <label for="clientName">Ім'я клієнта</label>
            <input list="clientNames" id="clientNameInput" name="clientName" required>

            <datalist id="clientNames">
                 ${cl_options}
            </datalist>

            <label for="caregiverName">Ім'я доглядальника</label>
            <input list="caregiverNames" id="caregiverNameInput" name="caregiverName" required>

            <datalist id="caregiverNames">
                 ${cg_options}
            </datalist>

            <label for="startDate">Дата початку призначення</label>
            <input type="date" id="startDateInput" name="startDate" required>

            <label for="endDate">Дата закінчення призначення</label>
            <input type="date" id="endDateInput" name="endDate">


            <label for="assignStatus">Статус призначення</label>
            <input list="assignStatuses" id="assignStatusInput" name="assignStatus" required>

            <datalist id="assignStatuses">
                <option value="Active">
                <option value="Suspended">
                <option value="Cancelled">
            </datalist>

            <label for="assignType">Тип призначення</label>
            <input list="assignTypes" id="assignTypeInput" name="assignType" required>

            <datalist id="assignTypes">
                <option value="Primary">
                <option value="Temporary">
                <option value="Replacement">
            </datalist>

            <button type="submit">Призначити доглядальника клієнту</button>
        </form>
    `;

    document.getElementById("createAssignmentForm").addEventListener("submit", createAssignment);

    const tbody = document.getElementById("caregiversStatsTableBody");
    curr_assigns.forEach(assign => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${assign.caregiver_name}</td>
            <td style="text-align: center;">${assign.qualification}</td>
            <td style="text-align: center;">${assign.hours_per_week}</td>            
        `;
        tbody.appendChild(tr);
    });
}

async function createAssignment(event) {
    event.preventDefault();
    try {
        const response = await fetch("/create_assign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_name: document.getElementById("clientNameInput").value.trim(),
                caregiver_name: document.getElementById("caregiverNameInput").value.trim(),
                start_date: document.getElementById("startDateInput").value,
                end_date: document.getElementById("endDateInput").value,
                assign_status: document.getElementById("assignStatusInput").value.trim(),
                assignment_type: document.getElementById("assignTypeInput").value.trim()
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        showToast(data.message, "success");
        assignmentList(); 
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}

async function assignmentList() {
    const response = await fetch("/change_assign");
    const assignments = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <h2>Призначення доглядальників клієнтам</h2>
        <table id="assignmentsTable">
            <thead>
                <tr><th>ПІБ клієнта</th><th>ПІБ доглядальника</th><th>Дата початку</th><th>Дата закінчення</th><th>Статус</th><th>Тип</th><th>Дії</th></tr>
            </thead>
            <tbody id="assignmentsTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("assignmentsTableBody");
    assignments.forEach(assignment => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${assignment.client_name}</td>
            <td>${assignment.caregiver_name}</td>
            <td>${assignment.start_date}</td>
            <td>${assignment.end_date  ?? "-"}</td>
            <td>${assignment.assign_status}</td>
            <td>${assignment.assignment_type}</td>
            <td style="display: flex; flex-direction: column;">
                <button class="delete-btn" 
                        style="
                            background-color: #ef4444; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Видалити
                </button>
            </td>
        `;
        tr.querySelector(".delete-btn").addEventListener("click", () => deleteAssignment(assignment.id_assignment));
        tbody.appendChild(tr);
    });
}

async function deleteAssignment(id) {
    const confirmed = await openConfirmModal("Ви дійсно хочете видалити це призначення?");
    if (!confirmed) return;

    const response = await fetch("/remove_assign", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_assignment: Number(id) })
    });

    const data = await response.json();
    if (!response.ok) return showToast(data.error, "error");

    showToast(data.message, "success");
    assignmentList();
}



async function reviewClientRatings() {
    const history = await fetch("/review_client_ratings").then(r => r.json());

    const adminPanel = document.getElementById("adminPanel");
    adminPanel.innerHTML = "";

    adminPanel.innerHTML = `<h2 style="margin-bottom: 20px;">Антирейтинги клієнтів</h2>`;

    for (const [name, values] of Object.entries(history)) {

        const div = document.createElement("div");

        div.className = "container";
        div.style.width = "900px";
        div.style.margin = "0 auto 30px auto";

        const title = document.createElement("h2");
        title.textContent = `Рейтинг ${name}`;

        const canvas = document.createElement("canvas");
        canvas.name = `chart-${name}`;

        div.append(title);
        div.append(canvas);

        adminPanel.append(div);

        new Chart(canvas, {
            type: "line",
            data: {
                labels: values.map(v => v.date),
                datasets: [{
                    label: `Рейтинг ${name}`,
                    data: values.map(v => v.rating),
                    borderColor: "#4A90E2",
                    backgroundColor: "rgba(74,144,226,0.2)",
                    fill: true,
                    tension: 0.35
                }]
            }
        });
    }
}

async function reviewCaregiverRatings() {
    const history = await fetch("/review_caregiver_ratings").then(r => r.json());

    const adminPanel = document.getElementById("adminPanel");
    adminPanel.innerHTML = "";

    adminPanel.innerHTML = `<h2 style="margin-bottom: 20px;">Рейтинги доглядальників</h2>`;

    for (const [name, values] of Object.entries(history)) {

        const div = document.createElement("div");

        div.className = "container";
        div.style.width = "900px";
        div.style.margin = "0 auto 30px auto";

        const title = document.createElement("h2");
        title.textContent = `Рейтинг ${name}`;

        const canvas = document.createElement("canvas");
        canvas.name = `chart-${name}`;

        div.append(title);
        div.append(canvas);

        adminPanel.append(div);

        new Chart(canvas, {
            type: "line",
            data: {
                labels: values.map(v => v.date),
                datasets: [{
                    label: `Рейтинг ${name}`,
                    data: values.map(v => v.rating),
                    borderColor: "#4A90E2",
                    backgroundColor: "rgba(74,144,226,0.2)",
                    fill: true,
                    tension: 0.35
                }]
            }
        });
    }
    /*
    adminPanel.innerHTML = `        
        <div class="container">
            <h2>Рейтинг 1 </h2>

            <canvas id="ratingChart"></canvas>
        </div>
    `;

    const canvas = document.getElementById("ratingChart");
    const ctx = canvas.getContext("2d");

    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Рейтинг",
                data: ratings,
                borderColor: "#4A90E2",
                backgroundColor: "rgba(74,144,226,0.2)",
                fill: true,
                tension: 0.35,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: false } }
        }
    });
    */
}



async function reviewFeedbacks() {
    const response = await fetch("/review_feedbacks");
    let feedbacks = await response.json();

    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `
        <h2>Відгуки</h2>
        <table id="feedbacksTable">
            <thead>
                <tr>
                    <th data-column="submition_date">Дата</th>
                    <th data-column="author_name">Автор</th>
                    <th data-column="reciever_name">Адресат</th>
                    <th data-column="grade">Оцінка</th>
                    <th data-column="comment">Коментар</th>
                </tr>
            </thead>
            <tbody id="feedbacksTableBody"></tbody>
        </table>
    `;

    let currentColumn = "";
    let ascending = true;

    function renderTable() {
        const tbody = document.getElementById("feedbacksTableBody");
        tbody.innerHTML = "";

        feedbacks.forEach(feedback => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${feedback.submition_date}</td>
                <td>${feedback.author_name}</td>
                <td>${feedback.reciever_name}</td>
                <td>${feedback.grade}/10</td>
                <td>${feedback.comment ?? "-"}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderTable();

    document.querySelectorAll("#feedbacksTable th").forEach(th => {
        th.style.cursor = "pointer";

        th.addEventListener("click", () => {
            const column = th.dataset.column;

            if (currentColumn === column) {
                ascending = !ascending;
            } else {
                currentColumn = column;
                ascending = true;
            }

            feedbacks.sort((a, b) => {
                let valA = a[column];
                let valB = b[column];

                if (column === "grade") {
                    return ascending ? valA - valB : valB - valA;
                }

                if (column === "submition_date") {
                    valA = new Date(valA);
                    valB = new Date(valB);
                    return ascending ? valA - valB : valB - valA;
                }

                valA = (valA ?? "").toString().toLowerCase();
                valB = (valB ?? "").toString().toLowerCase();

                return ascending
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            });

            renderTable();
        });
    });
}
/*
    for (const date in feedbacks) {
        feedbacks[date].forEach(feedback => {
            const container = document.createElement("div");
            container.className = "container";

            container.innerHTML = `
                <h3 style="margin-bottom: 15px;">${date} Від: ${feedback.author_name} Про: ${feedback.reciever_name}</h3>
                <p style="margin-bottom: 15px;">Оцінка: ${feedback.grade}</p>
                <p>${feedback.comment}</p>
            `;
            adminPanel.appendChild(container);
        });
    }
*/

async function reviewIncidents() {
    const response = await fetch("/review_incidents");
    const incidents = await response.json();
    const adminPanel = document.getElementById("adminPanel");

    adminPanel.innerHTML = `<h2>Скарги та відмови</h2>`;

    for (const date in incidents) {
        incidents[date].forEach(incident => {
            const container = document.createElement("div");
            container.className = "container";

            container.innerHTML = `
                <h3 style="margin-bottom: 15px;">${date} Клієнт: ${incident.client_name} - Доглядальник: ${incident.caregiver_name}</h3>
                <p  style="margin-bottom: 15px;"><strong>Тип інциденту: ${incident.incident_type}</strong></p>
                <p  style="margin-bottom: 15px;">Причина: ${incident.incident_reason}</p>
                <p  style="margin-bottom: 15px;">Опис інциденту: ${incident.incident_description}</p>
                <p  style="margin-bottom: 15px;">Статус інциденту: ${incident.incident_status}</p>
                <p  style="margin-bottom: 15px;">Дата розв'язання: ${incident.resolve_date  ?? "-"}</p>
                <p  style="margin-bottom: 15px;">Дата закриття: ${incident.closure_date  ?? "-"}</p>
            `;
            adminPanel.appendChild(container);
        });
    }
}

// caregiver panel

async function reviewAllCaregiverSchedules() {
    const response = await fetch("/review_all_schedules");
    const schedules = await response.json();
    const caregiverPanel = document.getElementById("caregiverPanel");

    caregiverPanel.innerHTML = `
        <h2>Графіки</h2>
        <table id="schedulesTable">
            <thead>
                <tr><th>Дата початку</th><th>Дата завершення</th><th>Статус</th><th>Тип</th><th>Дії</th></tr>
            </thead>
            <tbody id="schedulesTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("schedulesTableBody");
    schedules.forEach(schedule => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align: center;">${schedule.start_date}</td>
            <td style="text-align: center;">${schedule.end_date ?? "-"}</td>
            <td style="text-align: center;">${schedule.schedule_status}</td>
            <td style="text-align: center;">${schedule.schedule_type}</td>
            <td style="display: flex; flex-direction: column;">
                <button class="review-btn" 
                        style="
                            background-color: #10b981; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Переглянути
                </button>
            </td>
        `;

        tr.querySelector(".review-btn").addEventListener("click", () => reviewCaregiverSchedule(schedule.id_schedule));
        tbody.appendChild(tr);
    });
}

async function reviewCaregiverSchedule(scheduleId) {
    const token = localStorage.getItem("accessToken");
    if (!token) { return notLoggedIn(); }

    let userId;

    try {
        const res = await fetch("/me", { headers: { Authorization: `Bearer ${token}` } });
        
        if (res.status === 401) {
            console.log("Unauthorized");
            return;
        }

        const user = await res.json();
        userId = user.id;
    } catch (err) {
        console.error("Помилка авторизації:", err);
    }

    const response = await fetch("/review_caregiver_schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            id_user: userId,
            id_schedule: Number(scheduleId)
        })
    });

    const plannedVisits = await response.json();
    const caregiverPanel = document.getElementById("caregiverPanel");

    
    caregiverPanel.innerHTML = `
        <h2>Графіки</h2>
        <table id="plannedVisitsTable">
            <thead style="text-align: left;">
                <tr><th>Клієнт</th><th>Послуга</th><th>Дата</th><th>Запланований початок</th><th>Заплановане завершення</th></tr>
            </thead>
            <tbody id="plannedVisitsTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("plannedVisitsTableBody");
    
    let lastDate = null;

    plannedVisits.forEach(visit => {

        if (lastDate !== visit.planned_date){
            const dayRow=document.createElement("tr");

            dayRow.innerHTML = `<td colspan="6" class="day-header">${visit.planned_date}</td>`;

            tbody.appendChild(dayRow);

            lastDate = visit.planned_date;
            lastCaregiver = null;
        }

        const tr = document.createElement("tr");

        tr.classList.add("group-odd");

        tr.innerHTML = `
            <td>${visit.client_name}</td>
            <td>${visit.service_name}</td>
            <td>${visit.planned_date}</td>
            <td>${visit.planned_start_time}</td>
            <td>${visit.planned_end_time}</td>
        `;

        tbody.appendChild(tr);
    });
}

async function addReport() {
    const response = await fetch("/client_names");
    const client_names = await response.json();
    const options1 = client_names.map(row => `<option value="${row[0]}">`).join("");

    const caregiverPanel = document.getElementById("caregiverPanel");
    caregiverPanel.innerHTML = `
        <form class="panel-form" id="addReportForm">
            <h2>Створення звіту</h2>

            <label for="clientName">Ім'я клієнта</label>
            <input list="clientNames" id="clientNameInput" name="clientName" required>

            <datalist id="clientNames">
                 ${options1}
            </datalist>

            <label for="plannedVisitDate">Дата наряду, про який створюється звіт</label>
            <input type="date" id="plannedVisitDateInput" name="plannedVisitDate" required>

            <label for="reportText">Короткий опис звіту</label>
            <input type="text" id="reportTextInput" name="reportText" required>            

            <button type="submit">Створити звіт</button>
        </form>
    `;

    document.getElementById("addReportForm").addEventListener("submit", createReport);
}

async function createReport(event) {
    event.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) { return notLoggedIn(); }

    let userId;

    try {
        const res = await fetch("/me", { headers: { Authorization: `Bearer ${token}` } });
        
        if (res.status === 401) {
            console.log("Unauthorized");
            return;
        }

        const user = await res.json();
        userId = user.id;
    } catch (err) {
        console.error("Помилка авторизації:", err);
    }

    try {
        const response = await fetch("/create_report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_name: document.getElementById("clientNameInput").value.trim(),
                user_id_caregiver: userId,
                planned_visit_date: document.getElementById("plannedVisitDateInput").value,
                report_text: document.getElementById("reportTextInput").value.trim()
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        showToast(data.message, "success");
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}


async function selectedClientDiseasesList() {
    const token = localStorage.getItem("accessToken");
    if (!token) { return notLoggedIn(); }

    let userId;

    try {
        const res = await fetch("/me", { headers: { Authorization: `Bearer ${token}` } });
        
        if (res.status === 401) {
            console.log("Unauthorized");
            return;
        }

        const user = await res.json();
        userId = user.id;
    } catch (err) {
        console.error("Помилка авторизації:", err);
    }

    const response = await fetch("/selected_client_diseases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: userId })
    });

    const selected_client_diseases = await response.json();
    const caregiverPanel = document.getElementById("caregiverPanel");

    caregiverPanel.innerHTML = `
        <h2>Захворювання клієнтів</h2>
        <table id="clientsTable">
            <thead>
                <tr><th>ПІБ клієнта</th><th>Назва захворювання</th><th>Дата встановлення</th><th>Важкість</th><th>Нотатки</th></tr>
            </thead>
            <tbody id="clientDiseasesTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("clientDiseasesTableBody");
    selected_client_diseases.forEach(client_disease => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${client_disease.surname} ${client_disease.name} ${client_disease.patronymic}</td>
            <td>${client_disease.disease_name}</td>
            <td style="text-align: center">${client_disease.diagnosis_date ?? "-"}</td>
            <td style="text-align: center">${client_disease.severity ?? "-"}</td>
            <td style="text-align: center">${client_disease.notes ?? "-"}</td>
        `;
        tbody.appendChild(tr);
    });
}

// client panel

async function reviewAllClientSchedules() {
    const response = await fetch("/review_all_schedules");
    const schedules = await response.json();
    const clientPanel = document.getElementById("clientPanel");

    clientPanel.innerHTML = `
        <h2>Плани</h2>
        <table id="schedulesTable">
            <thead>
                <tr><th>Дата початку</th><th>Дата завершення</th><th>Статус</th><th>Тип</th><th>Дії</th></tr>
            </thead>
            <tbody id="schedulesTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("schedulesTableBody");
    schedules.forEach(schedule => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align: center;">${schedule.start_date}</td>
            <td style="text-align: center;">${schedule.end_date ?? "-"}</td>
            <td style="text-align: center;">${schedule.schedule_status}</td>
            <td style="text-align: center;">${schedule.schedule_type}</td>
            <td style="display: flex; flex-direction: column;">
                <button class="review-btn" 
                        style="
                            background-color: #10b981; 
                            color: white; 
                            padding: 5px 10px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer;">
                        Переглянути
                </button>
            </td>
        `;

        tr.querySelector(".review-btn").addEventListener("click", () => reviewClientSchedule(schedule.id_schedule));
        tbody.appendChild(tr);
    });
}

async function reviewClientSchedule(scheduleId) {
    const token = localStorage.getItem("accessToken");
    if (!token) { return notLoggedIn(); }

    let userId;

    try {
        const res = await fetch("/me", { headers: { Authorization: `Bearer ${token}` } });
        
        if (res.status === 401) {
            console.log("Unauthorized");
            return;
        }

        const user = await res.json();
        userId = user.id;
    } catch (err) {
        console.error("Помилка авторизації:", err);
    }

    const response = await fetch("/review_client_schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            id_user: userId,
            id_schedule: Number(scheduleId)
        })
    });

    const plannedVisits = await response.json();
    const clientPanel = document.getElementById("clientPanel");

    
    clientPanel.innerHTML = `
        <h2>Плани-графіки</h2>
        <table id="plannedVisitsTable">
            <thead style="text-align: left;">
                <tr><th>Послуга</th><th>Дата</th><th>Запланований початок</th><th>Заплановане завершення</th></tr>
            </thead>
            <tbody id="plannedVisitsTableBody"></tbody>
        </table>
    `;

    const tbody = document.getElementById("plannedVisitsTableBody");
    
    let lastDate = null;
    let lastCaregiver = null;

    plannedVisits.forEach(visit => {

        if (lastDate !== visit.planned_date){
            const dayRow=document.createElement("tr");

            dayRow.innerHTML = `<td colspan="6" class="day-header">${visit.planned_date}</td>`;

            tbody.appendChild(dayRow);

            lastDate = visit.planned_date;
            lastCaregiver = null;
        }

        if (lastCaregiver !== visit.id_caregiver){
            const caregiverRow=document.createElement("tr");

            caregiverRow.innerHTML = `<td colspan="6" class="caregiver-header"><h2>${visit.caregiver_name}</h2></td>`;

            tbody.appendChild(caregiverRow);

            lastCaregiver = visit.id_caregiver;
        }

        const tr = document.createElement("tr");

        tr.classList.add("group-odd");

        tr.innerHTML = `
            <td>${visit.service_name}</td>
            <td>${visit.planned_date}</td>
            <td>${visit.planned_start_time}</td>
            <td>${visit.planned_end_time}</td>
        `;

        tbody.appendChild(tr);
    });
}

async function addFeedback() {
    const response1 = await fetch("/client_names");
    const client_names = await response1.json();
    const options1 = client_names.map(row => `<option value="${row[0]}">`).join("");

    const response2 = await fetch("/caregiver_names");
    const caregiver_names = await response2.json();
    const options2 = caregiver_names.map(row => `<option value="${row[0]}">`).join("");

    //const commonUserPanel = document.getElementById("commonUserPanel");
    const formFeedbackHTML = `
        <form class="panel-form" id="addFeedbackForm">
            <h2>Створення відгуку</h2>

            <label for="clientName">Ім'я клієнта</label>
            <input list="clientNames" id="clientNameInput" name="clientName" required>

            <datalist id="clientNames">
                 ${options1}
            </datalist>

            <label for="caregiverName">Ім'я доглядальника</label>
            <input list="caregiverNames" id="caregiverNameInput" name="caregiverName" required>

            <datalist id="caregiverNames">
                 ${options2}
            </datalist>

            <label for="plannedVisitDate">Дата наряду, про який створюється відгук</label>
            <input type="date" id="plannedVisitDateInput" name="plannedVisitDate" required>

            <label for="feedbackGrade">Оцінка до відгуку</label>
            <input type="number" id="feedbackGradeInput" name="feedbackGrade" min="1" max="10" required>

            <label for="feedbackText">Комментар до відгуку</label>
            <input type="text" id="feedbackTextInput" name="feedbackText">            

            <button type="submit">Відправити відгук</button>
        </form>
    `;

    try 
    {
        clientPanel.innerHTML = "";
        caregiverPanel.innerHTML = "";
    } catch (e) { console.log("clientPanel not found"); }
    
    clientPanel.innerHTML = formFeedbackHTML;
    //try { caregiverPanel.innerHTML = formFeedbackHTML; } catch (e) { console.log("caregiverPanel not found"); }

    document.getElementById("addFeedbackForm").addEventListener("submit", createFeedback);
}


async function createFeedback(event) {
    event.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) { return notLoggedIn(); }

    let userId;

    try {
        const res = await fetch("/me", { headers: { Authorization: `Bearer ${token}` } });
        
        if (res.status === 401) {
            console.log("Unauthorized");
            return;
        }

        const user = await res.json();
        userId = user.id;
    } catch (err) {
        console.error("Помилка авторизації:", err);
    }

    try {
        const response = await fetch("/create_feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                feedback_author: userId,
                client_name: document.getElementById("clientNameInput").value.trim(),
                caregiver_name: document.getElementById("caregiverNameInput").value.trim(),
                planned_visit_date: document.getElementById("plannedVisitDateInput").value,
                feedback_grade: Number(document.getElementById("feedbackGradeInput").value),
                feedback_text: document.getElementById("feedbackTextInput").value.trim()
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        console.log(data);

        showToast(data.message, "success");
        recalculateRating(data.id_reciever, data.reciever_type, data.average_rating);
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}

async function recalculateRating(id, type, average_rating) {
    const lambda = 0.05;
    const m = 50;
    const C = average_rating ?? 0;

    let grades_arr = [];
    let months_diff_arr = [];

    try {
        const response = await fetch("/recalculate_rating", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_reciever: id,
                reciever_type: type
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        grades_arr = data.grades;
        months_diff_arr = data.months_diff;
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }

    let reviews_count = grades_arr.length;

    let w_arr = months_diff_arr.map(months_diff => Math.exp(-lambda * months_diff));
    let sum_w = w_arr.reduce((acc, w) => acc + w, 0);
    let weighted_sum = grades_arr.reduce((acc, grade, index) => acc + grade * w_arr[index], 0);

    let weighted_average = sum_w > 0 ? weighted_sum / sum_w : 0;

    let bayesian_average = (m * C + sum_w * weighted_average) / (m + sum_w);

    try {
        const response = await fetch("/update_rating", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_reciever: id,
                reciever_type: type,
                reviews_count: reviews_count,
                recalculated_rating: bayesian_average
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        showToast(data.message, "success");
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}

async function addIncident() {
    const response1 = await fetch("/client_names");
    const client_names = await response1.json();
    const options1 = client_names.map(row => `<option value="${row[0]}">`).join("");

    const response2 = await fetch("/caregiver_names");
    const caregiver_names = await response2.json();
    const options2 = caregiver_names.map(row => `<option value="${row[0]}">`).join("");

    //const commonUserPanel = document.getElementById("commonUserPanel");
    const formFeedbackHTML = `
        <form class="panel-form" id="addIncidentForm">
            <h2>Створення інциденту</h2>

            <label for="clientName">Ім'я клієнта</label>
            <input list="clientNames" id="clientNameInput" name="clientName" required>

            <datalist id="clientNames">
                 ${options1}
            </datalist>

            <label for="caregiverName">Ім'я доглядальника</label>
            <input list="caregiverNames" id="caregiverNameInput" name="caregiverName" required>

            <datalist id="caregiverNames">
                 ${options2}
            </datalist>

            <label for="incidentType">Тип інциденту</label>
            <input list="incidentTypes" id="incidentTypeInput" name="incidentType" required>

            <datalist id="incidentTypes">
                <option value="Скарга">
                <option value="Відмова">
            </datalist>

            <label for="incidentReason">Причина інциденту</label>
            <input type="text" id="incidentReasonInput" name="incidentReason" required>

            <label for="incidentDescription">Опис інциденту</label>
            <input type="text" id="incidentDescriptionInput" name="incidentDescription" required>

            <label for="incidentStatus">Статус інциденту</label>
            <input list="incidentStatuses" id="incidentStatusInput" name="incidentStatus" required>

            <datalist id="incidentStatuses">
                <option value="Opened">
                <option value="Closed">
            </datalist>

            <button type="submit">Відправити інцидент</button>
        </form>
    `;

    try 
    {
        clientPanel.innerHTML = "";
        caregiverPanel.innerHTML = "";
    } catch (e) { console.log("clientPanel not found"); }
    
    clientPanel.innerHTML = formFeedbackHTML;
    //try { caregiverPanel.innerHTML = formFeedbackHTML; } catch (e) { console.log("caregiverPanel not found"); }

    document.getElementById("addIncidentForm").addEventListener("submit", createIncident);
}

async function createIncident(event) {
    event.preventDefault();

    try {
        const response = await fetch("/create_incident", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_name: document.getElementById("clientNameInput").value.trim(),
                caregiver_name: document.getElementById("caregiverNameInput").value.trim(),
                incident_type: document.getElementById("incidentTypeInput").value.trim(),
                incident_reason: document.getElementById("incidentReasonInput").value.trim(),
                incident_description: document.getElementById("incidentDescriptionInput").value.trim(),
                incident_status: document.getElementById("incidentStatusInput").value.trim()
            })
        });

        const data = await response.json();
        if (!response.ok) return showToast(data.error, "error");
        
        showToast(data.message, "success");
    } catch (e) {
        showToast("Помилка з'єднання з сервером", "error");
    }
}
