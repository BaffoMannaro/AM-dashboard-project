<!--
  PreventiviView.vue
  
  Pagina principale per la gestione dei preventivi.
  Permette di:
  - Creare nuovi preventivi selezionando materiali
  - Applicare sconti ai preventivi
  - Inserire dati di trasporto
  - Visualizzare e modificare preventivi esistenti
  
  Componenti principali:
  - Form di creazione preventivo (righe 15-45)
  - Selezione materiali con quantità (righe 47-65)
  - Selezione sconto e trasporto (righe 67-85)
  - Tabella preventivi esistenti (righe 87-120)
  
  Funzioni principali:
  - handleSubmit(): gestisce creazione/aggiornamento preventivi (riga 180)
  - calculateTotal(): calcola il totale del preventivo (riga 220)
  - fetchData(): carica tutti i dati necessari (riga 160)
-->

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Gestione Preventivi</h1>
    <p class="text-gray-600 mb-8">Crea e gestisci i preventivi selezionando materiali, sconti e trasporto.</p>

    <!-- Form per Creazione e Modifica Preventivo -->
    <div class="bg-gray-50 p-8 rounded-lg mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">{{ isEditing ? 'Modifica Preventivo' : 'Nuovo Preventivo' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <div class="flex gap-4 flex-wrap">
          <input 
            v-model="editablePreventivo.preventivo_name" 
            placeholder="Nome preventivo" 
            required 
            class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input 
            v-model="editablePreventivo.preventivo_descr" 
            placeholder="Descrizione" 
            class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input 
            v-model="editablePreventivo.preventivo_data_evento" 
            type="date" 
            required 
            class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Selezione Materiali -->
        <div class="border border-gray-300 p-4 rounded-lg bg-white">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Seleziona Materiali</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div v-for="materiale in materiali" :key="materiale.materiale_id" class="border border-gray-200 p-4 rounded-md bg-gray-50 flex justify-between items-center">
              <div class="flex-1">
                <strong class="block mb-2 text-gray-800">{{ materiale.materiale_name }}</strong>
                <p class="my-1 text-gray-600 text-sm">{{ materiale.materiale_descr }}</p>
                <p class="font-bold text-blue-600">€{{ materiale.materiale_prezzo_unit }}</p>
              </div>
              <div class="flex flex-col items-center gap-2">
                <label class="text-sm font-medium text-gray-700">Quantità:</label>
                <input 
                  type="number" 
                  min="0" 
                  v-model="materialiSelezionati[materiale.materiale_id]" 
                  @input="calculateTotal"
                  class="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Selezione Sconto e Trasporto -->
        <div class="flex gap-4 flex-wrap">
          <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
            <label class="font-semibold text-gray-800">Sconto:</label>
            <select v-model="editablePreventivo.preventivo_sconto_id_fk" @change="calculateTotal" class="px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Nessuno sconto</option>
              <option v-for="sconto in sconti" :key="sconto.sconto_id" :value="sconto.sconto_id">
                {{ sconto.sconto_name }} ({{ sconto.sconto_percentuale }}%)
              </option>
            </select>
          </div>
          
          <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
            <label class="font-semibold text-gray-800">Trasporto:</label>
            <select v-model="editablePreventivo.preventivo_trasporto_id_fk" @change="calculateTotal" class="px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Nessun trasporto</option>
              <option v-for="trasporto in trasporti" :key="trasporto.trasporto_id" :value="trasporto.trasporto_id">
                {{ trasporto.trasporto_name }} - €{{ trasporto.trasporto_costo }}
              </option>
            </select>
          </div>
        </div>

        <!-- Totale e Pulsanti -->
        <div class="border border-gray-300 p-4 rounded-lg bg-blue-50">
          <h3 class="text-2xl font-bold text-blue-800 mb-4">Totale Preventivo: €{{ calcolaTotale.toFixed(2) }}</h3>
          <div class="flex gap-3 flex-wrap">
            <button type="submit" class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              {{ isEditing ? 'Aggiorna Preventivo' : 'Crea Preventivo' }}
            </button>
            <button v-if="isEditing" @click="cancelEdit" type="button" class="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
              Annulla
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Messaggi di errore o successo -->
    <div v-if="message" :class="`message ${messageType}`">{{ message }}</div>

    <!-- Lista Preventivi -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Preventivi Esistenti</h2>
      <div v-if="loading" class="text-center py-8 text-gray-500">
        Caricamento...
      </div>
      <div v-else-if="preventivi.length === 0" class="text-center py-8 text-gray-500">
        Nessun preventivo trovato.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="preventivo in preventivi" :key="preventivo.preventivo_id" class="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold text-gray-800">{{ preventivo.preventivo_name }}</h3>
            <span class="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">ID: {{ preventivo.preventivo_id }}</span>
          </div>
          <div class="space-y-2 mb-4">
            <p class="text-sm"><strong class="text-gray-700">Descrizione:</strong> <span class="text-gray-600">{{ preventivo.preventivo_descr }}</span></p>
            <p class="text-sm"><strong class="text-gray-700">Data Evento:</strong> <span class="text-gray-600">{{ formatDate(preventivo.preventivo_data_evento) }}</span></p>
            <p class="text-sm"><strong class="text-gray-700">Totale:</strong> <span class="text-blue-600 font-semibold">€{{ preventivo.preventivo_costo_totale }}</span></p>
            <p class="text-sm"><strong class="text-gray-700">Sconto:</strong> <span class="text-gray-600">{{ getScontoName(preventivo.preventivo_sconto_id_fk) }}</span></p>
            <p class="text-sm"><strong class="text-gray-700">Trasporto:</strong> <span class="text-gray-600">{{ getTrasportoName(preventivo.preventivo_trasporto_id_fk) }}</span></p>
          </div>
          <div class="flex gap-2">
            <button @click="startEdit(preventivo)" class="flex-1 px-3 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors">Modifica</button>
            <button @click="deletePreventivo(preventivo.preventivo_id)" class="flex-1 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">Elimina</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// API URLs
const API_URL = '/api/preventivi';
const MATERIALI_API_URL = '/api/materiali';
const SCONTI_API_URL = '/api/sconti';
const TRASPORTO_API_URL = '/api/trasporto';

// Reactive data
const preventivi = ref([]);
const materiali = ref([]);
const sconti = ref([]);
const trasporti = ref([]);
const loading = ref(false);
const message = ref('');
const messageType = ref('');

// Form state
const isEditing = ref(false);
const editablePreventivo = ref({
  preventivo_id: null,
  preventivo_name: '',
  preventivo_descr: '',
  preventivo_data_creazione: new Date().toLocaleDateString('it-IT').replace(/\//g, '-'), // Data corrente in formato DD-MM-YYYY
  preventivo_data_evento: '',
  preventivo_costo_totale: 0,
  preventivo_sconto_id_fk: '',
  preventivo_trasporto_id_fk: ''
});

// Materiali selezionati con quantità
const materialiSelezionati = ref({});

/**
 * Carica tutti i dati necessari per la gestione dei preventivi
 * Include: preventivi, materiali, sconti e trasporti
 */
async function fetchData() {
  loading.value = true;
  message.value = '';
  
  try {
    // Carica preventivi
    const preventiviResponse = await fetch(`${API_URL}/get-all`);
    if (!preventiviResponse.ok) throw new Error('Errore nel caricamento dei preventivi');
    preventivi.value = await preventiviResponse.json();

    // Carica materiali
    const materialiResponse = await fetch(`${MATERIALI_API_URL}/get-all`);
    if (!materialiResponse.ok) throw new Error('Errore nel caricamento dei materiali');
    materiali.value = await materialiResponse.json();

    // Carica sconti
    const scontiResponse = await fetch(`${SCONTI_API_URL}/get-all`);
    if (!scontiResponse.ok) throw new Error('Errore nel caricamento degli sconti');
    sconti.value = await scontiResponse.json();

    // Carica trasporti
    const trasportoResponse = await fetch(`${TRASPORTO_API_URL}/get-all`);
    if (!trasportoResponse.ok) throw new Error('Errore nel caricamento dei trasporti');
    trasporti.value = await trasportoResponse.json();

  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
}

/**
 * Gestisce la creazione e l'aggiornamento dei preventivi
 * Calcola il totale e invia i dati al backend
 */
async function handleSubmit() {
  try {
    // Calcola il totale finale
    editablePreventivo.value.preventivo_costo_totale = calcolaTotale.value;

    // Converte la data evento dal formato YYYY-MM-DD al formato DD-MM-YYYY
    let dataEvento = editablePreventivo.value.preventivo_data_evento;
    if (dataEvento && dataEvento.includes('-') && dataEvento.length === 10) {
      const [year, month, day] = dataEvento.split('-');
      dataEvento = `${day}-${month}-${year}`;
    }

    // Prepara i dati del preventivo
    const preventivoData = {
      ...editablePreventivo.value,
      preventivo_data_evento: dataEvento,
      materiali: Object.entries(materialiSelezionati.value)
        .filter(([id, qty]) => qty > 0)
        .map(([id, qty]) => ({ materiale_id: parseInt(id), quantita: parseInt(qty) }))
    };

    const url = isEditing.value 
      ? `${API_URL}/update/${editablePreventivo.value.preventivo_id}` 
      : `${API_URL}/create`;
    
    const method = isEditing.value ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preventivoData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Errore sconosciuto' }));
      throw new Error(errorData.message || 'Si è verificato un errore');
    }

    message.value = `Preventivo ${isEditing.value ? 'aggiornato' : 'creato'} con successo.`;
    messageType.value = 'success';
    await fetchData();
    cancelEdit();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
}

/**
 * Calcola il totale del preventivo considerando materiali, sconto e trasporto
 */
const calcolaTotale = computed(() => {
  let totale = 0;

  // Calcola il totale dei materiali
  Object.entries(materialiSelezionati.value).forEach(([materialeId, quantita]) => {
    if (quantita > 0) {
      const materiale = materiali.value.find(m => m.materiale_id == materialeId);
      if (materiale) {
        totale += materiale.materiale_prezzo_unit * quantita;
      }
    }
  });

  // Applica lo sconto
  if (editablePreventivo.value.preventivo_sconto_id_fk) {
    const sconto = sconti.value.find(s => s.sconto_id == editablePreventivo.value.preventivo_sconto_id_fk);
    if (sconto) {
      totale = totale * (1 - sconto.sconto_percentuale / 100);
    }
  }

  // Aggiungi il costo del trasporto
  if (editablePreventivo.value.preventivo_trasporto_id_fk) {
    const trasporto = trasporti.value.find(t => t.trasporto_id == editablePreventivo.value.preventivo_trasporto_id_fk);
    if (trasporto) {
      totale += parseFloat(trasporto.trasporto_costo);
    }
  }

  return totale;
});

/**
 * Funzione per ricalcolare il totale (chiamata dagli input)
 */
function calculateTotal() {
  // Il totale viene calcolato automaticamente dal computed
}

/**
 * Avvia la modifica di un preventivo esistente
 */
function startEdit(preventivo) {
  isEditing.value = true;
  editablePreventivo.value = { ...preventivo };
  
  // Reset materiali selezionati
  materialiSelezionati.value = {};
  
  // TODO: Caricare i materiali associati al preventivo
  // Questo richiederà una chiamata API aggiuntiva
}

/**
 * Annulla la modifica e resetta il form
 */
function cancelEdit() {
  isEditing.value = false;
  editablePreventivo.value = {
    preventivo_id: null,
    preventivo_name: '',
    preventivo_descr: '',
    preventivo_data_creazione: new Date().toLocaleDateString('it-IT').replace(/\//g, '-'), // Data corrente in formato DD-MM-YYYY
    preventivo_data_evento: '',
    preventivo_costo_totale: 0,
    preventivo_sconto_id_fk: '',
    preventivo_trasporto_id_fk: ''
  };
  materialiSelezionati.value = {};
}

/**
 * Elimina un preventivo
 */
async function deletePreventivo(id) {
  if (!confirm('Sei sicuro di voler eliminare questo preventivo?')) return;
  
  try {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Errore durante l\'eliminazione');
    
    message.value = 'Preventivo eliminato con successo.';
    messageType.value = 'success';
    await fetchData();
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
}

/**
 * Utility functions per i nomi
 */
function getScontoName(id) {
  if (!id) return 'Nessuno';
  const sconto = sconti.value.find(s => s.sconto_id === id);
  return sconto ? `${sconto.sconto_name} (${sconto.sconto_percentuale}%)` : 'N/A';
}

function getTrasportoName(id) {
  if (!id) return 'Nessuno';
  const trasporto = trasporti.value.find(t => t.trasporto_id === id);
  return trasporto ? `${trasporto.trasporto_name} (€${trasporto.trasporto_costo})` : 'N/A';
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('it-IT');
}

// Carica i dati al mount del componente
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Stili personalizzati aggiuntivi se necessari */
.message {
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>