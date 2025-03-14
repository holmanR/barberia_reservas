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
    }).then(response => response.json())
      .then(data => {
          alert(data.message);
          // Ocultar indicador de carga
          loadingIndicator.style.display = 'none';
      }).catch(error => {
          console.error('Error:', error);
          alert('Error al agregar el turno. Inténtalo de nuevo.');
          loadingIndicator.style.display = 'none';
      });
});
