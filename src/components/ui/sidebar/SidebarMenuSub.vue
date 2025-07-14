<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <ul
    data-sidebar="menu-badge"
    :class="
      cn(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
        'group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-none',
        props.class,
      )
    "
  >
    <slot />
  </ul>
</template>
