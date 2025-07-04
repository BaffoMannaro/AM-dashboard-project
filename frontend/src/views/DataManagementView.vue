<template>
  <div class="data-management p-8 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Pannello di Gestione Dati</h1>
    <p class="text-gray-600 mb-8">Selezione una categoria per iniziare a gestire i dati.</p>

    <!-- Qui inseriremo la navigazione e tab e i componenti specifici -->

    <div class="manager-section">
      <TypeMaterialiManager />
      <MaterialiManager /> <!-- Aggiungi il nuovo componente qui -->
      <ScontiManager />
      <TrasportoManager />
    </div>
  </div>
</template>

<script setup>
import TypeMaterialiManager from '../components/TypeMaterialiManager.vue';
import MaterialiManager from '../components/MaterialiManager.vue'; // Importa il nuovo componente
import ScontiManager from '../components/ScontiManager.vue';
import TrasportoManager from '@/components/TrasportoManager.vue';
</script>

<style scoped>
.data-managememnt {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.manager-section{
  background-color: #f9f9f9;
  color: #222222;
  padding: 1.5rem;
  border-radius: 8px;
}
</style>