// Crear la aplicación Vue
const { createApp } = Vue;

createApp({
  data() {
    return {
      scrolled: false,
      navActive: false,
      activeLink: null
    };
  },
  mounted() {
    // Manejar el scroll para el header
    window.addEventListener('scroll', this.handleScroll);
    
    // Configurar el toggler del menú
    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
      toggler.addEventListener('click', this.toggleNav);
    }
    
    // Configurar los enlaces de navegación
    const navbarAnchors = document.querySelectorAll('.navbar-links a');
    navbarAnchors.forEach(anchor => {
      anchor.addEventListener('click', () => {
        this.setActiveLink(anchor);
      });
    });
    
    // Recortar descripciones de recetas
    this.truncateDescriptions('.descripcion-tarjeta', 50);
    
    // Recortar descripciones de informate
    this.truncateDescriptions('.descripcion-tarjeta-inf', 40);
  },
  beforeUnmount() {
    // Limpiar event listeners cuando el componente se desmonte
    window.removeEventListener('scroll', this.handleScroll);
    
    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
      toggler.removeEventListener('click', this.toggleNav);
    }
    
    const navbarAnchors = document.querySelectorAll('.navbar-links a');
    navbarAnchors.forEach(anchor => {
      anchor.removeEventListener('click', () => {
        this.setActiveLink(anchor);
      });
    });
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 0;
      const header = document.getElementById('header');
      if (header) {
        if (this.scrolled) {
          header.classList.add('scroll');
        } else {
          header.classList.remove('scroll');
        }
      }
    },
    toggleNav() {
      const navLinks = document.querySelector('.navbar-links');
      if (navLinks) {
        navLinks.classList.toggle('active');
      }
      this.navActive = !this.navActive;
    },
    setActiveLink(anchor) {
      const navbarAnchors = document.querySelectorAll('.navbar-links a');
      navbarAnchors.forEach(a => a.classList.remove('active-link'));
      anchor.classList.add('active-link');
      this.activeLink = anchor.getAttribute('href');
    },
    truncateDescriptions(selector, maxWords) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(p => {
        const textoOriginal = p.textContent.trim();
        const palabras = textoOriginal.split(/\s+/);
        
        if (palabras.length > maxWords) {
          const textoRecortado = palabras.slice(0, maxWords).join(" ") + "...";
          p.textContent = textoRecortado;
        }
      });
    }
  }
}).mount('#mainBody'); //  app en el body principal

