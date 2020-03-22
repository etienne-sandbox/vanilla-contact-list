run();

interface Contact {
  id: string;
  name: string;
  email: string | null;
}

function run() {
  const rootEl = getElementByIdOrThrow('root');

  let contacts: Array<Contact> = [
    {
      id: 'p9n51g',
      name: 'Alice',
      email: null
    },
    {
      id: '8mopn7',
      name: 'Bob',
      email: 'bob@gmail.com'
    },
    {
      id: 'u7oo0d',
      name: 'Paul',
      email: 'paul@gmail.com'
    }
  ];

  const { contactsEl } = createApp();

  // initial render
  renderApp();

  function createApp() {
    const titleEl = createElement('h1', { children: 'Contacts', className: 'title' });
    const contactsEl = createElement('div', { className: 'contacts' });
    const { addFormEl } = createAddForm();
    const appEl = createElement('div', {
      className: 'app',
      children: [titleEl, contactsEl, addFormEl]
    });
    rootEl.appendChild(appEl);
    return {
      contactsEl
    };
  }

  function createAddForm() {
    const inputNameEl: HTMLInputElement = createElement('input') as any;
    inputNameEl.placeholder = 'name';
    const inputEmailEl: HTMLInputElement = createElement('input') as any;
    inputEmailEl.placeholder = 'email';
    const addButtonEl = createElement('button', {
      children: 'Add'
    });
    addButtonEl.addEventListener('click', () => {
      if (inputNameEl.value.length === 0) {
        return;
      }
      contacts.push({
        id: randomShortId(),
        name: inputNameEl.value,
        email: inputEmailEl.value.length > 0 ? inputEmailEl.value : null
      });
      renderApp();
      inputNameEl.value = '';
      inputEmailEl.value = '';
    });
    const addFormEl = createElement('div', {
      className: 'add',
      children: [inputNameEl, inputEmailEl, addButtonEl]
    });
    return { addFormEl };
  }

  function renderApp() {
    renderContacts();
  }

  function renderContacts() {
    contactsEl.innerHTML = '';
    const contactItemEls = contacts.map(contact => {
      const deleteEl = createElement('button', {
        className: 'remove',
        children: 'Delete'
      });
      deleteEl.addEventListener('click', () => {
        contacts = contacts.filter(c => c.id !== contact.id);
        renderApp();
      });
      return createElement('div', {
        className: 'contact',
        children: [
          createElement('div', {
            className: 'infos',
            children: [
              createElement('h2', { children: contact.name }),
              contact.email === null ? null : createElement('p', { children: contact.email })
            ]
          }),
          deleteEl
        ]
      });
    });
    contactItemEls.forEach(elem => {
      contactsEl.appendChild(elem);
    });
  }
}

type ElementType = 'div' | 'h1' | 'h2' | 'h3' | 'button' | 'p' | 'input';

type ChildrenItem = string | HTMLElement | null;

type Children = ChildrenItem | Array<ChildrenItem>;

interface ElementsProps {
  className?: string;
  children?: Children;
}

function createElement(type: ElementType, props: ElementsProps = {}): HTMLElement {
  const elem = document.createElement(type);
  if (props.className) {
    elem.className = props.className;
  }
  if (props.children) {
    const childrenArray = Array.isArray(props.children) ? props.children : [props.children];
    childrenArray
      .map(children => {
        if (typeof children === 'string') {
          return document.createTextNode(children);
        }
        return children;
      })
      .map(item => {
        if (item) {
          elem.appendChild(item);
        }
      });
  }
  return elem;
}

function getElementByIdOrThrow(id: string): HTMLElement {
  const elem = document.getElementById(id);
  if (!elem) {
    throw new Error(`Cannot find element with id "${id}"`);
  }
  return elem;
}

/**
 * Return a short (5 chars) string ID
 */
function randomShortId(): string {
  return Math.random()
    .toString(36)
    .substring(7);
}
