const newUserForm = document.getElementById('addNewUserForm');
newUserForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(newUserForm)
    console.log(formData)
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1])
    }
    const jsonData = {}
    formData.forEach(function (value, key) {
        if (key === 'roles') {
            if (!jsonData[key]) {
                jsonData[key] = []
            }
            jsonData[key].push({name: value})
        } else {
            jsonData[key] = value
        }
    })
    let response = await fetch('/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(jsonData)
    })
    if (response.ok) {
        const newAddedUser = await response.json();
        const rolesString = newAddedUser.roles.map(role => role.name.replace('ROLE_', '')).join(' ')
        const newAddedUserRow = document.createElement('tr')
        newAddedUserRow.innerHTML = `<td>${newAddedUser.id}</td>
<td>${newAddedUser.firstName}</td>
<td>${newAddedUser.lastName}</td>
<td>${newAddedUser.age}</td>
<td>${newAddedUser.email}</td>
<td>${rolesString}</td>
<td><button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#editModal-${newAddedUser.id}">Edit</button></td>
<td><button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteModal-${newAddedUser.id}">Delete</button></td>`
        const usersTable = document.getElementById('users-table')
        usersTable.appendChild(newAddedUserRow)
        const usersTableTab = document.getElementById('users-table-tab-link')
        usersTableTab.click()
        console.log(newAddedUser)
    } else {
        throw new Error('Request failed with status: ' + response.status);
    }
})

const usersTable = document.getElementById('users-table')
usersTable.addEventListener('click', (event) => {
    if (event.target.matches('[id^="edit-modal-open-"]')) {
        console.log(event.target)
    }
})
