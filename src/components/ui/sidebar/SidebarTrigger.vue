<script setup>
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PanelLeft } from 'lucide-vue-next';
import { useSidebar } from './utils';

const props = defineProps({
  class: { type: null, required: false },
});

const { toggleSidebar } = useSidebar();
</script>

<template>
  <Button
    data-sidebar="trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-7 w-7 flex gap-4 justify-start', props.class)"
    @click="toggleSidebar"
  >
    <PanelLeft class="shrink-0"/>
		<slot/>
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
