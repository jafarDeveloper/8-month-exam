let token = window.localStorage.getItem('token');
token = token ? token : '';
if (!token) window.location = '/login.html';

const elForm = document.querySelector('.js-form');

async function registerEmployee(data) {
    try {
        const req = await fetch('http://localhost:4000/api/auth/register/employee', {
            method: 'POST',
            headers: {
                token,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const res = await req.json();
            
        if (req.ok) window.location = '/royhat.ishchilar.html';

        else alert(res.message || 'Ishchi qo‘shishda xato');
    } catch (error) {
        console.error('Xato:', error);
    }
}

elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const formData = new FormData(elForm);
    const employeeData = Object.fromEntries(formData);
    
    registerEmployee(employeeData);
});

