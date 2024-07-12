document.addEventListener('DOMContentLoaded', function () {
    // DOM
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('loginButton');
    const togglePassword = document.getElementById('togglePassword');
    const changePasswordButton = document.getElementById('changePasswordButton');
    const submitChangePassword = document.getElementById('submitChangePassword');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        login();
    });

    loginButton.addEventListener('click', login);

    togglePassword.addEventListener('click', function () {
        const passwordInput = document.getElementById('password');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.textContent = 'hide password';
        } else {
            passwordInput.type = 'password';
            this.textContent = 'show password';
        }
    });

    changePasswordButton.addEventListener('click', function() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('changePasswordForm').style.display = 'block';
    });

    submitChangePassword.addEventListener('click', changePassword);

    // login
    function login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        sendRequest('/api/users/login', 'POST', { username: username, password: password })
            .then(data => {
                if (data.token) {
                    document.getElementById('loginForm').style.display = 'none';
                    document.getElementById('mainApp').style.display = 'block';
                    localStorage.setItem('jwtToken', data.token);
                } else {
                    alert('Login failed: Unexpected response from server');
                }
            })
            .catch(error => {
                alert('Failed to login: ' + error.message);
            });
    }

    // change password
    function changePassword() {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const secretPassword = document.getElementById('secretPassword').value;

        sendRequest('/api/users/change-password', 'POST', {
            oldPassword: oldPassword,
            newPassword: newPassword,
            secretPassword: secretPassword
        })
        .then(data => {
            alert('Password changed successfully');
            document.getElementById('changePasswordForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        })
        .catch(error => {
            alert('Failed to change password: ' + error.message);
        });
    }

    
    function sendRequest(url, method, data) {
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'An error occurred');
                });
            }
            return response.json();
        });
    }
});