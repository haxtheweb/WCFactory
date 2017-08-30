const <%= lowerCaseName %>Template = document.createElement('template');
<%= lowerCaseName %>Template.innerHTML = `
  <style>
    :host {
      display: block;
    }
  </style>

  <slot></slot>
`;

if (window.ShadyCSS) {
  ShadyCSS.prepareTemplate(<%= lowerCaseName %>Template, '<%= elementName %>');
}

class <%= elementClassName %> extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(<%= lowerCaseName %>Template.content.cloneNode(true));
  }

  connectedCallback() {
    if (window.ShadyCSS) {
      ShadyCSS.styleElement(this);
    }
  }
}

window.customElements.define('<%= elementName %>', <%= elementClassName %>);
