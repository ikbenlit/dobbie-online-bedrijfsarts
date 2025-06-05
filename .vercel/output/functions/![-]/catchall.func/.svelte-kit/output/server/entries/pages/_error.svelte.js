import { F as getContext, G as fallback, I as head, J as attr_class, K as escape_html, M as attr, N as bind_props, C as pop, A as push, O as store_get, P as unsubscribe_stores } from "../../chunks/index.js";
import "../../chunks/client.js";
/* empty css                                                      */
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function AvatarBubble($$payload, $$props) {
  push();
  let text = fallback($$props["text"], "");
  let avatarSrc = fallback($$props["avatarSrc"], "/images/avatar_shirley.webp");
  let bubblePosition = fallback($$props["bubblePosition"], "top");
  let avatarSize = fallback($$props["avatarSize"], "large");
  let bubbleAlign = fallback($$props["bubbleAlign"], "center");
  let textAlign = fallback($$props["textAlign"], "center");
  let textSize = fallback($$props["textSize"], "text-2xl");
  let textColor = fallback($$props["textColor"], "text-gray-800");
  const avatarSizeClass = {
    small: "w-12 h-12",
    medium: "w-20 h-20",
    large: "w-28 h-28"
  }[avatarSize];
  const textAlignClass = {
    center: "text-center",
    left: "text-left",
    right: "text-right"
  }[textAlign];
  head($$payload, ($$payload2) => {
    $$payload2.out += `<style>
    .speech-bubble.right[style*="left-1/2"]::before {
      left: 50%;
      transform: translateX(-50%);
    }
    .speech-bubble.right[style*="left-0"]::before {
      left: 32px;
    }
    .speech-bubble.right[style*="right-0"]::before {
      right: 32px;
    }
  </style>`;
  });
  $$payload.out += `<div class="flex flex-col items-center justify-center w-fit mx-auto"><div class="flex flex-col items-center"><div${attr_class(`speech-bubble right mb-4 min-w-[200px] max-w-xl ${textAlignClass} ${textSize} ${textColor}`, "svelte-1ab6sng")} style="position: relative;">${escape_html(text)}</div> <img${attr("src", avatarSrc)} alt="Avatar"${attr_class(`rounded-full object-cover border-4 border-white shadow-lg ${avatarSizeClass}`, "svelte-1ab6sng")} style="z-index: 10;" loading="lazy"></div></div>`;
  bind_props($$props, {
    text,
    avatarSrc,
    bubblePosition,
    avatarSize,
    bubbleAlign,
    textAlign,
    textSize,
    textColor
  });
  pop();
}
function _error($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<div class="min-h-screen flex flex-col items-center justify-center bg-beige-light px-4">`;
  if (store_get($$store_subs ??= {}, "$page", page).status === 404) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center w-full max-w-xl mx-auto"><h1 class="mb-8 text-4xl md:text-5xl font-bold font-sans text-black text-center">Whoops, deze pagina bestaat niet!</h1> <div class="flex justify-center w-full mb-8">`;
    AvatarBubble($$payload, {
      text: "Klik hieronder om terug te gaan naar de startpagina.",
      avatarSize: "large",
      bubblePosition: "top",
      bubbleAlign: "center"
    });
    $$payload.out += `<!----></div> <a href="/" class="mt-4 btn-primary inline-block text-center font-semibold rounded-[6px] px-8 py-4 text-xl md:text-2xl text-white bg-brand-pink-strong hover:bg-brand-pink-hover transition-colors duration-300 shadow-md">Terug naar home</a></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<h1 class="mb-4 text-4xl font-bold text-red-600 sm:text-5xl">Er is een fout opgetreden</h1> <p class="mb-8 text-lg text-gray-600 sm:text-xl">Er is iets misgegaan. Foutcode: ${escape_html(store_get($$store_subs ??= {}, "$page", page).status)}</p> <p class="text-md text-gray-500">${escape_html(store_get($$store_subs ??= {}, "$page", page).error?.message)}</p> <a href="/" class="mt-8 rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Terug naar de startpagina</a>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _error as default
};
