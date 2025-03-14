function showAvailableAppointments() {
    fetch('/turnos')
        .then(response => response.json())
        .then(appointments => {
            const availableDiv = document.getElementById('availableAppointments');
            availableDiv.innerHTML = ''; // Limpiar contenido anterior
            if (appointments.length > 0) {
                appointments.forEach((appointment) => {
                    availableDiv.innerHTML += `
                        ${appointment.hora} <button onclick="reserveAppointment(${appointment.id})">Reservar Turno</button><br>
                    `;
                });
            } else {
                availableDiv.innerHTML = 'No hay turnos disponibles.';
            }
        })
        .catch(error => {
            console.error('Error fetching appointments:', error);
        });
}

function reserveAppointment(id) {
    fetch('/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        showAvailableAppointments(); // Actualizar la lista de turnos disponibles
    })
    .catch(error => {
        console.error('Error reserving appointment:', error);
        alert('Error al reservar el turno. Inténtalo de nuevo.');
    });
}

// Llamar a la función para mostrar los turnos disponibles al cargar la página
document.addEventListener('DOMContentLoaded', showAvailableAppointments);
