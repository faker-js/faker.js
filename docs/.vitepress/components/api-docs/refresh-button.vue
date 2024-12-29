<script setup lang="ts">
import { ref } from 'vue';

// This should probably use emit instead, but emit cannot be awaited
const { refresh } = defineProps<{ refresh: () => Promise<void> }>();

const spinning = ref(false);

async function onRefresh() {
  spinning.value = true;
  await Promise.all([refresh(), delay(100)]);
  spinning.value = false;
}

// Extra delay to make the spinning effect more visible
// Some examples barely/don't change, so the spinning is the only visible effect
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>

<template>
  <button
    class="refresh"
    title="Refresh Examples"
    :disabled="spinning"
    @click="onRefresh"
  >
    <div :class="{ spinning: spinning }" />
  </button>
</template>

<style scoped>
button.refresh {
  border: 1px solid var(--vp-code-copy-code-border-color);
  border-radius: 4px;
  width: 40px;
  height: 40px;
  font-size: 25px;
  vertical-align: middle;
}

button.refresh div {
  background-image: url('refresh.svg');
  background-position: 50%;
  background-size: 20px;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

button.refresh:hover {
  background-color: var(--vp-code-copy-code-bg);
  opacity: 1;
}

div.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
