const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

//const { MongoClient } = require('mongodb');
//const client = new MongoClient('your_mongo_db_connection_string');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://lyrenee02:tSGwv9viMBFajw3u@cluster.muwwbsd.mongodb.net/?retryWrites=true&w=majority&appName=cluster';
const client = new MongoClient(url);

// optional: cors, body parser; Prof included it in his example
//app.use(cors());
//app.use(bodyParser.json());
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

// enter code to join party
app.post('/api/joinParty', async (req, res, next) =>
{
    // Incoming: partyInviteCode, userID
    const { partyInviteCode , userID} = req.body;
    const db = client.db('party-database');
    var error = "none";
    var partyID = '';

    // get partyID
    var results = await db.collection('party').find({partyInviteCode:partyInviteCode}).toArray();

    if( results.length > 0 )
    {
        // add new member to party 
        partyID = results[0].partyID;
        const newMember = {userID:userID, partyID:partyID};

        try
        {
            results = db.collection('party-members').insertOne(newMember);
            const query = {userID:userID};
            var newValue = {$set: {status:1} };
            results = db.collection('users').updateOne(query, newValue);
        }

        catch(e)
        {
            error = e.toString();
        }
    }

    else
    {
        error = "Invalid code"
    }

    // Return userID, partyID 
    var ret = { userID:userID, partyID:partyID, error:error };
    res.status(200).json(ret);
});

// display movies in search page
app.post('/api/displayMovies', async (req, res, next) =>
{
    // incoming: none 
    const db = client.db('party-database');
    var ret = '';

    // get array of movies
    var results = await db.collection('movie').find({}).toArray();
    if( results.length > 0 )
    {
        // sort title by alphabetical order
        results.sort((movie1, movie2) => {
            const lowercaseMovie1 = movie1.title.toLowerCase();
            const lowercaseMovie2 = movie2.title.toLowerCase();
            if (lowercaseMovie1 < lowercaseMovie2) {
              return -1; 
            } else if (lowercaseMovie1 > lowercaseMovie2) {
              return 1; 
            } else {
              return 0;  
            }
          });

        //results.sort();
        ret = results;
    }

    else
    {
        var error = "No movies";
        ret = {error: error}; 
    }

    // return: array of movies, genres, descriptions
    res.status(200).json(ret);
});

// add movie to voting page
app.post('/api/startPoll', async (req, res, next) =>
{
    // incoming: movieID, partyID
    const { movieID, partyID } = req.body;
    const db = client.db('party-database');
    var error = "none";
    
    // create new poll for movie
    try
    {
        var newPoll = {partyID:partyID, movieID:movieID, votes:0, watchedStatus:0};
        const results = db.collection('poll').insertOne(newPoll);
    }

    catch(e)
    {
        error = e.toString();
    }
    
    // return 
    var ret = {partyID:partyID, movieID:movieID, error:error}
    res.status(200).json(ret);
});


// display watched movies page
app.post('/api/displayWatchedMovies', async (req, res, next) =>
{
    // incoming: partyID 
    const { partyID } = req.body;
    const db = client.db('party-database');
    var ret = '';

    // get array of watched movieID
    var watchedMovies = await db.collection('poll').find({partyID:partyID, watchedStatus:1}).toArray();

    // get array of all movies
    var movies = await db.collection('movie').find({}).toArray();
    var results = [];

    // get watched movie info and add to results array
    if( watchedMovies.length > 0 )
    {
        for(var i = 0; i<watchedMovies.length; i++)
        {
            for(var k = 0; k<movies.length; k++)
            {
                if(watchedMovies[i].movieID == movies[k].movieID)
                {
                    results.push(movies[k]);
                    break;
                }
            }
        }
        ret = results;
    }

    else
    {
        var error = "No watched movies";
        ret = {error: error}; 
    }

    // return watched movies
    res.status(200).json(ret);
});


// display user account page
app.post('/api/userAccount', async (req, res, next) =>
{
    // incoming: userID
    const { userID } = req.body;
    const db = client.db('party-database');
    var ret = '';

    // get user info
    const results = await db.collection('users').find({userID:userID}).toArray();
    if( results.length > 0 )
    {
        ret = results;
    }

    else
    {
        var error = "error"; 
        ret = {error: error};
    }

    // return all user data
    res.status(200).json(ret);
});

// leave group
app.post('/api/leaveParty', async (req, res, next) =>
{
    // incoming: userID, partyID
    const { userID, partyID} = req.body;
    const db = client.db('party-database');
    var error = "none";
    
    // leave party
    try
    {
        // delete user from party 
        var query = {userID:userID, partyID:partyID };
        const results = db.collection('party-members').deleteOne(query);

        // change user status
        query = {userID:userID};
        var newValue = {$set: {status:0} };
        results = db.collection('users').updateOne(query, newValue);
    }

    catch(e)
    {
        error = e.toString();
    }
    
    // return error message
    var ret = {error: error};
    res.status(200).json(ret);
});

// change password
app.post('/api/changePassword', async (req, res, next) =>
{
    // incoming: userID, password, validatePassword
    var { userID, newPassword, validatePassword} = req.body;
    const db = client.db('party-database');
    var error = "none";
    
    // Check if password is 8-23 characters and has at least 1 number, special character, and upper case
    var passwordRegex  = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;

    // Check if 2nd password input is same as the first
    const compareValue = newPassword.localeCompare(validatePassword);

    // Check if password is same as old password
    const passwordCheck = await db.collection('users').find({userID:userID, password:newPassword}).toArray();
    
    if (passwordCheck.length > 0)
    {
        newPassword = '';
        error = "Password matches current password";
    }

    else if (!passwordRegex.test(newPassword))
    {
        newPassword = '';
        error = "Weak password";
    }
    
    else if (compareValue != 0)
    {
        error = "Passwords must match"
    }
    else
    {
        try
        {
            const query = {userID:userID};
            var newValue = {$set: {password:newPassword} };
            const results = db.collection('users').updateOne(query, newValue);
        }

        catch(e)
        {
            error = e.toString();
        }
    }
    
    // return error message
    var ret = {error: error};
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
