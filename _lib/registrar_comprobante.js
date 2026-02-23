const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const btnSnap = document.getElementById('btn-snap');
const fileInput = document.getElementById('file-input');
const btnUpload = document.getElementById('btn-upload');
const btnRegistrar = document.getElementById('btn-registrar');
const previewContainer = document.getElementById('preview-container');
const imgPreview = document.getElementById('img-preview');
const btnRemove = document.getElementById('btn-remove-file');

let currentFileData = null;
let stream = null;
var std = 0;

// Iniciar Cámara
async function initCamera() {
    try {

        if (std == 0) {

        }
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: 1280, height: 720 },
            audio: false
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error de cámara:", err);
        // alert("No se pudo acceder a la cámara. Revisa los permisos.");
    }
}

// Capturar Foto
btnSnap.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    currentFileData = canvas.toDataURL('image/png');
    imgPreview.src = currentFileData;
    mostrarPreview();
});

// Adjuntar Archivo
btnUpload.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentFileData = event.target.result;
            imgPreview.src = file.type.includes('pdf') ? 'https://cdn-icons-png.flaticon.com/512/337/337946.png' : currentFileData;
            mostrarPreview();
        };
        reader.readAsDataURL(file);
    }
});

function mostrarPreview() {
    previewContainer.classList.remove('preview-hidden');
    if (stream) stream.getTracks().forEach(track => track.stop());
}

btnRemove.addEventListener('click', () => {
    previewContainer.classList.add('preview-hidden');
    currentFileData = null;
    fileInput.value = "";
    initCamera();
});

// 1. Inicializar AutoNumeric en el campo precio
const anElement = new AutoNumeric('#precio', {
    currencySymbol: '$',
    digitGroupSeparator: '.',
    decimalCharacter: ',',
    decimalPlaces: 0, // En Chile no usamos decimales para pesos
    unformatOnSubmit: true // Ayuda a obtener el valor limpio
});

// 2. Modificación en la lógica de Registro Final con SweetAlert2
btnRegistrar.addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value.trim();
    const precioLimpio = anElement.getNumber(); 

    // Validaciones con Toast (notificaciones rápidas)
    if (!currentFileData) {
        Swal.fire({
            icon: 'warning',
            title: 'Falta el documento',
            text: 'Debes capturar o adjuntar una foto primero.',
            background: '#0f172a', // Tu color bg-dark
            color: '#f8fafc',
            confirmButtonColor: '#7000ff'
        });
        return;
    }

    if (!nombre || precioLimpio <= 0) {
        // Swal.fire({
        //     icon: 'error',
        //     title: 'Datos incompletos',
        //     text: 'Por favor, ingresa una descripción y un precio válido.',
        //     background: '#0f172a',
        //     color: '#f8fafc',
        //     confirmButtonColor: '#7000ff'
        // });
        // return;
    } // opcional mientras

    // Modal de Confirmación Estilizado
    const precioFormateado = anElement.getFormatted();
    
    Swal.fire({
        title: '¿Confirmar Registro?',
        html: `Vas a registrar: <b>${nombre}</b><br>Por un monto de: <span style="color: #00f2fe; font-size: 1.2rem; font-weight: bold;">${precioFormateado}</span>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Sí, registrar ahora',
        cancelButtonText: 'Cancelar',
        background: '#0f172a',
        color: '#f8fafc',
        backdrop: `rgba(0, 242, 254, 0.1)` // Un ligero tinte cian al fondo
    }).then((result) => {
        if (result.isConfirmed) {
            enviarFactura(nombre, precioLimpio);
        }
    });
});

// Conexión con guardar_comprobante.php mejorada
async function enviarFactura(nombre, precio) {
    // Spinner de carga bloqueando la pantalla para evitar doble clic
    Swal.fire({
        title: 'Procesando...',
        text: 'Guardando factura en el servidor',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
        background: '#0f172a',
        color: '#f8fafc'
    });

    const formData = new FormData();
    formData.append('imagen', currentFileData);
    formData.append('nombre', nombre);
    formData.append('precio', precio);

    try {
        const response = await fetch('../_lib/guardar_comprobante.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Registrado!',
                text: result.mensaje,
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#00f2fe',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.reload(); 
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error en el servidor',
                text: result.mensaje,
                background: '#0f172a',
                color: '#f8fafc'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo contactar con el servidor. Revisa tu internet.',
            background: '#0f172a',
            color: '#f8fafc'
        });
    }
}

initCamera();