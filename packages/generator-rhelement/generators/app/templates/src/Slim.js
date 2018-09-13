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

import 'slim-js';

/**
 * `<%= elementName %>`
 *
 *
 * @customElement
 * @slim
 * @demo demo/index.html
 */
Slim.tag(
  "<%= elementName %>",
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
    // use shadowDOM - well that was easy
    get useShadow() { return true }

    constructor() {
      super();
      // ensure default values are utilized when we setup
      let obj = <%= elementClassName %>.properties;
      for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
          this[p] = obj[p].value;
        }
      }
    }
    // native API, watch attribute changes off of things we define as our properties
    static get observedAttributes() {
      return Object.keys(<%= elementClassName %>.properties);
    }
    // bind attributes to properties
    // when 'who' attribute changed - it is reflected to the property, and the component alters the relevant text node.
    get autoBoundAttributes() {
      return Object.keys(<%= elementClassName %>.properties);
    }
  }
);