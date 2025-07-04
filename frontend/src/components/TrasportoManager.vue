<!--
 * TrasportoManager.vue
 * 
 * Componente Vue per la gestione completa dei trasporti.
 * 
 * Funzionalità principali:
 * - Visualizzazione di tutti i trasporti in una tabella (righe 25-40)
 * - Creazione di nuovi trasporti tramite form (righe 15-20)
 * - Modifica di trasporti esistenti (funzione startEdit riga 85)
 * - Eliminazione di trasporti con conferma (funzione deleteItem riga 95)
 * - Gestione stati di caricamento e messaggi di errore/successo
 * 
 * Struttura dati trasporto:
 * - trasporto_id: ID univoco del trasporto
 * - trasporto_name: Nome descrittivo del trasporto
 * - trasporto_distanza_km: Distanza in chilometri (numero intero)
 * - trasporto_costo: Costo del trasporto (decimale con 2 cifre)
 * 
 * API endpoints utilizzati:
 * - GET /api/trasporto/get-all: recupera tutti i trasporti
 * - POST /api/trasporto/create: crea nuovo trasporto
 * - POST /api/trasporto/update/{id}: aggiorna trasporto esistente
 * - POST /api/trasporto/delete/{id}: elimina trasporto
-->

<template>
  <div class="border border-gray-300 p-4 rounded-lg mt-4 bg-white">
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-semibold text-gray-800" :class="{'mb-4': isVisible}">Gestione Trasporti</h3>
      <button @click="isVisible = !isVisible" class="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-full hover:bg-gray-600 hover:text-white transition-colors" :class="{'mb-4 rotate-180': isVisible}">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 rotate-180 transform transition-transform" :class="{'rotate-0': !isVisible}" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <main v-if="isVisible">
      <!-- Form per Creazione e Modifica -->
      <form @submit.prevent="handleSubmit" class="mb-4 flex flex-wrap gap-2">
        <input v-model="editableTrasporto.trasporto_name" placeholder="Nome Trasporto" required class="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <input v-model="editableTrasporto.trasporto_distanza_km" placeholder="Distanza (km)" type="number" min="0" required class="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <input v-model="editableTrasporto.trasporto_costo" placeholder="Costo (€)" type="number" step="0.01" min="0" required class="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">{{ isEditing ? 'Aggiorna' : 'Crea' }}</button>
        <button v-if="isEditing" @click="cancelEdit" type="button" class="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">Annulla</button>
      </form>
      
      <!-- Messaggi di errore o successo -->
      <div v-if="message" :class="`message ${messageType}`" class="p-3 mb-4 rounded-md font-medium">{{ message }}</div>
      
      <!-- Tabella per visualizzare i dati -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Nome Trasporto</th>
              <th class="border-y border-l border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Distanza (km)</th>
              <th class="border-y border-l border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Costo (€)</th>
              <th class="border-y border-r border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="border border-gray-300 px-4 py-2 text-center text-gray-500">Caricamento...</td>
            </tr>
            <tr v-for="item in trasporti" :key="item.trasporto_id" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2 text-gray-600">{{ item.trasporto_name }}</td>
              <td class="border-y border-l border-gray-300 px-4 py-2 text-gray-600 text-center">{{ item.trasporto_distanza_km }}</td>
              <td class="border-y border-l border-gray-300 px-4 py-2 text-gray-600 text-right">{{ formatCurrency(item.trasporto_costo) }}</td>
              <td class="border-y border-r border-gray-300 px-4 py-2 text-right">
                <button @click="startEdit(item)" class="mr-2 px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 transition-colors">Modifica</button>
                <button @click="deleteItem(item.trasporto_id)" class="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors">X</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Configurazione API endpoint per i trasporti
const API_URL = '/api/trasporto';

// Stati reattivi del componente
const isVisible = ref(false);
const trasporti = ref([]);
const loading = ref(false);
const message = ref('');
const messageType = ref('');

// Stati per la gestione della modifica
const isEditing = ref(false);
const editableTrasporto = ref({
  trasporto_id: null,
  trasporto_name: '',
  trasporto_distanza_km: null,
  trasporto_costo: null
});

/**
 * Recupera tutti i trasporti dal backend
 * Gestisce stati di caricamento e messaggi di errore
 */
async function fetchData() {
  loading.value = true;
  message.value = '';
  try {
    const response = await fetch(`${API_URL}/get-all`);
    if (!response.ok) throw new Error('Errore nel caricamento dei trasporti');
    trasporti.value = await response.json();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
}

/**
 * Gestisce la creazione e l'aggiornamento dei trasporti
 * Determina automaticamente se creare o aggiornare in base allo stato isEditing
 */
async function handleSubmit() {
  const url = isEditing.value 
    ? `${API_URL}/update/${editableTrasporto.value.trasporto_id}` 
    : `${API_URL}/create`;
  
  const body = { ...editableTrasporto.value };

  // Rimuovi l'id dal corpo per la creazione e l'aggiornamento, dato che è nell'URL
  delete body.trasporto_id;
  // Rimuoviamo anche un eventuale campo 'id' per sicurezza
  delete body.id;

  // Conversione dei tipi per garantire la corretta validazione
  body.trasporto_distanza_km = parseInt(body.trasporto_distanza_km);
  body.trasporto_costo = parseFloat(body.trasporto_costo);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Errore sconosciuto' }));
      throw new Error(errorData.error || 'Si è verificato un errore');
    }

    message.value = `Trasporto ${isEditing.value ? 'aggiornato' : 'creato'} con successo.`;
    messageType.value = 'success';
    await fetchData();
    cancelEdit();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
}

/**
 * Inizia la modalità di modifica per un trasporto esistente
 * @param {Object} item - Il trasporto da modificare
 */
function startEdit(item) {
  isEditing.value = true;
  editableTrasporto.value = { ...item };
}

/**
 * Annulla la modalità di modifica e resetta il form
 */
function cancelEdit() {
  isEditing.value = false;
  editableTrasporto.value = { 
    trasporto_id: null, 
    trasporto_name: '', 
    trasporto_distanza_km: null,
    trasporto_costo: null 
  };
}

/**
 * Elimina un trasporto dopo conferma dell'utente
 * @param {number} id - ID del trasporto da eliminare
 */
async function deleteItem(id) {
  if (!confirm('Sei sicuro di voler eliminare questo trasporto?')) return;
  try {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Errore durante l\'eliminazione');
    message.value = 'Trasporto eliminato con successo.';
    messageType.value = 'success';
    await fetchData();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
}

/**
 * Formatta un valore numerico come valuta europea
 * @param {number} value - Il valore da formattare
 * @returns {string} Il valore formattato come valuta
 */
function formatCurrency(value) {
  if (value == null || isNaN(value)) return '€ 0,00';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(parseFloat(value));
}

// Carica i dati al montaggio del componente
onMounted(fetchData);

</script>

<style scoped>
/* Stili personalizzati per i messaggi di feedback */
.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>