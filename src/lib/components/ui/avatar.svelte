<script lang="ts">
  // Verwijder foute import: import { getInitials } from '../../stores/userStore.ts';
  import type { User } from '../../stores/userStore.js'; // Gebruik correcte .js extensie
  
  export let user: User;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  
  // Bereken de grootte van de avatar op basis van de size prop
  $: sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }[size];
  
  // Maak een deterministische kleur op basis van het e-mailadres (als ID niet beschikbaar is)
  $: avatarColor = getUserColor(user.email ?? 'default');

  // Genereer initialen direct hier
  $: initials = getAvatarInitials(user);

  function getAvatarInitials(u: User): string {
    if (u.name) {
      return u.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (u.email) {
      return u.email[0].toUpperCase();
    }
    return '?'; // Fallback
  }
  
  function getUserColor(identifier: string): string {
    // Array van achtergrondkleuren voor avatars
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    
    // Bereken een index gebaseerd op de som van de tekencodes in de identifier
    const sum = identifier.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  }
</script>

<div class="relative flex items-center justify-center rounded-full overflow-hidden {sizeClass}">
  <!-- Verwijder check voor profileImage -->
  <div class="flex items-center justify-center w-full h-full {avatarColor} text-white font-semibold">
    {initials} <!-- Gebruik lokale initials -->
  </div>
</div> 