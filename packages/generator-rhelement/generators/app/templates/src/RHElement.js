/*
 * Copyright <%= year %> <%= copyrightOwner %>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import RHElement from "../rhelement/rhelement.js";

/**
 * `<%= elementName %>`
 *
 *
 * @customElement
 * @demo demo/index.html
 */
class <%= elementClassName %> extends <%= customElementClass %> {

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "<%= elementName %>";
  }
  /**
   * A file that contains the HTML template for the element.
   */
  get templateUrl() {
    return "<%= elementName %>.html";
  }
  /**
   * A file that contains the properties that will be wired into this element.
   */
  get propertiesUrl() {
    return "<%= elementName %>-properties.json";
  }
  /**
   * A file that contains the css for this element to be mixed into the html block.
   */
  get styleUrl() {
  <%_ if (useSass) { _%>
    return "<%= elementName %>.scss";
  <%_ } else { _%>
    return "<%= elementName %>.css";
  <%_ } _%>
  }

  constructor() {
    super(<%= elementClassName %>.tag);
    // map properties object to local values
    let obj = <%= elementClassName %>.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        this[p] = obj[p].value;
      }
    }
  }

  // static get observedAttributes() {
  //   return [];
  // }
  // connectedCallback() {
  //   super.connectedCallback();
  // }
  // disconnectedCallback() {}
  // attributeChangedCallback(attr, oldValue, newValue) {}
}

RHElement.create(<%= elementClassName %>);
