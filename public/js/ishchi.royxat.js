let token = window.localStorage.getItem('token');
token = token ? token : '';
if (!token) window.location = '/login.html';

const elList = document.querySelector('.hero-inner');

async function fetchEmployees() {
    try {
        const req = await fetch('http://localhost:4000/api/employees', {
            headers: { token }
        });
        const res = await req.json();
        renderEmployees(res, elList);
    } catch (error) {
        console.error('Xato:', error);
    }
}

function renderEmployees(arr, node) {
    node.innerHTML = '';
    const fragment = document.createDocumentFragment();
    arr.forEach(({username, act_count}) => {
        const card = document.createElement('div');
        card.className = 'card me-3';
        card.style.width = '18rem';
        card.innerHTML = `
            <div class="card-body text-center">
                <h5 class="card-title">${username}</h5>
                <p class="card-text">${act_count} ta buyurtma</p>
                ${act_count==3?`<a href="#" class="btn btn-primary disabled">Band</a>` :""}
                
            </div>
        `;
        fragment.append(card);
    });
    node.append(fragment);
}

if (token) fetchEmployees();