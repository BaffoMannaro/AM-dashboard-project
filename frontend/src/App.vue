<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- Sidebar di navigazione -->
  <aside class="sidebar">
    <div class="flex flex-col items-center mb-8">
      <img alt="Vue logo" class="mb-6 w-full" src="@/assets/AM-logo.png" width="80" height="80" />
      <h1 class="text-xl font-medium text-center">App di Gestione Preventivi</h1>
    </div>

    <hr>

    <nav class="space-y-2 mt-6">
      <RouterLink to="/" class="block px-4 py-3 rounded-lg text-gray-700 transition-colors font-light">
        Home
      </RouterLink>
      <RouterLink to="/about" class="block px-4 py-3 rounded-lg text-gray-700  transition-colors font-light">
        About
      </RouterLink>
      <RouterLink to="/data-management" class="block px-4 py-3 rounded-lg text-gray-700 transition-colors font-light">
        Gestione Dati
      </RouterLink>
      <RouterLink to="/preventivi" class="block px-4 py-3 rounded-lg text-gray-700 transition-colors font-light">
        Preventivi
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
  color: white;
  font-weight: 600;
  background-color: #94AFB1;
}

nav a.router-link-exact-active:hover {
  background-color: #abcbcb;
}

nav a.router-link-exact:hover{
  background-color: #abcbcb;
}
</style>
