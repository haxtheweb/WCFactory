import Rhelement from "../rhelement/rhelement.js";

class <%= elementClassName %> extends Rhelement {
  static get tag() {
    return "<%= elementName %>";
  }

  get templateUrl() {
    return "<%= elementName %>.html";
  }
<% if (useSass) { %>
  get styleUrl() {
    return "<%= elementName %>.scss";
  }
<% } %>

  constructor() {
    super(<%= elementClassName %>.tag);
  }
}

Rhelement.create(<%= elementClassName %>);
