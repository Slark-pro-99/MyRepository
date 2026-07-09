const express = require('express');
const oracledb = require('oracledb');
const fs = require('fs');
const path = require("path");
const mammoth = require("mammoth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
exports.app = app;
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

/*
// добавление нового пользователя
const new_username = "kiril_korol";
const new_password = "Qwertz$$1";

async function SaveUser() {
    const hashedPassword = await bcrypt.hash(new_password, 10);

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(
            `
            INSERT INTO USERS (
                name,
                surname,
                patronymic,
                email,
                phone_number,
                rights,
                registration_date,
                username,
                password_hash
            )
            VALUES (
                :name,
                :surname,
                :patronymic,
                :email,
                :phone,
                :rights,
                TO_DATE(:regDate, 'YYYY-MM-DD'),
                :username,
                :password
            )
            `,
            {
                name: "Кіріл",
                surname: "Король",
                patronymic: "Андрійович",
                email: "kiril.korol@nure.ua",
                phone: "067998454358",
                rights: "Einsatzleiter",
                regDate: "2026-05-15",
                username: new_username,
                password: hashedPassword
            },
            {
                autoCommit: true
            }
        );

        console.log(result);
    } catch (err) {
        console.error(err);
    } finally {
        if (connection)
            await connection.close();
    }
}

SaveUser();
*/



/*
const fs = require("fs");
const mammoth = require("mammoth");

async function parseDocx(filePath) {
    try {
        const data = await mammoth.extractRawText({ path: filePath });
        console.log("Extracted text:\n", data.value); // The text
    } catch (err) {
        console.error("Error reading DOCX:", err.message);
    }
}

// Example usage
parseDocx("example.docx");
*/
/*
async function parseDocx(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const parser = new DocxParser();
        const result = await parser.parse(buffer);

        console.log("Document metadata:", result.metadata);
        console.log("Paragraphs:", result.paragraphs);
    } catch (err) {
        console.error("Error parsing DOCX:", err.message);
    }
}

parseDocx("Shablon_dlya_dogovora.docx");
*/
/*
async function extractText() {
    const result = await mammoth.extractRawText({
        path: "Shablon_dlya_dogovora.docx"
    });

    return result.value; // весь текст
}

function parseData(text) {
    const lines = text.split("\n");

    const data = {};

    lines.forEach(line => {
        if (line.includes("Имя:")) data.name = line.replace("Имя:", "").trim();
        if (line.includes("Возраст:")) data.age = parseInt(line.replace("Возраст:", "").trim());
        if (line.includes("Email:")) data.email = line.replace("Email:", "").trim();
    });

    return data;
}

async function saveToDB(params) {
    
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });
        
        await connection.execute(`INSERT INTO CLIENTS (id_client, name) VALUES (\'${params[0]}\', \'${params[1]}\')`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    } finally {
        if (connection) await connection.close();
    }
    
    console.log(params);
}
*/
/*
// парсинг для извленчения текста из ворд-файла
async function run() {
    const text = await extractText();
    const data = parseData(text);
    await saveToDB(data);
}

run();
*/



// app.use(express.json()); // allows JSON parsing
// app.use(express.urlencoded({ extended: true })); // Parse form data

//const ACCESS_SECRET = "access_secret";
//const REFRESH_SECRET = "refresh_secret";
/*
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Wrong password" });

    // access token (короткий)
    const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        ACCESS_SECRET,
        { expiresIn: "15m" }
    );

    // refresh token (длинный)
    const refreshToken = jwt.sign(
        { id: user.id },
        REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    refreshTokens.push(refreshToken);

    // обычно кладут в httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    });

    res.json({ accessToken });
});
*/

let refreshTokens = [];

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.sendStatus(401);

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) return res.sendStatus(401);

    jwt.verify(token, ACCESS_SECRET, (err, user) => {
        if (err) {
            console.log(err.name);
            console.log(err.message);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

app.get("/profile", authenticate, (req, res) => { res.json({ user: req.user }); });

app.get("/me", authenticate, (req, res) => { res.json(req.user); });

function requireRole(rights) {
    return (req, res, next) => {
        if (req.user.rights !== rights) {
            return res.sendStatus(403);
        }
        next();
    };
}

app.get("/admin", authenticate, requireRole("Admin"), (req, res) => { res.json({ secret: "admin data" }); });

app.post("/refresh", (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.sendStatus(401);
    if (!refreshTokens.includes(token)) return res.sendStatus(403);

    try {
        const user = jwt.verify(token, REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            { id: user.id },
            ACCESS_SECRET,
            { expiresIn: "30m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch {
        res.sendStatus(403);
    }
});



const cookieParser = require("cookie-parser");
//const oracledb = require('oracledb');

app.use(cookieParser());

app.post("/logout", (req, res) => {
    const token = req.cookies.refreshToken;

    refreshTokens = refreshTokens.filter(t => t !== token);

    if (!token) { return res.sendStatus(204); }

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
});



const ACCESS_SECRET = "access_secret";
const REFRESH_SECRET = "refresh_secret";

// Получение имени пользователя и пароля на проверку
app.post("/login_page/credentials", async (req, res) => {
    //const login_creds = req.body;
    const { username, password } = req.body;

    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });
        
        const match_id_user = await connection.execute(`
            SELECT 
                id_user, 
                password_hash, 
                rights, 
                name, 
                surname 
            FROM 
                users 
            WHERE 
                USERNAME = :username
            `,
            {
                username: username
            }
        );

        if (match_id_user.rows.length === 0) return res.status(401).json({ message: "User not found" });

        const row = match_id_user.rows[0];

        const user_id = row[0];
        const user_pass_hash = row[1];
        const user_rights = row[2];
        // const name = row[3];
        // const surname = row[4];

        const isValid = await bcrypt.compare(password, user_pass_hash);
        if (!isValid) return res.status(401).json({ message: "Wrong password" });
      
        // access token (короткий)
        const accessToken = jwt.sign(
            { 
                id: user_id,  
                rights: user_rights,
                name: row[3],
                surname: row[4] 
            }, 
            ACCESS_SECRET, 
            { 
                expiresIn: "15m" 
            });

        // refresh token (длинный)
        const refreshToken = jwt.sign(
            { 
                id: user_id 
            }, 
            REFRESH_SECRET, 
            { 
                expiresIn: "7d" 
            });

        refreshTokens.push(refreshToken);

        // обычно кладут в httpOnly cookie
        // res.cookie("refreshToken", refreshToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "Strict" });

        res.json({ accessToken });
    } catch (err) {
        console.error(err);
        //res.status(500).send("Error");
        res.status(500).json({ message: "Internal server error" });
    } finally {
        if (connection) await connection.close();
    }
});

// admin panel

app.post("/create_client", async (req, res) => {
    const {
        name,
        surname,
        patronymic,
        email,
        phone_number,
        registration_date,
        username,
        password,

        country,
        region,
        city,
        district,
        street,
        house_number,
        entrance,
        floor,
        flat,
        postal_code,

        date_of_birth,
        client_status
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const userResult = await connection.execute(`
            INSERT INTO Users (
                name, 
                surname, 
                patronymic, 
                email, 
                phone_number,
                rights, 
                registration_date, 
                username,
                password_hash, 
                creation_datetime
            )
            VALUES (
                :name,
                :surname,
                :patronymic,
                :email,
                :phone_number,
                :rights,
                TO_DATE(:registration_date, 'YYYY-MM-DD'),
                :username,
                :password_hash,
                SYSTIMESTAMP
            ) 
            RETURNING id_user INTO :id
        `,
        {
            name: name,
            surname: surname,
            patronymic: patronymic,
            email: email,
            phone_number: phone_number,
            rights: "Client",
            registration_date: registration_date,
            username: username,
            password_hash: hashedPassword,
            id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        });

        const user_id = userResult.outBinds.id[0];

        const addressResult = await connection.execute(`
            INSERT INTO Addresses (
                country, 
                region, 
                city, 
                district, 
                street, 
                house_number, 
                entrance, 
                floor, 
                flat, 
                postal_code
            )
            VALUES (
                :country, 
                :region, 
                :city, 
                :district, 
                :street, 
                :house_number, 
                :entrance, 
                :floor, 
                :flat, 
                :postal_code
            )
            RETURNING id_address INTO :id
            `,
            {
                country: country,
                region: region,
                city: city,
                district: district,
                street: street,
                house_number: house_number,
                entrance: entrance,
                floor: floor,
                flat: flat,
                postal_code: postal_code,
                id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            }
        );
        const address_id = addressResult.outBinds.id[0];

        const clientResult = await connection.execute(`
            INSERT INTO Clients (
                id_user, 
                id_address, 
                date_of_birth, 
                client_status
            )
            VALUES (
                :user_id,
                :address_id,
                TO_DATE(:date_of_birth, 'YYYY-MM-DD'),
                :client_status
            )
            `,
            {
                user_id: user_id,
                address_id: address_id,
                date_of_birth: date_of_birth,
                client_status: client_status
            }
        );
        await connection.commit();
        /*
        res.json({
            success: true,
            user_id,
            address_id,
            clientId: clientResult.insertId
        });
        */
        res.json({ message: "Client has been created" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.get("/change_client", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                c.id_client,
                u.id_user,
                u.name,
                u.surname,
                u.patronymic,
                u.email,
                u.phone_number,
                c.client_status
            FROM Clients c
            JOIN Users u
                ON c.id_user = u.id_user
            ORDER BY u.surname
        `);

        res.json(result.rows.map(r => ({
            id_client: r[0],
            id_user: r[1],
            name: r[2],
            surname: r[3],
            patronymic: r[4],
            email: r[5],
            phone_number: r[6],
            client_status: r[7]
        })));
    } finally {
        if (connection) await connection.close();
    }
});

app.post("/change_client", async (req, res) => {
    const {
        id_user,
        // name,
        // surname,
        // patronymic,
        // email,
        // phone_number,
        client_status
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });
        /*
        const userResult = await connection.execute(`
            UPDATE 
                Users
            SET 
                name = :name,
                surname = :surname,
                patronymic = :patronymic,
                email = :email,
                phone_number = :phone_number
            WHERE
                id_user = :id_user
        `,
        {
            id_user: id_user,
            name: name,
            surname: surname,
            patronymic: patronymic,
            email: email,
            phone_number: phone_number,
        });
        */
        const clientResult = await connection.execute(`
            UPDATE
                Clients
            SET
                client_status = :client_status
            WHERE
                id_user = :id_user
            `,
            {
                id_user: id_user,
                client_status: client_status
            }
        );
        await connection.commit();

        res.json({ message: "Client has been edited" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.delete("/remove_client", async (req, res) => {
    const { id_user } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        await connection.execute(
            `DELETE FROM Clients WHERE id_user = :id`,
            { id: id_user }
        );

        await connection.execute(
            `DELETE FROM Users WHERE id_user = :id`,
            { id: id_user }
        );

        await connection.execute(
            `DELETE FROM Addresses WHERE id_user = :id`,
            { id: id_user }
        );

        await connection.commit();

        res.json({ message: "Клієнта видалено" });
    } catch(err){
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally{
        if (connection) await connection.close();
    }
});


app.get("/client_names", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT u.surname || ' ' || u.name || ' ' || u.patronymic AS client_name
            FROM Clients c
            JOIN Users u
                ON u.id_user = c.id_user
            ORDER BY u.surname 
        `);

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.get("/caregiver_names", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT u.surname || ' ' || u.name || ' ' || u.patronymic AS caregiver_name
            FROM Caregivers c
            JOIN Users u
                ON u.id_user = c.id_user
            ORDER BY u.surname DESC
        `);

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});


app.post("/create_client_disease", async (req, res) => {
    const {
        client_name,
        disease_name,
        diagnosis_date,
        severity,
        notes
    } = req.body;

    const [surname, name, patronymic] = client_name.split(" ");

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const clientResult = await connection.execute(`
            SELECT
                c.id_client
            FROM Clients c
            JOIN Users u
                ON u.id_user = c.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `,
        {
            name: name,
            surname: surname,
            patronymic: patronymic
        });

        const id_client = clientResult.rows[0][0];

        
        const diseaseResult = await connection.execute(`SELECT id_disease FROM Diseases WHERE disease_name = :disease_name`, { disease_name: disease_name });

        const id_disease = diseaseResult.rows[0][0];


        const clientDiseaseResult = await connection.execute(`
            INSERT INTO Client_Diseases (
                id_client, 
                id_disease,
                diagnosis_date,
                severity,
                notes
            )
            VALUES (
                :id_client,
                :id_disease,
                TO_DATE(:diagnosis_date, 'YYYY-MM-DD'),
                :severity,
                :notes
            ) 
        `,
        {
            id_client: id_client,
            id_disease: id_disease,
            diagnosis_date: diagnosis_date,
            severity: severity,
            notes: notes
        });

        await connection.commit();

        res.json({ message: "Client Disease has been created" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.get("/change_client_diseases", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                cd.id_client_disease,
                u.name,
                u.surname,
                u.patronymic,
                d.disease_name,
                TO_CHAR(cd.diagnosis_date, 'YYYY-MM-DD') AS diagnosis_date,
                cd.severity,
                cd.notes

            FROM Client_Diseases cd

            JOIN Diseases d
                ON d.id_disease = cd.id_disease
            JOIN Clients cls
                ON cls.id_client = cd.id_client
            JOIN Users u
                ON u.id_user = cls.id_user

            ORDER BY u.surname
        `);

        res.json(result.rows.map(r => ({
            id_client_disease: r[0],
            name: r[1],
            surname: r[2],
            patronymic: r[3],
            disease_name: r[4],
            diagnosis_date: r[5],
            severity: r[6],
            notes: r[7]
        })));
    } finally {
        if (connection) await connection.close();
    }
});



app.post("/create_caregiver", async (req, res) => {
    const {
        name,
        surname,
        patronymic,
        email,
        phone_number,
        registration_date,
        username,
        password,

        qualification,
        area_of_application,
        caregiver_status
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const userResult = await connection.execute(`
            INSERT INTO Users (
                name, 
                surname, 
                patronymic, 
                email, 
                phone_number,
                rights, 
                registration_date, 
                username,
                password_hash, 
                creation_datetime
            )
            VALUES (
                :name,
                :surname,
                :patronymic,
                :email,
                :phone_number,
                :rights,
                TO_DATE(:registration_date, 'YYYY-MM-DD'),
                :username,
                :password_hash,
                SYSTIMESTAMP
            ) 
            RETURNING id_user INTO :id
        `,
        {
            name: name,
            surname: surname,
            patronymic: patronymic,
            email: email,
            phone_number: phone_number,
            rights: "Caregiver",
            registration_date: registration_date,
            username: username,
            password_hash: hashedPassword,
            id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        });

        const user_id = userResult.outBinds.id[0];

        const caregiverResult = await connection.execute(`
            INSERT INTO Caregivers (
                id_user, 
                qualification,
                area_of_application, 
                caregiver_status
            )
            VALUES (
                :user_id,
                :qualification,
                :area_of_application,
                :caregiver_status
            )
            `,
            {
                user_id: user_id,
                qualification: qualification,
                area_of_application: area_of_application,
                caregiver_status: caregiver_status
            }
        );
        await connection.commit();
        
        res.json({ message: "Caregiver has been created" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.get("/change_caregiver", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                c.id_caregiver,
                u.id_user,
                u.name,
                u.surname,
                u.patronymic,
                u.email,
                u.phone_number,
                c.qualification,
                c.area_of_application,
                c.caregiver_status
            FROM Caregivers c
            JOIN Users u
                ON c.id_user = u.id_user
            ORDER BY u.surname
        `);

        res.json(result.rows.map(r => ({
            id_caregiver: r[0],
            id_user: r[1],
            name: r[2],
            surname: r[3],
            patronymic: r[4],
            email: r[5],
            phone_number: r[6],
            qualification: r[7],
            area_of_application: r[8], 
            caregiver_status: r[9]
        })));
    } finally {
        if (connection) await connection.close();
    }
});

app.post("/change_caregiver", async (req, res) => {
    const {
        id_user,
        // name,
        // surname,
        // patronymic,
        // email,
        // phone_number,
        caregiver_status
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });
        /*
        const userResult = await connection.execute(`
            UPDATE 
                Users
            SET 
                name = :name,
                surname = :surname,
                patronymic = :patronymic,
                email = :email,
                phone_number = :phone_number
            WHERE
                id_user = :id_user
        `,
        {
            id_user: id_user,
            name: name,
            surname: surname,
            patronymic: patronymic,
            email: email,
            phone_number: phone_number,
        });
        */
        const clientResult = await connection.execute(`
            UPDATE
                Caregivers
            SET
                caregiver_status = :caregiver_status
            WHERE
                id_user = :id_user
            `,
            {
                id_user: id_user,
                caregiver_status: caregiver_status
            }
        );
        await connection.commit();

        res.json({ message: "Caregiver has been edited" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.delete("/remove_caregiver", async (req, res) => {
    const { id_user } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        await connection.execute(
            `DELETE FROM Caregivers WHERE id_user = :id`,
            { id: id_user }
        );

        await connection.execute(
            `DELETE FROM Users WHERE id_user = :id`,
            { id: id_user }
        );

        await connection.commit();

        res.json({ message: "Доглядальника видалено" });
    } catch(err){
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally{
        if (connection) await connection.close();
    }
});


app.post("/create_required_material", async (req, res) => {
    const {
        caregiver_name,
        material_name,
        quantity,
        unit,
        mater_usage_freq
    } = req.body;

    const [surname, name, patronymic] = caregiver_name.split(" ");

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const caregiverResult = await connection.execute(`
            SELECT 
                c.id_caregiver 
            FROM 
                Caregivers c
            JOIN Users u 
                ON u.id_user = c.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `,
        {
            name: name,
            surname: surname,
            patronymic: patronymic
        });

        const id_caregiver = caregiverResult.rows[0][0];

        
        const materialResult = await connection.execute(`SELECT id_material FROM Materials WHERE mater_name = :mater_name`, { mater_name: material_name });

        const id_material = materialResult.rows[0][0];


        const requiredMaterialResult = await connection.execute(`
            INSERT INTO Required_Materials (
                id_caregiver, 
                id_material,
                quantity,
                unit,
                mater_usage_freq
            )
            VALUES (
                :id_caregiver,
                :id_material,
                :quantity,
                :unit,
                :mater_usage_freq
            ) 
        `,
        {
            id_caregiver: id_caregiver,
            id_material: id_material,
            quantity: quantity,
            unit: unit,
            mater_usage_freq: mater_usage_freq
        });

        await connection.commit();

        res.json({ message: "Required Service has been created" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.get("/change_required_materials", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                rm.id_required_material,
                u.name,
                u.surname,
                u.patronymic,
                m.mater_name,
                rm.quantity,
                rm.unit,
                rm.mater_usage_freq

            FROM Required_Materials rm

            JOIN Materials m
                ON m.id_material = rm.id_material
            JOIN Caregivers c
                ON c.id_caregiver = rm.id_caregiver
            JOIN Users u
                ON u.id_user = c.id_user

            ORDER BY u.surname
        `);

        res.json(result.rows.map(r => ({
            id_required_material: r[0],
            name: r[1],
            surname: r[2],
            patronymic: r[3],
            mater_name: r[4],
            quantity: r[5],
            unit: r[6],
            mater_usage_freq: r[7]
        })));
    } finally {
        if (connection) await connection.close();
    }
});

app.delete("/remove_required_material", async (req, res) => {
    const { id_required_material } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        await connection.execute(`
            DELETE FROM Required_Materials 
            WHERE id_required_material = :id
            `,
            { 
                id: id_required_material
            }
        );

        await connection.commit();

        res.json({ message: "Матеріал для доглядальника видалено" });
    } catch(err){
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally{
        if (connection) await connection.close();
    }
});


app.get("/review_caregivers_reports", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                cr.id_report,

                ucl.surname || ' ' || ucl.name || ' ' || ucl.patronymic AS client_name,
                ucg.surname || ' ' || ucg.name || ' ' || ucg.patronymic AS caregiver_name,
 
                TO_CHAR(cr.creation_datetime, 'YYYY-MM-DD') AS creation_date,
                cr.report_text

            FROM Caregivers_Reports cr

            JOIN Planned_Visits pv
                ON pv.id_visit = cr.id_visit
            JOIN Assignments asg
                ON asg.id_assignment = pv.id_assignment
            JOIN Caregivers cg
                ON cg.id_caregiver = asg.id_caregiver
            JOIN Users ucg
                ON ucg.id_user = cg.id_user

            JOIN Contracts ct
                ON ct.id_contract = asg.id_contract
            JOIN Clients cl
                ON cl.id_client = ct.id_client
            JOIN Users ucl
                ON ucl.id_user = cl.id_user

            ORDER BY ucg.surname
        `);

        res.json(result.rows.map(r => ({
            id_report: r[0],
            client_name: r[1],
            caregiver_name: r[2],
            creation_date: r[3],
            report_text: r[4]
        })));
    } finally {
        if (connection) await connection.close();
    }
});



app.get("/review_all_schedules", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        // TO_CHAR(some_timestamp_column, 'HH24:MI:SS') AS time_only
        const result = await connection.execute(`
            SELECT
                id_schedule,
                TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
                TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
                schedule_status,
                schedule_type
            FROM Schedules
            ORDER BY creation_datetime ASC
        `);

        res.json(result.rows.map(r => ({
            id_schedule: r[0],
            start_date: r[1],
            end_date: r[2],
            schedule_status: r[3],
            schedule_type: r[4]
        })));
    } finally {
        if (connection) await connection.close();
    }
});

app.post("/review_schedule", async (req, res) => {
    const { id_schedule } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                cg.id_caregiver,
                cgu.surname || ' ' || cgu.name AS caregiver_name,
                
                c.id_client,
                cu.surname || ' ' || cu.name AS client_name,

                pv.id_visit,

                TO_CHAR(pv.planned_date, 'YYYY-MM-DD') AS planned_date,
                TO_CHAR(pv.planned_start_time, 'HH24:MI:SS') AS planned_start_time,
                TO_CHAR(pv.planned_end_time, 'HH24:MI:SS') AS planned_end_time,

                LISTAGG(s.service_name, ', ')
                    WITHIN GROUP (ORDER BY s.service_name) AS services

            FROM Schedules sch

            JOIN Planned_Visits pv
                ON pv.id_schedule = sch.id_schedule

            JOIN Assignments a
                ON a.id_assignment = pv.id_assignment

            JOIN Contracts ct
                ON ct.id_contract = a.id_contract

            JOIN Clients c
                ON c.id_client = ct.id_client

            JOIN Users cu
                ON cu.id_user = c.id_user

            JOIN Caregivers cg
                ON cg.id_caregiver = a.id_caregiver

            JOIN Users cgu
                ON cgu.id_user = cg.id_user

            JOIN Required_Services rs
                ON rs.id_client = c.id_client

            JOIN Services s
                ON s.id_service = rs.id_service

            WHERE sch.id_schedule = :id_schedule
              AND rs.req_serv_status = 'Active'

            GROUP BY
                cg.id_caregiver,
                cgu.surname,
                cgu.name,

                c.id_client,
                cu.surname,
                cu.name,

                pv.id_visit,
                pv.planned_date,
                pv.planned_start_time,
                pv.planned_end_time

            ORDER BY
                pv.planned_date ASC,
                cgu.surname ASC,
                pv.planned_start_time ASC
        `,
        {
            id_schedule: id_schedule
        });

        res.json(result.rows.map(r => ({
            id_caregiver: r[0],
            caregiver_name: r[1],
            id_client: r[2],
            client_name: r[3],
            id_visit: r[4],
            planned_date: r[5],
            planned_start_time: r[6],
            planned_end_time: r[7],
            service_name: r[8]
        })));
    } finally {
        if (connection) await connection.close();
    }
});


app.post("/change_schedule", async (req, res) => {
    const {
        id_schedule,
        schedule_status
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });
        
        const scheduleResult = await connection.execute(`
            UPDATE
                Schedules
            SET
                schedule_status = :schedule_status
            WHERE
                id_schedule = :id_schedule
            `,
            {
                id_schedule: id_schedule,
                schedule_status: schedule_status
            }
        );
        await connection.commit();

        res.json({ message: "Schedule has been edited" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});


app.delete("/remove_schedule", async (req, res) => {
    const { id_schedule } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        await connection.execute(`
            DELETE FROM Schedules 
            WHERE id_schedule = :id
            `,
            { 
                id: id_schedule
            }
        );

        await connection.execute(`
            DELETE FROM Planned_Visits 
            WHERE id_schedule = :id
            `,
            { 
                id: id_schedule
            }
        );

        await connection.commit();

        res.json({ message: "План-графік видалено" });
    } catch(err){
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally{
        if (connection) await connection.close();
    }
});


app.get("/review_visit_services", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        // TO_CHAR(some_timestamp_column, 'HH24:MI:SS') AS time_only
        const result = await connection.execute(`
            SELECT
                id_schedule,
                TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
                TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
                schedule_status,
                schedule_type
            FROM Schedules
            ORDER BY creation_datetime ASC
        `);

        res.json(result.rows.map(r => ({
            id_schedule: r[0],
            start_date: r[1],
            end_date: r[2],
            schedule_status: r[3],
            schedule_type: r[4]
        })));
    } finally {
        if (connection) await connection.close();
    }
});

app.post("/review_visit_services", async (req, res) => {
    const { id_schedule } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                cgu.surname || ' ' || cgu.name AS caregiver_name,                
                cu.surname || ' ' || cu.name AS client_name,

                TO_CHAR(pv.planned_date, 'YYYY-MM-DD') AS planned_date,
                TO_CHAR(pv.planned_start_time, 'HH24:MI:SS') AS planned_start_time,
                TO_CHAR(pv.planned_end_time, 'HH24:MI:SS') AS planned_end_time,

                TO_CHAR(vs.actual_start_time, 'HH24:MI:SS') AS actual_start_time,
                TO_CHAR(vs.actual_end_time, 'HH24:MI:SS') AS actual_end_time,

                vs.visit_serv_status,

                LISTAGG(s.service_name, ', ') WITHIN GROUP (ORDER BY s.service_name) AS services

            FROM Schedules sch

            JOIN Planned_Visits pv
                ON pv.id_schedule = sch.id_schedule

            JOIN Visit_Services vs
                ON vs.id_visit = pv.id_visit

            JOIN Assignments a
                ON a.id_assignment = pv.id_assignment

            JOIN Contracts ct
                ON ct.id_contract = a.id_contract

            JOIN Clients c
                ON c.id_client = ct.id_client

            JOIN Users cu
                ON cu.id_user = c.id_user

            JOIN Caregivers cg
                ON cg.id_caregiver = a.id_caregiver

            JOIN Users cgu
                ON cgu.id_user = cg.id_user

            JOIN Required_Services rs
                ON rs.id_client = c.id_client

            JOIN Services s
                ON s.id_service = rs.id_service

            WHERE sch.id_schedule = :id_schedule
              AND rs.req_serv_status = 'Active'

            GROUP BY
                cgu.surname,
                cgu.name,

                cu.surname,
                cu.name,

                pv.planned_date,
                pv.planned_start_time,
                pv.planned_end_time,

                actual_start_time,
                actual_end_time,
                vs.visit_serv_status

            ORDER BY
                pv.planned_date ASC,
                cgu.surname ASC,
                pv.planned_start_time ASC
        `,
        {
            id_schedule: id_schedule
        });

        res.json(result.rows.map(r => ({
            caregiver_name: r[0],
            client_name: r[1],
            planned_date: r[2],
            planned_start_time: r[3],
            planned_end_time: r[4],
            actual_start_time: r[5],
            actual_end_time: r[6],
            visit_serv_status: r[7],
            service_name: r[8]
        })));
    } finally {
        if (connection) await connection.close();
    }
});


// timetable.js
/*
// алгоритм построения графиков, если учитывается каждое маршрут между клиентами и деро филиала по отдельности
const DAYS = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
];

// промежутки в час
const distance = {
    depot: { 
        21: 40, 
        22: 10, 
        23: 15, 
        24: 40,

        25: 20, 
        26: 15 
    },

    21: { 
        22: 45, 
        23: 50, 
        24: 60 
    },

    22: { 
        21: 45, 
        23: 10, 
        24: 35 
    },

    23: { 
        21: 50, 
        22: 10, 
        24: 40 
    },

    24: { 
        21: 60, 
        22: 35, 
        23: 40 
    },

    25: { 
        26: 20 
    },

    26: { 
        25: 20 
    }
};

function distributeFrequency(freq) {
    switch(freq) {
        case 1: return [0];
        case 2: return [0, 3];
        case 3: return [0, 2, 4];
        case 4: return [0, 2, 4, 6];
        case 5: return [0, 1, 2, 3, 4];
        case 6: return [0, 1, 2, 3, 4, 5];
        case 7: return [0, 1, 2, 3, 4, 5, 6];
    }
    return [];
}

function getDistance(from, to) {
    if (from === to) return 0;

    return (
        distance[from]?.[to] ??
        distance[to]?.[from] ??
        Infinity
    );
}

function nearestClient(current, clients, distance) {
    let best = null;
    let bestDistance = Infinity;

    for (const client of clients) {
        //const d = distance[current][client.clientId];
        const d = getDistance(current, client.clientId);
        
        if (d < bestDistance) {
            bestDistance = d;
            best = client;
        }
    }
    return best;
}

function routeDistance(route) {
    let total = 0;
    let current = "depot";

    for (const visit of route) {
        total += getDistance(current, visit.clientId);
        total += visit.duration;
        current = visit.clientId;
    }
    return total;
}

function findBestDay(schedule, caregiverId, visit) {
    let bestDay = null;
    let bestLoad = Infinity;

    for (const day of DAYS) {
        const load = calculateRouteTime(schedule[caregiverId][day]);

        if (load + visit.duration <= 480 && load < bestLoad) {
            bestLoad = load;
            bestDay = day;
        }
    }
    return bestDay;
}

function moveToNextDay(schedule, caregiverId, dayIndex) {

    const currentDay = DAYS[dayIndex];
    const nextDay = DAYS[(dayIndex + 1) % 7];

    if (schedule[caregiverId][currentDay].length === 0) return false;

    const visit = schedule[caregiverId][currentDay].pop();

    schedule[caregiverId][nextDay].push(visit);

    return true;
}

function twoOpt(route) {
    let improved = true;

    while (improved) {
        improved = false;

        for (let i = 1; i < route.length - 1; i++) {
            for (let j = i + 1; j < route.length; j++) {
                const candidate = [
                    ...route.slice(0, i),
                    ...route.slice(i, j + 1).reverse(),
                    ...route.slice(j + 1)
                ];

                if (routeDistance(candidate) < routeDistance(route)) {
                    route = candidate;
                    improved = true;
                }
            }
        }
    }
    return route;
}

// Вспомогательная функция для подсчета общего времени маршрута (включая работу)
function calculateRouteTime(route, currentLoc = "depot") {
    let totalMinutes = 0;

    for (const visit of route) {
        totalMinutes += getDistance(currentLoc, visit.clientId);
        totalMinutes += visit.duration;
        currentLoc = visit.clientId;
    }

    return totalMinutes;
}

function findLeastLoadedDay(schedule, caregiverId, excludeDay) {
    let bestDay = null;
    let bestLoad = Infinity;

    for (const day of DAYS) {
        if (day === excludeDay) continue;

        const load = calculateRouteTime(schedule[caregiverId][day]);

        if (load < bestLoad) {
            bestLoad = load;
            bestDay = day;
        }
    }
    return bestDay;
}

function recalculateTimes(route) {
    let currentLoc = "depot";
    let currentTime = 8 * 60;

    for (const visit of route) {
        currentTime += getDistance(currentLoc, visit.clientId);

        visit.plannedStart = currentTime;
        currentTime += visit.duration;
        visit.plannedEnd = currentTime;
        currentLoc = visit.clientId;
    }
}

function buildSchedule(caregivers, clients, requiredServices, assignments, services) {
    // ==========================================
    // ЭТАП 1: Распределение визитов по дням
    // ==========================================
    const schedule = {};

    for (const caregiverId of caregivers) {
        schedule[caregiverId] = {
            Mon: [],
            Tue: [],
            Wed: [],
            Thu: [],
            Fri: [],
            Sat: [],
            Sun: []
        };
    }

    for (const caregiverId of caregivers) {
        // Получаем всех клиентов конкретного сотрудника
        const clients = assignments
            .filter(a => a.caregiverId === caregiverId)
            .map(a => a.clientId);

        for (const clientId of clients) {
            // Ищем все услуги для этого клиента
            const clientServices = requiredServices.filter(rs => rs.clientId === clientId);
            if (clientServices.length === 0) continue;

            // Считаем общую длительность услуг и максимальную частоту
            const totalDuration = clientServices.reduce((sum, rs) => sum + services[rs.serviceId].duration, 0);
            const maxFrequency = Math.max(...clientServices.map(rs => rs.frequency));

            // Раскладываем визиты по дням
            const visitDays = distributeFrequency(maxFrequency);
            // const visitDay = findBestDay(schedule, caregiverId, { clientId, duration: totalDuration });
            
            const assignment = assignments.find(a =>
                a.clientId===clientId &&
                a.caregiverId===caregiverId
            );

            const assignmentId=assignment.assignmentId;

            visitDays.forEach(dayIndex => {
                schedule[caregiverId][DAYS[dayIndex]].push({
                    clientId: clientId,
                    caregiverId: caregiverId,
                    assignmentId: assignmentId,
                    duration: totalDuration
                });
            });
        }
    }

    // ==========================================
    // ЭТАП 2: Построение маршрутов и проверка ограничений
    // ==========================================
    for (const caregiverId of caregivers) {
        let weekMinutes = 0;
        let currentLoc = "depot";

        for (let day = 0; day < DAYS.length; day++) {
            const dayName = DAYS[day];
            let unvisited = schedule[caregiverId][dayName];
            
            if (unvisited.length === 0) continue;

            let dailyRoute = [];

            // Жадный алгоритм: выбираем ближайшего клиента
            while (unvisited.length > 0) {
                const nextVisit = nearestClient(currentLoc, unvisited, distance);
                
                dailyRoute.push(nextVisit);
                currentLoc = nextVisit.clientId;
                
                // Удаляем посещенного клиента из списка
                //unvisited = unvisited.filter(v => v.clientId !== nextVisit.clientId);
                const idx = unvisited.indexOf(nextVisit);
                unvisited.splice(idx, 1);
            }

            // Оптимизация маршрута с помощью 2-opt
            dailyRoute = twoOpt(dailyRoute);
            
            let currentTime = 8 * 60;

            for (const visit of dailyRoute) {
                const travel = getDistance(currentLoc, visit.clientId);

                currentTime += travel;
                visit.travelTime = travel;
                visit.plannedStart = currentTime;
                currentTime += visit.duration;
                visit.plannedEnd = currentTime;
                currentLoc = visit.clientId;
            }

            // Сохраняем оптимизированный маршрут обратно в расписание
            schedule[caregiverId][dayName] = dailyRoute;

            let dayMinutes = calculateRouteTime(schedule[caregiverId][dayName]);

            while (dayMinutes > 480) {

                const moved = moveToNextDay(schedule, caregiverId, day);

                if (!moved) {
                    console.warn(`Cannot move more visits from ${dayName}`);
                    break;
                }

                // Поточний день після перенесення
                const currentDay = DAYS[day];
                
                // Наступний день (із переходом неділя → понеділок)
                const nextDay = DAYS[(day + 1) % DAYS.length];

                // Оптимізувати обидва маршрути
                schedule[caregiverId][currentDay] = twoOpt(schedule[caregiverId][currentDay]);

                schedule[caregiverId][nextDay] = twoOpt(schedule[caregiverId][nextDay]);

                // Перерахувати час
                recalculateTimes(schedule[caregiverId][currentDay]);
                recalculateTimes(schedule[caregiverId][nextDay]);

                // Перевірити поточний день ще раз
                dayMinutes = calculateRouteTime(schedule[caregiverId][currentDay]);

                const nextDayMinutes = calculateRouteTime(schedule[caregiverId][nextDay]);

                // console.log(currentDay, dayMinutes, nextDay, nextDayMinutes);
            }
            weekMinutes += dayMinutes;
        }

        // Проверка недельного лимита (40 часов = 2400 минут)
        if (weekMinutes > 2400) {
            console.warn(`[!] Сотрудник ${caregiverId} превысил лимит 40 часов в неделю. Итого: ${weekMinutes} мин.`);
        }
    }
    return schedule;
}
*/

const WORK_START = 8 * 60;      // 08:00
const BREAK_TIME = 60;          // 1 час между клиентами
const DAY_LIMIT = 480;          // 8 часов
const WEEK_LIMIT = 2400;        // 40 часов

const DAYS = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
];

function distributeFrequency(freq) {
    switch(freq) {
        case 1: return [0];
        case 2: return [0, 3];
        case 3: return [0, 2, 4];
        case 4: return [0, 2, 4, 6];
        case 5: return [0, 1, 2, 3, 4];
        case 6: return [0, 1, 2, 3, 4, 5];
        case 7: return [0, 1, 2, 3, 4, 5, 6];
    }
    return [];
}

function calculateRouteTime(route) {
    if (route.length === 0) return 0;

    let total = 0;

    route.forEach((visit, index) => {
        total += visit.duration;

        if (index < route.length - 1) {
            total += BREAK_TIME;
        }
    });

    return total;
}

function recalculateTimes(route) {

    let currentTime = WORK_START;

    route.forEach((visit, index) => {

        visit.plannedStart = currentTime;

        currentTime += visit.duration;

        visit.plannedEnd = currentTime;

        if (index < route.length - 1) {
            currentTime += BREAK_TIME;
        }

    });

}

function moveToNextDay(schedule, caregiverId, dayIndex) {

    const currentDay = DAYS[dayIndex];
    const nextDay = DAYS[(dayIndex + 1) % 7];

    if (schedule[caregiverId][currentDay].length === 0) return false;

    const visit = schedule[caregiverId][currentDay].pop();

    schedule[caregiverId][nextDay].push(visit);

    return true;
}

function findLeastLoadedDay(schedule, caregiverId, excludeDay) {
    let bestDay = null;
    let bestLoad = Infinity;

    for (const day of DAYS) {
        if (day === excludeDay) continue;

        const load = calculateRouteTime(schedule[caregiverId][day]);

        if (load < bestLoad) {
            bestLoad = load;
            bestDay = day;
        }
    }
    return bestDay;
}

function buildSchedule(caregivers, clients, requiredServices, assignments, services) {
    // ==========================================
    // ЭТАП 1: Распределение визитов по дням
    // ==========================================
    const schedule = {};

    for (const caregiverId of caregivers) {
        schedule[caregiverId] = {
            Mon: [],
            Tue: [],
            Wed: [],
            Thu: [],
            Fri: [],
            Sat: [],
            Sun: []
        };
    }

    for (const caregiverId of caregivers) {
        // Получаем всех клиентов конкретного сотрудника
        const clients = assignments
            .filter(a => a.caregiverId === caregiverId)
            .map(a => a.clientId);

        for (const clientId of clients) {
            // Ищем все услуги для этого клиента
            const clientServices = requiredServices.filter(rs => rs.clientId === clientId);
            if (clientServices.length === 0) continue;

            // Считаем общую длительность услуг и максимальную частоту
            const totalDuration = clientServices.reduce((sum, rs) => sum + services[rs.serviceId].duration, 0);
            const maxFrequency = Math.max(...clientServices.map(rs => rs.frequency));

            // Раскладываем визиты по дням
            const visitDays = distributeFrequency(maxFrequency);
            // const visitDay = findBestDay(schedule, caregiverId, { clientId, duration: totalDuration });
            
            const assignment = assignments.find(a =>
                a.clientId===clientId &&
                a.caregiverId===caregiverId
            );

            const assignmentId = assignment.assignmentId;

            visitDays.forEach(dayIndex => {
                schedule[caregiverId][DAYS[dayIndex]].push({
                    clientId: clientId,
                    caregiverId: caregiverId,
                    assignmentId: assignmentId,
                    duration: totalDuration
                });
            });
        }
    }

    // ==========================================
    // ЭТАП 2: Построение маршрутов и проверка ограничений
    // ==========================================
    for (const caregiverId of caregivers) {

        let weekMinutes = 0;

        for (const dayName of DAYS) {

            const dailyRoute = schedule[caregiverId][dayName];

            if (dailyRoute.length === 0) continue;

            recalculateTimes(dailyRoute);

            let dayMinutes = calculateRouteTime(dailyRoute);

            while (dayMinutes > DAY_LIMIT) {

                const dayIndex = DAYS.indexOf(dayName);

                if (!moveToNextDay(schedule, caregiverId, dayIndex)) break;

                recalculateTimes(schedule[caregiverId][dayName]);
                recalculateTimes(schedule[caregiverId][DAYS[(dayIndex + 1) % 7]]);

                dayMinutes = calculateRouteTime(schedule[caregiverId][dayName]);
            }
            weekMinutes += dayMinutes;
        }

        if (weekMinutes > WEEK_LIMIT) { console.warn(`[!] Сотрудник ${caregiverId} превысил недельный лимит`); }
    }
    return schedule;
}

function getDateForDay(startDate, dayIndex) {
    const d = new Date(startDate);

    d.setDate(d.getDate() + dayIndex);
    return d;
}

function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

function formatDate(date){
    return date.toISOString().slice(0,10);
}

app.post("/create_schedule", async (req, res) => {
    const {
        start_date,
        end_date,
        schedule_status,
        schedule_type,
        id_user
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT id_einsatzleiter
            FROM Einsatzleiter
            WHERE id_user = :id_user
        `,
        {
            id_user
        });

        if (result.rows.length === 0) throw new Error("Einsatzleiter not found");

        const id_einsatzleiter = result.rows[0][0];


        const extr_caregivers = await connection.execute(`
            SELECT id_caregiver 
            FROM Caregivers 
            WHERE caregiver_status <> 'Unavailable'
        `);
        const caregivers = extr_caregivers.rows.map(row => row[0]);

        const extr_clients = await connection.execute(`
            SELECT cl.id_client 
            FROM Clients cl
            JOIN Contracts cn
                ON cn.id_client = cl.id_client
            JOIN Assignments asg
                ON asg.ID_CONTRACT = cn.ID_CONTRACT
            WHERE assign_status = 'Active'
        `);
        const clients = extr_clients.rows.map(row => row[0]);

        const requiredServicesQuery = `
            SELECT 
                rs.id_client, 
                s.id_service,
                rs.frequency 
            FROM Required_Services rs
            JOIN Services s ON rs.id_service = s.id_service
            WHERE rs.req_serv_status = 'Active'
        `;

        const extr_requiredServices = await connection.execute(requiredServicesQuery);
        const requiredServices = extr_requiredServices.rows.map(r => ({
            clientId: r[0],
            serviceId: r[1],
            frequency: r[2]
        }));

        const assignmentsQuery = `
            SELECT 
                c.id_client, 
                a.id_caregiver,
                a.id_assignment
            FROM Contracts c
            JOIN Assignments a ON c.id_contract = a.id_contract
            WHERE a.assign_status = 'Active'
        `;

        const extr_assigns = await connection.execute(assignmentsQuery);
        const assignments = extr_assigns.rows.map(r => ({
            clientId: r[0],
            caregiverId: r[1],
            assignmentId: r[2]
        }));

        const servicesQuery = `
            SELECT 
                id_service,
                service_duration
            FROM Services
        `;

        const extr_services = await connection.execute(servicesQuery);
        const services = {};

        extr_services.rows.forEach(r=>{ services[r[0]] = { duration:r[1] }; });
        
        // Построение плана-графика
        const schedule = buildSchedule(caregivers, clients, requiredServices, assignments, services);

        // Создание записи в таблице Schedules, с которой будут связаны записи в Panned Visits
        const scheduleResult = await connection.execute(`
            INSERT INTO Schedules (
                id_einsatzleiter, 
                start_date, 
                end_date,   
                schedule_status,
                schedule_type
            )
            VALUES (
                :id_einsatzleiter,
                TO_DATE(:start_date, 'YYYY-MM-DD'),
                TO_DATE(:end_date, 'YYYY-MM-DD'),
                :schedule_status,
                :schedule_type
            )
            RETURNING id_schedule INTO :id
        `,
        {
            id_einsatzleiter: id_einsatzleiter,
            start_date: start_date,
            end_date: end_date,
            schedule_status: schedule_status,
            schedule_type: schedule_type,
            id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        });

        const id_schedule = scheduleResult.outBinds.id[0];

        for (const caregiverId in schedule) {
            for (const day of DAYS) {
                for (const visit of schedule[caregiverId][day]) {
                    // Сохранение результата в Planned Visits
                    await connection.execute(`
                        INSERT INTO Planned_Visits (
                            id_assignment, 
                            id_schedule, 
                            planned_date, 
                            planned_start_time, 
                            planned_end_time, 
                            visit_type, 
                            visit_status
                        )
                        VALUES (
                            :id_assignment,
                            :id_schedule,
                            TO_DATE(:planned_date, 'YYYY-MM-DD'),
                            TO_DATE(:planned_start_time, 'HH24:MI:SS'),
                            TO_DATE(:planned_end_time, 'HH24:MI:SS'),
                            :visit_type,
                            :visit_status
                        )
                    `,
                    {
                        id_assignment: visit.assignmentId,
                        id_schedule,
                        planned_date: formatDate(getDateForDay(start_date, DAYS.indexOf(day))),
                        planned_start_time: minutesToTime(visit.plannedStart),
                        planned_end_time: minutesToTime(visit.plannedEnd),
                        visit_type: schedule_type,
                        visit_status: schedule_status
                    });
                }
            }
        }
        await connection.commit();

        res.json({ message: "Schedule has been created" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});


app.post("/create_contract", async (req, res) => {
    const {
        client_name,
        date_of_signing,
        expiration_date,
        care_schedule_type,
        contract_details
    } = req.body;

    const [surname, name, patronymic] = client_name.split(" ");

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const clientResult = await connection.execute(`
            SELECT 
                c.id_client 
            FROM 
                Clients c
            JOIN Users u 
                ON u.id_user = c.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `,
        {
            name: name,
            surname: surname,
            patronymic: patronymic
        });

        const id_client = clientResult.rows[0][0];

        const contractResult = await connection.execute(`
            INSERT INTO Contracts (
                id_client, 
                date_of_signing, 
                expiration_date, 
                care_schedule_type, 
                contract_details
            )
            VALUES (
                :id_client,
                TO_DATE(:date_of_signing, 'YYYY-MM-DD'),
                TO_DATE(:expiration_date, 'YYYY-MM-DD'),
                :care_schedule_type,
                :contract_details
            ) 
        `,
        {
            id_client: id_client,
            date_of_signing: date_of_signing,
            expiration_date: expiration_date,
            care_schedule_type: care_schedule_type,
            contract_details: contract_details
        });

        await connection.commit();

        res.json({ message: "Contract has been created" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.get("/change_contract", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                c.id_contract,
                u.name,
                u.surname,
                u.patronymic,
                TO_CHAR(c.date_of_signing, 'YYYY-MM-DD') AS date_of_signing,
                TO_CHAR(c.expiration_date, 'YYYY-MM-DD') AS expiration_date,
                c.care_schedule_type
            FROM Contracts c
            JOIN Clients cls
                ON cls.id_client = c.id_client
            JOIN Users u
                ON u.id_user = cls.id_user
            ORDER BY u.surname
        `);

        res.json(result.rows.map(r => ({
            id_contract: r[0],
            name: r[1],
            surname: r[2],
            patronymic: r[3],
            date_of_signing: r[4],
            expiration_date: r[5],
            care_schedule_type: r[6]
        })));
    } finally {
        if (connection) await connection.close();
    }
});


app.post("/create_req_serv", async (req, res) => {
    const {
        client_name,
        service_name,
        frequency,
        priority,
        start_date,
        end_date,
        req_serv_status,
        notes
    } = req.body;

    const [surname, name, patronymic] = client_name.split(" ");

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const clientResult = await connection.execute(`
            SELECT 
                c.id_client 
            FROM 
                Clients c
            JOIN Users u 
                ON u.id_user = c.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `,
        {
            name: name,
            surname: surname,
            patronymic: patronymic
        });

        if (clientResult.rows.length === 0) return res.status(401).json({ message: "Client not found" });

        const id_client = clientResult.rows[0][0];

        const serviceResult = await connection.execute(`
            SELECT id_service 
            FROM Services 
            WHERE service_name = :service_name
            `, 
            { 
                service_name: service_name
            });

        const id_service = serviceResult.rows[0][0];

        const reqServResult = await connection.execute(`
            INSERT INTO Required_Services (
                id_client,
                id_service,
                frequency,
                priority,
                start_date,
                end_date,
                req_serv_status,
                notes
            )
            VALUES (
                :id_client,
                :id_service,
                :frequency,
                :priority,
                TO_DATE(:start_date, 'YYYY-MM-DD'),
                TO_DATE(:end_date, 'YYYY-MM-DD'),
                :req_serv_status,
                :notes
            ) 
        `,
        {
            id_client: id_client,
            id_service: id_service,
            frequency: frequency,
            priority: priority,
            start_date: start_date,
            end_date: end_date,
            req_serv_status: req_serv_status,
            notes: notes
        });

        await connection.commit();

        res.json({ message: "Required Service has been created" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.get("/change_req_serv", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                rs.id_required_service,
                u.name,
                u.surname,
                u.patronymic,
                s.service_name,
                s.required_application,
                rs.frequency,
                rs.priority,
                rs.req_serv_status
            FROM Required_Services rs
            JOIN Services s
                ON s.id_service = rs.id_service
            JOIN Clients cls
                ON cls.id_client = rs.id_client
            JOIN Users u
                ON u.id_user = cls.id_user
            ORDER BY u.surname
        `);

        res.json(result.rows.map(r => ({
            id_required_service: r[0],
            name: r[1],
            surname: r[2],
            patronymic: r[3],
            service_name: r[4],
            required_qualification: r[5],
            frequency: r[6],
            priority: r[7],
            req_serv_status: r[8]
        })));
    } finally {
        if (connection) await connection.close();
    }
});


app.delete("/remove_req_serv", async (req, res) => {
    const { id_required_service } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        await connection.execute(`
            DELETE FROM Required_Services 
            WHERE id_required_service = :id
            `,
            { 
                id: id_required_service
            }
        );

        await connection.commit();

        res.json({ message: "Послугу для клієнта видалено" });
    } catch(err){
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally{
        if (connection) await connection.close();
    }
});



app.get("/curr_assign", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                cg.id_caregiver,
                u.surname || ' ' || u.name || ' ' || u.patronymic AS caregiver_name,
                cg.qualification,

                ROUND(
                    SUM(
                          EXTRACT(DAY    FROM (pv.planned_end_time - pv.planned_start_time)) * 24
                        + EXTRACT(HOUR   FROM (pv.planned_end_time - pv.planned_start_time))
                        + EXTRACT(MINUTE FROM (pv.planned_end_time - pv.planned_start_time)) / 60
                        + EXTRACT(SECOND FROM (pv.planned_end_time - pv.planned_start_time)) / 3600
                    ),
                    2
                ) AS hours_per_week

            FROM Planned_Visits pv
            
            JOIN Schedules sch
                ON sch.id_schedule = pv.id_schedule
            JOIN Assignments a
                ON a.id_assignment = pv.id_assignment
            JOIN Caregivers cg
                ON cg.id_caregiver = a.id_caregiver
            JOIN Users u
                ON u.id_user = cg.id_user
            
            WHERE sch.schedule_status = 'Active'

            GROUP BY
                cg.id_caregiver,
                u.surname,
                u.name,
                u.patronymic,
                cg.qualification

            ORDER BY hours_per_week ASC
        `);

        res.json(result.rows.map(r => ({
            id_caregiver: r[0],
            caregiver_name: r[1],
            qualification: r[2],
            hours_per_week: r[3]
        })));
    } finally {
        if (connection) await connection.close();
    }
});

app.post("/create_assign", async (req, res) => {
    const {
        client_name,
        caregiver_name,
        start_date,
        end_date,
        assign_status,
        assignment_type
    } = req.body;

    const [cl_surname, cl_name, cl_patronymic] = client_name.split(" ");

    const [ca_surname, ca_name, ca_patronymic] = caregiver_name.split(" ");

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const contractResult = await connection.execute(`
            SELECT
                cl.id_client,
                cn.id_contract
            FROM Contracts cn
            JOIN Clients cl
                ON cl.id_client = cn.id_client
            JOIN Users u 
                ON u.id_user = cl.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `,
        {
            name: cl_name,
            surname: cl_surname,
            patronymic: cl_patronymic
        });

        if (contractResult.rows.length === 0) return res.status(401).json({ message: "Client not found" });

        const id_client   = contractResult.rows[0][0];
        const id_contract = contractResult.rows[0][1];

        const caregiverResult = await connection.execute(`
            SELECT 
                c.id_caregiver 
            FROM 
                Caregivers c
            JOIN Users u 
                ON u.id_user = c.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `,
        {
            name: ca_name,
            surname: ca_surname,
            patronymic: ca_patronymic
        });

        if (caregiverResult.rows.length === 0) return res.status(401).json({ message: "Caregiver not found" });

        const id_caregiver = caregiverResult.rows[0][0];

        const assignmentResult = await connection.execute(`
            INSERT INTO Assignments (
                id_contract,
                id_caregiver,
                start_date,
                end_date,
                assign_status,
                assignment_type
            )
            VALUES (
                :id_contract,
                :id_caregiver,
                TO_DATE(:start_date, 'YYYY-MM-DD'),
                TO_DATE(:end_date, 'YYYY-MM-DD'),
                :assign_status,
                :assignment_type
            ) 
        `,
        {
            id_contract: id_contract,
            id_caregiver: id_caregiver,
            start_date: start_date,
            end_date: end_date,
            assign_status: assign_status,
            assignment_type: assignment_type
        });

        const assignmentClientStatusResult = await connection.execute(`
            UPDATE
                Clients
            SET
                client_status = 'Assigned'
            WHERE
                id_client = :id_client
            `,
            {
                id_client: id_client
            }
        );

        const assignmentCaregiverStatusResult = await connection.execute(`
            UPDATE
                Caregivers
            SET
                caregiver_status = 'Busy'
            WHERE
                id_caregiver = :id_caregiver
            `,
            {
                id_caregiver: id_caregiver
            }
        );

        await connection.commit();

        res.json({ message: "Assignment has been created" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.get("/change_assign", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const assignmentResult = await connection.execute(`
            SELECT
                a.id_assignment,

                ucl.surname || ' ' || ucl.name || ' ' || ucl.patronymic AS client_name,
                ucg.surname || ' ' || ucg.name || ' ' || ucg.patronymic AS caregiver_name,

                TO_CHAR(a.start_date, 'YYYY-MM-DD') AS start_date,
                TO_CHAR(a.end_date, 'YYYY-MM-DD') AS end_date,
                a.assign_status,
                a.assignment_type

            FROM Assignments a

            JOIN Caregivers cg
                ON cg.id_caregiver = a.id_caregiver
            JOIN Users ucg
                ON ucg.id_user = cg.id_user

            JOIN Contracts cn
                ON cn.id_contract = a.id_contract
            JOIN Clients cl
                ON cl.id_client = cn.id_client
            JOIN Users ucl
                ON ucl.id_user = cl.id_user
        `);

        res.json(assignmentResult.rows.map(r => ({
            id_assignment: r[0],
            client_name: r[1],
            caregiver_name: r[2],
            start_date: r[3],
            end_date: r[4],
            assign_status: r[5],
            assignment_type: r[6]
        })));
    } finally {
        if (connection) await connection.close();
    }
});


app.delete("/remove_assign", async (req, res) => {
    const { id_assignment } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        await connection.execute(`
            DELETE FROM Assignments
            WHERE id_assignment = :id
            `,
            { 
                id: id_assignment
            }
        );

        await connection.commit();

        res.json({ message: "Призначення доглядальника клієнту видалено" });
    } catch(err){
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally{
        if (connection) await connection.close();
    }
});



app.get("/review_client_ratings", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const clientRatingResult = await connection.execute(`
            SELECT
                u.surname || ' ' || u.name || ' ' || u.patronymic AS client_name,
                TO_CHAR(cr.calculation_date, 'YYYY-MM-DD') AS calculation_date,
                cr.average_rating
            
            FROM Client_Ratings cr
            
            JOIN Clients c
                ON c.id_client = cr.id_client
            JOIN Users u
                ON u.id_user = c.id_user

            ORDER BY u.surname DESC, calculation_date ASC
        `);

        const rows = clientRatingResult.rows;

        const result = {};

        for (const row of rows) {
            const name = row[0];
            const date = row[1];
            const rating = row[2];

            if (!result[name]) result[name] = [];

            result[name].push({
                date,
                rating
            });
        }

        res.json(result);
    } finally {
        if (connection) await connection.close();
    }
});

app.get("/review_caregiver_ratings", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const caregiverRatingResult = await connection.execute(`
            SELECT
                u.surname || ' ' || u.name || ' ' || u.patronymic AS caregiver_name,
                TO_CHAR(cr.calculation_date, 'YYYY-MM-DD') AS calculation_date,
                cr.average_rating
            
            FROM Caregiver_Ratings cr
        
            JOIN Caregivers c
                ON c.id_caregiver = cr.id_caregiver
            JOIN Users u
                ON u.id_user = c.id_user

            ORDER BY u.surname DESC, calculation_date ASC
        `);

        const rows = caregiverRatingResult.rows;

        const result = {};

        for (const row of rows) {
            const name = row[0];
            const date = row[1];
            const rating = row[2];

            if (!result[name]) result[name] = [];

            result[name].push({
                date,
                rating
            });
        }

        res.json(result);
    } finally {
        if (connection) await connection.close();
    }
});


app.get("/review_feedbacks", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const feedbacksResult = await connection.execute(`
            SELECT
                uauth.surname || ' ' || uauth.name || ' ' || uauth.patronymic AS author_name,

                CASE
                    WHEN f.feedback_author = cg.id_user THEN
                        ucl.surname || ' ' || ucl.name || ' ' || ucl.patronymic
                    ELSE
                        ucg.surname || ' ' || ucg.name || ' ' || ucg.patronymic
                    END AS receiver_name,

                TO_CHAR(f.submission_datetime, 'YYYY-MM-DD') AS submission_date,
                f.grade,
                f.text_comment
            
            FROM Feedbacks f

            JOIN Users uauth
                ON uauth.id_user = f.feedback_author
            
            JOIN Planned_Visits pv
                ON pv.id_visit = f.id_visit
            JOIN Assignments asg
                ON asg.id_assignment = pv.id_assignment
            JOIN Caregivers cg
                ON cg.id_caregiver = asg.id_caregiver
            JOIN Users ucg
                ON ucg.id_user = cg.id_user

            JOIN Contracts cn
                ON cn.id_contract = asg.id_contract
            JOIN Clients cl
                ON cl.id_client = cn.id_client
            JOIN Users ucl
                ON ucl.id_user = cl.id_user

            ORDER BY submission_date DESC
        `);

        // const result = {};
        /*
        for (const row of feedbacksResult.rows) {
            const author_name = `${row[0]}`;

            const caregiver_name = `${row[1]}`;
            const client_name = `${row[2]}`;

            let reciever_name;

            if (author_name === caregiver_name) {
                reciever_name = client_name;
            } else {
                reciever_name = caregiver_name;
            }
            
            if (!result[submition_date]) result[submition_date] = [];
            
            result[submition_date].push({
                author_name,
                reciever_name,
                grade,
                comment
            });
        }
        */
        res.json(feedbacksResult.rows.map(r => ({
            author_name: r[0],
            reciever_name: r[1],
            submition_date: r[2],
            grade: r[3],
            comment: r[4]
        })));

        // res.json(result);
    } finally {
        if (connection) await connection.close();
    }
});



app.get("/review_incidents", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const incidentsResult = await connection.execute(`
            SELECT
                i.id_incident,

                cu.surname || ' ' || cu.name AS client_name,
                gu.surname || ' ' || gu.name AS caregiver_name,

                i.incident_type,
                i.incident_reason,
                i.incident_description,
                TO_CHAR(i.incident_datetime, 'YYYY-MM-DD') AS incident_date,
                i.incident_status,
                TO_CHAR(i.resolve_datetime, 'YYYY-MM-DD') AS resolve_date,
                TO_CHAR(i.closure_datetime, 'YYYY-MM-DD') AS closure_date

            FROM Incidents i

            JOIN Clients c
                ON c.id_client = i.id_client

            JOIN Users cu
                ON cu.id_user = c.id_user

            JOIN Caregivers cg
                ON cg.id_caregiver = i.id_caregiver

            JOIN Users gu
                ON gu.id_user = cg.id_user

            ORDER BY incident_date DESC
        `);

        const rows = incidentsResult.rows;

        const result = {};

        for (const row of rows) {
            const id_incident = row[0];
            const client_name = row[1];
            const caregiver_name = row[2];
            const incident_type = row[3];
            const incident_reason = row[4];
            const incident_description = row[5];
            const incident_date = row[6];
            const incident_status = row[7];
            const resolve_date = row[8];
            const closure_date = row[9];

            if (!result[incident_date]) result[incident_date] = [];

            result[incident_date].push({
                client_name,
                caregiver_name,
                incident_type,
                incident_reason,
                incident_description,
                incident_status,
                resolve_date,
                closure_date
            });
        }

        res.json(result);
    } finally {
        if (connection) await connection.close();
    }
});

// caregiver panel

app.post("/review_caregiver_schedule", async (req, res) => {
    const { 
        id_user,
        id_schedule 
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT                
                c.id_client,
                cu.surname || ' ' || cu.name AS client_name,

                pv.id_visit,

                TO_CHAR(pv.planned_date, 'YYYY-MM-DD') AS planned_date,
                TO_CHAR(pv.planned_start_time, 'HH24:MI:SS') AS planned_start_time,
                TO_CHAR(pv.planned_end_time, 'HH24:MI:SS') AS planned_end_time,

                LISTAGG(s.service_name, ', ')
                    WITHIN GROUP (ORDER BY s.service_name) AS services

            FROM Schedules sch

            JOIN Planned_Visits pv
                ON pv.id_schedule = sch.id_schedule

            JOIN Assignments a
                ON a.id_assignment = pv.id_assignment

            JOIN Contracts ct
                ON ct.id_contract = a.id_contract

            JOIN Clients c
                ON c.id_client = ct.id_client

            JOIN Users cu
                ON cu.id_user = c.id_user

            JOIN Caregivers cg
                ON cg.id_caregiver = a.id_caregiver

            JOIN Users cgu
                ON cgu.id_user = cg.id_user

            JOIN Required_Services rs
                ON rs.id_client = c.id_client

            JOIN Services s
                ON s.id_service = rs.id_service

            WHERE sch.id_schedule = :id_schedule
              AND rs.req_serv_status = 'Active'
              AND cgu.id_user = :id_user

            GROUP BY
                c.id_client,
                cu.surname,
                cu.name,

                pv.id_visit,
                pv.planned_date,
                pv.planned_start_time,
                pv.planned_end_time

            ORDER BY
                pv.planned_date ASC,
                pv.planned_start_time ASC
        `,
        {
            id_user: id_user,
            id_schedule: id_schedule
        });

        res.json(result.rows.map(r => ({
            id_client: r[0],
            client_name: r[1],
            id_visit: r[2],
            planned_date: r[3],
            planned_start_time: r[4],
            planned_end_time: r[5],
            service_name: r[6]
        })));
    } finally {
        if (connection) await connection.close();
    }
});


app.post("/create_report", async (req, res) => {
    const {
        client_name,
        user_id_caregiver,
        planned_visit_date,
        report_text
    } = req.body;

    const [cl_surname, cl_name, cl_patronymic] = client_name.split(" ");

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const caregiverResult = await connection.execute(`
            SELECT c.id_caregiver
            FROM Caregivers c
            JOIN Users u
                ON u.id_user = c.id_user
            WHERE u.id_user = :user_id_caregiver
        `, {
            user_id_caregiver: user_id_caregiver
        });

        const id_caregiver = caregiverResult.rows[0][0];

        const clientResult = await connection.execute(`
            SELECT c.id_client
            FROM Clients c
            JOIN Users u
                ON u.id_user = c.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `,
        {
            name: cl_name,
            surname: cl_surname,
            patronymic: cl_patronymic
        });

        const id_client = clientResult.rows[0][0];

        const visitResult = await connection.execute(`
            SELECT pv.id_visit
            FROM Planned_Visits pv

            JOIN Assignments asg
                ON asg.id_assignment = pv.id_assignment
            JOIN Caregivers cg
                ON cg.id_caregiver = asg.id_caregiver
            
            JOIN Contracts cn
                ON cn.id_contract = asg.id_contract
            JOIN Clients cl
                ON cl.id_client = cn.id_client
            
            JOIN Schedules sch
                ON sch.id_schedule = pv.id_schedule

            WHERE cl.id_client = :id_client
            AND cg.id_caregiver = :id_caregiver
            AND TO_CHAR(pv.planned_date, 'YYYY-MM-DD') = :planned_visit_date
            AND sch.schedule_status = 'Active'
        `,
        {
            id_client: id_client,
            id_caregiver: id_caregiver,
            planned_visit_date: planned_visit_date
        });

        const id_visit = visitResult.rows[0][0];


        const caregiverReportResult = await connection.execute(`
            INSERT INTO Caregivers_Reports (
                id_visit, 
                report_text,
                creation_datetime
            )
            VALUES (
                :id_visit,
                :report_text,
                SYSDATE
            ) 
        `,
        {
            id_visit: id_visit,
            report_text: report_text
        });

        await connection.commit();

        res.json({ message: "Report has been created" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});


app.post("/selected_client_diseases", async (req, res) => {
    const { id_user } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                cd.id_client_disease,
                ucl.name,
                ucl.surname,
                ucl.patronymic,
                d.disease_name,
                TO_CHAR(cd.diagnosis_date, 'YYYY-MM-DD') AS diagnosis_date,
                cd.severity,
                cd.notes

            FROM Client_Diseases cd

            JOIN Diseases d
                ON d.id_disease = cd.id_disease
            JOIN Clients cl
                ON cl.id_client = cd.id_client
            JOIN Users ucl
                ON ucl.id_user = cl.id_user

            JOIN Contracts cn
                ON cn.id_client = cl.id_client
            JOIN Assignments a
                ON a.id_contract = cn.id_contract
            JOIN Caregivers cg
                ON cg.id_caregiver = a.id_caregiver
            JOIN Users ucg
                ON ucg.id_user = cg.id_user

            WHERE ucg.id_user = :id_user

            ORDER BY ucl.surname
        `, 
        {
            id_user: id_user
        });

        res.json(result.rows.map(r => ({
            id_client_disease: r[0],
            name: r[1],
            surname: r[2],
            patronymic: r[3],
            disease_name: r[4],
            diagnosis_date: r[5],
            severity: r[6],
            notes: r[7]
        })));
    } finally {
        if (connection) await connection.close();
    }
});

// client panel

app.post("/review_client_schedule", async (req, res) => {
    const { 
        id_user,
        id_schedule 
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const result = await connection.execute(`
            SELECT
                cg.id_caregiver,
                cgu.surname || ' ' || cgu.name AS caregiver_name,

                pv.id_visit,

                TO_CHAR(pv.planned_date, 'YYYY-MM-DD') AS planned_date,
                TO_CHAR(pv.planned_start_time, 'HH24:MI:SS') AS planned_start_time,
                TO_CHAR(pv.planned_end_time, 'HH24:MI:SS') AS planned_end_time,

                LISTAGG(s.service_name, ', ')
                    WITHIN GROUP (ORDER BY s.service_name) AS services

            FROM Schedules sch

            JOIN Planned_Visits pv
                ON pv.id_schedule = sch.id_schedule

            JOIN Assignments a
                ON a.id_assignment = pv.id_assignment

            JOIN Contracts ct
                ON ct.id_contract = a.id_contract

            JOIN Clients c
                ON c.id_client = ct.id_client

            JOIN Users cu
                ON cu.id_user = c.id_user

            JOIN Caregivers cg
                ON cg.id_caregiver = a.id_caregiver

            JOIN Users cgu
                ON cgu.id_user = cg.id_user

            JOIN Required_Services rs
                ON rs.id_client = c.id_client

            JOIN Services s
                ON s.id_service = rs.id_service

            WHERE sch.id_schedule = :id_schedule
              AND rs.req_serv_status = 'Active'
              AND cu.id_user = :id_user

            GROUP BY
                cg.id_caregiver,
                cgu.surname,
                cgu.name,

                pv.id_visit,
                pv.planned_date,
                pv.planned_start_time,
                pv.planned_end_time

            ORDER BY
                pv.planned_date ASC,
                cgu.surname ASC,
                pv.planned_start_time ASC
        `,
        {  
            id_user: id_user,
            id_schedule: id_schedule
        });

        res.json(result.rows.map(r => ({
            id_caregiver: r[0],
            caregiver_name: r[1],
            id_visit: r[2],
            planned_date: r[3],
            planned_start_time: r[4],
            planned_end_time: r[5],
            service_name: r[6]
        })));
    } finally {
        if (connection) await connection.close();
    }
});


app.post("/create_feedback", async (req, res) => {
    const {
        feedback_author,
        client_name,
        caregiver_name,
        planned_visit_date,
        feedback_grade,
        feedback_text
    } = req.body;

    const [cl_surname, cl_name, cl_patronymic] = client_name.split(" ");
    const [ca_surname, ca_name, ca_patronymic] = caregiver_name.split(" ");

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const caregiverResult = await connection.execute(`
            SELECT c.id_caregiver
            FROM Caregivers c
            JOIN Users u
                ON u.id_user = c.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `, {
            name: ca_name,
            surname: ca_surname,
            patronymic: ca_patronymic
        });

        const id_caregiver = caregiverResult.rows[0][0];


        const clientResult = await connection.execute(`
            SELECT c.id_client
            FROM Clients c
            JOIN Users u
                ON u.id_user = c.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `,
        {
            name: cl_name,
            surname: cl_surname,
            patronymic: cl_patronymic
        });

        const id_client = clientResult.rows[0][0];


        const visitResult = await connection.execute(`
            SELECT pv.id_visit
            FROM Planned_Visits pv

            JOIN Assignments asg
                ON asg.id_assignment = pv.id_assignment
            JOIN Caregivers cg
                ON cg.id_caregiver = asg.id_caregiver
            
            JOIN Contracts cn
                ON cn.id_contract = asg.id_contract
            JOIN Clients cl
                ON cl.id_client = cn.id_client
            
            JOIN Schedules sch
                ON sch.id_schedule = pv.id_schedule

            WHERE cl.id_client = :id_client
            AND cg.id_caregiver = :id_caregiver
            AND TO_CHAR(pv.planned_date, 'YYYY-MM-DD') = :planned_visit_date
            AND sch.schedule_status = 'Active'
        `,
        {
            id_client: id_client,
            id_caregiver: id_caregiver,
            planned_visit_date: planned_visit_date
        });

        const id_visit = visitResult.rows[0][0];


        const feedbacktResult = await connection.execute(`
            INSERT INTO Feedbacks (
                id_visit, 
                feedback_author,
                submission_datetime,
                grade,
                text_comment
            )
            VALUES (
                :id_visit,
                :feedback_author,
                SYSDATE,
                :grade,
                :text_comment
            ) 
        `,
        {
            id_visit: id_visit,
            feedback_author: feedback_author,
            grade: feedback_grade,
            text_comment: feedback_text
        });

        const clientUserResult = await connection.execute(`SELECT id_user FROM Clients WHERE id_client = :id_client`, { id_client: id_client });
        const clientUserId = clientUserResult.rows[0][0];
        
        const caregiverUserResult = await connection.execute(`SELECT id_user FROM Caregivers WHERE id_caregiver = :id_caregiver`, { id_caregiver: id_caregiver });
        const caregiverUserId = caregiverUserResult.rows[0][0];

        let id_reciever;
        let reciever_type;
        let avg;

        if (Number(feedback_author) === Number(clientUserId)) {

            id_reciever = id_caregiver;
            reciever_type = 'Caregiver';

            const averageRatingResult = await connection.execute(`
                SELECT AVG(cr.average_rating) AS average_rating
                FROM Caregivers c
                JOIN Caregiver_Ratings cr
                    ON c.id_caregiver = cr.id_caregiver
                WHERE
                    c.id_caregiver = :id_caregiver
            `,
            {
                id_caregiver: id_caregiver
            });

            avg = averageRatingResult.rows[0][0];

        } else if (Number(feedback_author) === Number(caregiverUserId)) {

            id_reciever = id_client;
            reciever_type = 'Client';

            const averageRatingResult = await connection.execute(`
                SELECT AVG(cr.average_rating) AS average_rating
                FROM Clients c
                JOIN Client_Ratings cr
                    ON c.id_client = cr.id_client
                WHERE
                    c.id_client = :id_client
            `,
            {
                id_client: id_client
            });

            avg = averageRatingResult.rows[0][0];

        } else { throw new Error("Cannot determine receiver type."); }

        await connection.commit();

        res.json(
        {
            message: "Feedback has been created",
            id_reciever: id_reciever,
            reciever_type: reciever_type,
            average_rating: avg
        });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});


app.post("/recalculate_rating", async (req, res) => {
    const {
        id_reciever,
        reciever_type
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        let grades = [];
        let months_diff = [];

        if (reciever_type === 'Caregiver') {
            const caregiverGrades = await connection.execute(`
                SELECT grade, FLOOR(MONTHS_BETWEEN(SYSDATE, submission_datetime)) AS months_diff
                FROM Feedbacks f
                JOIN Planned_Visits pv ON f.id_visit = pv.id_visit
                JOIN Assignments a ON pv.id_assignment = a.id_assignment
                WHERE a.id_caregiver = :id_caregiver
            `, 
            { 
                id_caregiver: id_reciever
            });

            grades = caregiverGrades.rows.map(row => row[0]);
            months_diff = caregiverGrades.rows.map(row => row[1]);

        } else if (reciever_type === 'Client') {

            const clientGrades = await connection.execute(`
                SELECT grade, FLOOR(MONTHS_BETWEEN(SYSDATE, submission_datetime)) AS months_diff
                FROM Feedbacks f
                JOIN Planned_Visits pv ON f.id_visit = pv.id_visit
                JOIN Assignments a ON pv.id_assignment = a.id_assignment
                JOIN Contracts cn ON a.id_contract = cn.id_contract
                JOIN Clients c ON cn.id_client = c.id_client
                WHERE c.id_client = :id_client
            `, 
            { 
                id_client: id_reciever
            });

            grades = clientGrades.rows.map(row => row[0]);
            months_diff = clientGrades.rows.map(row => row[1]);
        }

        await connection.commit();

        res.json({ grades, months_diff });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});


app.post("/update_rating", async (req, res) => {
    const {
        id_reciever,
        reciever_type,
        reviews_count,
        recalculated_rating
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });


        if (reciever_type === 'Caregiver') {
            const feedbacktResult = await connection.execute(`
                INSERT INTO Caregiver_Ratings (
                    id_caregiver, 
                    average_rating,
                    reviews_count,
                    calculation_date
                )
                VALUES (
                    :id_caregiver,
                    :average_rating,
                    :reviews_count,
                    SYSDATE
                ) 
            `,
            {
                id_caregiver: id_reciever,
                average_rating: recalculated_rating,
                reviews_count: reviews_count
            });

        } else if (reciever_type === 'Client') {

            const feedbacktResult = await connection.execute(`
                INSERT INTO Client_Ratings (
                    id_client, 
                    average_rating,
                    reviews_count,
                    calculation_date
                )
                VALUES (
                    :id_client,
                    :average_rating,
                    :reviews_count,
                    SYSDATE
                ) 
            `,
            {
                id_client: id_reciever,
                average_rating: recalculated_rating,
                reviews_count: reviews_count
            });
        }

        await connection.commit();

        res.json({ message: "Rating has been recalculated" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});


app.post("/create_incident", async (req, res) => {
    const {
        client_name,
        caregiver_name,
        incident_type,
        incident_reason,
        incident_description,
        incident_status
    } = req.body;

    const [cl_surname, cl_name, cl_patronymic] = client_name.split(" ");
    const [ca_surname, ca_name, ca_patronymic] = caregiver_name.split(" ");

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "C##Einsatzleiter",
            password: "Qwertz$$1",
            connectString: "localhost/XE"
        });

        const caregiverResult = await connection.execute(`
            SELECT c.id_caregiver
            FROM Caregivers c
            JOIN Users u
                ON u.id_user = c.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `, {
            name: ca_name,
            surname: ca_surname,
            patronymic: ca_patronymic
        });

        const id_caregiver = caregiverResult.rows[0][0];


        const clientResult = await connection.execute(`
            SELECT c.id_client
            FROM Clients c
            JOIN Users u
                ON u.id_user = c.id_user
            WHERE
                u.name = :name
                AND u.surname = :surname
                AND u.patronymic = :patronymic
        `,
        {
            name: cl_name,
            surname: cl_surname,
            patronymic: cl_patronymic
        });

        const id_client = clientResult.rows[0][0];


        const incidentResult = await connection.execute(`
            INSERT INTO Incidents (
                id_client,
                id_caregiver,
                incident_type,
                incident_reason,
                incident_description,
                incident_status
            )
            VALUES (
                :id_client,
                :id_caregiver,
                :incident_type,
                :incident_reason,
                :incident_description,
                :incident_status
            )
        `,
        {
            id_client: id_client,
            id_caregiver: id_caregiver,
            incident_type: incident_type,
            incident_reason: incident_reason,
            incident_description: incident_description,
            incident_status: incident_status
        });

        await connection.commit();

        res.json({ message: "Incident has been created" });
    } catch (err) {
        console.error(err);
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});



app.listen(PORT, () => console.log("Server running on port 3000"));
app.use(express.static(__dirname));
