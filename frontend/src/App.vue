<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- Sidebar di navigazione -->
  <aside class="sidebar">
    <div class="flex flex-col items-center mb-8">
      <img alt="Vue logo" class="mb-4" src="@/assets/logo.svg" width="80" height="80" />
      <HelloWorld msg="You did it!" />
    </div>

    <nav class="space-y-2">
      <RouterLink to="/" class="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
        🏠 Home
      </RouterLink>
      <RouterLink to="/about" class="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
        ℹ️ About
      </RouterLink>
      <RouterLink to="/data-management" class="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
        📊 Gestione Dati
      </RouterLink>
      <RouterLink to="/preventivi" class="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
        💰 Preventivi
      </RouterLink>
    </nav>
  </aside>

  <!-- Contenuto principale -->
  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
/* Stili per i link attivi del router */
nav a.router-link-exact-active {
  color: #2563eb;
  font-weight: 600;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}
</style>
