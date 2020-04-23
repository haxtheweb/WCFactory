/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';
<%- includesString %>
/**
 * `<%= elementName %>`
 * `<%= description %>`
 * @demo demo/index.html
 * @element <%= elementName %>
 */
class <%= elementClassName %> extends <%= customElementClass %> {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Convention we use
   */
  static get tag() {
    return "<%= elementName %>";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    <%- constructorString %>
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    <%- connectedString %>
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
  <%- additionalFunctionsString %>
}
customElements.define(<%= elementClassName %>.tag, <%= elementClassName %>);
export { <%= elementClassName %> };
