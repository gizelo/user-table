let users = []
let newUser = {}
const usersTable = document.querySelector('.users-table__body')
const userModal = document.querySelector('.modal-bg')
const userModalContent = document.querySelector('.newUserForm')
const userModalTitle = document.querySelector('.user-modal__header__title')
const userModalFooter = document.querySelector('.user-modal__footer')

function fillTable() {
    const templates = users.map((user, index) => createUser(index))
    usersTable.innerHTML = templates.join(' ')
}

function createUser(id) {
    return `
    <tr class="users-table__body__row">
        <td class="users-table__body__cell">
            <button onclick="viewUser(${id})"
                    class="btn"
            >
                <i class="far fa-eye"></i>
            </button>
        </td>
        <td class="users-table__body__cell">${users[id].name}</td>
        <td class="users-table__body__cell">${users[id].username}</td>
        <td class="users-table__body__cell">${users[id].email}</td>
        <td class="users-table__body__cell">${users[id].website}</td>
        <td class="users-table__body__cell">
            <button onclick="deleteUser(${id})"
                    class="btn"
            >
                <i class="fas fa-trash"></i>
            </button>
        </td>
    </tr>
    `
}

function sortUsers(field) {
    let sortFieldsIn = []
    users.forEach(el => {
        sortFieldsIn.push(el[field])
    })

    for (let i = 0; i < users.length; i++) {
        for (let j = i; j < users.length; j++) {
            if (users[i][field] > users[j][field]) {
                let t = users[i]
                users[i] = users[j]
                users[j] = t
            }
        }
    }

    let sortFieldsOut = []
    users.forEach(el => {
        sortFieldsOut.push(el[field])
    })

    for (let i = 0; i < sortFieldsOut.length; i++) {
        if (sortFieldsOut[i] !== sortFieldsIn[i]) {
            fillTable()
            return
        }
    }

    for (let i = 0; i < users.length; i++) {
        for (let j = i; j < users.length; j++) {
            if (users[i][field] < users[j][field]) {
                let t = users[i]
                users[i] = users[j]
                users[j] = t
            }
        }
    }
    fillTable()
}

function deleteUser(id) {
    let newUsers = []

    for (let i = 0; i < users.length; i++) {
        if (i !== id) {
            newUsers.push(users[i])
        }
    }

    users = newUsers
    fillTable()
}

function createNewUser() {
    for (const f in users[0]) {
        if (users[0].hasOwnProperty(f)) {
            newUser[f] = ''
        }
    }
}

// New user modal functions

function openNewUserModal() {
    for (const field in newUser) {
        newUser[field] = ''
    }

    let fields = []
    for (const field in newUser) {
        if (newUser.hasOwnProperty(field)) {
            if (field === 'id') {
                fields.push(`
                <div class="user-modal__content__field">
                    <span class="user-modal__content__field-name">${field}: </span>
                    <input type="number"
                           class="user-modal__content__field-input"
                    >
                </div>
                `)
            } else {
                fields.push(`
                <div class="user-modal__content__field">
                    <span class="user-modal__content__field-name">${field}: </span>
                    <input type="text"
                           class="user-modal__content__field-input"
                    >
                </div>
                `)
            }
        }
    }
    userModalContent.innerHTML = fields.join(' ')
    userModalTitle.textContent = 'New user'
    userModalFooter.style.display = 'block'
    userModal.style.display = 'block'
}

function saveUser() {
    let user = {}

    let i = 0
    for (const f in newUser) {
        if (userModalContent[i].value.trim() === '') {
            alert('Fill in all the fields, please')
            return
        }
        user[f] = userModalContent[i].value
        i++
    }
    users.push(user)
    fillTable()
    closeUserModal()
}

// View user modal functions

function viewUser(id) {
    let fields = []
    for (const field in users[id]) {
        if (users[id].hasOwnProperty(field)) {
            fields.push(createUserField(users[id][field], field))
        }
    }
    userModalContent.innerHTML = fields.join(' ')
    userModalTitle.textContent = `User #${id}`
    userModal.style.display = 'block'
}

function createUserField(field, fieldName, objectField) {
    if (typeof field === 'object') {
        const sectionStart = `
            <div class="user-modal__content__field">
                <p class="user-modal__content__field-text">
                    <span class="user-modal__content__field-name">${fieldName.toUpperCase()}: </span>
                </p>
            </div>
        `
        let fields = []

        for (const f in field) {
            if (field.hasOwnProperty(f)) {
                fields.push(createUserField(field[f], f, true))
            }
        }

        return sectionStart + fields.join(' ')
    }

    if (objectField) {
        return `
        <div class="user-modal__content__field">
            <p class="user-modal__content__field-text">
                <span class="user-modal__content__field-name">- ${fieldName}: </span>
                ${field}
            </p>
        </div>
    `
    } else {
        return `
        <div class="user-modal__content__field">
            <p class="user-modal__content__field-text">
                <span class="user-modal__content__field-name">${fieldName}: </span>
                ${field}
            </p>
        </div>
    `
    }
}

function closeUserModal() {
    userModalFooter.style.display = 'none'
    userModal.style.display = 'none'
}

userModal.style.display = 'none'
userModalFooter.style.display = 'none'

fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(json => {
        users = json
        createNewUser()
        fillTable()
    })