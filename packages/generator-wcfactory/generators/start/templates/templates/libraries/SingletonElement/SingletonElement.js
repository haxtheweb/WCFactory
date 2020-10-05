/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
// register globally so we can make sure there is only one
window.<%= elementClassName %> = window.<%= elementClassName %> || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same <%= elementName %> element, making it a singleton.
window.<%= elementClassName %>.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!window.<%= elementClassName %>.instance) {
    window.<%= elementClassName %>.instance = document.createElement("<%= elementName %>");
    document.body.appendChild(window.<%= elementClassName %>.instance);
  }
  return window.<%= elementClassName %>.instance;
};
<%- includesString %>
/**
 * `<%= elementName %>`
 * `<%= description %>`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @element <%= elementName %>
 */
class <%= elementClassName %> extends <%= customElementClass %> {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
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
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    <%- connectedString %>
    window.addEventListener("<%= elementName %>-hide", this.hide <%= elementClassName %>.bind(this));
    window.addEventListener("<%= elementName %>-show", this.show <%= elementClassName %>.bind(this));
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    window.removeEventListener("<%= elementName %>-hide", this.hide <%= elementClassName %>.bind(this));
    window.removeEventListener("<%= elementName %>-show", this.show <%= elementClassName %>.bind(this));
    super.disconnectedCallback();
  }
  /**
   * Hide callback
   */
  hide<%= elementClassName %> (e) {
    // add your code to run when the singleton hides
  }
  /**
   * Show / available callback
   */
  show<%= elementClassName %> (e) {
    // add your code to run when the singleton is called for
  }

  <%- additionalFunctionsString %>
}
customElements.define(<%= elementClassName %>.tag, <%= elementClassName %>);
export { <%= elementClassName %> };
