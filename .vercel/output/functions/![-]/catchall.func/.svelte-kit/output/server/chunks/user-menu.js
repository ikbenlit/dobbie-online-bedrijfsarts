import { S as sanitize_props, G as fallback, B as setContext, O as store_get, J as attr_class, V as clsx, E as slot, M as attr, P as unsubscribe_stores, N as bind_props, C as pop, A as push, F as getContext, Y as attr_style, K as escape_html, R as stringify } from "./index.js";
import { w as writable } from "./index3.js";
import "./client.js";
import "clsx";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const sidebarStore = writable({ open: false });
const SidebarContextKey = Symbol("sidebar-context");
function Sidebar($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  var $$store_subs;
  let open;
  let animate = fallback($$props["animate"], true);
  setContext(SidebarContextKey, { sidebarStore, animate });
  function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  open = store_get($$store_subs ??= {}, "$sidebarStore", sidebarStore).open;
  $$payload.out += `<div${attr_class(clsx(cn($$sanitized_props.class, "md:fixed md:inset-y-0 md:left-0 md:z-30 md:w-64")))}><div${attr_class(clsx(cn("hidden md:flex h-full bg-brand-beige-light dark:bg-neutral-800 px-4 py-4 flex-col flex-shrink-0 transition-width duration-300 ease-in-out", open ? "md:w-64" : "md:w-20")))} role="navigation" aria-label="Hoofdnavigatie"><div class="flex-1 overflow-y-auto overflow-x-hidden"><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></div> <div class="py-2 border-t border-neutral-200 dark:border-neutral-700"><button class="w-full flex items-center justify-center p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"${attr("aria-label", open ? "Sidebar inklappen" : "Sidebar uitklappen")}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">`;
  if (open) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>`;
  }
  $$payload.out += `<!--]--></svg> `;
  if (open) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="ml-2 text-sm transition-opacity duration-200 opacity-100">Inklappen</span>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span class="ml-2 text-sm transition-opacity duration-200 opacity-0"></span>`;
  }
  $$payload.out += `<!--]--></button></div> <div class="pt-2 border-t border-neutral-200 dark:border-neutral-700"><!---->`;
  slot($$payload, $$props, "user", {});
  $$payload.out += `<!----></div></div> `;
  if (open) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" aria-hidden="true"></div> <div${attr_class(clsx(cn("fixed inset-y-0 left-0 w-64 bg-brand-beige-light dark:bg-neutral-800 p-4 z-40 flex flex-col md:hidden", $$sanitized_props.mobileClass)))} role="dialog" aria-modal="true" aria-label="Mobiel navigatiemenu"><button type="button" class="absolute right-4 top-4 text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white md:hidden" aria-label="Sluit navigatiemenu"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button> <div class="flex-1 overflow-y-auto overflow-x-hidden"><!---->`;
    slot($$payload, $$props, "default", {});
    $$payload.out += `<!----></div> <div class="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700"><!---->`;
    slot($$payload, $$props, "user", {});
    $$payload.out += `<!----></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { animate });
  pop();
}
function Sidebarlink($$payload, $$props) {
  push();
  var $$store_subs;
  let open;
  let link = fallback($$props["link"], () => ({ label: "", href: "", icon: "" }), true);
  let className = fallback($$props["className"], "");
  const { sidebarStore: sidebarStore2, animate } = getContext(SidebarContextKey);
  function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  open = store_get($$store_subs ??= {}, "$sidebarStore", sidebarStore2).open;
  $$payload.out += `<a${attr("href", link.href)}${attr("target", link.target || "_self")}${attr("rel", link.target === "_blank" ? "noopener noreferrer" : void 0)}${attr_class(clsx(cn("flex items-center justify-start gap-2 group/sidebar py-2", className)))}><span>${html(link.icon)}</span> `;
  if (animate) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition-all duration-300 ease-in-out whitespace-pre overflow-hidden"${attr_style(`max-width: ${open ? "200px" : "0px"}; opacity: ${open ? 1 : 0}; margin-left: ${open ? "8px" : "0px"};`)}>${escape_html(link.label)}</span>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span class="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre ml-2">${escape_html(link.label)}</span>`;
  }
  $$payload.out += `<!--]--></a>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { link, className });
  pop();
}
function Avatar($$payload, $$props) {
  push();
  let sizeClass, avatarColor, initials;
  let user = $$props["user"];
  let size = fallback($$props["size"], "md");
  function getAvatarInitials(u) {
    if (u.name) {
      return u.name.split(" ").map((part) => part[0]).join("").toUpperCase().substring(0, 2);
    }
    if (u.email) {
      return u.email[0].toUpperCase();
    }
    return "?";
  }
  function getUserColor(identifier) {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500"
    ];
    const sum = identifier.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  }
  sizeClass = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  }[size];
  avatarColor = getUserColor(user.email ?? "default");
  initials = getAvatarInitials(user);
  $$payload.out += `<div${attr_class(`relative flex items-center justify-center rounded-full overflow-hidden ${stringify(sizeClass)}`)}><div${attr_class(`flex items-center justify-center w-full h-full ${stringify(avatarColor)} text-white font-semibold`)}>${escape_html(initials)}</div></div>`;
  bind_props($$props, { user, size });
  pop();
}
const initialUser = { email: null };
const userStore = writable(initialUser);
function User_menu($$payload, $$props) {
  push();
  let user = $$props["user"];
  let isMenuOpen = false;
  let sidebarOpen;
  sidebarStore.subscribe((value) => {
    sidebarOpen = value.open;
  });
  $$payload.out += `<div class="relative"><button${attr_class("flex items-center p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 w-full", void 0, {
    "justify-center": !sidebarOpen,
    "space-x-3": sidebarOpen
  })}>`;
  Avatar($$payload, { user });
  $$payload.out += `<!----> `;
  if (sidebarOpen) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex-1 text-left overflow-hidden transition-opacity duration-200 opacity-100"><div class="font-medium truncate">${escape_html(user.name ?? user.email)}</div> `;
    if (user.name) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="text-xs text-neutral-500 dark:text-neutral-400 truncate">${escape_html(user.email)}</div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (sidebarOpen) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"${attr_class("w-5 h-5 transform transition-transform duration-200 text-neutral-500 dark:text-neutral-400 transition-opacity opacity-100", void 0, { "rotate-180": isMenuOpen })}><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"></path></svg>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { user });
  pop();
}
export {
  Sidebar as S,
  User_menu as U,
  Sidebarlink as a,
  html as h,
  sidebarStore as s,
  userStore as u
};
