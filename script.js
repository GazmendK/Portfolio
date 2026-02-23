document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');

        if (document.body.classList.contains('light-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.innerHTML = navLinks.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.dataset.filter;

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category.includes(filterValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);

            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.innerHTML = "Sende...";
            submitButton.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let jsonResponse = await response.json();
                    if (response.status == 200) {
                        submitButton.innerHTML = "Erfolgreich gesendet!";
                        contactForm.reset();
                    } else {
                        console.log(response);
                        submitButton.innerHTML = `Fehler: ${jsonResponse.message}`;
                        submitButton.style.backgroundColor = '#d9534f';
                    }
                })
                .catch(error => {
                    console.log(error);
                    submitButton.innerHTML = "Fehler beim Senden!";
                    submitButton.style.backgroundColor = '#d9534f';
                })
                .finally(() => {
                    setTimeout(() => {
                        submitButton.innerHTML = "Nachricht senden";
                        submitButton.disabled = false;
                        submitButton.style.backgroundColor = '';
                    }, 4000);
                });
        });
    }


    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in:not(.animated)');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
});