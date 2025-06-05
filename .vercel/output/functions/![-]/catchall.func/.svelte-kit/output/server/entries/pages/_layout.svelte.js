import { E as slot } from "../../chunks/index.js";
function _layout($$payload, $$props) {
  $$payload.out += `<div class="min-h-screen flex flex-col"><main class="flex-grow"><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></main></div>`;
}
export {
  _layout as default
};
