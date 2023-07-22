const isLocalStorageAccessible = (() => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (error) {
      return false;
    }
  })();
  
  if (isLocalStorageAccessible) {
    console.log('localStorage is accessible.');
  } else {
    console.log('localStorage is not accessible.');
  }


document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');

    loginButton.addEventListener('click', function (event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const username = usernameInput.value;
        const password = passwordInput.value;

        authenticateUser(username, password);
    });
    

    function authenticateUser(username, password) {
        const endpoint = 'https://01.kood.tech/api/auth/signin'
        const credentials = btoa(`${username}:${password}`);
    
        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + credentials,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        };
    
        fetch(endpoint, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Authorization was impossible, wrong credentials');
                }
                return response.json();
            })
            .then(data => {
                const jwtToken = data.token;
                localStorage.setItem('jwtToken', jwtToken);
                console.log('Fetch data works', data);
                window.location.href = 'profile.html';
                showUserData(); // Call showUserData after successful authentication
            })
            .catch(error => {
                console.error('Error', error.message);
            });
    }

    function showUserData() {
        console.log('showUserData() function called');
        const endpoint = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
        const jwtToken = localStorage.getItem('jwtToken');

        const query = `
          {
            user {
              firstName
              lastName
              login
            }
          }
        `;

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        };

        fetch(endpoint, options)
            .then(response => response.json())
            .then(data => {
                console.log('GraphQL Response:', data);
                if (data && data.data && data.data.user) {
                    const { firstName, lastName, login } = data.data.user;
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

    const isProfilePage = window.location.pathname.includes('profile.html');
    if (isProfilePage) {
        showUserData(); // Call showUserData on profile.html page load
    }
});
