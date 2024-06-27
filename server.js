// register
app.post('/api/register', async (req, res, next) =>
{
    // incoming: email, name, password 
    var { email, name, password } = req.body;
    var status = 0;
    const db = client.db('party-database');
    var error = "none";

    // Check if email is valid
    var emailRegex  = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!emailRegex.test(email))
    {
        email = '';
        error = "Invalid email";
    }
    
    // Check if email is already taken
    var results = await db.collection('users').find({email:email}).toArray();
    if (results.length > 0)
    {
        email = '';
        error = "Email already in use";
    }

    // Check if password is 8-23 characters and has at least 1 number, special character, and upper case
    var passwordRegex  = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    if (!passwordRegex.test(password))
    {
        password = '';
        error = "Weak password";
    }
    
    // If email, name, password valid then create new user
    if(password != '' && email != '' && name != '')
    {
        try
        {
            //const newUser = {login:login, email:email, password:password,userID:userID};
            const newUser = {name:name, email:email, password:password, status:status};

            results = db.collection('users').insertOne(newUser);
        }

        catch(e)
        {
            error = e.toString();
        }
    }

    // Return array: email, name, password, status, error message
    var ret = { name:name,email:email,password:password, status:status, error:error};
    res.status(200).json(ret);
});
