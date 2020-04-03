document.body.appendChild(document.createElement('textarea'));
const textarea = document.querySelector('textarea');
textarea.classList.add('use-keyboard');


const KEYBOARD = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    layouts: {
      ru: [
        'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
        'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
        'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
        'lshift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'uarr', 'shift',
        'ctrl', 'lang', 'alt', 'space', 'alt', 'ctrl', 'larr', 'darr', 'rarr',
      ],
      en: [
        '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
        'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
        'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter',
        'lshift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'uarr', 'shift',
        'ctrl', 'lang', 'alt', 'space', 'alt', 'ctrl', 'larr', 'darr', 'rarr',
      ],
    },
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    english: true,
  },

  init() {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'hidden');
    this.elements.keysContainer.className = 'keyboard__keys';
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    document.querySelector('.use-keyboard').addEventListener('focus', () => {
      this.open(document.querySelector('.use-keyboard').value, (currentValue) => {
        document.querySelector('.use-keyboard').value = currentValue;
      });
    });
  },

  createKeys() {
    const fragment = document.createDocumentFragment();
    let keyLayout = [];

    if (this.properties.english) {
      keyLayout = this.elements.layouts.en;
    } else {
      keyLayout = this.elements.layouts.ru;
    }

    // Create keys
    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', '\\', 'enter', 'shift'].indexOf(key) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      keyElement.addEventListener('click', () => {
        textarea.focus();
      });

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Backspace';

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value
              .substring(0, this.properties.value.length - 1);
            this.triggerEvent('oninput');
          });
          break;

        case 'tab':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Tab';

          keyElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.properties.value += '\t';
            this.triggerEvent('oninput');
          });
          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.textContent = 'CapsLock';
          keyElement.id = 'Caps';

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });
          break;

        case 'lshift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Shift';

          keyElement.addEventListener('mousedown', () => {
            this.shiftPress();
          });
          keyElement.addEventListener('mouseup', () => {
            this.shiftUnpress();
          });
          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Shift';

          keyElement.addEventListener('mousedown', () => {
            this.shiftPress();
          });
          keyElement.addEventListener('mouseup', () => {
            this.shiftUnpress();
          });
          break;

        case 'ctrl':
          keyElement.textContent = 'Ctrl';
          keyElement.id = 'Control';
          break;

        case 'lang':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = 'EN';
          keyElement.id = 'lang';
          keyElement.addEventListener('mousedown', () => {
            this.toggleLang();
          });
          break;

        case 'alt':
          keyElement.textContent = 'Alt';
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = 'Enter';

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n';
            this.triggerEvent('oninput');
          });
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.textContent = 'Space';

          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this.triggerEvent('oninput');
          });
          break;

        case 'darr':
          keyElement.textContent = '↓';
          keyElement.id = 'ArrowDown';

          keyElement.addEventListener('click', () => {
            this.properties.value += '↓';
            this.triggerEvent('oninput');
          });
          break;

        case 'uarr':
          keyElement.textContent = '↑';
          keyElement.id = 'ArrowUp';

          keyElement.addEventListener('click', () => {
            this.properties.value += '↑';
            this.triggerEvent('oninput');
          });
          break;

        case 'larr':
          keyElement.textContent = '←';
          keyElement.id = 'ArrowLeft';

          keyElement.addEventListener('click', () => {
            this.properties.value += '←';
            this.triggerEvent('oninput');
          });
          break;

        case 'rarr':
          keyElement.textContent = '→';
          keyElement.id = 'ArrowRight';

          keyElement.addEventListener('click', () => {
            this.properties.value += '→';
            this.triggerEvent('oninput');
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            this.properties.value += keyElement.textContent;
            this.triggerEvent('oninput');
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    this.elements.keys.forEach((key) => {
      const resultKey = key;
      if (key.textContent.length === 1) {
        resultKey.textContent = this.properties
          .capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
      return resultKey;
    });
  },

  toggleLang() {
    for (let index = 0; index < this.elements.keys.length; index += 1) {
      const buttonIsSymbol = this.elements.layouts.en[index].length === 1;
      // Change only symbol buttons
      if (buttonIsSymbol) {
        if (this.properties.english) {
          this.elements.keys[index].textContent = this.elements.layouts.ru[index];
        } else {
          this.elements.keys[index].textContent = this.elements.layouts.en[index];
        }
      }
    }
    const langButtonText = document.getElementById('lang').textContent;
    if (langButtonText === 'EN') {
      document.getElementById('lang').textContent = 'RU';
    } else document.getElementById('lang').textContent = 'EN';

    this.properties.english = !this.properties.english;
  },


  shiftPress() {
    this.elements.keys.forEach((key) => {
      const shiftedKey = key;
      if (key.textContent.length === 1) {
        shiftedKey.textContent = key.textContent.toUpperCase();
      }
    });
    this.properties.shift = true;
  },

  shiftUnpress() {
    if (!this.properties.capsLock) {
      this.elements.keys.forEach((key) => {
        const unshiftedKey = key;
        if (key.textContent.length === 1) {
          unshiftedKey.textContent = key.textContent.toLowerCase();
        }
      });
    }
    this.properties.shift = false;
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('hidden');
  },
};

window.addEventListener('DOMContentLoaded', () => {
  KEYBOARD.init();
  KEYBOARD.open();
  textarea.focus();
});

// Input from real keyboard
textarea.onkeydown = (event) => {
  document.querySelectorAll('.keyboard__key').forEach((key) => {
    if (key.innerText.toLowerCase() === event.key.toLowerCase() ||
      key.innerText === event.code ||
      event.key === key.id) {
      key.classList.add('red');
    }
  });

  switch (event.key) {
    case 'Enter':
      KEYBOARD.properties.value += '\n';
      break;

    case 'Backspace':
      // KEYBOARD.properties.value = KEYBOARD.properties.value
      //   .substring(0, KEYBOARD.properties.value.length - 1);
      break;

    case 'CapsLock':
      document.querySelector('#Caps').classList.toggle('keyboard__key--active', !KEYBOARD.properties.capsLock);
      KEYBOARD.toggleCapsLock();
      break;

    case 'Shift':
      if (KEYBOARD.properties.ctrl === true) {
        KEYBOARD.toggleLang();
      }
      KEYBOARD.shiftPress();
      break;

    case 'Tab':
      event.preventDefault();
      textarea.value += '\t';
      break;

    case 'ArrowUp':
      event.preventDefault();
      textarea.value += '↑';
      break;

    case 'ArrowDown':
      event.preventDefault();
      textarea.value += '↓';
      break;

    case 'ArrowRight':
      event.preventDefault();
      textarea.value += '→';
      break;

    case 'ArrowLeft':
      event.preventDefault();
      textarea.value += '←';
      break;

    default:
      event.preventDefault();
      if (event.key.length === 1) {
        switch (KEYBOARD.properties.capsLock || KEYBOARD.properties.shift) {
          case true:
            KEYBOARD.properties.value += event.key.toUpperCase();
            textarea.value += event.key.toUpperCase();
            break;

          default:
            KEYBOARD.properties.value += event.key.toLowerCase();
            textarea.value += event.key.toLowerCase();
            break;
        }
      }
      break;
  }
};

textarea.onkeyup = (event) => {
  document.querySelectorAll('.keyboard__key').forEach((key) => {
    if (key.innerText.toLowerCase() === event.key.toLowerCase() ||
      key.innerText === event.code ||
      event.key === key.id) {
      key.classList.remove('red');
    }
    if (event.key === 'Shift') {
      KEYBOARD.shiftUnpress();
    }
  });
};
