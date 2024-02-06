document.addEventListener('DOMContentLoaded', (event) => {
    const topBar = document.createElement('div');
    topBar.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; background: grey; color: white; padding: 2px; text-align: left; z-index: 1000;';
    topBar.innerHTML = `<a href="./" style="color: white; text-decoration: none;"><b>Card.js</b></a> | <i>${titleSuffix}</i>`;
    document.body.prepend(topBar);
});
