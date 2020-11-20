
import { html } from "lit-element/lit-element.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { <%= elementClassName %> } from "./<%= elementName %>.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: '<%= storyGroup %>|<%= elementClassName %>',
  component: '<%= elementName %>',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const <%= elementClassName %>Story = () => {
  return utils.makeElementFromClass(<%= elementClassName %>);
};
