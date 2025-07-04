<template>
  <div class="border border-gray-300 p-4 rounded-lg mt-4 bg-white">
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-semibold text-gray-800" :class="{'mb-4': isVisible}">Gestione Tipi Materiale</h3>
      <button @click="isVisible = !isVisible" class="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-full hover:bg-gray-600 hover:text-white transition-colors" :class="{'mb-4 rotate-180': isVisible}">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform transition-transform" :class="{'rotate-0': !isVisible}" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <main v-if="isVisible">
      <!-- Form per Creazione e Modifica -->
      <form @submit.prevent="handleSubmit" class="mb-4 flex flex-wrap gap-2">
        <input
          v-model="editableType.type_mat_name"
          placeholder="Nome tipo materiale"
          required
          name="type_mat_name"
          id="type_mat_name"
          class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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
              <th class="border-y border-l border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 w-9/12 ">Nome</th>
              <th class="border-y border-r border-gray-300 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="3" class="border border-gray-300 px-4 py-2 text-center text-gray-500">Caricamento...</td>
            </tr>
            <tr v-for="item in typeMateriali" :key="item.type_mat_id" class="hover:bg-gray-50">
              <td class="border-y border-l border-gray-300 px-4 py-2 text-gray-600">{{ item.type_mat_name }}</td>
              <td class="border-y border-r border-gray-300 px-4 py-2 text-right">
                <button @click="startEdit(item)" class=" mr-2 px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 transition-colors">Modifica</button>
                <button @click="deleteItem(item.type_mat_id)" class="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors">X</button>
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

// URL base della tua API
const API_URL = '/api/type_materiali';

// Stato del componente
const isVisible = ref(false);
const typeMateriali = ref([]); // Array per contenere i dati dalla API
const loading = ref(false); // Flag per indicare il caricamento
const message = ref(''); // Messaggio per l'utente (errori, successi)
const messageType = ref(''); // Tipo di messaggio ('error' o 'success')

// Stato per il form di creazione/modifica
const isEditing = ref(false);
const editableType = ref({ type_mat_id: null, type_mat_name: '' });

// Funzione per caricare i dati dalla API
async function fetchData() {
  loading.value = true;
  message.value = '';
  try {
    const response = await fetch(`${API_URL}/get-all`); // Rimosso method: 'POST'
    if (!response.ok) throw new Error('Errore nel caricamento dei dati');
    typeMateriali.value = await response.json();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
}

// Funzione per gestire l'invio del form (creazione o aggiornamento)
async function handleSubmit() {
  console.log("Click")
  const url = isEditing.value ? `${API_URL}/update/${editableType.value.type_mat_id}` : `${API_URL}/create`;
  const body = { type_mat_name: editableType.value.type_mat_name };

  try {
    console.log("Click", body)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Errore sconosciuto' }));
      throw new Error(errorData.message || 'Si è verificato un errore');
    }

    message.value = `Tipo materiale ${isEditing.value ? 'aggiornato' : 'creato'} con successo.`;
    messageType.value = 'success';
    await fetchData();
    cancelEdit();
    if (!isEditing.value) {
        editableType.value.type_mat_name = '';
    }
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
}

// Funzione per iniziare la modifica di un item
function startEdit(item) {
  isEditing.value = true;
  editableType.value = { ...item }; // Copia l'oggetto per non modificare l'originale direttamente
}

// Funzione per annullare la modifica
function cancelEdit() {
  isEditing.value = false;
  editableType.value = { type_mat_id: null, type_mat_name: '' };
}

// Funzione per eliminare un item
async function deleteItem(id) {
  if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;
  try {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Errore durante l\'eliminazione');
    message.value = 'Elemento eliminato con successo.';
    messageType.value = 'success';
    await fetchData(); // Ricarica i dati
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
}

// Carica i dati quando il componente viene montato
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