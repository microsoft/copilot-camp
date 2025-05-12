document.addEventListener('DOMContentLoaded', function () {
    const navInner = document.querySelector('.md-nav--primary');
    const navUls = navInner.querySelector('ul.md-nav__list');
    const activelistItem = Array.from(navUls.children).filter(child => child.classList.contains('md-nav__item--active'))[0];

    if (!activelistItem) {
        return;
    }
    const activeNav = activelistItem.querySelector('ul.md-nav__list');

    const items = activeNav.querySelectorAll('li');
    let currentIndex = -1
    for (let i = 0; i < items.length; i++) {
        if (items[i].classList.contains('md-nav__item--active')) {
            currentIndex = i;
            break;
        }
    }

    const navItems = Array.from(activeNav.children).map(child => child.querySelector('a'));
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = 'github-button';
    if (currentIndex !== -1 && currentIndex < navItems.length - 1) {
        const nextUrl = navItems[currentIndex + 1].getAttribute('href');
        nextButton.onclick = () => { window.location.href = nextUrl; };
    } else {
        nextButton.disabled = true;
    }
    const container = document.querySelector('.md-content__inner');
    container.appendChild(nextButton);
});
