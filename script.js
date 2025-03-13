function showAvailableAppointments(service) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || {};

    const availableAppointments = appointments[service] || [];
    const availableDiv = document.getElementById('availableAppointments');
    availableDiv.innerHTML = ''; // Clear previous content
    if (availableAppointments.length > 0) {
        availableAppointments.forEach((appointment) => {
            availableDiv.innerHTML += `
                ${appointment} <button onclick="window.location.href='turnos.html?service=${service}'">Reservar Turno</button><br>
            `;
        });
    } else {
        availableDiv.innerHTML = 'No hay turnos disponibles.';
    }






}

function closeModal() {
    document.getElementById('appointmentsModal').style.display = 'none';
}
