let token = window.localStorage.getItem('token');
token = token ? token : '';
if (!token) window.location = '/login.html';

const elName = document.querySelector('.js-name');
const elPhoneNumber = document.querySelector('.js-phone-number');
const elEmail = document.querySelector('.js-email');
const elPassword = document.querySelector('.js-password');
const elForm = document.querySelector('.js-form');
const elBtn = document.querySelector('.js-btn');

async function takingIdEmployee(token) {
    const req = await fetch('http://localhost:4000/api/employee', { headers: { token } });
    const res = await req.json();
    if (req.ok) {
        delete res.role;
        const { email, password, phone_num, username } = res;
        elName.value = username;
        elPassword.value = password;
        elEmail.value = email;
        elPhoneNumber.value = phone_num;
        window.localStorage.setItem('userData', JSON.stringify(res));
    }
}

async function update( data) {
    const req = await fetch(`http://localhost:4000/api/employe`, {
        method: "PUT",
        headers: { token ,"Content-type": "application/json" },
        body: JSON.stringify(data)
    });
    const res = await req.json();
    
}

elForm.addEventListener('input', () => {
    elBtn.disabled = false;
});

elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const formData = new FormData(elForm);
    const user = Object.fromEntries(formData);
    user.updatedAt = timestamp();

    let userData = window.localStorage.getItem('userData');
    userData = userData ? JSON.parse(userData) : '';
    const updatedData = { ...userData, ...user };
    update(updatedData);
});

if (token) takingIdEmployee(token);

function timestamp() {
    const now = new Date();
    const datestamp = now.toISOString().slice(0, 10);
    const timestamp = `${now.getHours()}:${now.getMinutes()}`; 
    return `${datestamp}/${timestamp}`;
}