const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const year = document.querySelector('#current-year');
const dialogOpeners = document.querySelectorAll('[data-dialog-open]');
const dialogs = document.querySelectorAll('.project-dialog');

year.textContent = new Date().getFullYear();

const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
};

toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('is-active', isCurrent);
        });
    });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

dialogOpeners.forEach((opener) => {
    opener.addEventListener('click', () => {
        const dialog = document.querySelector(`#${opener.dataset.dialogOpen}`);
        if (!dialog) return;
        dialog.showModal();
        document.body.classList.add('dialog-open');
    });
});

dialogs.forEach((dialog) => {
    const closeButton = dialog.querySelector('[data-dialog-close]');

    closeButton?.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener('close', () => {
        document.body.classList.remove('dialog-open');
    });
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
});
