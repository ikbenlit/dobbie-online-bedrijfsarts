<script lang="ts">
  import { sidebarStore, type SidebarState } from '$lib/stores/sidebarStore.js';

  function toggleSidebar() {
    sidebarStore.update((state: SidebarState) => ({ ...state, open: !state.open }));
  }
</script>

<button
  on:click={toggleSidebar}
  class="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
  aria-label="Open sidebar"
>
  <!-- Basic Hamburger Icon SVG -->
  <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
</button> 