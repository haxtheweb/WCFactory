/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import 'slim-js';
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
 * @slimjs
 * @demo demo/index.html
 */
Slim.tag(
  "<%= elementName %>",
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
      super();
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
	         this[p] = obj[p].value;
          }
        }
      }
    }
    // use shadowDOM - well that was easy
    get useShadow() { return true }
    // native API, watch attribute changes off of things we define as our properties
    static get observedAttributes() {
      return Object.keys(<%= elementClassName %>.properties);
    }
    /**
     * life cycle, element is afixed to the DOM
     */
    onRender() {
      <%- connectedString %>
    }
    <%- additionalFunctionsString %>
  }
);