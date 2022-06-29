/*
<div class="more__range range">
    <input type="number" value="1" class="range__input">
    <div class="range__control control_minus">-</div>
    <div class="range__control control_plus">+</div>
    <span class="range__value">1</span>
</div>
*/

const modulesLoader = new ModulesLoader();
modulesLoader
    .loadModule('log')
    .loadModule('parallax')
    .loadModule('background')
    .loadModule('view')
    .loadModule('storage')
    .loadModule('nicknames')
    .onload([
        './background.js',
        './views.js',
        './main.js']);
