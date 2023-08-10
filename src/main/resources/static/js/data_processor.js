processLoginForm()

function processLoginForm() {
    $(document).on('submit', '#login-form', async (loginFormEvent) => {
        loginFormEvent.preventDefault()
        // console.log('tryLogin');
        const jsonData = {
            username: $('#username').val(),
            password: $('#password').val()
        }
        // console.log(jsonData)
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        const newHtml = await response.text()
        $('body').html(newHtml)
        processAdminLink()
        processCommonUserLink()
        processNewUserForm()
        processUsersTable()
        processLogout()
    })
}

function processLogout() {
    $(document).on('click', '#logout', async (logoutLinkEvent) => {
        logoutLinkEvent.preventDefault();
        const response = await fetch('/logout-custom', {method: 'POST'});
        const newHtml = await response.text();
        $('body').html(newHtml);
    })
}

function processAdminLink() {
    $(document).on('click', '#admin-link', async (adminLinkEvent) => {
        console.log('processAdminLink');
        adminLinkEvent.preventDefault();
        const adminLink = $(adminLinkEvent.target);
        if (adminLink.hasClass('inactive-sidebar-link')) {
            return;
        }
        const response = await fetch('/admin', {method: 'GET'});
        const newHtml = await response.text();
        document.title = 'Admin Page';
        $('#main').html(newHtml);
        $('#common-user-link').removeClass('bg-primary text-light inactive-sidebar-link').addClass('text-primary');
        adminLink.removeClass('text-primary').addClass('bg-primary inactive-sidebar-link text-light');
    })
}

function processCommonUserLink() {
    $(document).on('click', '#common-user-link', async (commonUserLinkEvent) => {
        commonUserLinkEvent.preventDefault();
        const commonUserLink = $(commonUserLinkEvent.target);
        if (commonUserLink.hasClass('inactive-sidebar-link')) {
            return;
        }
        const response = await fetch('/common-user', {method: 'GET'});
        const newHtml = await response.text();
        document.title = 'Common User Page';
        $('#main').html(newHtml);
        $('#admin-link').removeClass('bg-primary text-light inactive-sidebar-link').addClass('text-primary');
        commonUserLink.removeClass('text-primary').addClass('bg-primary inactive-sidebar-link text-light');
    })
}

function processNewUserForm() {
    $(document).on('submit', '#new-user-form', tryNewUser)
    console.log('processNewUserForm')
}

async function tryNewUser(newUserFormEvent) {
    newUserFormEvent.preventDefault();
    console.log('tryNewUser');
    const usersTable = $('#users-table');
    const usersTableTab = $('#users-table-tab-link');
    const newUserForm = newUserFormEvent.target
    const jsonData = getJsonFromForm(newUserForm);
    console.log(jsonData);
    let response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(jsonData)
    });
    console.log(response);
    if (response.ok) {
        const newAddedUser = await response.json();
        const rolesString = newAddedUser.roles.map(role => role.name.replace('ROLE_', '')).join(' ');
        const newAddedUserRow = $('<tr></tr>');
        newAddedUserRow.html(`<td class="id">${newAddedUser.id}</td>
<td class="firstname">${newAddedUser.firstName}</td>
<td class="lastname">${newAddedUser.lastName}</td>
<td class="age">${newAddedUser.age}</td>
<td class="email">${newAddedUser.email}</td>
<td class="roles">${rolesString}</td>
<td><button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#editModal">Edit</button></td>
<td><button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteModal">Delete</button></td>`);
        usersTable.append(newAddedUserRow);
        usersTableTab.click();
        console.log(newAddedUser);
    } else {
        throw new Error('Request failed with status: ' + response.status);
    }
}

function processUsersTable() {
    $(document).on('click', '#users-table', (clickEvent) => {
        if ($(clickEvent.target).is('[data-target="#editModal"]')) {
            editUser(clickEvent);
        } else if ($(clickEvent.target).is('[data-target="#deleteModal"]')) {
            deleteUser(clickEvent);
        }
    })
}

let oldFirstName, oldLastName, oldAge, oldEmail, oldRoleNames;
const editUserForm = $('#edit-form');
const editFormButtonClose = editUserForm.find('button.close');
const deleteUserForm = $('#delete-form');
const deleteFormButtonClose = deleteUserForm.find('button.close');


function processEditUserForm() {
    editUserForm.on('submit', async (e) => {
        e.preventDefault();
        const jsonData = getJsonFromForm(editUserForm);
        console.log(jsonData);
        let response = await fetch('/api/users', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(jsonData)
        });
        if (response.ok) {
            const editedUser = await response.json();
            const rolesString = editedUser.roles.map(role => role.name.replace('ROLE_', '')).join(' ');
            oldFirstName.text(editedUser.firstName);
            oldLastName.text(editedUser.lastName);
            oldAge.text(editedUser.age);
            oldEmail.text(editedUser.email);
            oldRoleNames.text(rolesString);
            console.log(editedUser);
            editFormButtonClose.click();
        } else {
            throw new Error('Request failed with status: ' + response.status);
        }
    });
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

//
// function processDeleteUserForm() {
//     deleteUserForm.addEventListener('submit', async (event) => {
//         event.preventDefault()
//         // const formData = new FormData(deleteUserForm)
//         console.log(event.target.closest('form'))
//         const id = event.target.closest('form').querySelector('[name="id"]').value
//         console.log(id)
//
//         let response = await fetch('/api/users/' + id, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json;charset=utf-8'
//             }
//         })
//         if (response.ok) {
//             console.log(response)
//             deleteFormButtonClose.click()
//             const rows = usersTable.querySelectorAll('tbody tr')
//             console.log(rows)
//
//             rows.forEach(row => {
//                 if (row.querySelector('td.id').innerText === id) {
//                     row.remove()
//                     return
//                 }
//             })
//             // const deletedUser = await response.json();
//             // console.log(deletedUser)
//         } else {
//             throw new Error('Request failed with status: ' + response.status);
//         }
//     })
// }
//
// function editUser(event) {
//     const userRow = event.target.closest('tr')
//     const id = userRow.querySelector('.id').innerText
//     const editIdField = editUserForm.querySelector('[name="id"]')
//     const editFirstNameField = editUserForm.querySelector('[name="firstName"]')
//     const editLastNameField = editUserForm.querySelector('[name="lastName"]')
//     const editAgeField = editUserForm.querySelector('[name="age"]')
//     const editEmailField = editUserForm.querySelector('[name="email"]')
//     const editPasswordField = editUserForm.querySelector('[name="password"]')
//     const roleOptions = editUserForm.querySelectorAll('[name="roles"] option')
//     editIdField.value = editFirstNameField.value = editLastNameField.value = editAgeField.value = editEmailField.value = editPasswordField.value = ''
//     getRowValues(userRow)
//
//     editIdField.value = id
//     editFirstNameField.value = oldFirstName.innerText
//     editLastNameField.value = oldLastName.innerText
//     editAgeField.value = oldAge.innerText
//     editEmailField.value = oldEmail.innerText
//
//     roleOptions.forEach(roleOption => {
//         roleOption.selected = false
//         oldRoleNames.innerText.split(' ').forEach(roleName => {
//             if (roleOption.innerText === roleName) {
//                 roleOption.selected = true
//             }
//         })
//     })
// }
//
// function deleteUser(event) {
//     const userRow = event.target.closest('tr')
//     const id = userRow.querySelector('.id').innerText
//     getRowValues(userRow)
//
//     const deleteIdField = deleteUserForm.querySelector('[name="id"]')
//     const deleteFirstNameField = deleteUserForm.querySelector('[name="firstName"]')
//     const deleteLastNameField = deleteUserForm.querySelector('[name="lastName"]')
//     const deleteAgeField = deleteUserForm.querySelector('[name="age"]')
//     const deleteEmailField = deleteUserForm.querySelector('[name="email"]')
//     const deleteRoleField = deleteUserForm.querySelector('[name="roles"]')
//     deleteIdField.value = deleteFirstNameField.value = deleteLastNameField.value = deleteAgeField.value = deleteEmailField.value = ''
//     deleteRoleField.innerHTML = ''
//
//     deleteIdField.value = id
//     deleteFirstNameField.value = oldFirstName.innerText
//     deleteLastNameField.value = oldLastName.innerText
//     deleteAgeField.value = oldAge.innerText
//     deleteEmailField.value = oldEmail.innerText
//     oldRoleNames.innerText.split(' ').forEach(roleName => {
//         const option = document.createElement("option")
//         option.value = 'ROLE_' + roleName
//         option.innerText = roleName
//         deleteRoleField.appendChild(option)
//     })
//     deleteRoleField.size = oldRoleNames.innerText.split(' ').length
// }
//
// function getRowValues(row) {
//     oldFirstName = row.querySelector('.firstname')
//     oldLastName = row.querySelector('.lastname')
//     oldAge = row.querySelector('.age')
//     oldEmail = row.querySelector('.email')
//     oldRoleNames = row.querySelector('.roles')
// }
