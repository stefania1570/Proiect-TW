const form = document.getElementById('loginForm')

form.addEventListener('submit', loginUser)

async function loginUser(event) {
    event.preventDefault()

    // form data
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    console.log("[login]", username, password)

    const url = 'http://localhost:5500/login-user';
    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            }),
    }).then(response => {

        if (!response.ok) {
            throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
        }

        return response.json();
        }).then(json => {
            console.log("[login]", json.information)//token...

        let date = new Date();
        date.setTime(date.getTime() + (35 * 60 * 1000)); //35 min cookie
        const expires = date.toUTCString();
        document.cookie = `jwt=${json.information}; expires=${expires}; path=/`; 

        window.location.href = json.route
        window.alert(json.message)
        }).catch(error => {
              console.error(error);
        });
}