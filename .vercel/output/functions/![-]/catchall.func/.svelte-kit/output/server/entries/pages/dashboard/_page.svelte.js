import { O as store_get, P as unsubscribe_stores } from "../../../chunks/index.js";
import { S as Sidebar, u as userStore, U as User_menu, a as Sidebarlink } from "../../../chunks/user-menu.js";
function _page($$payload) {
  var $$store_subs;
  let user = store_get($$store_subs ??= {}, "$userStore", userStore);
  $$payload.out += `<div class="flex h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">`;
  Sidebar($$payload, {
    animate: true,
    $$slots: {
      desktop: ($$payload2) => {
        $$payload2.out += `<div slot="desktop" class="flex flex-col space-y-2"><div class="px-3 py-4"><h2 class="text-lg font-bold">Dashboard</h2></div> `;
        Sidebarlink($$payload2, {
          link: {
            href: "/dashboard",
            label: "Dashboard",
            icon: "home"
          }
        });
        $$payload2.out += `<!----> `;
        Sidebarlink($$payload2, {
          link: {
            href: "/dashboard/projecten",
            label: "Projecten",
            icon: "folder"
          }
        });
        $$payload2.out += `<!----> `;
        Sidebarlink($$payload2, {
          link: {
            href: "/dashboard/taken",
            label: "Taken",
            icon: "check-square"
          }
        });
        $$payload2.out += `<!----> `;
        Sidebarlink($$payload2, {
          link: {
            href: "/dashboard/team",
            label: "Team",
            icon: "users"
          }
        });
        $$payload2.out += `<!----> `;
        Sidebarlink($$payload2, {
          link: {
            href: "/dashboard/rapportages",
            label: "Rapportages",
            icon: "bar-chart"
          }
        });
        $$payload2.out += `<!----></div>`;
      },
      user: ($$payload2) => {
        $$payload2.out += `<div slot="user">`;
        User_menu($$payload2, { user });
        $$payload2.out += `<!----></div>`;
      },
      mobile: ($$payload2) => {
        $$payload2.out += `<div slot="mobile" class="flex flex-col space-y-2 mt-10"><div class="px-3 py-4"><h2 class="text-lg font-bold">Dashboard</h2></div> `;
        Sidebarlink($$payload2, {
          link: {
            href: "/dashboard",
            label: "Dashboard",
            icon: "home"
          }
        });
        $$payload2.out += `<!----> `;
        Sidebarlink($$payload2, {
          link: {
            href: "/dashboard/projecten",
            label: "Projecten",
            icon: "folder"
          }
        });
        $$payload2.out += `<!----> `;
        Sidebarlink($$payload2, {
          link: {
            href: "/dashboard/taken",
            label: "Taken",
            icon: "check-square"
          }
        });
        $$payload2.out += `<!----> `;
        Sidebarlink($$payload2, {
          link: {
            href: "/dashboard/team",
            label: "Team",
            icon: "users"
          }
        });
        $$payload2.out += `<!----> `;
        Sidebarlink($$payload2, {
          link: {
            href: "/dashboard/rapportages",
            label: "Rapportages",
            icon: "bar-chart"
          }
        });
        $$payload2.out += `<!----></div>`;
      },
      "user-mobile": ($$payload2) => {
        $$payload2.out += `<div slot="user-mobile">`;
        User_menu($$payload2, { user });
        $$payload2.out += `<!----></div>`;
      }
    }
  });
  $$payload.out += `<!----> <main class="flex-grow p-8"><h1 class="text-2xl font-bold mb-6">Dashboard</h1> <p>Welkom bij het dashboard. Dit is een voorbeeld implementatie van de sidebar met gebruikerssectie.</p></main></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
export {
  _page as default
};
