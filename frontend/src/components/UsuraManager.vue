<template>
  <div class="max-w-6xl mx-auto p-5 font-sans">
    <h2 class="text-2xl font-bold mb-5 text-gray-800">Gestione Usura Materiali</h2>

    <!-- Form per Aggiungere/Modificare Dati Usura -->
    <form @submit.prevent="handleSubmit" class="mt-5 bg-gray-50 p-5 rounded-lg shadow-sm">
      <div class="mb-4">
        <label for="usura_mat_name" class="block mb-1 font-medium text-gray-700">Nome Usura:</label>
        <input type="text" id="usura_mat_name" v-model="editableUsura.usura_mat_name" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      </div>
      <div class="mb-4">
        <label for="usura_mat_percentuale_usura" class="block mb-1 font-medium text-gray-700">Percentuale Usurata (%):</label>
        <input type="number" step="0.01" id="usura_mat_percentuale_usura" v-model="editableUsura.usura_mat_percentuale_usura" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      </div>
      <div class="mb-4">
        <label for="usura_mat_vita_restante" class="block mb-1 font-medium text-gray-700">Vita Restante:</label>
        <input type="text" id="usura_mat_vita_restante" v-model="editableUsura.usura_mat_vita_restante" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      </div>
      <div class="flex gap-2">
        <button type="submit" class="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">{{ isEditing ? 'Aggiorna' : 'Aggiungi' }}</button>
        <button type="button" @click="resetForm" class="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">Annulla</button>
      </div>
    </form>

    <!-- Tabella Dati Usura -->
    <div class="mt-5 bg-gray-50 p-5 rounded-lg shadow-sm overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">ID</th>
            <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Nome</th>
            <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Percentuale Usurata</th>
            <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Vita Restante</th>
            <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usura in usuraData" :key="usura.usura_mat_id" class="even:bg-gray-100 hover:bg-gray-50">
            <td class="border border-gray-300 px-3 py-2 text-gray-600">{{ usura.usura_mat_id }}</td>
            <td class="border border-gray-300 px-3 py-2 text-gray-600">{{ usura.usura_mat_name }}</td>
            <td class="border border-gray-300 px-3 py-2 text-gray-600">{{ usura.usura_mat_percentuale_usura }}%</td>
            <td class="border border-gray-300 px-3 py-2 text-gray-600">{{ usura.usura_mat_vita_restante }}</td>
            <td class="border border-gray-300 px-3 py-2">
              <div class="flex gap-1">
                <button @click="editUsura(usura)" class="px-2 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors">Modifica</button>
                <button @click="deleteUsura(usura.usura_mat_id)" class="px-2 py-1 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors">Elimina</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from 'vue';

const props = defineProps({
  materialeId: {
    type: Number,
    required: true
  }
});

const API_URL = '/api/usura_materiali';
const usuraData = ref([]);
const editableUsura = ref({ 
  materiale_id_fk: props.materialeId, 
  usura_mat_name: '', 
  usura_mat_percentuale_usura: null, 
  usura_mat_vita_restante: '' 
});
const isEditing = ref(false);

// Fetch usura data by materialeId
const fetchUsuraData = async () => {
  if (!props.materialeId) return;
  try {
    const response = await fetch(`${API_URL}/by-materiale/${props.materialeId}`);
    if (!response.ok) throw new Error('Errore nel caricamento dei dati di usura');
    usuraData.value = await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    usuraData.value = []; // Pulisce i dati in caso di errore
  }
};

// Handle form submission (Create/Update)
const handleSubmit = async () => {
  if (isEditing.value) {
    // Update
    try {
      const url = `${API_URL}/update`; // URL generico per l'update
      const body = { ...editableUsura.value };

      const response = await fetch(url, {
        method: 'POST', // Torniamo a POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore nell\'aggiornamento');
      }
      await fetchUsuraData();
      resetForm();
    } catch (error) {
      console.error('Update error:', error);
      alert(error.message); // Mostra un alert con il messaggio di errore
    }
  } else {
    // Create
    try {
      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableUsura.value),
      });
      if (!response.ok) throw new Error('Errore nella creazione');
      await fetchUsuraData();
      resetForm();
    } catch (error) {
      console.error('Create error:', error);
    }
  }
};

// Set form for editing
const editUsura = (usura) => {
  isEditing.value = true;
  editableUsura.value = { ...usura };
};

// Delete usura data
const deleteUsura = async (id) => {
  if (!confirm('Sei sicuro di voler eliminare questo dato?')) return;
  try {
    const response = await fetch(`${API_URL}/delete`, { // URL generico per delete
      method: 'POST', // Torniamo a POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usura_mat_id: id })
    });
    if (!response.ok) throw new Error('Errore nell\'eliminazione');
    await fetchUsuraData();
  } catch (error) {
    console.error('Delete error:', error);
  }
};

// Reset form
const resetForm = () => {
  isEditing.value = false;
  editableUsura.value = { 
    materiale_id_fk: props.materialeId, 
    usura_mat_name: '', 
    usura_mat_percentuale_usura: null, 
    usura_mat_vita_restante: '' 
  };
};

// Fetch data on component mount and when materialeId changes
watch(() => props.materialeId, fetchUsuraData, { immediate: true });

onMounted(fetchUsuraData);
</script>

<style scoped>
/* Tutti gli stili sono stati convertiti in classi Tailwind CSS */
</style>