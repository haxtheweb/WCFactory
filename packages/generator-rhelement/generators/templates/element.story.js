import { storiesOf } from "@storybook/polymer";
import "./<%= elementName %>";

storiesOf("<%= readmeName %>", module).add(
  "<%= elementName %>",
  () => `
  <<%= elementName %>>
    <%= readmeName %>
  </<%= elementName %>>
  `
);
