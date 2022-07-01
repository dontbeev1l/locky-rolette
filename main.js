// const viewController = new ViewController(licenseView);

let activeBet = 1;
const ROLETTE_VALUES = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 32, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
let spinActive = false;
let vertical = true;


const viewController = new ViewController(licenseView);
const storage = new Storage(
    {
        name: '',
        balance: 5000,
        music: true
    },
    {
        name: (value) => {
            nameValue.innerHTML = value;
        },
        balance: (value) => {
            if (value == 0) {
                storage.set('balance', 1000);
            }
            console.log(value);
            balanceValue1.innerHTML = value;
            balanceValue2.innerHTML = value;
        }
    });

document.querySelector('.accept_btn').addEventListener('click', () => {
    if (storage.get('name')) {
        viewController.setView(gameView)
    } else {
        viewController.setView(nameView)

    }
});

class Chat {
    constructor() {
        this.chatWapper = document.querySelector('.chat');
        // setInterval(() => this.sendMessage('Jack', 'Hi barbie' + Date.now()), 1000);
    }

    sendMessage(from, text) {
        this.chatWapper.insertAdjacentHTML('beforeend', ` <div class="chat-row"><span class="author author_${from}">${from}: </span>${text}</div>`);
        this.chatWapper.scrollTop = this.chatWapper.scrollHeight;
    }
}

const chat = new Chat();


const submitName = (e) => {
    e.stopPropagation();
    e.preventDefault();
    nameInp.blur();
    if (!nameInp.value) {
        return;
    }

    storage.set('name', nameInp.value);
    viewController.setView(gameView);
};

document.querySelector('.name-form').addEventListener('submit', submitName);
document.querySelector('.name-btn').addEventListener('click', submitName);
document.querySelector('.btn-play').addEventListener('click', () => {
    if (storage.get('music')) {
        song.play();

        document.querySelector('.sound').style.display = 'none';
        document.querySelector('.mute').style.display = 'inline-block';
    } else {
        song.pause();
        document.querySelector('.mute').style.display = 'none';
        document.querySelector('.sound').style.display = 'inline-block';
    }
    viewController.setView(roletteView)
});

document.querySelector('.home').addEventListener('click', () => viewController.setView(gameView));

const DEG_STEP = 360 / 37;

class Rolette {
    constructor() {
        this.rolette = document.querySelector('.rolette_с');
        this.ball = document.querySelector('.ball');
    }

    spin(clbck) {
        const roletteAng = 1800 + Math.round(Math.random() * 74 - 37) * DEG_STEP;
        const ballAng = -1800 - Math.round(Math.random() * 74 - 37) * DEG_STEP;

        this.rolette.classList.add('rolette_с_active');
        this.ball.classList.add('ball_active');
        this.rolette.style.transform = `rotate(${roletteAng}deg)`;
        this.ball.style.transform = `rotate(${ballAng}deg)`;

        const stepsFromZero = Math.round((((roletteAng - ballAng) + 360) % 360) / DEG_STEP);

        setTimeout(() => {
            this.rolette.classList.remove('rolette_с_active');
            this.ball.classList.remove('ball_active');
            this.rolette.style.transform = `rotate(${roletteAng % 360}deg)`;
            this.ball.style.transform = `rotate(${ballAng % 360}deg)`;

            clbck(ROLETTE_VALUES[(37 - stepsFromZero) % 37]);
        }, 5000);
    }
}

const r = new Rolette();

class Game {
    constructor() {
        this.history = [];
        this.bets = [];
        this.sumBet = 0;
        this.updateSumBet();
    }

    updateSumBet() {
        betValue1.innerHTML = this.sumBet;
    }

    betName(value) {
        if (`${+value}` == `${value}`) {
            return `${value} (${getColor(+value)})`;
        }

        const names = {
            '2to1_1': '1st 2 To 1',
            '2to1_2': '2nd 2 To 1',
            '2to1_3': '3rd 2 To 1',
            '12_1': '1st 12',
            '12_2': '2nd 12',
            '12_3': '3rd 12'
        }

        return names[value] || value;
    }

    clear() {
        if (spinActive) { return; }
        while (this.history.length) {
            this.undo();
        }
    }

    double() {
        if (spinActive) { return; }
        this.history.push('DM');
        this.history.forEach((h) => {
            if (h.type === 'bet') {
                this.bet(h.value, h.parent, true);
            }
        });

        chat.sendMessage('LR', `You double all you bets`);

        this.history.push({ type: 'double' });
    }

    bet(value, el, disableMessage) {
        if (spinActive) { return; }
        if (storage.get('balance') < activeBet) { return; }
        log(value);
        if (!el.querySelector('.chips')) {
            el.insertAdjacentHTML('beforeend', '<div class="chips"></div>')
        }

        const chips = el.querySelector('.chips');
        chips.insertAdjacentHTML('beforeend', `<img src="./img/chip_${activeBet}.png"></img>`);
        this.history.push({ type: 'bet', value, el: chips.children[chips.children.length - 1], parent: el });
        if (!disableMessage) {
            chat.sendMessage('LR', `You bet <img src="./img/coin.svg" alt=""> ${activeBet} to ${this.betName(value)}`)
        }
        this.sumBet += activeBet;

        storage.set('balance', storage.get('balance') - activeBet);
        this.updateSumBet();
        this.bets.push({ value, bet: activeBet });
    }

    undo() {
        if (spinActive) { return; }
        if (!this.history.length) { return; }

        const lastItem = this.history.splice(-1, 1)[0];
        if (lastItem.type === 'bet') {
            const lastBet = this.bets.splice(-1, 1)[0];
            lastItem.el.parentNode.removeChild(lastItem.el);
            this.sumBet -= lastBet.bet;
            storage.set('balance', storage.get('balance') + lastBet.bet);
            this.updateSumBet();
        }

        if (lastItem.type === 'double') {
            const historyBets = this.history.splice(this.history.lastIndexOf('DM'), this.history.length - this.history.lastIndexOf('DM'));
            historyBets.forEach(historyBet => {
                if (historyBet.type !== 'bet') { return; }
                const lastBet = this.bets.splice(-1, 1)[0];
                historyBet.el.parentNode.removeChild(historyBet.el);
                this.sumBet -= lastBet.bet;
                storage.set('balance', storage.get('balance') + lastBet.bet);
                this.updateSumBet();
            })
        }

        return;
    }

    spin() {
        if (spinActive) { return; }
        spinActive = true;
        r.spin((value) => {
            Array.from(document.querySelectorAll('.chips')).forEach(e => e.innerHTML = '');
            chat.sendMessage('LR', `${value} (${getColor(value)})`)
            this.calculateRes(value);
            spinActive = false;
        });
    }

    calculateRes(value) {
        log(value);
        let win = 0;
        this.bets.forEach(bet => {
            if (`${+bet.value}` === bet.value) {
                if (+bet.value === value) {
                    win += bet.bet * 30;
                }
                return;
            }
            if (bet.value === '2to1_1') {
                if ([3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(value)) {
                    win += bet.bet * 3;
                }
                return;
            }
            if (bet.value === '2to1_2') {
                if ([3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].map(v => v - 1).includes(value)) {
                    win += bet.bet * 3;
                }
                return;
            }
            if (bet.value === '2to1_3') {
                if ([3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].map(v => v - 2).includes(value)) {
                    win += bet.bet * 3;
                }
                return;
            }
            if (bet.value === '12_1') {
                if (value >= 1 && value <= 12) {
                    win += bet.bet * 3;
                }
                return;
            }
            if (bet.value === '12_2') {
                if (value >= 13 && value <= 24) {
                    win += bet.bet * 3;
                }
                return;
            }
            if (bet.value === '12_3') {
                if (value >= 25 && value <= 36) {
                    win += bet.bet * 3;
                }
                return;
            }
            if (bet.value === '1to18') {
                if (value >= 1 && value <= 18) {
                    win += bet.bet * 2;
                }
                return;
            }
            if (bet.value === '19to36') {
                if (value >= 19 && value <= 36) {
                    win += bet.bet * 2;
                }
                return;
            }
            if (bet.value === 'even') {
                if (value === 0) { return; }
                if (value % 2 === 0) {
                    win += bet.bet * 2;
                }
                return;
            }
            if (bet.value === 'odd') {
                if (value === 0) { return; }
                if (value % 2 === 1) {
                    win += bet.bet * 2;
                }
                return;
            }
            if (bet.value === 'red') {
                if (value === 0) { return; }
                if (getColor(value) === 'red') {
                    win += bet.bet * 2;
                }
                return;
            }
            if (bet.value === 'black') {
                if (value === 0) { return; }
                if (getColor(value) === 'black') {
                    win += bet.bet * 2;
                }
                return;
            }
        });

        storage.set('balance', storage.get('balance') + win);
        chat.sendMessage('LR', `You win: ${win}`)
        this.prevBets = this.bets;
        this.bets = [];
        this.history = [];
        this.sumBet = 0;
        this.updateSumBet();
    }
}

const game = new Game();

function getColor(value) {
    const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    if (value == +'0') {
        return 'green';
    }
    if (red.includes(+value)) {
        return 'red'
    }
    return 'black';
}

(() => {
    const numbers = document.querySelector('.numbers');
    for (let j = 0; j < 3; j++) {
        for (let i = 1; i <= 12; i++) {
            const value = i * 3 - j;
            numbers.insertAdjacentHTML('beforeend', `<div data-bet="${value}" class="number number_${getColor(value)}">${value}</div>`);
        }
    }

    Array.from(document.querySelectorAll('[data-bet]')).forEach(el => {
        el.addEventListener('click', () => game.bet(el.getAttribute('data-bet'), el))
    });

    Array.from(document.querySelectorAll('.bet-value')).forEach((el, index) => {
        el.addEventListener('click', () => {
            try {
                document.querySelector('.bet-value__active').classList.remove('bet-value__active');
            } catch (e) { }
            activeBet = [25, 10, 5, 1][index];
            el.classList.add('bet-value__active')
        })

        if (index === 3) {
            el.classList.add('bet-value__active')
        }
    });


    document.querySelector('.btn_undo').addEventListener('click', () => game.undo())
    document.querySelector('.btn_double').addEventListener('click', () => game.double())
    document.querySelector('.btn_clear').addEventListener('click', () => game.clear())
    document.querySelector('.btn_spin').addEventListener('click', () => game.spin())
})();


const scaleRolette = () => {
    requestAnimationFrame(scaleRolette);
    const wrapper = document.querySelector('.rolette-wrapper');
    const rolette = document.querySelector('.rolette');
    if (vertical) {
        // rolette.style.width = ``;
        // return;
    }

    rolette.style.width = `${Math.min(wrapper.clientWidth, wrapper.clientHeight) * 0.92}px`
}

scaleRolette();


const nicknames = new Nicknmes();

const fakeBet = () => {
    setTimeout(fakeBet, Math.round(Math.random() * 10000) + 20000);
    const r = Math.round(Math.random() * 36);
    chat.sendMessage(Nicknmes.getRandom(nicknames), `Bet ${Math.round(Math.random() * 500 + 1)} to ${r} (${getColor(r)})`);
}

fakeBet();


const checkVertical = () => {
    requestAnimationFrame(checkVertical);
    const view = document.querySelector('.view');
    vertical = view.clientWidth < view.clientHeight;

    if (vertical) {
        document.body.classList.add('vetical')
    } else {
        document.body.classList.remove('vetical')
    }
}


checkVertical();

document.querySelector('.sound').onclick = () => {
    document.querySelector('.sound').style.display = 'none';
    document.querySelector('.mute').style.display = 'inline-block';
    storage.set('music', true);
    song.play();
}

document.querySelector('.mute').onclick = () => {
    document.querySelector('.sound').style.display = 'inline-block';
    storage.set('music', false);
    document.querySelector('.mute').style.display = 'none';
    song.pause();
}