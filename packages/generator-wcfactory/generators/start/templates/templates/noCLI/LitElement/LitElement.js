/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';
/**
 * `<%= elementName %>`
 * `<%= description %>`
 * @demo demo/index.html
 * @element <%= elementName %>
 */
class <%= elementClassName %> extends <%= customElementClass %> {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    <%- constructorString %>
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [...styles, css`
      :host {
        display: block;
      }
    `]
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "<%= elementName %>";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
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
}
customElements.define(<%= elementClassName %>.tag, <%= elementClassName %>);
export { <%= elementClassName %> };
