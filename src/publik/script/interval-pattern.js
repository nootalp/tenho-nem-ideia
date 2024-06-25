import { patterns } from './interval-list.js'

document.addEventListener('DOMContentLoaded', function() {
    const presetButtonsContainer = document.getElementById('preset-buttons');

    patterns.forEach(pattern => {
        console.log(pattern)
        const button = document.createElement('button');
        button.id = pattern.id;
        button.type = 'button';
        button.textContent = pattern.label;
        button.addEventListener('click', function() {
            document.getElementById('pattern-input').value = pattern.value;
        });
        presetButtonsContainer.appendChild(button);
    });
});
