import { html } from 'lit-html';
import {
  withKnobs,
  text,
  boolean,
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { <%= elementClassName %> } from "./<%= elementName %>.js";
// need to account for polymer goofiness when webpack rolls this up

export default {
  title: '<%= storyGroup %>|<%= elementClassName %>',
  component: '<%= elementName %>',
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" },
  },
};
const utils = new StorybookUtilities();
export const <%= elementClassName %>Story = () => {
  return utils.makeUsageDocs(
    <%= elementClassName %>,
    import.meta.url, utils.makeElementFromClass(<%= elementClassName %>)
  );
};