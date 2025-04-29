// crear_receta.js

// =========================
// FUNCIONALIDAD PRINCIPAL
// =========================

// crear_recetas.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-receta');

  if (!form) {
    console.error("Formulario de receta no encontrado.");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const titulo = document.getElementById('name-receta').value.trim();
    const descripcion = document.getElementById('descripcion-receta').value.trim();
    const dificultad = document.getElementById('select-dificultad').value;
    const imagenFile = document.getElementById('input-imagen-receta').files[0];

    // Validación básica
    if (!titulo || !descripcion || !dificultad || !imagenFile) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos requeridos e incluye una imagen.',
      });
    }

    // Obtener ingredientes dinámicos
    const ingredientes = Array.from(document.querySelectorAll('#lista-ingredientes input'))
      .map(input => input.value.trim()).filter(val => val !== "");

    // Obtener pasos dinámicos
    const pasosDiv = document.querySelectorAll('#lista-pasos .paso-item');
    const pasos = [];

    for (const paso of pasosDiv) {
      const texto = paso.querySelector('.paso-input').value.trim();
      const imgFile = paso.querySelector('.input-paso-img').files[0];
      pasos.push({ texto, imgFile });
    }

    try {
      // Subir imagen principal a Firebase Storage
      const storageRef = firebase.storage().ref();
      const recetaImgRef = storageRef.child(`recetas/${Date.now()}_${imagenFile.name}`);
      const snapshot = await recetaImgRef.put(imagenFile);
      const recetaImgURL = await snapshot.ref.getDownloadURL();

      // Subir imágenes de pasos si hay
      const pasosConImagen = await Promise.all(pasos.map(async (p, index) => {
        let imgURL = null;
        if (p.imgFile) {
          const pasoImgRef = storageRef.child(`recetas/pasos/${Date.now()}_paso${index + 1}_${p.imgFile.name}`);
          const pasoSnapshot = await pasoImgRef.put(p.imgFile);
          imgURL = await pasoSnapshot.ref.getDownloadURL();
        }
        return {
          texto: p.texto,
          imagen: imgURL
        };
      }));

      // Guardar en Firestore
      const recetaData = {
        titulo,
        descripcion,
        dificultad,
        ingredientes,
        pasos: pasosConImagen,
        imagenURL: recetaImgURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('Recetas').add(recetaData);

      await Swal.fire({
        icon: 'success',
        title: 'Receta guardada',
        text: 'La receta se ha guardado exitosamente.',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      form.reset();
      document.getElementById('preview-imagen-receta').style.display = 'none';

      // Opcional: Redirigir o recargar
      // window.location.href = 'ruta-a-lista-recetas.html';

    } catch (error) {
      console.error("Error al guardar receta:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la receta. Intenta nuevamente.',
      });
    }
  });
});







/*

function initFormularioReceta() {
    const formReceta = document.getElementById('form-receta');
  
    if (!formReceta) {
      console.error("Formulario de receta no encontrado.");
      return;
    }
  
    formReceta.addEventListener('submit', async (e) => {
      // Prevenir la recarga de la página al hacer submit
      e.preventDefault();
      e.stopPropagation();
  
      // Verificar conexión con Firebase (esto ya lo tienes)
      if (!firebase.apps.length || !window.db) {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'Firebase no está inicializado correctamente.'
        });
        return;
      }
  
      // Obtener valores de los campos
      const nombre = document.getElementById('name-receta').value.trim();
      const descripcion = document.getElementById('description-receta').value.trim();
      const tiempo = document.querySelector('.tiempo input').value.trim();
      const dificultad = document.getElementById('select-dificultad').value;
      const imagenFile = document.getElementById('input-imagen-receta').files[0];
  
      // Validar campos obligatorios
      if (!nombre || !descripcion || !tiempo || !dificultad) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor completa todos los campos obligatorios.'
        });
        return;
      }
  
      // Validar ingredientes
      const ingredientes = Array.from(document.querySelectorAll('#lista-ingredientes input'))
        .map(input => input.value.trim())
        .filter(val => val !== "");
  
      if (ingredientes.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Ingredientes faltantes',
          text: 'Por favor agrega al menos un ingrediente.'
        });
        return;
      }
  
      // Validar pasos
      const pasos = [];
      const pasoItems = document.querySelectorAll('#lista-pasos .paso-item');
      
      for (let item of pasoItems) {
        const texto = item.querySelector('.paso-input').value.trim();
        const imgFile = item.querySelector('.input-paso-img').files[0];
        let imgURL = "";
  
        if (imgFile) {
          try {
            const fileName = `pasos/${Date.now()}_${imgFile.name}`;
            const pasoRef = storage.ref().child(fileName);
            await pasoRef.put(imgFile);
            imgURL = await pasoRef.getDownloadURL();
          } catch (error) {
            console.error("Error subiendo imagen de paso:", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al subir la imagen del paso.'
            });
            return;
          }
        }
  
        if (texto) {
          pasos.push({ texto, imagen: imgURL });
        }
      }
  
      if (pasos.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Pasos faltantes',
          text: 'Por favor agrega al menos un paso.'
        });
        return;
      }
  
      // Subir imagen principal si está presente
      let imagenURL = "";
      if (imagenFile) {
        try {
          const fileName = `recetas/${Date.now()}_${imagenFile.name}`;
          const recetaRef = storage.ref().child(fileName);
          await recetaRef.put(imagenFile);
          imagenURL = await recetaRef.getDownloadURL();
        } catch (error) {
          console.error("Error subiendo imagen de receta:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al subir la imagen principal.'
          });
          return;
        }
      }
  
      // Crear el objeto de receta
      const recetaData = {
        nombre,
        descripcion,
        tiempo,
        dificultad,
        imagenURL,
        ingredientes,
        pasos,
        fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
        rating: 0,
        numCalificaciones: 0,
        categoria: document.getElementById('categoria-recetas').value || 'general'
      };
  
      // Intentar guardar la receta en Firebase
      try {
        const docRef = await db.collection("Recetas").add(recetaData);
  
        console.log("Receta guardada con ID:", docRef.id);
  
        Swal.fire({
          icon: 'success',
          title: '¡Receta guardada!',
          text: 'Tu receta ha sido guardada exitosamente.'
        }).then(() => {
          resetFormulario();
        });
      } catch (error) {
        console.error("Error guardando receta:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar la receta: ' + error.message
        });
      }
    });
  }
  

function resetFormulario() {
  const form = document.getElementById('form-receta');
  form.reset();

  contadorIngredientes = 2;
  contadorPasos = 2;

  document.getElementById('lista-ingredientes').innerHTML = `
    <input type="text" class="form-control input-border" placeholder="Ingrediente 1" />
  `;

  document.getElementById('lista-pasos').innerHTML = `
    <div class="paso-item">
      <div class="paso-imagen-small" onclick="this.querySelector('input').click()">
        <i class="ph ph-image icono-placeholder"></i>
        <img class="img-preview" style="display:none;" />
        <input type="file" accept="image/*" class="input-paso-img" style="display:none;" onchange="mostrarPreviewPaso(this, this.previousElementSibling)" />
      </div>
      <input type="text" class="form-control input-border paso-input" placeholder="Paso 1" />
    </div>
  `;

  const previewImg = document.getElementById('preview-imagen-receta');
  if (previewImg) {
    previewImg.style.display = 'none';
    previewImg.src = '';
    const icono = previewImg.parentElement.querySelector('.icono-placeholder');
    if (icono) icono.style.display = "block";
  }

  window.scrollTo(0, 0);
}


*/