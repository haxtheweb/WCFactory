/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { LitElement, html, css } from 'lit';
<%- includesString %>
/**
 * `<%= elementName %>`
 * `<%= description %>`
 * @demo demo/index.html
 * @element <%= elementName %>
 */
class <%= elementClassName %> extends <%= customElementClass %> {
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
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }  
  <%- additionalFunctionsString %>
}
globalThis.customElements.define(<%= elementClassName %>.tag, <%= elementClassName %>);
export { <%= elementClassName %> };
