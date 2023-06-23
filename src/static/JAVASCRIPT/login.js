function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
} 

const form = document.getElementById('loginForm')

form.addEventListener('submit', loginUser)  

async function loginUser(event) {
    event.preventDefault()
    if(getCookie("jwt") != null && getCookie("jwt") != 'undefined'){
        window.alert("You are probably already logged in!");
        return
    }
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