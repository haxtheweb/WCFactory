import { storiesOf } from "@storybook/polymer";
import { withKnobs, text, boolean, number, color, object, array, date, select } from "@storybook/addon-knobs/polymer";
import "./heym-asdf";
const stories = storiesOf("Asdf", module);
stories.addDecorator(withKnobs);
stories.add("heym-asdf",
  () => {
  const title = text("title", "");

  return `
  <heym-asdf title="${title}"; >
    Asdf
  </heym-asdf>
  `;
});
