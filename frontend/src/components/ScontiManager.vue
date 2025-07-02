<template>
  <div class="border border-gray-300 p-4 rounded-lg mt-4 bg-white">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">Gestione Sconti</h3>

    <!-- Form per Creazione e Modifica -->
    <form @submit.prevent="handleSubmit" class="mb-4 flex flex-wrap gap-2">
      <input v-model="editableSconto.sconto_name" placeholder="Nome Sconto" required class="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      <input v-model="editableSconto.sconto_percentuale" placeholder="Percentuale" type="number" step="0.01" required class="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">ID</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Nome</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Percentuale</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="4" class="border border-gray-300 px-4 py-2 text-center text-gray-500">Caricamento...</td>
          </tr>
          <tr v-for="item in sconti" :key="item.sconto_id" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2 text-gray-600">{{ item.sconto_id }}</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">{{ item.sconto_name }}</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">{{ item.sconto_percentuale }}%</td>
            <td class="border border-gray-300 px-4 py-2">
              <button @click="startEdit(item)" class="mr-2 px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 transition-colors">Modifica</button>
              <button @click="deleteItem(item.sconto_id)" class="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors">Elimina</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_URL = '/api/sconti';

const sconti = ref([]);
const loading = ref(false);
const message = ref('');
const messageType = ref('');

const isEditing = ref(false);
const editableSconto = ref({
  sconto_id: null,
  sconto_name: '',
  sconto_percentuale: null
});

async function fetchData() {
  loading.value = true;
  message.value = '';
  try {
    const response = await fetch(`${API_URL}/get-all`);
    if (!response.ok) throw new Error('Errore nel caricamento degli sconti');
    sconti.value = await response.json();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  const url = isEditing.value 
    ? `${API_URL}/update/${editableSconto.value.sconto_id}` 
    : `${API_URL}/create`;
  
  const body = { ...editableSconto.value };

  // Rimuovi l'id dal corpo per la creazione e l'aggiornamento, dato che è nell'URL
  delete body.sconto_id;
  // Rimuoviamo anche un eventuale campo 'id' per sicurezza
  delete body.id;

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

    message.value = `Sconto ${isEditing.value ? 'aggiornato' : 'creato'} con successo.`;
    messageType.value = 'success';
    await fetchData();
    cancelEdit();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
}

function startEdit(item) {
  isEditing.value = true;
  editableSconto.value = { ...item };
}

function cancelEdit() {
  isEditing.value = false;
  editableSconto.value = { sconto_id: null, sconto_name: '', sconto_percentuale: null };
}

async function deleteItem(id) {
  if (!confirm('Sei sicuro di voler eliminare questo sconto?')) return;
  try {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Errore durante l\'eliminazione');
    message.value = 'Sconto eliminato con successo.';
    messageType.value = 'success';
    await fetchData();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
}

onMounted(fetchData);

</script>

<style scoped>
/* Stili personalizzati per i messaggi */
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