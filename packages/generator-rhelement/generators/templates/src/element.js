import Rhelement from '../rhelement/rhelement.js';

/*
 * DO NOT EDIT. This will be autopopulated with the
 * html from <%= elementName %>.html and css from
 * <%= elementName %>.<% if (useSass) { %>scss<% } else { %>css<% } %>
 */
const template = document.createElement('template');
template.innerHTML = ``;
/* end DO NOT EDIT */

class <%= elementClassName %> extends Rhelement {
  constructor() {
    super('<%= elementName %>', template);
  }
}

window.customElements.define('<%= elementName %>', <%= elementClassName %>);
