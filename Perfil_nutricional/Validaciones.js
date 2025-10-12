document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------
  // FUNCIONES AUXILIARES
  // ---------------------------
  function contarPalabras(texto) {
    if (!texto.trim()) return 0;
    return texto.trim().split(/\s+/).length;
  }

  function scrollFocus(element) {
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ---------------------------
  // VALIDACIÓN - SECCIÓN NUTRICIONAL
  // ---------------------------
  const camposNutricionales = [
    { name:'dieta_actual', element:document.querySelector('[name="dieta_actual"]'), errorElement:document.getElementById('error-dieta'), validar: v=>v!=='', errorMsg:'⚠️ Selecciona un tipo de dieta', validMsg:'Selecciona la dieta que sigues actualmente'},
    { name:'peso', element:document.querySelector('[name="peso"]'), errorElement:document.getElementById('error-peso'), validar: v=>v!=='' && !isNaN(v) && Number(v)>=50 && Number(v)<=500 && v.length<=3 && !v.includes('-'), errorMsg:'⚠️ El peso debe ser un número entre 50 y 500 libras', validMsg:'Ingresa tu peso actual en libras'},
    { name:'altura', element:document.querySelector('[name="altura"]'), errorElement:document.getElementById('error-altura'), validar: v=>v!=='' && !isNaN(v) && Number(v)>=50 && Number(v)<=250 && v.length<=3 && !v.includes('-'), errorMsg:'⚠️ La altura debe ser un número entre 50 y 250 cm', validMsg:'Ingresa tu altura en centímetros'},
    { name:'objetivo', element:document.querySelector('[name="objetivo"]'), errorElement:document.getElementById('error-objetivo'), validar: v=>v!=='', errorMsg:'⚠️ Selecciona un objetivo nutricional', validMsg:'Selecciona tu principal objetivo nutricional'},
    { name:'nivel_meta', element:document.querySelector('[name="nivel_meta"]'), errorElement:document.getElementById('error-nivel-meta'), validar: v=>v!=='', errorMsg:'⚠️ Selecciona un nivel de meta', validMsg:'Selecciona el nivel de cambio que deseas lograr'}
  ];

  function validarSeccionNutricional() {
    let valido = true, primerCampoError = null;
    camposNutricionales.forEach(({element,errorElement,validar,errorMsg,validMsg})=>{
      const valor = element.value.trim();
      element.classList.remove('campo-error','campo-valido');
      errorElement.classList.remove('error','valido');

      if(!validar(valor)){
        valido=false;
        element.classList.add('campo-error');
        errorElement.textContent=errorMsg;
        errorElement.classList.add('error');
        if(!primerCampoError) primerCampoError=element;
      }else{
        element.classList.add('campo-valido');
        errorElement.textContent=validMsg;
        errorElement.classList.add('valido');
      }
    });
    if(primerCampoError) scrollFocus(primerCampoError);
    return valido;
  }

  // Validación en tiempo real
  camposNutricionales.forEach(({element,errorElement,validar,errorMsg,validMsg})=>{
    const evento = element.tagName==='SELECT'?'change':'input';
    element.addEventListener(evento, ()=>{
      const valor = element.value.trim();
      element.classList.remove('campo-error','campo-valido');
      errorElement.classList.remove('error','valido');
      if(!validar(valor)){
        element.classList.add('campo-error');
        errorElement.textContent=errorMsg;
        errorElement.classList.add('error');
      }else{
        element.classList.add('campo-valido');
        errorElement.textContent=validMsg;
        errorElement.classList.add('valido');
      }
    });
  });

  // ---------------------------
  // DESCRIPCIONES DE DIETAS Y NIVELES
  // ---------------------------
  const descripcionesDieta = { normal:"Normal: Persona que consume todo tipo de alimentos sin restricción.", vegetariana:"Vegetariana: No consume carne, pollo ni pescado, pero sí productos de origen animal.", vegana:"Vegana: No consume ningún producto de origen animal, ni derivados."};
  const descripcionesNivelMeta = { transicionista:"Transicionista: Está en proceso de dejar productos animales.", vegetariano:"Vegetariano: No consume carne, pollo ni pescado, pero sí lácteos o huevos.", vegano:"Vegano: No consume ningún producto animal y evita su uso en la vida diaria."};

  const selectDieta = document.querySelector('[name="dieta_actual"]');
  const nivelMeta = document.querySelector('[name="nivel_meta"]');

  selectDieta.addEventListener('change', ()=>{
    const valor = selectDieta.value.trim();
    const errorEl = document.getElementById('error-dieta');
    selectDieta.classList.remove('campo-error','campo-valido');
    errorEl.classList.remove('error','valido');
    if(valor===''){
      selectDieta.classList.add('campo-error');
      errorEl.textContent='⚠️ Selecciona un tipo de dieta';
      errorEl.classList.add('error');
    }else{
      selectDieta.classList.add('campo-valido');
      errorEl.textContent=descripcionesDieta[valor];
      errorEl.classList.add('valido');
      errorEl.style.fontStyle='italic';
      errorEl.style.color='#666';
    }
  });

  nivelMeta.addEventListener('change', ()=>{
    const valor = nivelMeta.value.trim();
    const errorEl = document.getElementById('error-nivel-meta');
    nivelMeta.classList.remove('campo-error','campo-valido');
    errorEl.classList.remove('error','valido');
    if(valor===''){
      nivelMeta.classList.add('campo-error');
      errorEl.textContent='⚠️ Selecciona un nivel de meta';
      errorEl.classList.add('error');
    }else{
      nivelMeta.classList.add('campo-valido');
      errorEl.textContent=descripcionesNivelMeta[valor];
      errorEl.classList.add('valido');
      errorEl.style.fontStyle='italic';
      errorEl.style.color='#666';
    }
  });

  // ---------------------------
  // DIETA PRESCRITA
  // ---------------------------
  const checkboxDieta = document.getElementById('dietaCheckbox');
  const dietaDescripcion = document.getElementById('descripcionDieta');
  const errorDieta = document.getElementById('errorDieta');
  const contadorPalabras = document.getElementById('contadorPalabras');
  const malasPalabras = ['mierda','puta','tonto','idiota','asdf','123'];

  function limpiarEstado() {
    errorDieta.style.display='none';
    dietaDescripcion.style.borderColor='';
    contadorPalabras.style.color='#555';
  }

  function validarDieta() {
    if(checkboxDieta.checked){
      const texto=dietaDescripcion.value.trim();
      const palabras=contarPalabras(texto);
      const contieneMalaPalabra=malasPalabras.some(p=>texto.toLowerCase().includes(p));

      if(texto===''){ errorDieta.textContent='Describe la dieta o desmarca el checkbox.'; errorDieta.style.display='block'; dietaDescripcion.style.borderColor='red'; dietaDescripcion.focus(); return false; }
      if(palabras>250){ errorDieta.textContent='Has excedido 250 palabras.'; errorDieta.style.display='block'; dietaDescripcion.style.borderColor='red'; dietaDescripcion.focus(); return false; }
      if(contieneMalaPalabra){ errorDieta.textContent='Escribe una descripción válida.'; errorDieta.style.display='block'; dietaDescripcion.style.borderColor='red'; dietaDescripcion.focus(); return false; }
    }
    return true;
  }

  dietaDescripcion.addEventListener('input', ()=>{
    const texto=dietaDescripcion.value.toLowerCase();
    const palabras=contarPalabras(dietaDescripcion.value);
    contadorPalabras.textContent=`${palabras} / 250 palabras`;
    if(palabras>250 || malasPalabras.some(p=>texto.includes(p))){ dietaDescripcion.style.borderColor='red'; } else limpiarEstado();
  });

  // ---------------------------
  // ENVÍO FORM PERFIL + PAGO
  // ---------------------------
  const formPerfil = document.getElementById('form-crear-perfil');
  const formPago = document.getElementById('form-pago');
  const section8 = document.getElementById('section8');
  const section9 = document.getElementById('section9');

  async function guardarPerfil() {
    const submitBtn = formPerfil.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled=true;
    submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try{
      const response = await fetch(formPerfil.action,{method:'POST', body:new FormData(formPerfil)});
      const data = await response.json();

      if(data.error==='user_exists'){
        await Swal.fire({icon:'error', title:'Error', text:'Ya tienes un perfil creado.', confirmButtonText:'Entendido'});
        window.location.href='/Pantalla_principal/index_pantalla_principal.html';
        return false;
      }

      if(data.success){
        await Swal.fire({icon:'success', title:'¡Perfil guardado!', timer:2000, showConfirmButton:false});
        return true;
      }else throw new Error(data.message || "Error desconocido");
    }catch(err){
      console.error(err);
      Swal.fire('Error','No se pudo guardar el perfil','error');
      return false;
    }finally{
      submitBtn.disabled=false;
      submitBtn.innerHTML=originalText;
    }
  }

  formPerfil.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!validarSeccionNutricional() || !validarDieta()) return;

    const exito = await guardarPerfil();
    if(!exito) return;

    // Si hay botón de pago, esperar al pago
    if(formPago){
      section8.style.display='block'; // mostrar sección 8 si no estaba
      // el pago se procesa en formPago.submit
    }else{
      // No hay pago, pasar directamente a section9
      section8.style.display='none';
      section9.style.display='block';
    }
  });

  formPago.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const submitBtn = formPago.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled=true;
    submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Procesando...';

    try{
      // Aquí iría la llamada real al procesamiento de pago
      await Swal.fire({icon:'success', title:'¡Pago completado!', text:'Tu plan está activo.', timer:2000, showConfirmButton:false});
      section8.style.display='none';
      section9.style.display='block';
    }catch(err){
      console.error(err);
      Swal.fire('Error','No se pudo procesar el pago','error');
    }finally{
      submitBtn.disabled=false;
      submitBtn.innerHTML=originalText;
    }
  });

});


const btnEmpezarPlan = document.getElementById('btn_empezar_plan');
if(btnEmpezarPlan){
  btnEmpezarPlan.addEventListener('click', () => {
    // Redirige a la pantalla principal
    window.location.href = '/Pantalla_principal/index_pantalla_principal.html';
  });
}
