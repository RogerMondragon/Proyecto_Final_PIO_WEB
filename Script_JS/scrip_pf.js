// ----------------------- Smooth Scroll para Navegación ----------------------- //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ----------------------- Efecto de Aparición al Hacer Scroll ----------------------- //
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.card');
    elements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        if (position < screenHeight - 100) { // Ajusta el valor según necesites
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        } else {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
        }
    });
});

// ----------------------- Activación del Menú Desplegable en Hover ----------------------- //
$(document).ready(function () {
    $('.dropdown').hover(
        function () {
            $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(200);
        },
        function () {
            $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(200);
        }
    );
});

// ----------------------- Funciones para Manejar Cookies ----------------------- //
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return "";
}

// ----------------------- Manejo del Formulario de Contacto ----------------------- //
document.addEventListener('DOMContentLoaded', function() {
    // Cargar los datos de cookies al cargar la pagina
    const nombre = getCookie('nombre');
    const email = getCookie('email');
    const mensaje = getCookie('mensaje');

    if (nombre) {
        document.getElementById('nombre').value = nombre;
    }
    if (email) {
        document.getElementById('email').value = email;
    }
    if (mensaje) {
        document.getElementById('mensaje').value = mensaje;
    }

    // Guardar datos del formulario en cookies al enviar
    const contactoForm = document.getElementById('contacto-form');
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;

            // Guardar en cookies por 7 días
            setCookie('nombre', nombre, 7);
            setCookie('email', email, 7);
            setCookie('mensaje', mensaje, 7);

            Swal.fire({
                icon: 'success',
                title: 'Enviado',
                text: 'Mensaje enviado'
            });
        });
    }

    // Event Listeners para los formularios de Registro y Login
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    // Actualizar la navbar al cargar la página
    updateNavbar();
});

// ----------------------- Funciones para Manejar la Autenticación ----------------------- //
function updateNavbar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginNav = document.getElementById('login-nav');
    const registerNav = document.getElementById('register-nav');
    const logoutNav = document.getElementById('logout-nav');
    const userNav = document.getElementById('user-nav');
    const userNameSpan = document.getElementById('user-name');

    if (isLoggedIn === 'true') {
        loginNav.classList.add('d-none');
        registerNav.classList.add('d-none');
        logoutNav.classList.remove('d-none');
        userNav.classList.remove('d-none');

        // Obtener y mostrar el nombre del usuario
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.name) {
            userNameSpan.textContent = currentUser.name;
        }
    } else {
        loginNav.classList.remove('d-none');
        registerNav.classList.remove('d-none');
        logoutNav.classList.add('d-none');
        userNav.classList.add('d-none');
    }
}

function registerUser(event) {
    event.preventDefault(); // Evita el envío del formulario

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (name === '' || email === '' || password === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios.'
        });
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Verificar si el correo ya está registrado
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo ya está registrado.'
        });
        return;
    }

    // Agregar nuevo usuario
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    Swal.fire(
        '¡Éxito!',
        'Registro exitoso. Ahora puedes iniciar sesión.',
        'success'
    );

    // Cerrar el modal y limpiar el formulario
    $('#registerModal').modal('hide');
    document.getElementById('register-form').reset();
}

function loginUser(event) {
    event.preventDefault(); // Evita el envío del formulario

    const email = document.getElementById('logEmail').value.trim();
    const password = document.getElementById('logPassword').value.trim();

    if (email === '' || password === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, ingresa el correo y la contraseña.'
        });
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Buscar el usuario
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso.',
            timer: 2000,
            showConfirmButton: false
        });

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateNavbar();

        // Cerrar el modal y limpiar el formulario después de un breve retraso
        setTimeout(() => {
            $('#loginModal').modal('hide');
            document.getElementById('login-form').reset();
        }, 2000);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Correo o contraseña incorrectos.'
        });
    }
}

function logout() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas cerrar sesión?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            updateNavbar();
            Swal.fire(
                '¡Cerrado!',
                'Has cerrado sesión.',
                'success'
            );
        }
    });
}

// ----------------------- Funcionalidad del Carrito ----------------------- //

let cart = [];
let total = 0;

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

// Función para actualizar el total del carrito
function updateCartTotal() {
    total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.innerText = total.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP'       
        });
    }
}

// Función para renderizar los elementos del carrito en el modal
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
            <td>
                <input type="number" min="1" value="${item.quantity}" class="form-control quantity-input" data-index="${index}">
            </td>
            <td>${(item.price * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
            <td>
                <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Eliminar</button>
            </td>
        `;

        cartItems.appendChild(row);
    });

    updateCartTotal();
}

// Función para añadir un producto al carrito
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartCount();
    renderCart();
    saveCart();
    Swal.fire({
        icon: 'success',
        title: '¡Añadido al carrito!',
        text: `${name} ha sido añadido al carrito.`,
        timer: 1500,
        showConfirmButton: false
    });
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
    saveCart();
}

// Función para actualizar la cantidad de un producto en el carrito
function updateQuantity(index, newQuantity) {
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
        renderCart();
        saveCart();
    }
}

// Función para manejar la compra
function handleCheckout() {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito Vacío',
            text: 'Por favor, añade productos al carrito antes de comprar.',
        });
    } else {
        // Aquí puedes implementar la lógica de compra, como redirigir a una página de pago
        Swal.fire({
            icon: 'success',
            title: '¡Compra Exitosa!',
            text: 'Gracias por tu compra.',
        });
        // Reiniciar el carrito
        cart = [];
        updateCartCount();
        renderCart();
        saveCart();
        $('#cartModal').modal('hide');
    }
}

// Funciones para manejar la persistencia del carrito usando localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        cart = savedCart;
        updateCartCount();
        renderCart();
    }
}

// Event Listener para los botones de "Agregar al Carrito"
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            addToCart(name, price);
        });
    });

    // Cargar el carrito desde localStorage al iniciar
    loadCart();

    // Event Listener para el botón de "Comprar"
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
});

// Event Listener para actualizar la cantidad de un producto
const cartItemsElement = document.getElementById('cart-items');
if (cartItemsElement) {
    cartItemsElement.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const index = e.target.getAttribute('data-index');
            const newQuantity = parseInt(e.target.value);
            if (!isNaN(newQuantity)) {
                updateQuantity(index, newQuantity);
            }
        }
    });

    // Event Listener para eliminar un producto del carrito
    cartItemsElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index);
        }
    });
}
