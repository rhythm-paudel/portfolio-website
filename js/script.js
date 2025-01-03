// Smooth Scroll
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        window.scrollTo({
            top: targetElement.offsetTop - 60,
            behavior: 'smooth'
        });
    });
});

// Contact Form Handling
document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you for contacting me! I will respond soon.');
    e.target.reset();
});
