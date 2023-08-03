<template>
    <Icon :icon="icon" />
</template>

<script setup lang="ts">

import { Icon } from '@iconify/vue';

const props = defineProps({
    icon: { type: String, required: true }
})
</script>
