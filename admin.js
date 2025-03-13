document.getElementById('add-turno-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Validate form inputs
    const servicio = document.getElementById('servicio').value;
    const hora = document.getElementById('hora').value;

    if (!servicio || !hora) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Show loading indicator
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.style.display = 'block';

    fetch('/agregar-turno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicio, hora })
    }).then(response => response.json())
      .then(data => {
          alert(data.message);
          // Hide loading indicator
          loadingIndicator.style.display = 'none';
      });
});
