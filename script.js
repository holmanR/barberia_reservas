async function showAvailableAppointments() {
    try {
        const response = await fetch('/turnos');
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        const appointments = await response.json();
        const availableDiv = document.getElementById('availableAppointments');
        availableDiv.innerHTML = ''; // Limpiar contenido anterior

        if (appointments.length > 0) {
            availableDiv.innerHTML = appointments.map(appointment => `
                ${appointment.hora} 
                <button onclick="reserveAppointment(${appointment.id})">Reservar Turno</button>
                <br>
            `).join('');
        } else {
            availableDiv.textContent = 'No hay turnos disponibles.';
        }
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
        document.getElementById('availableAppointments').textContent = 'Error al cargar los turnos. Inténtalo de nuevo más tarde.';
    }
}

async function reserveAppointment(id) {
    try {
        const response = await fetch('/reservar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        const data = await response.json();
        alert(data.message);
        showAvailableAppointments(); // Actualizar la lista de turnos disponibles
    } catch (error) {
        console.error('Error al reservar turno:', error);
        alert('Error al reservar el turno. Inténtalo de nuevo.');
    }
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', showAvailableAppointments);
