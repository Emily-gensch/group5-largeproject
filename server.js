const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const client = new MongoClient('your_mongo_db_connection_string');

app.use(express.json());

app.post('/api/register', async (req, res, next) => {
    var { email, name, password } = req.body;
    var status = 0; // Default status value
    const db = client.db('party-database');
    var error = "none";

    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        email = '';
        error = "Invalid email";
    }

    var results = await db.collection('users').find({ email: email }).toArray();
    if (results.length > 0) {
        email = '';
        error = "Email already in use";
    }

    var passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    if (!passwordRegex.test(password)) {
        password = '';
        error = "Weak password";
    }

    if (password !== '' && email !== '' && name !== '') {
        try {
            const newUser = { name: name, email: email, password: password, status: status };
            results = await db.collection('users').insertOne(newUser);
        } catch (e) {
            error = e.toString();
        }
    }

    var ret = { name: name, email: email, password: password, status: status, error: error };
    res.status(200).json(ret);
});

client.connect(err => {
    if (err) {
        console.error('Failed to connect to the database. Exiting now...');
        process.exit();
    } else {
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    }
});
