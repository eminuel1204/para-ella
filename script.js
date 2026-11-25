document.addEventListener('DOMContentLoaded', () => {
    // Fecha fija (30 días antes del 25 de noviembre de 2026): avanza igual en cualquier navegador o celular
    const fechaInicio = new Date('2026-10-26T01:40:00');

    // Referencias del DOM
    const sobre = document.getElementById('sobre');
    const pantallaSobre = document.getElementById('pantalla-sobre');
    const cartaContenedor = document.getElementById('carta-contenedor');
    const musica = document.getElementById('musica-fondo');
    const btnMusica = document.getElementById('btn-musica');
    const videos = document.querySelectorAll('video');

    let musicaSonando = false;

    
    sobre.addEventListener('click', () => {
        sobre.classList.add('abierto');

        musica.volume = 0.4;
        musica.play().then(() => {
            musicaSonando = true;
            btnMusica.classList.remove('oculto');
        }).catch(() => {
            btnMusica.classList.remove('oculto');
            btnMusica.textContent = '🔇';
        });

        setTimeout(() => {
            pantallaSobre.classList.add('desvanecer');
            cartaContenedor.classList.remove('oculto');
            document.body.style.alignItems = 'flex-start';
        }, 650);
    });

    
    btnMusica.addEventListener('click', () => {
        if (musicaSonando) {
            musica.pause();
            btnMusica.textContent = '🔇';
        } else {
            musica.play();
            btnMusica.textContent = '🎵';
        }
        musicaSonando = !musicaSonando;
    });

   
    videos.forEach(video => {
        video.addEventListener('play', () => {
            if (musicaSonando) {
                musica.pause();
                btnMusica.textContent = '🔇';
                musicaSonando = false;
            }
        });
    });

    function actualizarContador() {
        const ahora = new Date();
        const diferencia = Math.max(0, ahora - fechaInicio);

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diferencia / 1000 / 60) % 60);
        const segundos = Math.floor((diferencia / 1000) % 60);

        document.getElementById('dias').textContent = dias;
        document.getElementById('horas').textContent = horas.toString().padStart(2, '0');
        document.getElementById('minutos').textContent = minutos.toString().padStart(2, '0');
        document.getElementById('segundos').textContent = segundos.toString().padStart(2, '0');
    }

    setInterval(actualizarContador, 1000);
    actualizarContador();

    const btnAbrirEditor = document.getElementById('btn-abrir-editor');
    const cajaEditor = document.getElementById('caja-editor');
    const btnCancelarNota = document.getElementById('btn-cancelar-nota');
    const btnGuardarNota = document.getElementById('btn-guardar-nota');
    const inputNota = document.getElementById('input-nota');
    const listaNotas = document.getElementById('lista-notas');

    if (btnAbrirEditor && cajaEditor && inputNota && listaNotas) {
        let notasGuardadas = JSON.parse(localStorage.getItem('notasCarta')) || [];
        renderizarNotas();

        btnAbrirEditor.addEventListener('click', () => {
            cajaEditor.classList.remove('oculto');
            btnAbrirEditor.classList.add('oculto');
            inputNota.focus();
            cajaEditor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        btnCancelarNota.addEventListener('click', () => {
            cajaEditor.classList.add('oculto');
            btnAbrirEditor.classList.remove('oculto');
            inputNota.value = '';
        });

        btnGuardarNota.addEventListener('click', () => {
            const texto = inputNota.value.trim();
            if (!texto) return;

            const ahora = new Date();
            const fechaFormateada = ahora.toLocaleDateString('es-MX', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            notasGuardadas.unshift({
                id: Date.now(),
                fecha: fechaFormateada,
                texto: texto
            });

            localStorage.setItem('notasCarta', JSON.stringify(notasGuardadas));
            renderizarNotas();

            inputNota.value = '';
            cajaEditor.classList.add('oculto');
            btnAbrirEditor.classList.remove('oculto');
        });

        function renderizarNotas() {
            listaNotas.innerHTML = '';
            notasGuardadas.forEach(nota => {
                const div = document.createElement('div');
                div.className = 'nota-card';
                div.innerHTML = `
                    <button class="btn-borrar-nota" data-id="${nota.id}" title="Eliminar nota">✕</button>
                    <span class="nota-fecha">${nota.fecha}</span>
                    <p class="nota-texto"></p>
                `;
                div.querySelector('.nota-texto').textContent = nota.texto;
                listaNotas.appendChild(div);
            });

            document.querySelectorAll('.btn-borrar-nota').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = Number(e.target.getAttribute('data-id'));
                    notasGuardadas = notasGuardadas.filter(n => n.id !== id);
                    localStorage.setItem('notasCarta', JSON.stringify(notasGuardadas));
                    renderizarNotas();
                });
            });
        }
    }
});