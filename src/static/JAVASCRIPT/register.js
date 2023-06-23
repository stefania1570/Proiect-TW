const form = document.getElementById('form2')

form.addEventListener('submit', userRegister)

async function userRegister(event) {
    event.preventDefault()

    // form data
    const username = document.getElementById('username').value
    const password1 = document.getElementById('password-input').value
    const email = document.getElementById('email').value
    const password2 = document.getElementById('password-input2').value

    console.log("[register]", username, password1, email, password2)

    const url = 'http://localhost:5500/add-user';
    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password1,
                email,
                password2
            }),
    }).then(response => {

        if (!response.ok) {
            throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
        }

        return response.json();
        }).then(data => {
            //console.log(data); //{route: '/login.html', message: 'Your account has been created successfully!'}
            window.location.href = data.route 
            window.alert(data.message)
        }).catch(error => {

        console.error(error);

        });
}