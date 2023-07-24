import { showLevel } from './queries.js';





const loginButton = document.getElementById('loginButton');
const url = 'https://01.kood.tech/api/graphql-engine/v1/graphql';


if (loginButton) {
    loginButton.addEventListener('click', function (event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const username = usernameInput.value;
        const password = passwordInput.value;
        const isEmailLogin = /\S+@\S+\.\S+/.test(username);

         authenticateUser(username, password, isEmailLogin);
    });
}


export async function authenticateUser(username, password, isEmailLogin) {
    const endpoint = 'https://01.kood.tech/api/auth/signin';
    const credentials = btoa(`${username}:${password}`);

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${credentials}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
    };

    try {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            console.log('Authorization was impossible, wrong credentials');
            return;
        }

        const textResponse = await response.text();

        try {
            const jwtToken = JSON.parse(textResponse);

            if (jwtToken && jwtToken !== "") {
                localStorage.setItem('jwtToken', jwtToken);
                console.log('JWT Token stored in localStorage.');
                showUserData();

                showLevel();
            } else {
                console.log('JWT Token is undefined or empty. It will not be stored in localStorage.');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}


export function showUserData() {
    const jwtToken = localStorage.getItem('jwtToken');
    const query = `query{
            user {
                firstName
                lastName
                login
            }
        }`;

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    };
        console.log('Making GraphQL request with options:',options);
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('GraphQL Response:', data);
            if (data && data.data && Array.isArray(data.data.user) && data.data.user.length > 0) {
                const { firstName, lastName, login } = data.data.user[0];
                console.log('User Data:', { firstName, lastName, login });

                document.getElementById('login').textContent = login;
                document.getElementById('firstName').textContent = firstName;
                document.getElementById('lastName').textContent = lastName;
            } else {
                console.error('User data is missing or undefined in the API response.');
            }
        })
        .catch(error => console.error('Error:', error.message));
 
}
