let token = window.localStorage.getItem('token');
token = token ? token : '';
if (!token) window.location = '/login.html';

const elList = document.querySelector('.js-employee-orders-list');
const elOrder = document.querySelector('.js-order-template').content;

async function render(arr, node) {
    node.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (const { id, tech_id, emp_id, user_id, totalPrice, status, createdAt } of arr) {
        try {
            let price = await fetch(`http://localhost:4000/api/prices/${tech_id}`, { headers: { token } }).then(res => res.json());
            let name = await fetch(`http://localhost:4000/api/employee/${emp_id}`, { headers: { token } }).then(res => res.json());
            let username = await fetch(`http://localhost:4000/api/users/${user_id}`, { headers: { token } }).then(res => res.json());
            let techs = await fetch(`http://localhost:4000/api/techs`, { headers: { token } }).then(res => res.json());
            let tech = techs.filter((tech) => tech.id == tech_id);

            
                const clone = elOrder.cloneNode(true);
                clone.querySelector('.js-date').textContent = "Order date: "+ new Date(createdAt).toLocaleDateString();
                clone.querySelector('.js-name').textContent ="tech: "+ tech[0].tech_name;
                clone.querySelector('.js-client-name').textContent ="user: "+ username.username;
                clone.querySelector('.js-price').textContent ="price: "+ totalPrice;
                clone.querySelector('.js-btn').dataset.id = id;
                fragment.append(clone);
            
        } catch (err) {
            console.error('Error in render:', err);
        }
    }
    node.append(fragment);
}

function timestamp() {
    const now = new Date();
    const datestamp = now.toISOString().slice(0, 10);
    const timestamp = `${now.getHours()}:${now.getMinutes()}`;
    return `${datestamp}/${timestamp}`;
}

async function employeeOrders() {
    try {
        const req = await fetch('http://localhost:4000/api/acts', {
            headers: {
                token
            }
        });
        const res = await req.json();
        render(res, elList);
    } catch (err) {
        console.error('Error in employeeOrders:', err);
    }
}
if (token) employeeOrders();

async function updateOrderStatus(id, data) {
    try {
        const req = await fetch(`http://localhost:4000/api/actes/${id}`, {
            method: "PUT",
            headers: {
                token,
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const res = await req.json();
        employeeOrders();
    } catch (err) {
        console.error('Error in updateOrderStatus:', err);
    }
}

elList.addEventListener('click', (evt) => {
    if (evt.target.matches('.js-btn')) {
        const id = evt.target.dataset.id;
        let a =confirm("Siz buyurtmani yakunlashni tasdiqlaysizmi?")
        if (a) {
            
     
            updateOrderStatus(id, {}); // data parametri bo'sh ob'ekt sifatida yuborilmoqda, agar kerak bo'lsa o'zgartiriladi
        }
        
    }
});