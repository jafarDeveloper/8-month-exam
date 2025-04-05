let token = window.localStorage.getItem('token');
token = token ? token : '';
if (!token) window.location = '/login.html';

const elList = document.querySelector('.js-box');

async function fetchOrders() {
    try {
        const req = await fetch('http://localhost:4000/api/acts', {
            headers: { token }
        });
        const res = await req.json();
        renderOrders(res, elList);
    } catch (error) {
        console.error('Xato:', error);
    }
}

function renderOrders(arr, node) {
    node.innerHTML = '';
    const fragment = document.createDocumentFragment();
    arr.forEach(async({createdAt, user_id,emp_id,tech_id, status}) => {
        let price =  await fetch(`http://localhost:4000/api/prices/${tech_id}`, {headers:{token}}).then(res => res.json());
        let name =  await fetch(`http://localhost:4000/api/employee/${emp_id}`, {headers:{token}}).then(res => res.json());
        let username =  await fetch(`http://localhost:4000/api/users/${user_id}`, {headers:{token}}).then(res => res.json());
        console.log(price, name,username);
        
        const card = document.createElement('div');
        card.className = 'card me-3';
        card.style.width = '18rem';
        card.innerHTML = `
            <div class="card-body text-center">
                <h5 class="card-title">employee:${name.username}</h5>
                <h5 class="card-title">price: ${price.price}</h5>
                <p class="card-text">${createdAt.split('/')[0]}</p>
                <a href="#" class="btn btn-primary disabled">${status === 1 ? 'Tayyor' : 'Tayyorlanmoqda'}</a>
            </div>
        `;
        node.append(card);
    });
    node.append(fragment);
}

if (token) fetchOrders();