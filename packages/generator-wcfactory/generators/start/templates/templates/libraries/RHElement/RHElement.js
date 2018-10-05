/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import RHElement from "@rhelements/rhelement/rhelement.js";
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
 * @rhelement
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
   * life cycle
   */
  constructor() {
    super(<%= elementClassName %>.tag);
    <%- constructorString %>
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/<%= elementClassName %>-properties.json
    let obj = <%= elementClassName %>.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        }
        else {
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
  }

  // static get observedAttributes() {
  //   return [];
  // }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    <%- connectedString %>
  }
  // disconnectedCallback() {}
  // attributeChangedCallback(attr, oldValue, newValue) {}
  <%- additionalFunctionsString %>
}

RHElement.create(<%= elementClassName %>);
