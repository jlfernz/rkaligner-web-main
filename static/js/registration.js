$('#createAccount').submit(function (event) {
  event.preventDefault();
  handleSubmitRegistration();
});

function handleSubmitRegistration() {
  const username = document.querySelector(
    '.wrapper__registration #createAccount #username'
  ).value;
  const email = document.querySelector(
    '.wrapper__registration #createAccount #email'
  ).value;
  const password = document.querySelector(
    '.wrapper__registration #createAccount #password'
  ).value;
  const confirmpass = document.querySelector(
    '.wrapper__registration #createAccount #confirmpass'
  ).value;

  console.log(username, email, password, confirmpass);
  if (password != confirmpass) {
    return alert('Password did not match');
  }

  if (username && email && password && confirmpass) {
    fetch('/registration_submit', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then(function (response) {
      if (response.ok) {
        window.location.href = '/login';
      }
    });

  }
    
}
