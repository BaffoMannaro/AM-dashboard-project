<template>
  <div class="data-management">
    <h1>Pannello di Gestione Dati</h1>
    <p>Selezione una categoria per iniziare a gestire i dati.</p>

    <!-- Qui inseriremo la navigazione e tab e i componenti specifici -->

    <div class="manager-section">
      <TypeMaterialiManager />
      <MaterialiManager /> <!-- Aggiungi il nuovo componente qui -->
      <ScontiManager />
    </div>
  </div>
</template>

<script setup>
import TypeMaterialiManager from '../components/TypeMaterialiManager.vue';
import MaterialiManager from '../components/MaterialiManager.vue'; // Importa il nuovo componente
import ScontiManager from '../components/ScontiManager.vue';
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