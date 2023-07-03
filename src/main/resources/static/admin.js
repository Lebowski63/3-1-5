let tableUsers = [];
let currentUser = "";
let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
let editModal = new bootstrap.Modal(document.getElementById('editModal'));
let request = new Request("http://localhost:8199/api/admin", {
    method: "GET",
    headers: {
        'Content-Type': 'application/json',
    },
});
getUsers()

function getUsers() {
    fetch(request).then(res =>
        res.json()).then(data => {
        tableUsers = [];
        if (data.length > 0) {
            data.forEach(user => {
                tableUsers.push(user)
            })
        } else {
            tableUsers = [];
        }

        showUsers(tableUsers);
    })
}

fetch("http://localhost:8199/api/admin/current").then(res => res.json())
    .then(data => {
        currentUser = data;
        console.log(data)
        showOneUser(currentUser);
    })

function showUsers(table) {
    let temp = "";
    table.forEach(user => {
        temp += "<tr>"
        temp += "<td>" + user.id + "</td>"
        temp += "<td>" + user.username + "</td>"
        temp += "<td>" + user.lastname + "</td>"
        temp += "<td>" + user.email + "</td>"
        temp += "<td>" + user.listRole.map(role => role.rolename.substring(5)) + "</td>"
        temp += "<td>" + `<a onclick='showEditModal(${user.id})' class="btn btn-outline-info" id="edit">Edit</a>` + "</td>"
        temp += "<td>" + `<a onclick='showDeleteModal(${user.id})' class="btn btn-outline-danger" id="delete">Delete</a>` + "</td>"
        temp += "</tr>"
        document.getElementById("allUsersBody").innerHTML = temp;
    })
}

function getRoles(list) {
    let userRoles = [];
    for (let role of list) {
        if (role == 2 || role.id == 2) {
            userRoles.push("USER");
        }
        if (role == 1 || role.id == 1) {
            userRoles.push("ADMIN");
        }
    }
    return userRoles.join(" , ");
}

function showOneUser(user) {
    let temp = "";
    temp += "<tr>"
    temp += "<td>" + user.id + "</td>"
    temp += "<td>" + user.username + "</td>"
    temp += "<td>" + user.lastname + "</td>"
    temp += "<td>" + user.email + "</td>"
    temp += "<td>" + user.listRole.map(role => role.rolename.substring(5)) + "</td>"
    temp += "</tr>"
    document.getElementById("oneUserBody").innerHTML = temp;
}

function rolesUser(event) {
    let rolesAdmin = {};
    let rolesUser = {};
    let roles = [];
    let allRoles = [];
    let sel = document.querySelector(event);
    for (let i = 0, n = sel.options.length; i < n; i++) {
        if (sel.options[i].selected) {
            roles.push(sel.options[i].value);
        }
    }
    if (roles.includes('2')) {
        rolesAdmin["id"] = 2;
        rolesAdmin["rolename"] = "ROLE_USER";
        allRoles.push(rolesAdmin);
    }
    if (roles.includes('1')) {
        rolesUser["id"] = 1;
        rolesUser["rolename"] = "ROLE_ADMIN";
        allRoles.push(rolesUser);
    }
    return allRoles;
}

document.getElementById('newUser').addEventListener('submit', addNewUser);

function addNewUser(form) {
    form.preventDefault();
    let newUserForm = new FormData(form.target);
    let user = {
        id: null,
        username: newUserForm.get('username'),
        lastname: newUserForm.get('lastname'),
        email: newUserForm.get('email'),
        password: newUserForm.get('password'),
        listRole: rolesUser("#listRole")
    };

    let req = new Request("http://localhost:8199/api/admin", {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    fetch(req).then(() => getUsers())
    form.target.reset();
    const triggerE1 = document.querySelector('#v-pills-tabContent button[data-bs-target="#nav-home"]');
    bootstrap.Tab.getInstance(triggerE1).show()
}

function showDeleteModal(id) {
    document.getElementById('closeDeleteModal').setAttribute('onclick', () => {
        deleteModal.hide();
        document.getElementById('deleteUser').reset();
    });

    let request = new Request("http://localhost:8199/api/admin/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    fetch(request).then(res => res.json()).then(deleteUser => {
            console.log(deleteUser);
            document.getElementById('idDel').setAttribute('value', deleteUser.id);
            document.getElementById('firstNameDel').setAttribute('value', deleteUser.username);
            document.getElementById('lastNameDel').setAttribute('value', deleteUser.lastname);
            document.getElementById('emailDel').setAttribute('value', deleteUser.email);
            document.getElementById('passwordDel').setAttribute('value', deleteUser.password);
            if (getRoles(deleteUser.listRole).includes("ADMIN") && getRoles(deleteUser.listRole).includes("USER")) {
                document.getElementById('rolesDel1').setAttribute('selected', 'true');
                document.getElementById('rolesDel2').setAttribute('selected', 'true');
            } else if (getRoles(deleteUser.listRole).includes("ADMIN")) {
                document.getElementById('rolesDel1').setAttribute('selected', 'true');
            } else if (getRoles(deleteUser.listRole).includes("USER")) {
                document.getElementById('rolesDel2').setAttribute('selected', 'true');
            }
            deleteModal.show();
        }
    );
    var isDelete = false;
    document.getElementById('deleteUser').addEventListener('submit', event => {
        event.preventDefault();
        if (!isDelete) {
            isDelete = true;
            let request = new Request("http://localhost:8199/api/admin/" + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetch(request).then(() => {
                getUsers();
            });
            document.getElementById('deleteUser').reset();
        }

        deleteModal.hide();
    });
}

function showEditModal(id) {
    let request = new Request("http://localhost:8199/api/admin/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request).then(res => res.json()).then(editUser => {
            document.getElementById('idRed').setAttribute('value', editUser.id);
            document.getElementById('firstNameRed').setAttribute('value', editUser.username);
            document.getElementById('lastNameRed').setAttribute('value', editUser.lastname);
            document.getElementById('emailRed').setAttribute('value', editUser.email);
            document.getElementById('passwordRed').setAttribute('value', editUser.password);
            if ((editUser.listRole.map(role => role.id)) === 1 && ((editUser.listRole.map(role => role.id)) === 2)) {
                document.getElementById('rolesRed2').setAttribute('selected', 'true');
                document.getElementById('rolesRed1').setAttribute('selected', 'true');
            } else if ((editUser.listRole.map(role => role.id)) === 1) {
                document.getElementById('rolesRed2').setAttribute('selected', 'true');
            } else if (editUser.listRole.map(role => role.id) === 2) {
                document.getElementById('rolesRed1').setAttribute('selected', 'true');
            }
            console.log(editUser)
            editModal.show();
        }
    );

    document.getElementById('editUser').addEventListener('submit', submitFormEditUser);
}

function submitFormEditUser(event) {
    event.preventDefault();
    let redUserForm = new FormData(event.target);
    let user = {
        id: redUserForm.get('id'),
        username: redUserForm.get('username'),
        lastname: redUserForm.get('lastname'),
        email: redUserForm.get('email'),
        password: redUserForm.get('password'),
        listRole: rolesUser("#rolesRed")
    }
    console.log(user);
    let request = new Request("http://localhost:8199/api/admin", {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request).then(
        function (response) {
            console.log(response)
            getUsers();
            event.target.reset();
            editModal.hide();
        });
}
