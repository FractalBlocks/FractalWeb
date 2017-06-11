
let token: string


let passwordInput = <HTMLInputElement> document.querySelector('#password')
let loginBtn = document.querySelector('#login')


function login () {
  fetch('http://localhost:3005/login', {
    method: 'POST',
    body: passwordInput.value,
  })
    .then(r => r.text())
    .then(res => {
      token = res
      fetch('http://localhost:3005/connect', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }).then(r => r.text()).then(r => console.log(r))
    })
}

loginBtn.addEventListener('click', login)
