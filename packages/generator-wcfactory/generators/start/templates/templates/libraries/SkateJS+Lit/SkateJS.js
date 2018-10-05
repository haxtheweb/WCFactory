/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { props, withComponent } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';
import { html } from 'lit-html';
<%- includesString %>
export { <%= elementClassName %> };
// extend into class name matching library for consistency
class SkateJS extends withComponent(withLitHtml()) { }
/**
 * `<%= elementName %>`
 * `<%= description %>`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @skatejs
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

  /**
   * life cycle
   */
  constructor() {
    super();
    <%- constructorString %>
    // silly but this nets us data binding for default values
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
          this[p] = obj[p].value;
        }
      }
    }
  }
  // SkateJS props function that we map our abstracted properties object over to
  static get props() {
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/<%= elementClassName %>-properties.json
    let obj = <%= elementClassName %>.properties;
    let simpleProps = {};
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        simpleProps[p] = obj[p].value;
      }
    }
    return simpleProps;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connected() {
    <%- connectedString %>
  }

  <%- additionalFunctionsString %>
}
customElements.define("<%= elementName %>", <%= elementClassName %>);
