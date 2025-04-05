let token = window.localStorage.getItem('token');
token = token ? token : '';
if(!token) window.location = '/login.html';

const elList = document.querySelector('.js-employee-orders-list');
const elOrder = document.querySelector('.js-order-template').content;

function render(arr, node){
    node.innerHTML = '';
    const fragment = document.createDocumentFragment();

    arr.forEach(({createdAt, name, id, status}) => {
        if(status != 1){
            const clone = elOrder.cloneNode(true);
            clone.querySelector('.js-date').textContent = createdAt.split('/')[0];
            clone.querySelector('.js-name').textContent = name;
            clone.querySelector('.js-btn').dataset.id = id;
            fragment.append(clone);
        }
    });
    node.append(fragment);
}

function timestamp(){
    const now = new Date();
    const datestamp = now.toISOString().slice(0, 10);
    const timestamp = `${now.getHours()}:${now.getMinutes()}`; 
    return `${datestamp}/${timestamp}`
}

async function employeeOrders(token) {
    const req = await fetch('http://localhost:4000/api/acts',{
        headers:{
            token: token
        }
    });

    const res = await req.json();
    console.log(res);
    
    render(res, elList);
}
if(token) employeeOrders(token);

async function updateOrderStatus(id, data) {
    const req = await fetch(`http://localhost:4000/api/actes/${id}`, {
        method: "PUT",
        headers: {
            token,
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const res = await req.json();
    console.log(res);
    employeeOrders(token)
}

elList.addEventListener('click', (evt)=>{
    if(evt.target.matches('.js-btn')){
        const id = evt.target.dataset.id;
        updateOrderStatus(id);
    }
})