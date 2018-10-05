/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
<%- includesString %>
export { <%= elementClassName %> };
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
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
  <%- additionalFunctionsString %>
}
window.customElements.define(<%= elementClassName %>.tag, <%= elementClassName %>);
