let commonUserLink, adminLink
processLoginForm()

function processLoginForm() {
    const loginForm = document.getElementById('login-form')
    loginForm.addEventListener('submit', tryLogin)
}

async function tryLogin(loginFormEvent) {
    loginFormEvent.preventDefault()
    const loginForm = loginFormEvent.target
    console.log('tryLogin')
    const username = loginForm.querySelector('#username').value
    const password = loginForm.querySelector('#password').value
    const jsonData = {
        username: username,
        password: password
    }
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    // console.log(request)
    const response = await fetch('/login', request)
    const newHtml = await response.text()
    // console.log(newHtml)
    document.open()
    document.write(newHtml)
    document.close()
    loginForm.removeEventListener('submit', tryLogin)
    processAdminLink()
    processCommonUserLink()
    processLogout()
}

function processLogout() {
    const logoutLink = document.getElementById('logout')
    logoutLink.addEventListener('click', tryLogout)
}

async function tryLogout(logoutLinkEvent) {
    // console.log('tryLogout')
    // console.log(logoutLinkEvent)
    logoutLinkEvent.preventDefault()
    const logoutLink = logoutLinkEvent.target
    // console.log(logoutLink)
    const request = {
        method: 'POST'
    }
    const response = await fetch('/logout-custom', request)
    const newHtml = await response.text()
    // console.log('newHtml' + newHtml)
    commonUserLink.removeEventListener('click', tryCommonUser)
    logoutLink.removeEventListener('click', tryLogout)
    document.open()
    document.write(newHtml)
    document.close()
    processLoginForm()
}

function processAdminLink() {
    adminLink = document.getElementById('admin-link')
    adminLink.addEventListener('click', tryAdmin)
}

async function tryAdmin(adminLinkEvent) {
    adminLinkEvent.preventDefault()
    // adminLink = adminLinkEvent.target
    if (adminLink.classList.contains('inactive-sidebar-link')) {
        return
    }
    const request = {
        method: 'GET'
    }
    const response = await fetch('/admin', request)
    const newHtml = await response.text()
    console.log('newHtml' + newHtml)
    const main = document.getElementById('main')
    main.innerHTML = newHtml
    commonUserLink.classList.remove('bg-primary')
    commonUserLink.classList.remove('text-light')
    commonUserLink.classList.add('text-primary')
    commonUserLink.classList.remove('inactive-sidebar-link')
    commonUserLink.classList.remove('bg-primary')
    adminLink.classList.add('text-light')
    adminLink.classList.remove('text-primary')
    adminLink.classList.add('bg-primary')
    adminLink.classList.add('inactive-sidebar-link')

}

function processCommonUserLink() {
    commonUserLink = document.getElementById('common-user-link')
    commonUserLink.addEventListener('click', tryCommonUser)
}

async function tryCommonUser(commonUserLinkEvent) {
    commonUserLinkEvent.preventDefault()
    // commonUserLink = commonUserLinkEvent.target
    if (commonUserLink.classList.contains('inactive-sidebar-link')) {
        return
    }
    const request = {
        method: 'GET'
    }
    const response = await fetch('/common-user', request)
    const newHtml = await response.text()
    console.log('newHtml' + newHtml)
    const main = document.getElementById('main')
    main.innerHTML = newHtml
    adminLink.classList.remove('bg-primary')
    adminLink.classList.remove('text-light')
    adminLink.classList.add('text-primary')
    adminLink.classList.remove('inactive-sidebar-link')
    adminLink.classList.remove('bg-primary')
    commonUserLink.classList.add('text-light')
    commonUserLink.classList.remove('text-primary')
    commonUserLink.classList.add('bg-primary')
    commonUserLink.classList.add('inactive-sidebar-link')
}

function processNewUserForm() {
    const usersTable = document.getElementById('users-table')
    const usersTableTab = document.getElementById('users-table-tab-link')
    const newUserForm = document.getElementById('addNewUserForm')
    newUserForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const jsonData = getJsonFromForm(newUserForm)
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
}

function processEditUserForm() {
    editUserForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const jsonData = getJsonFromForm(editUserForm)
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
}

function getJsonFromForm(form) {
    const formData = new FormData(form)
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
    return jsonData
}

function processDeleteUserForm() {
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
}

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
    getRowValues(userRow)

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
    getRowValues(userRow)

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

function getRowValues(row) {
    oldFirstName = row.querySelector('.firstname')
    oldLastName = row.querySelector('.lastname')
    oldAge = row.querySelector('.age')
    oldEmail = row.querySelector('.email')
    oldRoleNames = row.querySelector('.roles')
}
