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
        newAddedUserRow.innerHTML = `<td>${newAddedUser.id}</td>
<td>${newAddedUser.firstName}</td>
<td>${newAddedUser.lastName}</td>
<td>${newAddedUser.age}</td>
<td>${newAddedUser.email}</td>
<td>${rolesString}</td>
<td><button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#editModal-${newAddedUser.id}">Edit</button></td>
<td><button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteModal-${newAddedUser.id}">Delete</button></td>`
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
usersTable.addEventListener('click', (event) => {
    if (event.target.matches('[id^="edit-modal-open-"]')) {
        const userRow = event.target.closest('tr')
        const id = userRow.querySelector('[data-field="id"]').innerText
        const editIdField = editUserForm.querySelector('[name="id"]')
        const editFirstNameField = editUserForm.querySelector('[name="firstName"]')
        const editLastNameField = editUserForm.querySelector('[name="lastName"]')
        const editAgeField = editUserForm.querySelector('[name="age"]')
        const editEmailField = editUserForm.querySelector('[name="email"]')
        const editPasswordField = editUserForm.querySelector('[name="password"]')
        const roleOptions = editUserForm.querySelectorAll('#editmodal-roles option')
        editIdField.value = editFirstNameField.value = editLastNameField.value = editAgeField.value = editEmailField.value = editPasswordField.value = ''

        // oldFirstName = userRow.querySelector('[data-field="firstname"]').innerText
        oldFirstName = userRow.querySelector('[data-field="firstname"]')
        oldLastName = userRow.querySelector('[data-field="lastname"]')
        oldAge = userRow.querySelector('[data-field="age"]')
        oldEmail = userRow.querySelector('[data-field="email"]')
        oldRoleNames = userRow.querySelector('[data-field="roles"]')

        editIdField.value = id
        // editFirstNameField.value = oldFirstName
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
