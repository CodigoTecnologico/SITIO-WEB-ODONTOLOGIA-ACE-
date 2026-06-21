// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // ============ MENÚ HAMBURGUESA ============
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const hamburgerSpans = document.querySelectorAll('.hamburger span');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animación del ícono hamburguesa
            if (hamburgerSpans.length >= 3) {
                hamburgerSpans[0].classList.toggle('rotate-down');
                hamburgerSpans[1].classList.toggle('hide');
                hamburgerSpans[2].classList.toggle('rotate-up');
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (hamburgerSpans.length >= 3) {
                    hamburgerSpans[0].classList.remove('rotate-down');
                    hamburgerSpans[1].classList.remove('hide');
                    hamburgerSpans[2].classList.remove('rotate-up');
                }
            });
        });
    }
    
    // ============ SCROLL SUAVE ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar enlaces que solo son "#"
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Si el menú móvil está abierto, cerrarlo
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (hamburgerSpans.length >= 3) {
                        hamburgerSpans[0].classList.remove('rotate-down');
                        hamburgerSpans[1].classList.remove('hide');
                        hamburgerSpans[2].classList.remove('rotate-up');
                    }
                }
            }
        });
    });
    
    // ============ CONTADORES ANIMADOS ============
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        if (isNaN(target)) return;
        
        const duration = 2000; // 2 segundos
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing suave
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString(); // Valor final exacto
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Observer para los contadores
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        counter.textContent = '0'; // Reiniciar a 0
                        animateCounter(counter);
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        counterObserver.observe(heroStats);
    }
    
    // ============ SLIDER DE TESTIMONIOS ============
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let autoSlideInterval;
    
    function showSlide(index) {
        if (testimonialCards.length === 0) return;
        
        // Ocultar todas las tarjetas
        testimonialCards.forEach(card => card.classList.remove('active'));
        
        // Mostrar la tarjeta actual
        testimonialCards[index].classList.add('active');
        
        // Actualizar dots
        if (dots.length > 0) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        showSlide(currentSlide);
    }
    
    function startAutoSlide() {
        if (testimonialCards.length <= 1) return;
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Eventos de botones prev/next
    if (prevBtn && nextBtn && testimonialCards.length > 0) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
        
        // Eventos de dots
        if (dots.length > 0) {
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const slideIndex = parseInt(dot.getAttribute('data-slide'));
                    if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < testimonialCards.length) {
                        currentSlide = slideIndex;
                        showSlide(currentSlide);
                        resetAutoSlide();
                    }
                });
            });
        }
        
        // Iniciar auto-slide
        startAutoSlide();
        
        // Pausar auto-slide cuando el mouse está sobre el slider
        const sliderContainer = document.querySelector('.testimonials-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
        }
    }
    
    // ============ FAQ ACORDEÓN ============
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    // Verificar si este item ya está activo
                    const isActive = item.classList.contains('active');
                    
                    // Cerrar todas las preguntas
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // Si no estaba activo, abrirlo
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    // ============ VALIDACIÓN DE FORMULARIO ============
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validar campos requeridos
            const requiredFields = this.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff6b6b';
                    field.style.backgroundColor = '#fff5f5';
                } else {
                    field.style.borderColor = '#e0e0e0';
                    field.style.backgroundColor = 'white';
                }
            });
            
            // Validar email
            const emailField = document.getElementById('email');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.style.borderColor = '#ff6b6b';
                    emailField.style.backgroundColor = '#fff5f5';
                    alert('Por favor, ingresa un correo electrónico válido');
                    return;
                }
            }
            
            // Validar teléfono (opcional)
            const telefonoField = document.getElementById('telefono');
            if (telefonoField && telefonoField.value) {
                const telefonoRegex = /^[\d\s\-\(\)\+]{7,15}$/;
                if (!telefonoRegex.test(telefonoField.value)) {
                    isValid = false;
                    telefonoField.style.borderColor = '#ff6b6b';
                    telefonoField.style.backgroundColor = '#fff5f5';
                    alert('Por favor, ingresa un número de teléfono válido');
                    return;
                }
            }
            
            if (isValid) {
                // Obtener los datos del formulario
                const formData = {
                    nombre: document.getElementById('nombre').value,
                    email: document.getElementById('email').value,
                    telefono: document.getElementById('telefono').value,
                    servicio: document.getElementById('servicio').value,
                    mensaje: document.getElementById('mensaje').value
                };
                
                console.log('Formulario enviado:', formData);
                
                // Mostrar mensaje de éxito
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div style="text-align: center; color: #2d8faa; font-size: 50px; margin-bottom: 20px;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h4 style="color: #1a5f7a; margin-bottom: 15px; text-align: center; font-size: 22px;">¡Gracias por contactarnos!</h4>
                    <p style="color: #666; text-align: center; margin-bottom: 10px;">Nos pondremos en contacto contigo pronto.</p>
                    <p style="color: #666; text-align: center;">También puedes llamarnos al <strong style="color: #e85d04;">55 3528 5903</strong></p>
                `;
                successMessage.style.cssText = `
                    text-align: center;
                    padding: 40px 30px;
                    background: #f0fdf4;
                    border-radius: 10px;
                    margin-top: 20px;
                    border: 2px solid #2d8faa;
                `;
                
                // Limpiar formulario y mostrar mensaje
                this.innerHTML = '';
                this.appendChild(successMessage);
                
                // Scroll al mensaje de éxito
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Scroll al primer campo con error
                const firstError = this.querySelector('[style*="border-color: rgb(255, 107, 107)"]');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        // Limpiar errores al escribir
        appointmentForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => {
                field.style.borderColor = '#e0e0e0';
                field.style.backgroundColor = 'white';
            });
        });
        
        // Limpiar errores al cambiar selección
        const selectField = document.getElementById('servicio');
        if (selectField) {
            selectField.addEventListener('change', () => {
                selectField.style.borderColor = '#e0e0e0';
                selectField.style.backgroundColor = 'white';
            });
        }
    }
    
    // ============ ANIMACIONES AL HACER SCROLL ============
    const elementsToAnimate = document.querySelectorAll('.service-card, .why-us-text, .why-us-image, .feature-item, .promo-card, .gallery-item');
    
    if (elementsToAnimate.length > 0) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elementsToAnimate.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            scrollObserver.observe(element);
        });
    }
    
    // ============ MENÚ ACTIVO SEGÚN SCROLL ============
    function updateActiveMenu() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    
    // ============ NAVBAR CON EFECTO SCROLL ============
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255,255,255,0.98)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'white';
                navbar.style.backdropFilter = 'none';
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        }
        updateActiveMenu();
    });
    
    // ============ ESTILOS DEL MENÚ HAMBURGUESA ============
    const style = document.createElement('style');
    style.textContent = `
        .hamburger span {
            display: block;
            transition: all 0.3s ease;
        }
        
        .hamburger span.rotate-down {
            transform: rotate(45deg) translate(6px, 6px);
        }
        
        .hamburger span.hide {
            opacity: 0;
            transform: scaleX(0);
        }
        
        .hamburger span.rotate-up {
            transform: rotate(-45deg) translate(6px, -6px);
        }
        
        .success-message i {
            animation: successPulse 1s ease;
        }
        
        @keyframes successPulse {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease, padding 0.4s ease;
        }
        
        .faq-item.active .faq-answer {
            max-height: 300px;
            padding: 0 25px 20px;
        }
    `;
    document.head.appendChild(style);
    
});