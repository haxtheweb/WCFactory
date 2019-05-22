/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/HAXCMSThemeWiring.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

<%- includesString %>
/**
 * `<%= elementName %>`
 * `<%= description %>`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class <%= elementClassName %> extends HAXCMSTheme(<%= customElementClass %>) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "<%= elementName %>";
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    this.__disposer = [];
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    autorun(reaction => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });
    <%- connectedString %>
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  /**
   * Previous page to hook into when prev is hit
   */
  prevPage(e) {
    super.prevPage(e);
  }
  /**
   * Next page to hook into when next is hit
   */
  nextPage(e) {
    super.nextPage(e);
  }

  <%- additionalFunctionsString %>
}
window.customElements.define(<%= elementClassName %>.tag, <%= elementClassName %>);
export { <%= elementClassName %> };
