/**
 * Copyright 2018 Red Hat, Inc.
 * @license MIT, see License.md for full text.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { HAXWiring } from "hax-body-behaviors/lib/HAXWiring.js"
/**
 * `heym-asdf`
 * `asdf`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement heym-asdf
 * @polymer
 * @demo demo/index.html
 */
class HeymAsdf extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "heym-asdf";
  }
  /**
   * A file that contains the HTML template for the element.
   * @notice function name must be here for tooling to operate correctly
   */
  get templateUrl() {
    return "heym-asdf.html";
  }
  /**
   * A file that contains the properties that will be wired into this element.
   * @notice function name must be here for tooling to operate correctly
   */
  get propertiesUrl() {
    return "heym-asdf-properties.json";
  }
  /**
   * A file that contains the HAX properties that will be wired into this element.
   * @notice function name must be here for tooling to operate correctly
   */
  get HAXPropertiesUrl() {
    return "heym-asdf-hax.json";
  }
  /**
   * A file that contains the css for this element to be mixed into the html block.
   * @notice function name must be here for tooling to operate correctly
   */
  get styleUrl() {
    return "heym-asdf.css";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring;
    this.HAXWiring.setHaxProperties(HeymAsdf.haxProperties, HeymAsdf.tag, this);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
    // Observer title for changes
          _titleChanged (newValue, oldValue) {
            if (typeof newValue !== typeof undefined) {
              console.log(newValue);
            }
          }


}
window.customElements.define(HeymAsdf.tag, HeymAsdf);
