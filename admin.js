document.getElementById('add-turno-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Validar entradas del formulario
    const servicio = document.getElementById('servicio').value;
    const hora = document.getElementById('hora').value;

    if (!servicio || !hora) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Mostrar indicador de carga
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.style.display = 'block';

    try {
        const response = await fetch('/agregar-turno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ servicio, hora })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en la respuesta del servidor.');
        }

        alert(data.message);
        actualizarTurnos(); // Nueva función para actualizar la lista
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el turno: ' + error.message);
    } finally {
        loadingIndicator.style.display = 'none';
    }
});

// Función para actualizar la lista de turnos en la UI
async function actualizarTurnos() {
    try {
        const response = await fetch('/obtener-turnos');
        const turnos = await response.json();
        
        const turnosContainer = document.getElementById('reservedAppointments');
        turnosContainer.innerHTML = ''; // Limpiar lista

        turnos.forEach(turno => {
            const div = document.createElement('div');
            div.textContent = `${turno.servicio} - ${turno.hora}`;
            turnosContainer.appendChild(div);
        });
    } catch (error) {
        console.error('Error al obtener turnos:', error);
    }
}

// Cargar turnos al iniciar
document.addEventListener("DOMContentLoaded", actualizarTurnos);
