document.getElementById('add-turno-form').addEventListener('submit', function(event) {
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

    fetch('/agregar-turno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicio, hora })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.statusText);
        }
        return response.json();
    }).then(data => {
        alert(data.message);
        loadingIndicator.style.display = 'none';
    }).catch(error => {
        console.error('Error:', error);
        alert('Error al agregar el turno: ' + error.message);
        loadingIndicator.style.display = 'none';
    });
});
