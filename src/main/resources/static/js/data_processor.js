let currentUser
processLoginForm()

function processLoginForm() {
    $(document).off('submit', '#login-form').on('submit', '#login-form', async (loginFormEvent) => {
        const loginErrorMessage = $('#login-error-message')
        loginErrorMessage.text('')
        loginFormEvent.preventDefault()
        const jsonData = {
            username: $('#username').val(),
            password: $('#password').val()
        }
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
    $(document).off('click', '#logout').on('click', '#logout', async (logoutLinkEvent) => {
        logoutLinkEvent.preventDefault();
        const response = await fetch('/logout-custom', {method: 'POST'});
        const newHtml = await response.text();
        $('body').html(newHtml);
    })
}

function processAdminLink() {
    $(document).off('click', '#admin-link').on('click', '#admin-link', async (adminLinkEvent) => {
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
    $(document).off('click', '#common-user-link').on('click', '#common-user-link', async (commonUserLinkEvent) => {
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
    $(document).off('submit', '#new-user-form').on('submit', '#new-user-form', async (newUserFormEvent) => {
        newUserFormEvent.preventDefault();
        const usersTable = $('#users-table');
        const usersTableTab = $('#users-table-tab-link');
        const newUserForm = newUserFormEvent.target
        const jsonData = getJsonFromForm(newUserForm);
        let response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(jsonData)
        });
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
        } else {
            throw new Error('Request failed with status: ' + response.status);
        }
    })
}

function processUsersTable() {
    $(document).off('click', '#users-table').on('click', '#users-table', (usersTableEvent) => {
        if ($(usersTableEvent.target).is('[data-target="#editModal"]')) {
            fillEditUserForm(usersTableEvent);
        } else if ($(usersTableEvent.target).is('[data-target="#deleteModal"]')) {
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
    $(document).off('submit', '#edit-user-form').on('submit', '#edit-user-form', async (editUserFormEvent) => {
        editUserFormEvent.preventDefault();
        const editUserForm = editUserFormEvent.target
        const jsonData = getJsonFromForm(editUserForm);
        const editUserFormButtonClose = $(editUserForm).find('button.close');
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
    $(document).off('submit', '#delete-user-form').on('submit', '#delete-user-form', async (deleteUserFormEvent) => {
        deleteUserFormEvent.preventDefault()
        const deleteUserForm = $(deleteUserFormEvent.target)
        const id = deleteUserForm.find('[name="id"]').val();

        let response = await fetch('/api/users/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        if (response.ok) {
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
    return jsonData
}
