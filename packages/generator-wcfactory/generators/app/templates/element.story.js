import { storiesOf } from "@storybook/polymer";
import { withKnobs, text, boolean, number, color, object, array, date, select } from "@storybook/addon-knobs/polymer";
import "./<%= elementName %>";
const stories = storiesOf("<%= readmeName %>", module);
stories.addDecorator(withKnobs);
stories.add("<%= elementName %>",
  () => {
<%- storyPropDeclaration %>
  return `
  <<%= elementName %> <%- storyHTMLProps %>>
    <%= readmeName %>
  </<%= elementName %>>
  `;
});
