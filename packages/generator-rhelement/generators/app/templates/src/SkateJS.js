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

import { props, withComponent } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';
import { html } from 'lit-html';
class SkateJS extends withComponent(withLitHtml()) { }

/**
 * `<%= elementName %>`
 *
 *
 * @customElement
 * @lit-html
 * @skatejs
 * @demo demo/index.html
 */
class <%= elementClassName %> extends <%= customElementClass %> {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  tag() {
    return "<%= elementName %>";
  }
  /**
   * A file that contains the HTML template for the element.
   */
  templateUrl() {
    return "<%= elementName %>.html";
  }
  /**
   * A file that contains the properties that will be wired into this element.
   */
  propertiesUrl() {
    return "<%= elementName %>-properties.json";
  }
  /**
   * A file that contains the css for this element to be mixed into the html block.
   */
  styleUrl() {
  <%_ if (useSass) { _%>
    return "<%= elementName %>.scss";
  <%_ } else { _%>
    return "<%= elementName %>.css";
  <%_ } _%>
  }
  constructor() {
    super();
    // silly but this nets us data binding for default values
    let obj = <%= elementClassName %>.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        this[p] = obj[p].value;
      }
    }
  }
  // SkateJS props function that we map our abstracted properties object over to
  static get props() {
    let obj = <%= elementClassName %>.properties;
    let simpleProps = {};
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        simpleProps[p] = obj[p].value;
      }
    }
    return simpleProps;
  }
}
customElements.define("<%= elementName %>", <%= elementClassName %>);
