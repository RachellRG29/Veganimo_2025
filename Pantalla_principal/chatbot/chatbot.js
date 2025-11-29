// chatbot.js - Versión con pantalla de mascota Lottie
(function() {
  // Esperar a que el DOM esté listo
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function() {
    // Verificar si el chatbot ya está inicializado
    if (window.chatbotInitialized) {
      return;
    }
    
    window.chatbotInitialized = true;

    // Elementos del chatbot
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const chatArea = document.getElementById('chatArea');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotNotification = document.getElementById('chatbotNotification');
    const userGreeting = document.querySelector('.user-greeting');
    const mascotContainer = document.getElementById('mascot-chatbot');

    // Verificar que todos los elementos existan
    if (!chatbotToggle || !chatbotWindow || !chatbotClose || !welcomeScreen || !chatArea || !mascotContainer) {
      console.warn('⚠️ No se encontraron todos los elementos del chatbot');
      return;
    }

    // Estado del chatbot
    let isOpen = false;
    let hasNewMessage = true;
    let isFirstInteraction = true;
    let lottieAnimation = null;

    // Cargar animación Lottie
    function loadLottieAnimation() {
      if (typeof lottie === 'undefined') {
        console.warn('Lottie no está cargado');
        return;
      }
      
      lottieAnimation = lottie.loadAnimation({
        container: mascotContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/Images/json/chatbot-saludando.json' // ← REEMPLAZA CON TU RUTA
      });
    }

    // Actualizar saludo con nombre del usuario
    function updateUserGreeting() {
      const userName = localStorage.getItem('userDisplayName') || 'Usuario';
      if (userGreeting) {
        userGreeting.textContent = `Hola, ${userName}!`;
      }
    }

    // Abrir/cerrar chatbot
    function toggleChatbot() {
      isOpen = !isOpen;
      if (isOpen) {
        chatbotWindow.classList.add('open');
        chatbotContainer.classList.add('chat-open');
        // Ocultar notificación cuando se abre
        if (chatbotNotification) {
          chatbotNotification.style.display = 'none';
        }
        hasNewMessage = false;
        // Actualizar saludo
        updateUserGreeting();
        // Enfocar el input
        setTimeout(() => {
          if (chatbotInput) chatbotInput.focus();
        }, 300);
      } else {
        chatbotWindow.classList.remove('open');
        chatbotContainer.classList.remove('chat-open');
      }
    }

    // Cerrar chatbot
    function closeChatbot() {
      isOpen = false;
      chatbotWindow.classList.remove('open');
      chatbotContainer.classList.remove('chat-open');
    }

    // Mostrar notificación
    function showNotification() {
      if (!isOpen && !hasNewMessage && chatbotNotification) {
        chatbotNotification.style.display = 'flex';
        hasNewMessage = true;
      }
    }

    // Obtener hora actual
    function getCurrentTime() {
      const now = new Date();
      return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    // Cambiar a modo chat normal
    function switchToChatMode() {
      if (isFirstInteraction) {
        welcomeScreen.style.display = 'none';
        chatArea.style.display = 'flex';
        isFirstInteraction = false;
        // Opcional: pausar animación Lottie cuando cambie a chat
        if (lottieAnimation) {
          lottieAnimation.pause();
        }
      }
    }

    // Añadir mensaje al chat
    function addMessage(text, isUser = false) {
      switchToChatMode();
      
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
      
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      
      const messageText = document.createElement('p');
      messageText.textContent = text;
      
      const messageTime = document.createElement('span');
      messageTime.className = 'message-time';
      messageTime.textContent = getCurrentTime();
      
      messageContent.appendChild(messageText);
      messageContent.appendChild(messageTime);
      messageDiv.appendChild(messageContent);
      
      chatArea.appendChild(messageDiv);
      
      // Scroll al final
      chatArea.scrollTop = chatArea.scrollHeight;
    }

    // Enviar mensaje
    function sendMessage() {
      const message = chatbotInput.value.trim();
      if (message) {
        // Añadir mensaje del usuario
        addMessage(message, true);
        chatbotInput.value = '';
        
        // Simular respuesta del bot después de un breve retraso
        setTimeout(() => {
          const botResponse = generateBotResponse(message);
          addMessage(botResponse, false);
          
          // Mostrar notificación si el chat está cerrado
          if (!isOpen) {
            showNotification();
          }
        }, 1000);
      }
    }

    // Generar respuesta del bot (simulación)
    function generateBotResponse(userMessage) {
      const message = userMessage.toLowerCase();
      
      // Respuestas predefinidas
      if (message.includes('hola') || message.includes('hi') || message.includes('hello')) {
        return '¡Hola! Me da gusto saludarte. ¿En qué puedo ayudarte hoy?';
      } else if (message.includes('receta') || message.includes('cocinar') || message.includes('comida')) {
        return '¡Perfecto! Puedo ayudarte a encontrar recetas veganas deliciosas. ¿Qué tipo de comida te interesa? ¿Algún ingrediente en particular?';
      } else if (message.includes('dieta') || message.includes('vegana') || message.includes('nutrición')) {
        return 'Tenemos planes de dieta vegana personalizados según tus objetivos. ¿Te gustaría conocer más sobre nuestras opciones?';
      } else if (message.includes('plan') || message.includes('pro') || message.includes('premium')) {
        return 'Nuestro plan Pro incluye dietas personalizadas, recetas exclusivas, seguimiento nutricional y más beneficios. ¿Quieres que te cuente más detalles?';
      } else if (message.includes('gracias') || message.includes('thanks') || message.includes('agradecido')) {
        return '¡De nada! Estoy aquí para ayudarte en lo que necesites. ¿Hay algo más en lo que pueda asistirte?';
      } else if (message.includes('ayuda') || message.includes('help') || message.includes('soporte')) {
        return 'Puedo ayudarte con: recetas veganas, planes de dieta, información nutricional, dudas sobre veganismo y más. ¿Qué necesitas específicamente?';
      } else if (message.includes('precio') || message.includes('costo') || message.includes('cuánto') || message.includes('valor')) {
        return 'Tenemos diferentes planes según tus necesidades. El plan básico es gratuito y el Pro tiene características avanzadas. ¿Te interesa conocer los detalles?';
      } else if (message.includes('veganismo') || message.includes('vegano') || message.includes('vegetariano')) {
        return 'El veganismo es un estilo de vida que busca excluir toda forma de explotación animal. ¿Te gustaría saber más sobre sus beneficios?';
      } else {
        return 'Entiendo. ¿Puedes darme más detalles sobre tu consulta para poder ayudarte mejor?';
      }
    }

    // Event listeners
    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', closeChatbot);
    
    if (chatbotSend) {
      chatbotSend.addEventListener('click', sendMessage);
    }
    
    if (chatbotInput) {
      chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    }

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (isOpen && 
          !chatbotWindow.contains(e.target) && 
          !chatbotToggle.contains(e.target)) {
        closeChatbot();
      }
    });

    // Cargar animación Lottie cuando esté disponible
    function initializeLottie() {
      if (typeof lottie !== 'undefined') {
        loadLottieAnimation();
      } else {
        // Reintentar después de un tiempo si Lottie no está cargado
        setTimeout(initializeLottie, 100);
      }
    }

    // Inicializar
    initializeLottie();

    // Mostrar notificación de bienvenida después de unos segundos
    setTimeout(() => {
      if (!isOpen) {
        showNotification();
      }
    }, 5000);

    // Actualizar el saludo cuando cambie el nombre del usuario
    updateUserGreeting();
  });
})();