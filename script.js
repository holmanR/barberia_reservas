function showAvailableAppointments() {
    fetch('/turnos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la red: ${response.statusText}`);
            }
            return response.json();
        })
        .then(appointments => {
            const availableDiv = document.getElementById('availableAppointments');
            availableDiv.innerHTML = ''; // Limpiar contenido anterior

            if (appointments.length > 0) {
                appointments.forEach(appointment => {
                    availableDiv.innerHTML += `
                        <p>${appointment.servicio} - ${appointment.hora} 
                        <button onclick="reserveAppointment(${appointment.id})">Reservar</button></p>
                    `;
                });
            } else {
                availableDiv.innerHTML = '<p>No hay turnos disponibles.</p>';
            }
        })
        .catch(error => {
            console.error('Error al obtener turnos:', error);
            document.getElementById('availableAppointments').innerHTML = '<p>Error al cargar los turnos.</p>';
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
        showAvailableAppointments(); // Recargar la lista de turnos
    })
    .catch(error => {
        console.error('Error al reservar turno:', error);
        alert('Error al reservar el turno.');
    });
}

// Cargar turnos al iniciar la página
document.addEventListener('DOMContentLoaded', showAvailableAppointments);
