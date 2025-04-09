let token = window.localStorage.getItem('token');
token = token ? token : '';
if (!token) window.location = '/login.html';

const elForm = document.querySelector('.js-form');
const elTechnics = document.querySelector('.js-technics-list');
const elEmployees = document.querySelector('.js-employees-list');
const elPrice = document.querySelector('.js-price');
const elBtn = document.querySelector('.js-btn');

function renderEmployees(arr, node) {
    node.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const option1 = document.createElement('option');
    option1.value = '';
    option1.textContent = 'Ishchi tanlang';
    option1.selected = true;
    option1.disabled = true;
    option1.hidden = true;

    arr.forEach(({username, id, act_count}) => {
        if (act_count < 3) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = username;
            fragment.append(option);
        }
    });
    node.append(option1, fragment);
}

function renderTechnics(arr, node) {
    node.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const option1 = document.createElement('option');
    option1.value = '';
    option1.textContent = 'Texnikani tanlang';
    option1.selected = true;
    option1.disabled = true;
    option1.hidden = true;

    arr.forEach(({tech_name, id}) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = tech_name;
        fragment.append(option);
    });
    node.append(option1, fragment);
}

async function postClient(data) {
    const req = await fetch('http://localhost:4000/api/auth/register/user', {
        method: "POST",
        headers: { token, "Content-type": "application/json" },
        body: JSON.stringify(data)
    });
    const res = await req.json();
    if (req.ok) return res
    // else alert(res.message||"siz kiritish paytida xatoga yo'l qo'ydiz");
}

async function postAct(data) {
    const req = await fetch('http://localhost:4000/api/actes', {
        method: "POST",
        headers: { token, "Content-type": "application/json" },
        body: JSON.stringify(data)
    });
    const res = await req.json();
    if(res.status==201){
        window.location="/royhat.buyurtmalar.html"
    }
    
    
}

elForm.addEventListener('input', async (evt) => {
    let formData = new FormData(elForm);
    formData = Object.fromEntries(formData);
    if (formData.tech_id) {
        const foundedPrice = await fetch(`http://localhost:4000/api/prices/${formData.tech_id}`).then(res => res.json());
        elPrice.value = foundedPrice.price;
        elPrice.disabled = false;
    }
    const values = Object.values(formData);
    const checking = values.every(item => item != '');
    if (checking && values.length == 7) elBtn.disabled = false;
    else elBtn.disabled = true;
});

elForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    let formData = new FormData(elForm);
    formData = Object.fromEntries(formData);

    const clientKeys = ["username", "email", "phone", "password"];
    const clientData = clientKeys.reduce((obj, key) => {
        if (key in formData) obj[key] = formData[key];
        return obj;
    }, {});
    
    
    const actKeys = ["tech_id", "emp_id"];
    const actData = actKeys.reduce((obj, key) => {
        if (key in formData) obj[key] = formData[key];
        return obj;
    }, {});
    

    const id = await postClient(clientData);
    
    actData.user_id = id.id;
    postAct(actData);
});

const urls = [
    'http://localhost:4000/api/prices',
    'http://localhost:4000/api/techs',
    'http://localhost:4000/api/employees'
];
Promise.all(urls.map(url => fetch(url).then(res => res.json())))
    .then(data => {
        window.localStorage.setItem('prices', JSON.stringify(data[0]));
        renderTechnics(data[1], elTechnics);
        renderEmployees(data[2], elEmployees);
    })
    .catch(err => console.error('Error fetching one of the URLs:', err));

function timestamp() {
    const now = new Date();
    const datestamp = now.toISOString().slice(0, 10);
    const timestamp = `${now.getHours()}:${now.getMinutes()}`; 
    return `${datestamp}/${timestamp}`;
}