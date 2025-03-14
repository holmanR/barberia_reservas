document.getElementById('add-turno-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const servicio = document.getElementById('servicio').value;
    const hora = document.getElementById('hora').value;

    if (!servicio || !hora) {
        alert('⚠️ Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await fetch('/agregar-turno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ servicio, hora })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en la respuesta del servidor.');
        }

        alert('✅ ' + data.message);
        actualizarTurnos();
    } catch (error) {
        console.error('❌ Error:', error);
        alert('⚠️ Error al agregar el turno.');
    }
});

// Función para actualizar la lista de turnos
async function actualizarTurnos() {
    try {
        const response = await fetch('/admin-turnos');
        const turnos = await response.json();

        const turnosContainer = document.getElementById('reservedAppointments');
        turnosContainer.innerHTML = ''; // Limpiar lista

        turnos.forEach(turno => {
            const div = document.createElement('div');
            div.classList.add('turno-item');
            div.innerHTML = `
                <p>${turno.servicio} - ${turno.hora} ${turno.reservado ? '🟢 (Reservado)' : '🔴 (Disponible)'}</p>
                <button class="delete-btn" onclick="eliminarTurno(${turno.id})">❌ Eliminar</button>
            `;
            turnosContainer.appendChild(div);
        });
    } catch (error) {
        console.error('❌ Error al obtener turnos:', error);
    }
}

// Función para eliminar un turno
async function eliminarTurno(id) {
    if (!confirm('⚠️ ¿Seguro que deseas eliminar este turno?')) return;

    try {
        const response = await fetch(`/eliminar-turno/${id}`, { method: 'DELETE' });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al eliminar turno.');
        }

        alert('✅ ' + data.message);
        actualizarTurnos();
    } catch (error) {
        console.error('❌ Error:', error);
        alert('⚠️ Error al eliminar el turno.');
    }
}

// Cargar turnos al iniciar
document.addEventListener("DOMContentLoaded", actualizarTurnos);
