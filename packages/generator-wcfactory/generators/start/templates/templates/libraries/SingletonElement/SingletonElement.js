/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
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
 * @customElement
 * @polymer
 * @demo demo/index.html
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
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    <%- connectedString %>
    window.addEventListener("<%= elementName %>-hide", this.hide<%= elementClassName %>.bind(this));
    window.addEventListener("<%= elementName %>-show", this.show<%= elementClassName %>.bind(this));
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.connectedCallback();
    window.removeEventListener("<%= elementName %>-hide", this.hide<%= elementClassName %>.bind(this));
    window.removeEventListener("<%= elementName %>-show", this.show<%= elementClassName %>.bind(this));
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
window.customElements.define(<%= elementClassName %>.tag, <%= elementClassName %>);
export { <%= elementClassName %> };
