<template>
  <div class="border border-gray-300 p-4 rounded-lg mt-4 bg-white">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">Gestione Materiali</h3>

    <!-- Form per Creazione e Modifica -->
    <form @submit.prevent="handleSubmit" class="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <input v-model="editableMateriale.materiale_name" placeholder="Nome materiale" required class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      <input v-model="editableMateriale.materiale_descr" placeholder="Descrizione" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      <input v-model="editableMateriale.materiale_costo_unit" placeholder="Costo Unitario" type="number" step="0.01" required class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      <input v-model="editableMateriale.materiale_prezzo_unit" placeholder="Prezzo Unitario" type="number" step="0.01" required class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      <select v-model="editableMateriale.materiale_type_fk" required class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <option disabled value="">Seleziona un tipo</option>
        <option v-for="tipo in tipiMateriale" :key="tipo.type_mat_id" :value="tipo.type_mat_id">
          {{ tipo.type_mat_name }}
        </option>
      </select>
      <div class="flex gap-2 md:col-span-2 lg:col-span-3">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">{{ isEditing ? 'Aggiorna' : 'Crea' }}</button>
        <button v-if="isEditing" @click="cancelEdit" type="button" class="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">Annulla</button>
      </div>
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
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Descrizione</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Prezzo</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Tipo</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Usura %</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="border border-gray-300 px-4 py-2 text-center text-gray-500">Caricamento...</td>
          </tr>
          <tr v-for="item in materiali" :key="item.materiale_id" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2 text-gray-600">{{ item.materiale_id }}</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">{{ item.materiale_name }}</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">{{ item.materiale_descr }}</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">€{{ item.materiale_prezzo_unit }}</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">{{ getTipoMaterialeName(item.materiale_type_fk) }}</td>
            <td class="border border-gray-300 px-4 py-2 text-gray-600">{{ item.max_usura_perc != null ? item.max_usura_perc + '%' : 'N/A' }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <div class="flex flex-wrap gap-1">
                <button @click="startEdit(item)" class="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-colors">Modifica</button>
                <button @click="deleteItem(item.materiale_id)" class="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors">Elimina</button>
                <button @click="toggleUsuraManager(item.materiale_id)" class="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors">Gestisci Usura</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Componente per la gestione dell'usura -->
    <UsuraManager v-if="selectedMaterialeId" :materiale-id="selectedMaterialeId" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UsuraManager from './UsuraManager.vue'; // Importa il nuovo componente

const API_URL = '/api/materiali';
const TIPI_API_URL = '/api/type_materiali';

const materiali = ref([]);
const tipiMateriale = ref([]);
const loading = ref(false);
const message = ref('');
const messageType = ref('');

const selectedMaterialeId = ref(null); // ID del materiale selezionato per l'usura

const isEditing = ref(false);
const editableMateriale = ref({
  materiale_id: null,
  materiale_name: '',
  materiale_descr: '',
  materiale_costo_unit: null,
  materiale_prezzo_unit: null,
  materiale_type_fk: null
});

function toggleUsuraManager(materialeId) {
  if (selectedMaterialeId.value === materialeId) {
    selectedMaterialeId.value = null; // Nasconde se già visibile
  } else {
    selectedMaterialeId.value = materialeId; // Mostra per il materiale selezionato
  }
}

async function fetchTipiMateriale() {
  try {
    const response = await fetch(`${TIPI_API_URL}/get-all`);
    if (!response.ok) throw new Error('Errore nel caricamento dei tipi di materiale');
    tipiMateriale.value = await response.json();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
}

async function fetchData() {
  loading.value = true;
  message.value = '';
  try {
    const response = await fetch(`${API_URL}/get-all`);
    if (!response.ok) throw new Error('Errore nel caricamento dei materiali');
    const data = await response.json();
    console.log('Dati ricevuti dal backend:', data); // Aggiungi questo log
    materiali.value = data;
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
}

function getTipoMaterialeName(id) {
    const tipo = tipiMateriale.value.find(t => t.type_mat_id === id);
    return tipo ? tipo.type_mat_name : 'N/A';
}

async function handleSubmit() {
  const url = isEditing.value 
    ? `${API_URL}/update/${editableMateriale.value.materiale_id}` 
    : `${API_URL}/create`;
  
  const method = isEditing.value ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editableMateriale.value)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Errore sconosciuto' }));
      throw new Error(errorData.message || 'Si è verificato un errore');
    }

    message.value = `Materiale ${isEditing.value ? 'aggiornato' : 'creato'} con successo.`;
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
  editableMateriale.value = { ...item };
}

function cancelEdit() {
  isEditing.value = false;
  editableMateriale.value = { materiale_id: null, materiale_name: '', materiale_descr: '', materiale_costo_unit: null, materiale_prezzo_unit: null, materiale_type_fk: null };
}

async function deleteItem(id) {
  if (!confirm('Sei sicuro di voler eliminare questo materiale?')) return;
  try {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Errore durante l\'eliminazione');
    message.value = 'Materiale eliminato con successo.';
    messageType.value = 'success';
    await fetchData();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
}

onMounted(async () => {
  await fetchTipiMateriale();
  await fetchData();
});

</script>

<style scoped>
.success {
  background-color: #d4edda;
  color: #155724;
}
.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style>