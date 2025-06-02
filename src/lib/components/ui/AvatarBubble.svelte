<script lang="ts">
  export let text: string = "";
  export let avatarSrc: string = "/images/avatar_shirley.webp";
  export let bubblePosition: 'top' | 'top-right' | 'top-left' = 'top';
  export let avatarSize: 'small' | 'medium' | 'large' = 'large';
  export let bubbleAlign: 'center' | 'left' | 'right' = 'center';
  export let textAlign: 'center' | 'left' | 'right' = 'center';
  export let textSize: string = "text-2xl"; // standaardgrootte, pas aan naar wens
  export let textColor: string = "text-gray-800";

  // Avatar size classes
  const avatarSizeClass = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-28 h-28',
  }[avatarSize];

  // Bubble alignment classes
  const bubbleAlignClass = {
    center: 'left-1/2 -translate-x-1/2',
    left: 'left-0',
    right: 'right-0',
  }[bubbleAlign];

  // Bubble position classes
  const bubblePositionClass = {
    'top': '-top-6',
    'top-right': '-top-6 right-0',
    'top-left': '-top-6 left-0',
  }[bubblePosition];

  // Tekst align class
  const textAlignClass = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
  }[textAlign];

  // Pointer position for ::before
  function getPointerStyle() {
    if (bubbleAlign === 'center') return 'left: 50%; transform: translateX(-50%);';
    if (bubbleAlign === 'left') return 'left: 32px;';
    if (bubbleAlign === 'right') return 'right: 32px;';
    return '';
  }
</script>

<div class="flex flex-col items-center justify-center w-fit mx-auto">
  <div class="flex flex-col items-center">
    <div
      class={`speech-bubble right mb-4 min-w-[200px] max-w-xl ${textAlignClass} ${textSize} ${textColor}`}
      style="position: relative;"
    >
      {text}
    </div>
    <img
      src={avatarSrc}
      alt="Avatar"
      class={`rounded-full object-cover border-4 border-white shadow-lg ${avatarSizeClass}`}
      style="z-index: 10;"
      loading="lazy"
    />
  </div>
</div>

<style>
  .speech-bubble.right {
    position: relative;
    margin-left: 0;
    margin-right: 0;
  }
  .speech-bubble.right::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: white;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 0;
    border-width: 8px 8px 0 8px;
    width: 0;
    height: 0;
  }
</style>

<!-- Dynamische pointer uitlijning -->
<svelte:head>
  <style>
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
  </style>
</svelte:head> 