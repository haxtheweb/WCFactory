/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { LitElement, html } from '@polymer/lit-element';
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
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class <%= elementClassName %> extends <%= customElementClass %> {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "<%= elementName %>";
  }

  // life cycle
  constructor() {
    super();
    <%- constructorString %>
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    <%- connectedString %>
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
  <%- additionalFunctionsString %>
}
customElements.define("<%= elementName %>", <%= elementClassName %>);