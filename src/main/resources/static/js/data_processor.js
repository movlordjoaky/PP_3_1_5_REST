const usersTable = document.getElementById('users-table')
const usersTableTab = document.getElementById('users-table-tab-link')
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
    let response = await fetch('/api/users', {
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
        newAddedUserRow.innerHTML = `<td class="id">${newAddedUser.id}</td>
<td class="firstname">${newAddedUser.firstName}</td>
<td class="lastname">${newAddedUser.lastName}</td>
<td class="age">${newAddedUser.age}</td>
<td class="email">${newAddedUser.email}</td>
<td class="roles">${rolesString}</td>
<td><button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#editModal">Edit</button></td>
<td><button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteModal">Delete</button></td>`
        usersTable.appendChild(newAddedUserRow)
        usersTableTab.click()
        console.log(newAddedUser)
    } else {
        throw new Error('Request failed with status: ' + response.status);
    }
})

let oldFirstName, oldLastName, oldAge, oldEmail, oldRoleNames
const editUserForm = document.getElementById('edit-form')
const editFormButtonClose = editUserForm.querySelector('button.close')
const deleteUserForm = document.getElementById('delete-form')
const deleteFormButtonClose = deleteUserForm.querySelector('button.close')
usersTable.addEventListener('click', (event) => {
    if (event.target.matches('[data-target="#editModal"]')) {
        editUser(event)
    } else if (event.target.matches('[data-target="#deleteModal"]')) {
        deleteUser(event)
    }
})
editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(editUserForm)
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
    console.log(jsonData)
    let response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(jsonData)
    })
    if (response.ok) {
        const editedUser = await response.json();
        const rolesString = editedUser.roles.map(role => role.name.replace('ROLE_', '')).join(' ')
        oldFirstName.innerText = editedUser.firstName
        oldLastName.innerText = editedUser.lastName
        oldAge.innerText = editedUser.age
        oldEmail.innerText = editedUser.email
        oldRoleNames.innerText = rolesString
        console.log(editedUser)
        editFormButtonClose.click()
    } else {
        throw new Error('Request failed with status: ' + response.status);
    }
})
deleteUserForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    // const formData = new FormData(deleteUserForm)
    console.log(event.target.closest('form'))
    const id = event.target.closest('form').querySelector('[name="id"]').value
    console.log(id)

    let response = await fetch('/api/users/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
    if (response.ok) {
        console.log(response)
        deleteFormButtonClose.click()
        const rows = usersTable.querySelectorAll('tbody tr')
        console.log(rows)

        rows.forEach(row => {
            if (row.querySelector('td.id').innerText === id) {
                row.remove()
                return
            }
        })
        // const deletedUser = await response.json();
        // console.log(deletedUser)
    } else {
        throw new Error('Request failed with status: ' + response.status);
    }
})

function editUser(event) {
    const userRow = event.target.closest('tr')
    const id = userRow.querySelector('.id').innerText
    const editIdField = editUserForm.querySelector('[name="id"]')
    const editFirstNameField = editUserForm.querySelector('[name="firstName"]')
    const editLastNameField = editUserForm.querySelector('[name="lastName"]')
    const editAgeField = editUserForm.querySelector('[name="age"]')
    const editEmailField = editUserForm.querySelector('[name="email"]')
    const editPasswordField = editUserForm.querySelector('[name="password"]')
    const roleOptions = editUserForm.querySelectorAll('[name="roles"] option')
    editIdField.value = editFirstNameField.value = editLastNameField.value = editAgeField.value = editEmailField.value = editPasswordField.value = ''

    oldFirstName = userRow.querySelector('.firstname')
    oldLastName = userRow.querySelector('.lastname')
    oldAge = userRow.querySelector('.age')
    oldEmail = userRow.querySelector('.email')
    oldRoleNames = userRow.querySelector('.roles')

    editIdField.value = id
    editFirstNameField.value = oldFirstName.innerText
    editLastNameField.value = oldLastName.innerText
    editAgeField.value = oldAge.innerText
    editEmailField.value = oldEmail.innerText

    roleOptions.forEach(roleOption => {
        roleOption.selected = false
        oldRoleNames.innerText.split(' ').forEach(roleName => {
            if (roleOption.innerText === roleName) {
                roleOption.selected = true
            }
        })
    })
}


function deleteUser(event) {
    const userRow = event.target.closest('tr')
    const id = userRow.querySelector('.id').innerText
    oldFirstName = userRow.querySelector('.firstname')
    oldLastName = userRow.querySelector('.lastname')
    oldAge = userRow.querySelector('.age')
    oldEmail = userRow.querySelector('.email')
    oldRoleNames = userRow.querySelector('.roles')

    const deleteIdField = deleteUserForm.querySelector('[name="id"]')
    const deleteFirstNameField = deleteUserForm.querySelector('[name="firstName"]')
    const deleteLastNameField = deleteUserForm.querySelector('[name="lastName"]')
    const deleteAgeField = deleteUserForm.querySelector('[name="age"]')
    const deleteEmailField = deleteUserForm.querySelector('[name="email"]')
    const deleteRoleField = deleteUserForm.querySelector('[name="roles"]')
    deleteIdField.value = deleteFirstNameField.value = deleteLastNameField.value = deleteAgeField.value = deleteEmailField.value = ''
    deleteRoleField.innerHTML = ''

    deleteIdField.value = id
    deleteFirstNameField.value = oldFirstName.innerText
    deleteLastNameField.value = oldLastName.innerText
    deleteAgeField.value = oldAge.innerText
    deleteEmailField.value = oldEmail.innerText
    oldRoleNames.innerText.split(' ').forEach(roleName => {
        const option = document.createElement("option")
        option.value = 'ROLE_' + roleName
        option.innerText = roleName
        deleteRoleField.appendChild(option)
    })
    deleteRoleField.size = oldRoleNames.innerText.split(' ').length
}
