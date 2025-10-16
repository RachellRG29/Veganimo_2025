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
      } else {
        element.classList.add('campo-valido');
        errorElement.textContent=validMsg;
        errorElement.classList.add('valido');
      }
    });
    if(primerCampoError) scrollFocus(primerCampoError);
    return valido;
  }

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
      } else {
        element.classList.add('campo-valido');
        errorElement.textContent=validMsg;
        errorElement.classList.add('valido');
      }
    });
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
    if(checkboxDieta && checkboxDieta.checked){
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
  const formPago = document.querySelector('.payment-form');
  const section8 = document.getElementById('section8');
  const section9 = document.getElementById('section9');

  // ✅ VALIDAR TARJETA CON MONTO TOMADO DEL HTML
  async function validarTarjeta() {
    const numero = document.getElementById('cardNumber').value.trim().replace(/\s+/g, '');
    const titular = document.getElementById('cardHolder').value.trim();
    const mes = document.getElementById('month').value.trim();
    const anio = document.getElementById('year').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    // 🔹 Obtener monto directamente del HTML
    const precioPlan = document.getElementById('precio_plan').textContent.trim();
    const monto = parseFloat(precioPlan.replace(/[^0-9.]/g, '')) || 5;

    console.log('💰 Monto actual tomado del HTML:', monto);

    if (!numero || !titular || !mes || !anio || !cvv) {
      Swal.fire('Error', 'Debes completar todos los datos de la tarjeta', 'error');
      return false;
    }

    try {
      const formData = new FormData();
      formData.append('numero', numero);
      formData.append('titular', titular);
      formData.append('mes', mes);
      formData.append('anio', anio);
      formData.append('cvv', cvv);
      formData.append('monto', monto);

      const response = await fetch('validar_tarjeta.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        Swal.fire('Error', data.message || 'La tarjeta no es válida o el saldo es insuficiente', 'error');
        return false;
      }

      return true; // ✅ Tarjeta válida y saldo suficiente
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo validar la tarjeta', 'error');
      return false;
    }
  }

  // ✅ PROCESAR TODO
  async function procesarTodo() {
    if(!validarSeccionNutricional() || !validarDieta()) return;

    const tarjetaOk = await validarTarjeta();
    if(!tarjetaOk) return;

    const submitBtn = formPerfil.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
      const response = await fetch(formPerfil.action, { method:'POST', body: new FormData(formPerfil) });
      const data = await response.json();

      if(!data.success){
        Swal.fire('Error', data.message || 'No se pudo guardar el perfil', 'error');
        return;
      }

      Swal.fire({icon:'success', title:'¡Pago realizado y perfil guardado con éxito!', timer:2000, showConfirmButton:false});
      section8.style.display='none';
      section9.style.display='block';

    } catch(err){
      console.error(err);
      Swal.fire('Error','No se pudo guardar el perfil','error');
    } finally {
      submitBtn.disabled=false;
      submitBtn.innerHTML=originalText;
    }
  }

  // ---------------------------
  // EVENTOS
  // ---------------------------
  if(formPago){
    formPago.addEventListener('submit', async (e)=>{
      e.preventDefault();
      await procesarTodo();
    });
  }

  if(formPerfil){
    formPerfil.addEventListener('submit', async (e)=>{
      e.preventDefault();
      await procesarTodo();
    });
  }

  //  Botón "Comencemos"
  const btnEmpezarPlan = document.getElementById('btn_empezar_plan');
  if(btnEmpezarPlan){
    btnEmpezarPlan.type = 'button';
    btnEmpezarPlan.addEventListener('click', () => {
    window.location.href = '/Pantalla_principal/index_pantalla_principal.html';
    });
  }

});





/** este tambien realiza lo de pago el cobro pero de local storage y el otro lo hace agarrando e monto del html

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
      } else {
        element.classList.add('campo-valido');
        errorElement.textContent=validMsg;
        errorElement.classList.add('valido');
      }
    });
    if(primerCampoError) scrollFocus(primerCampoError);
    return valido;
  }

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
      } else {
        element.classList.add('campo-valido');
        errorElement.textContent=validMsg;
        errorElement.classList.add('valido');
      }
    });
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
    if(checkboxDieta && checkboxDieta.checked){
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
  const formPago = document.querySelector('.payment-form');
  const section8 = document.getElementById('section8');
  const section9 = document.getElementById('section9');

  // ✅ VALIDAR TARJETA CON MONTO ACTUALIZADO
  async function validarTarjeta() {
    const numero = document.getElementById('cardNumber').value.trim().replace(/\s+/g, '');
    const titular = document.getElementById('cardHolder').value.trim();
    const mes = document.getElementById('month').value.trim();
    const anio = document.getElementById('year').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    const montoGuardado = localStorage.getItem('monto_plan');
    const monto = montoGuardado ? parseFloat(montoGuardado) : 5;

    console.log('💰 Monto actual usado para pago:', monto);

    if (!numero || !titular || !mes || !anio || !cvv) {
      Swal.fire('Error', 'Debes completar todos los datos de la tarjeta', 'error');
      return false;
    }

    try {
      const formData = new FormData();
      formData.append('numero', numero);
      formData.append('titular', titular);
      formData.append('mes', mes);
      formData.append('anio', anio);
      formData.append('cvv', cvv);
      formData.append('monto', monto);

      const response = await fetch('validar_tarjeta.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        Swal.fire('Error', data.message || 'La tarjeta no es válida o el saldo es insuficiente', 'error');
        return false;
      }

      return true; // ✅ Tarjeta válida y saldo suficiente
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo validar la tarjeta', 'error');
      return false;
    }
  }

  // ✅ PROCESAR TODO
  async function procesarTodo() {
    if(!validarSeccionNutricional() || !validarDieta()) return;

    const tarjetaOk = await validarTarjeta();
    if(!tarjetaOk) return;

    const submitBtn = formPerfil.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
      const response = await fetch(formPerfil.action, { method:'POST', body: new FormData(formPerfil) });
      const data = await response.json();

      if(!data.success){
        Swal.fire('Error', data.message || 'No se pudo guardar el perfil', 'error');
        return;
      }

      localStorage.removeItem('monto_plan');

      Swal.fire({icon:'success', title:'¡Pago realizado y perfil guardado con éxito!', timer:2000, showConfirmButton:false});
      section8.style.display='none';
      section9.style.display='block';

    } catch(err){
      console.error(err);
      Swal.fire('Error','No se pudo guardar el perfil','error');
    } finally {
      submitBtn.disabled=false;
      submitBtn.innerHTML=originalText;
    }
  }

  // ---------------------------
  // EVENTOS
  // ---------------------------
  if(formPago){
    formPago.addEventListener('submit', async (e)=>{
      e.preventDefault();
      await procesarTodo();
    });
  }

  // ❌ Eliminamos este bloque (ya no queremos doble envío)
   if(formPerfil){
   formPerfil.addEventListener('submit', async (e)=>{
     e.preventDefault();
     await procesarTodo();
   });
  }

  // ✅ GUARDAR MONTO DEL PLAN CUANDO SE ELIJA UNO NUEVO
  document.querySelectorAll('.plan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const monto = btn.dataset.monto;
      localStorage.setItem('monto_plan', monto);
      console.log('Monto guardado en localStorage:', monto);
    });
  });

  // ✅ Botón "Comencemos"
  const btnEmpezarPlan = document.getElementById('btn_empezar_plan');
  if(btnEmpezarPlan){
    btnEmpezarPlan.type = 'button'; // 🔒 Evita submit accidental
    btnEmpezarPlan.addEventListener('click', () => {
      window.location.href = '/Pantalla_principal/index_pantalla_principal.html';
    });
  }

});
/**/