document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userTableBody = document.getElementById('userTableBody');

    // Función para obtener los usuarios
    const fetchUsers = async () => {
        const res = await fetch('/users');
        const users = await res.json();
        renderUsers(users);
    };

    // Función para renderizar los usuarios en la tabla
    const renderUsers = (users) => {
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button class="update" data-id="${user.id}">Actualizar</button>
                    <button class="delete" data-id="${user.id}">Eliminar</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    };

    // Agregar usuario
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(userForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email')
        };

        await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        fetchUsers();
        userForm.reset();
    });

    // Actualizar o eliminar usuario
    userTableBody.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains('delete')) {
            await fetch(`/users/${id}`, {
                method: 'DELETE'
            });
            fetchUsers();
        }

        if (e.target.classList.contains('update')) {
            const newName = prompt('Nuevo nombre:');
            const newEmail = prompt('Nuevo email:');
            if (newName && newEmail) {
                await fetch(`/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: newName, email: newEmail })
                });
                fetchUsers();
            }
        }
    });

    // Inicializar tabla con usuarios
    fetchUsers();
});
