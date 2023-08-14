let currentUser
processLoginForm()

function processLoginForm() {
    $(document).on('submit', '#login-form', async (loginFormEvent) => {
        const loginErrorMessage = $('#login-error-message')
        loginErrorMessage.text('')
        loginFormEvent.preventDefault()
        // console.log('tryLogin');
        const jsonData = {
            username: $('#username').val(),
            password: $('#password').val()
        }
        console.log(jsonData)
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        if (response.ok) {
            response.json().then(jsonData => {
                const newHtml = jsonData.html
                currentUser = jsonData.user
                console.log(currentUser);
                $('body').html(newHtml)
            })
        } else {
            loginErrorMessage.text('Неправильное имя пользователя или пароль')
        }
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
    $(document).on('submit', '#new-user-form', async (newUserFormEvent) => {
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
            const rolesString = newAddedUser.roles.map(role => role.name).join(' ');
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
    })
    console.log('processNewUserForm')
}

function processUsersTable() {
    $(document).on('click', '#users-table', (usersTableEvent) => {
        if ($(usersTableEvent.target).is('[data-target="#editModal"]')) {
            console.log('fillEditUserForm(usersTableEvent)')
            fillEditUserForm(usersTableEvent);
        } else if ($(usersTableEvent.target).is('[data-target="#deleteModal"]')) {
            console.log('fillDeleteUserForm(usersTableEvent)')
            fillDeleteUserForm(usersTableEvent);
        }
    })
}

function fillEditUserForm(usersTableEvent) {
    const editUserForm = $('#edit-user-form');
    const userRow = $(usersTableEvent.target).closest('tr');

    const id = userRow.find('.id').text();
    const editIdField = editUserForm.find('[name="id"]');
    const editFirstNameField = editUserForm.find('[name="firstName"]');
    const editLastNameField = editUserForm.find('[name="lastName"]');
    const editAgeField = editUserForm.find('[name="age"]');
    const editEmailField = editUserForm.find('[name="email"]');
    const editPasswordField = editUserForm.find('[name="password"]');
    const roleOptions = editUserForm.find('[name="roles"] option');

    editIdField.add(editFirstNameField).add(editLastNameField).add(editAgeField).add(editEmailField).add(editPasswordField).val('')
    roleOptions.prop('selected', false);

    editIdField.val(id);
    editFirstNameField.val(userRow.find('.firstname').text());
    editLastNameField.val(userRow.find('.lastname').text());
    editAgeField.val(userRow.find('.age').text());
    editEmailField.val(userRow.find('.email').text());


    userRow.find('.roles').text().split(' ').forEach(function (roleName) {
        roleOptions.each(function () {
            if ($(this).text() === roleName) {
                $(this).prop('selected', true);
            }
        });
    });
    processEditUserForm(userRow)
}

function processEditUserForm(userRow) {
    $(document).on('submit', '#edit-user-form', async (editUserFormEvent) => {
        editUserFormEvent.preventDefault();
        const editUserForm = editUserFormEvent.target
        console.log(editUserForm)
        const jsonData = getJsonFromForm(editUserForm);
        const editUserFormButtonClose = $(editUserForm).find('button.close');
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
            const rolesString = editedUser.roles.map(role => role.name).join(' ');
            userRow.find('.firstname').text(editedUser.firstName);
            userRow.find('.lastname').text(editedUser.lastName);
            userRow.find('.age').text(editedUser.age);
            userRow.find('.email').text(editedUser.email);
            userRow.find('.roles').text(rolesString);
            console.log(editedUser);
            editUserFormButtonClose.click();
        } else {
            throw new Error('Request failed with status: ' + response.status);
        }
    });
}

function fillDeleteUserForm(usersTableEvent) {
    const deleteUserForm = $('#delete-user-form');
    const userRow = $(usersTableEvent.target).closest('tr');

    const id = userRow.find('.id').text();
    const deleteIdField = deleteUserForm.find('[name="id"]');
    const deleteFirstNameField = deleteUserForm.find('[name="firstName"]')
    const deleteLastNameField = deleteUserForm.find('[name="lastName"]')
    const deleteAgeField = deleteUserForm.find('[name="age"]')
    const deleteEmailField = deleteUserForm.find('[name="email"]')
    const deleteRoleField = deleteUserForm.find('[name="roles"]');

    deleteIdField.add(deleteFirstNameField).add(deleteLastNameField).add(deleteAgeField).add(deleteEmailField).val('')
    deleteRoleField.empty();

    deleteIdField.val(id)
    deleteFirstNameField.val(userRow.find('.firstname').text());
    deleteLastNameField.val(userRow.find('.lastname').text());
    deleteAgeField.val(userRow.find('.age').text());
    deleteEmailField.val(userRow.find('.email').text());

    const roleNames = userRow.find('.roles').text().split(/\s+/)
    roleNames.forEach(function (roleName) {
        const option = $('<option>', {value: roleName, text: roleName});
        deleteRoleField.append(option);
    });
    deleteRoleField.prop('size', roleNames.length)
    processDeleteUserForm(userRow)
}


function processDeleteUserForm(userRow) {
    $(document).on('submit', '#delete-user-form', async (deleteUserFormEvent) => {
        const deleteUserForm = deleteUserFormEvent.target
        deleteUserFormEvent.preventDefault()
        const id = deleteUserForm.find('[name="id"]').val();
        console.log(id)

        let response = await fetch('/api/users/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        if (response.ok) {
            console.log(response)
            const deleteFormButtonClose = deleteUserForm.find('button.close');
            deleteFormButtonClose.click()
            userRow.remove()
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
