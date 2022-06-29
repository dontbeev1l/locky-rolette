(() => {
    const tick = () => {
        requestAnimationFrame(tick);
        const elements = document.querySelectorAll('.range:not([data-processed])');
        Array.from(elements).forEach(el => {
            el.setAttribute('data-processed', '');
            const input = el.querySelector('.range__input');
            const rangeValueEl = el.querySelector('.range__value');
            
            let value = input.value;
            rangeValueEl.innerHTML = value;

            el.querySelector('.control_minus').addEventListener('click', () => {
                value--;
                if (value < 1) {
                    value = 1;
                }
                rangeValueEl.innerHTML = value;
            });
            el.querySelector('.control_plus').addEventListener('click', () => {
                value++;
                if (value > 10) {
                    value = 10;
                }
                rangeValueEl.innerHTML = value;
            });
        })

    }
    tick();
})()
