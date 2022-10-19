const form = document.getElementById('form');
const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const listItems = document.getElementById('listitems');

window.addEventListener('DOMContentLoaded', async () => {
    try {
        let res = await axios.get('https://crudcrud.com/api/34ccb3554f2f4322b17e75edb9c05f96/expenseData')
        res.data.forEach(element => {
            showData(element);
        })
    }
    catch (err) {
        console.log(err);
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (amount.value !== '' && description.value !== '') {
        try {
            const object = {
                amount: amount.value,
                description: description.value,
                category: category.value
            }
            const id = object.amount + object.description + object.category;

            // checking for duplicates
            let res = await axios.get('https://crudcrud.com/api/34ccb3554f2f4322b17e75edb9c05f96/expenseData')
            res.data.forEach(async (element) => {
                const idCeck = element.amount + element.description + element.category;
                if (id === idCeck) {
                    await axios.delete(`https://crudcrud.com/api/34ccb3554f2f4322b17e75edb9c05f96/expenseData/${element._id}`)
                    console.log(`deleted id: ${element._id}`)
                    deleteDataFromScreen(id);
                }
            });
            showData(object)
            await axios.post('https://crudcrud.com/api/34ccb3554f2f4322b17e75edb9c05f96/expenseData', object)
            console.log('successfull')
            amount.value = '';
            description.value = '';
            category.value = '';
        }
        catch (err) {
            console.log(err)
        }
    }
});

listItems.addEventListener('click', async (e) => {
    if (e.target.className === 'delete') {
        const id = e.target.parentElement.id;
        deleteDataFromScreen(id);
        deleteDataFromServer(id);
    }
    if (e.target.className === 'edit') {
        const id = e.target.parentElement.id;
        try {
            let res = await axios.get('https://crudcrud.com/api/34ccb3554f2f4322b17e75edb9c05f96/expenseData')
            res.data.forEach(element => {
                const idCeck = element.amount + element.description + element.category;
                if (id === idCeck) {
                    amount.value = element.amount;
                    description.value = element.description;
                    category.value = element.category;
                }
            })
            deleteDataFromScreen(id);
            deleteDataFromServer(id);
        }
        catch (err) {
            console.log(err)
        }
    }
});

//show Expense based on object value
function showData(object) {
    const li = document.createElement('li');
    li.id = `${object.amount}${object.description}${object.category}`;
    const textNode = document.createTextNode(`Spent ${object.amount} rupees for ${object.category} (${object.description})  `);
    li.appendChild(textNode);

    const edit = document.createElement('button');
    edit.className = 'edit';
    edit.innerText = 'Edit';
    edit.setAttribute('type', 'button');
    edit.style.backgroundColor = 'green';
    edit.style.color = 'white';
    edit.style.cursor = 'pointer';
    edit.style.border = 'none';
    li.appendChild(edit);

    const del = document.createElement('button');
    del.className = 'delete';
    del.innerText = 'Delete';
    del.setAttribute('type', 'button');
    del.style.backgroundColor = 'red';
    del.style.color = 'white';
    del.style.cursor = 'pointer';
    del.style.border = 'none';
    li.appendChild(del);

    listItems.append(li);
}

//deletes from screen
function deleteDataFromScreen(id) {
    const del = document.getElementById(id);
    del.remove();
}

//deletes from server
async function deleteDataFromServer(id) {
    try {
        let res = await axios.get('https://crudcrud.com/api/34ccb3554f2f4322b17e75edb9c05f96/expenseData')
        res.data.forEach(async (element) => {
            const idCeck = element.amount + element.description + element.category;
            if (id === idCeck) {
                await axios.delete(`https://crudcrud.com/api/34ccb3554f2f4322b17e75edb9c05f96/expenseData/${element._id}`)
                console.log(`Deleted id:${element._id}`)
            }
        });
    }
    catch (err) {
        console.log(err)
    }
}