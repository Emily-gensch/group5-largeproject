ja d tf en
jadtfen
🧡

ja d tf en — 07/20/2024 9:16 PM
jjaden562@gmail.com
Josaiah Saldana — 07/20/2024 9:19 PM
I sent the files, let me know if you can access them
Josaiah Saldana — 07/20/2024 9:20 PM
Yeah I can look through them
ja d tf en — 07/21/2024 2:21 AM
okay I fixed join page works its saying that the user isnt authroized so until we get the email verification its like that now. I tried to fix the search and vote page by adding a display movie but its not working and search isnt fetching the movie id correctly im going to fix my files and send them back to you do you can see all of it in action yourself im busy until tmr night but if you got those api functions to work for search vote and a group memebbers displaya pi for the home page we would almost be done
Attachment file type: archive
frontend_web copy.zip
62.93 MB
Attachment file type: archive
Project-API-2 copy.zip
57.92 MB
Josaiah Saldana — 07/21/2024 4:47 PM
I downloaded the frontend_web copy.zip but there is nothing there. Just the node_modules. I'll keep working on the apis
ja d tf en — 07/21/2024 5:11 PM
Attachment file type: archive
frontend_web copy.zip
62.93 MB
ja d tf en — 07/21/2024 6:29 PM
okay these should work the login api is fixed
Attachment file type: archive
frontend_web copy.zip
62.93 MB
Attachment file type: archive
Project-API-2 copy.zip
57.92 MB
Josaiah Saldana — 07/21/2024 7:19 PM
I managed to fix the search, add movies  and displaymovie. The vote page is now correctly connected but it is not displaying anything yet, but the movies are being added to the poll from the search page. The votepage is giving me a lot of trouble so it will take me a bit longer to fix. Also need to fix the members not being retrieved properly. I probably will pick it back up tomorrow because I'm pretty burnt out.
ja d tf en — 07/21/2024 7:23 PM
kk its okay im getting the email verificantion to work
ja d tf en — 07/22/2024 10:59 AM
hey you said you got the join page and createa party page to work without being hard coded could you send me those two files so I can try to work with you on the vote page I got the verfication atuff for register to work
Josaiah Saldana — 07/22/2024 1:19 PM
Yeah I’ll send it right now
I sent it through email
ja d tf en — 07/22/2024 1:35 PM
kk! i’ll see how it works at home!
ja d tf en — 07/22/2024 1:44 PM
you only edited the join create and vote page right?
Josaiah Saldana — 07/22/2024 1:52 PM
I think I also edited the search and home page
Just the api url if I remember correctly
ja d tf en — 07/22/2024 1:52 PM
yea my dumb ass had a https instead of http 😭
i fixed that in some of them
as i went down i’m almost home and i’ll try those out bc that’s the only error i have now and then see how to vote page works more too by tonight
ja d tf en — 07/22/2024 4:52 PM
hey so I got everything to work except for the session id
im going to send you everything I have in like 2 hours I think I can get everything else fixed by the but the session id stuff isnt working for me i got the login to work with local storage for now i thyink it mightbe easier and the register page I was able to get the verification to work im at the search page now to fix that
Josaiah Saldana — 07/22/2024 5:30 PM
okay I'll take a look at it. By everything working, do you also mean the members being fetched properly at home and the vote page displaying the movies?
ja d tf en — 07/22/2024 5:31 PM
im working on that now I was able to get the user to work login registeration with verfication create a party join and now that im pass all of that im too the search page
Josaiah Saldana — 07/22/2024 6:23 PM
Alright. I am working on the votePage and it seems to retrieve the movies well now
Josaiah Saldana — 07/22/2024 9:32 PM
I got votePage to retrieve the movies successfully, even when the movies are added by search. Do you want me to send the files voer
ja d tf en — 07/22/2024 9:52 PM
yes please
that’s what i’m working on now
i think that’s pretty much it i’ll look into it now
Josaiah Saldana — 07/22/2024 10:30 PM
I sent it
ja d tf en — 07/22/2024 10:34 PM
kk
ja d tf en — 07/23/2024 12:45 PM
I cant sseem to get what you did with th search page at all
uhh ill email you mine
ja d tf en — 07/23/2024 12:58 PM
maybe if you fix the api the same with what I have currently everything works I just have to change the backgrounf the only other thing is that its not letting more than one user use the code
lmk if you got them
Josaiah Saldana — 07/23/2024 1:27 PM
So just search page isn’t working?
ja d tf en — 07/23/2024 1:31 PM
yea
i can fix the design
Josaiah Saldana — 07/23/2024 1:53 PM
I’ll fix it soon
ja d tf en — 07/23/2024 1:53 PM
kk!
im also not sure where to connect the api with this https://themoviesocial-a63e6cbb1f61.herokuapp.com/
React App
Web site created using create-react-app
im going to try to mess with it
Josaiah Saldana — 07/23/2024 2:10 PM
Okay. Anything else that needs to be fixed? Tomorrow I won’t be too available to help
ja d tf en — 07/23/2024 2:57 PM
the group members and top pics on home page
Josaiah Saldana — 07/23/2024 4:35 PM
Could you push your current files into the github? I tried using it, but there are a lot of things that are not working at the moment.
ja d tf en — 07/23/2024 4:57 PM
i had to change it for heroku to a diff git repository 
so i’m not sure if i can set it to another one with out disconnecting the ink
what was the issue with the ones i sent you?
Josaiah Saldana — 07/23/2024 5:00 PM
The login isn’t working, userid isn’t being found, a created party is going to the wrong place in the database, etc. Idk if it is because we are sending zips, but if this stuff is working on your end then that is fine.
ja d tf en — 07/23/2024 5:01 PM
hmm let me try on more time at home
ja d tf en — Today at 4:25 AM
so this is my register file it keeps hitting the regiestration error
Image
import React, { useState, useEffect } from 'react';
import './styles/Register.css';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
Expand
message.txt
5 KB
im not sure if my api is connected wrong or
Image
so i found the error its the index.hmtl file
Josaiah Saldana — Today at 4:29 AM
is this file still using json web tokens?
ja d tf en — Today at 4:30 AM
yea i can fix that i opened an old project to see if it was something i was doing I can just insert the register page if I can get this all to run
its not hitting that error tho
its something with the index.html
Josaiah Saldana — Today at 4:32 AM
hmm it's just that I see that some of the api in that file are using authorization bearer tokens which we aren't creating anymore in the backend. I also stopped updating the api/auth/token as well because we no longer needed it. Out of curiosity, what does the api/auth/user do?
ja d tf en — Today at 4:33 AM
is this in the api endpoints?
or are you asking me to curl it?
Josaiah Saldana — Today at 4:35 AM
I am not sure what a curl is if I am being honest. The only api I am unware about is the api/auth/user
oh wait I might be going crazy. Are those tokens for the email portion?
the verification stuff?
ja d tf en — Today at 4:37 AM
i thought so? but i could be wrong
also that was for me to pull to display on the profile page
Josaiah Saldana — Today at 4:38 AM
ah alright gotcha
ja d tf en — Today at 4:38 AM
If your index.html is being served instead of the API responses, it typically means that your server is not correctly routing requests to the appropriate handlers.
so its a google issue...
Image
one sec
Josaiah Saldana — Today at 4:41 AM
Now that you mention it I have been testing this on firefox
wait nvm
ja d tf en — Today at 4:43 AM
did it work on fire fox?
Josaiah Saldana — Today at 4:46 AM
no it has actually begun to fail me right now
hold on let me see into it
ja d tf en — Today at 4:48 AM
maybe we should try changing the fetches to this like this perosn says?
Image
Josaiah Saldana — Today at 4:51 AM
Are you testing this on your frontend? And if so, could you check the developer tools
ja d tf en — Today at 4:51 AM
yeaa it still threw me the same thing
Josaiah Saldana — Today at 4:55 AM
you said that you have the frontend running on a domain? was it netlify?
ja d tf en — Today at 4:55 AM
yea
Josaiah Saldana — Today at 4:56 AM
could you send the url
ja d tf en — Today at 4:56 AM
i tried to but then the login page was being weird
Josaiah Saldana — Today at 4:56 AM
im going to try something out
ja d tf en — Today at 4:56 AM
yea
http://group5cop4331.com/
React App
Web site created using create-react-app
Josaiah Saldana — Today at 4:58 AM
okay i am going to make a push to the heroku main
ja d tf en — Today at 4:58 AM
okay
is it giving you errors?
Josaiah Saldana — Today at 5:06 AM
yeah I am having some merge conflicts with the server.js file. I am fixing it rn
ja d tf en — Today at 5:07 AM
kk i was making sure you didnt have the one i earlier
Josaiah Saldana — Today at 5:17 AM
honestly I'm kind of afraid to push anything right now if rachelle is using the backend and it's working.


In the server.js file

app.use(
  cors({
    origin: ['http://localhost:5002/', 'http://group5cop4331.com/'],
    credentials: true,
  })
);

This was the only change I was going to make. Just adding the frontend url into the cors
because it's giving me a lot of issues right now
ja d tf en — Today at 5:18 AM
yea i already had that changed to the server js already for the heroku
oh wait
I tried that with the url and the heroku link and im building that now
ja d tf en — Today at 5:26 AM
import React, { useState } from 'react';
import './styles/Register.css';

function RegisterPage() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async (email, name, password) => {
    try {
      const response = await fetch('https://socialmoviebackend-4584a07ae955.herokuapp.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', // Ensure Content-Type header is set
        },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful');
        // Redirect to the join page or login page
        window.location.href = '/join'; // Example: Redirect to '/join' page
      } else {
        setMessage('Registration failed'); // Inform user of failure
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed'); // Inform user of failure
    }
  };

  return (
    <div className="container">
      <div id="registerDiv">
        <form onSubmit={(e) => {
          e.preventDefault();
          register(registerEmail, registerUsername, registerPassword);
        }}>
          <span id="inner-title">REGISTER</span><br />
          <input
            type="text"
            id="registerUsername"
            placeholder="Username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          /><br />
          <input
            type="email"
            id="registerEmail"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          /><br />
          <input
            type="password"
            id="registerPassword"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          /><br />
          <input
            type="submit"
            id="registerButton"
            className="buttons"
            value="Register"
          />
        </form>
        <span id="registerResult">{message}</span>
        <div>
          <span>If you already have an account, <a href="/login">Login</a></span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
 even with me having this accept here it still gives the same thing that it faild
React App
Web site created using create-react-app
the registration page also said registration faild
im just wondering bc its not fetching form anywhere if you go to the heroku link and do /search its as if the api arent working with it.... but i cant see the issue to why it isnt
Josaiah Saldana — Today at 5:31 AM
ah wait I think I found this issue
quick shot in the dark but, 

try this for the api.js
const API_URL = 'https://socialmoviebackend-4584a07ae955.herokuapp.com/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
Expand
message.txt
6 KB
﻿
Josaiah Saldana
josaiahs
const API_URL = 'https://socialmoviebackend-4584a07ae955.herokuapp.com/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Used to register new users. POST request that expects an email, name and password
export const register = async (email, name, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, password }),
  });
  return handleResponse(response);
};

// Used to login new users. POST request that expects an email, and password.
// The generate token is stored for the specific user for later use that requires stricter authentication.
export const login = async (email, password) => {
  console.log('Sending login request', { email, password });
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  return handleResponse(response);
};

// This function will return the specific token for the current user that is currently logged in.
const getToken = async () => {
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('tokenExpiry');

  if (!token || Date.now() > tokenExpiry) {
    try {
      const newToken = await refreshToken();
      return newToken;
    } catch (error) {
      throw new Error('Session expired. Please log in again.');
    }
  }

  return token;
};

// Party functions

// createParty
// joinParty
// GetPartyHomePage
// EditPartyName

// Creates a party. POST request that requires a party name. Token is required from the user (they have to be logged in) in order to create a party.
// getToken() function is used to retrieve the current users token.
export const createParty = async (partyName) => {
  const response = await fetch(`${API_URL}/party/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyName }),
    credentials: 'include',
  });

  return handleResponse(response);
};

// Allows user to join a party. POST request that expects the party invite code that is created when the party is created by host.
export const joinParty = async (partyInviteCode, userID) => {
  const response = await fetch(`${API_URL}/party/joinParty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyInviteCode, userID }),
  });

  return handleResponse(response);
};

// Gets the homepage of the party. GET request that expects the partyID as a query parameter.
// Example: https://socialmoviebackend-4584a07ae955.herokuapp.com/api/party/home/?partyID=66934da66fca26f472155a9d
export const getPartyHomePage = async (partyID) => {
  const response = await fetch(`${API_URL}/party/home?partyID=${partyID}`, {
    method: 'GET',
    headers: {},
  });

  return handleResponse(response);
};

export const editPartyName = async (newPartyName, hostID) => {
  const response = await fetch(`${API_URL}/party/EditPartyName`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newPartyName, hostID }),
  });

  return handleResponse(response);
};

export const leaveParty = async (userID, partyID) => {
  const response = await fetch(`${API_URL}/party/leaveParty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID, partyID }),
  });

  return handleResponse(response);
};

// Example: https://socialmoviebackend-4584a07ae955.herokuapp.com/api/poll/votePage?pollID=66980dc3b03ee5fdec99ffde
export const getVotePage = async (pollID) => {
  const response = await fetch(`${API_URL}/poll/votePage?pollID=${pollID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
};

// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
export const addMovieToPoll = async (partyID, movieID) => {
  const response = await fetch(`${API_URL}/poll/addMovieToPoll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyID, movieID }),
  });

  return handleResponse(response);
};

// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
export const upvoteMovie = async (partyID, movieID) => {
  const response = await fetch(`${API_URL}/poll/upvoteMovie`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyID, movieID }),
  });

  return handleResponse(response);
};

// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
export const removeMovieFromPoll = async (partyID, movieID) => {
  const response = await fetch(`${API_URL}/poll/removeMovie`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyID, movieID }),
  });

  return handleResponse(response);
};

// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
export const markMovieAsWatched = async (partyID, movieID) => {
  const response = await fetch(`${API_URL}/poll/markWatched`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partyID, movieID }),
  });

  return handleResponse(response);
};
message.txt
6 KB