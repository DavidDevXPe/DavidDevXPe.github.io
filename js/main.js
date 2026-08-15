const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const year = document.querySelector('#current-year');
const menuLabel = toggle?.querySelector('[data-menu-label]');
const dialogOpeners = document.querySelectorAll('[data-dialog-open]');
const dialogs = document.querySelectorAll('.project-dialog');

if (year) year.textContent = new Date().getFullYear();

const setMenuState = (isOpen) => {
    if (!toggle || !menu) return;

    toggle.setAttribute('aria-expanded', String(isOpen));
    menu.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    if (menuLabel) menuLabel.textContent = isOpen ? 'Cerrar menú' : 'Abrir menú';
};

const closeMenu = () => {
    setMenuState(false);
};

toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
}

const sections = document.querySelectorAll('main section[id]');

if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
                link.classList.toggle('is-active', isCurrent);
                if (isCurrent) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        });
    }, { rootMargin: '-35% 0px -55%', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
}

dialogOpeners.forEach((opener) => {
    opener.addEventListener('click', () => {
        const dialog = document.querySelector(`#${opener.dataset.dialogOpen}`);
        if (!dialog) return;
        if (typeof dialog.showModal === 'function') {
            dialog.showModal();
        } else {
            dialog.setAttribute('open', '');
        }
        document.body.classList.add('dialog-open');
    });
});

dialogs.forEach((dialog) => {
    const closeButton = dialog.querySelector('[data-dialog-close]');

    const closeDialog = () => {
        if (typeof dialog.close === 'function') {
            dialog.close();
        } else {
            dialog.removeAttribute('open');
            document.body.classList.remove('dialog-open');
        }
    };

    closeButton?.addEventListener('click', closeDialog);

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) closeDialog();
    });

    dialog.addEventListener('close', () => {
        document.body.classList.remove('dialog-open');
    });
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
});
