const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

loginButton.addEventListener('click', function(event) {
    event.preventDefault();

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
            'Authorization': 'Bearer' + credentials,
            'Content-Type': 'application/json'
                }, 
    };
        fetch(endpoint, options)
        .then(response => {
            if(!response.ok) {
                throw new Error('Authorization was impossible, wrong credentials');
            }
            return response.json();
        })
        .then(data =>{
            console.log('Fetch data works', data);
            const jwt = data.jwt;
        })
        .catch(error =>{
            console.error('Error', error.message);
        });

}
authenticateUser(username,password);