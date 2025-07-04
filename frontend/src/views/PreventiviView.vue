<!--
  PreventiviView.vue
  
  Pagina principale per la gestione dei preventivi.
  Permette di:
  - Creare nuovi preventivi selezionando materiali con quantità
  - Applicare sconti ai preventivi
  - Inserire dati di trasporto
  - Visualizzare e modificare preventivi esistenti
  - Visualizzare i materiali associati a ogni preventivo con quantità e subtotali
  
  Componenti principali:
  - Form di creazione preventivo (righe 15-45)
  - Selezione materiali con quantità (righe 47-65)
  - Selezione sconto e trasporto (righe 67-85)
  - Lista preventivi esistenti con materiali associati (righe 87-165)
  
  Funzioni principali:
  - handleSubmit(): gestisce creazione/aggiornamento preventivi (riga 220)
  - calculateTotal(): calcola il totale del preventivo (riga 280)
  - fetchData(): carica tutti i dati necessari inclusi materiali per preventivo (riga 210)
  - startEdit(): carica preventivo per modifica inclusi materiali associati (riga 360)
  
  Endpoint API utilizzati:
  - GET /api/preventivi/get-all: lista preventivi
  - GET /api/preventivi/:id/materiali: materiali dettagliati di un preventivo
  - POST/PUT /api/preventivi/create|update: salvataggio preventivi
  - GET /api/materiali/get-all: lista materiali disponibili
  - GET /api/sconti/get-all: lista sconti disponibili
  - GET /api/trasporto/get-all: lista opzioni trasporto
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
          <input v-model="editablePreventivo.preventivo_name" placeholder="Nome preventivo" required class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input v-model="editablePreventivo.preventivo_descr" placeholder="Descrizione" class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input v-model="editablePreventivo.preventivo_data_evento" type="date" required class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
                <input type="number" min="0" v-model="materialiSelezionati[materiale.materiale_id]" @input="calculateTotal" class="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
          <div class="mb-4 space-y-2">
            <h3 class="text-2xl font-bold text-blue-800">Totale Preventivo: €{{ calcolaTotale.toFixed(2) }}</h3>
            <p class="text-lg font-semibold text-gray-700">Totale Costo Unitario Materiali: €{{ calcolaTotaleCostoUnitario.toFixed(2) }}</p>
          </div>
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
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">Storico Preventivi</h2>
        <button @click="isVisible = !isVisible" class="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-full hover:bg-gray-600 hover:text-white transition-colors" :class="{'rotate-180': isVisible}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div class="flex items-center gap-10 mb-6 mt-3">
        <h4>Totale lordo: <span class="font-bold">€ {{ calcolaAllPreventiviTotale() }} </span></h4>
        <h4>Totale costo risorse: <span class="text-gray-400">€ {{ calcolaAllPreventiviCosti() }}</span></h4>
        <h4>Totale utile: <span class="font-bold text-green-700">€ {{ calcolaAllPreventiviUtile() }}</span></h4>
      </div>
      <main v-if="isVisible">
        <div v-if="loading" class="text-center py-8 text-gray-500"> Caricamento... </div>
        <div v-else-if="!loading && preventivi.length === 0" class="text-center py-8 text-gray-500"> Nessun preventivo trovato. </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div v-for="preventivo in preventivi" :key="preventivo.preventivo_id" class="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold text-gray-800">{{ preventivo.preventivo_name }}</h3>
              <span class="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">{{ formatDate(preventivo.preventivo_data_evento) }}</span>
            </div>
            <div class="text-sm mb-3"><span class="text-gray-600">{{ preventivo.preventivo_descr }}</span></div>
            <hr>
            <div class="mt-3 mb-3">
              <p class="text-sm flex justify-between"><strong class="text-gray-700">Sconto:</strong><span class="text-gray-600">{{ getScontoValue(preventivo.preventivo_sconto_id_fk) }}</span></p>
              <p class="text-sm flex justify-between"><strong class="text-gray-700">Trasporto:</strong> <span class="text-gray-600">{{ getTrasportoName(preventivo.preventivo_trasporto_id_fk) }}</span></p>
              <p class="text-sm pt-4 flex justify-between"><strong class="text-gray-700">Totale:</strong> <span class="text-blue-600 font-semibold">€{{ preventivo.preventivo_costo_totale }}</span></p>
              <p class="text-sm flex justify-between"><strong class="text-gray-700">Costo risorse:</strong> <span class="text-gray-300 font-semibold">€{{ calcolaTotaleCostiMateriali(preventivo).toFixed(2) }}</span></p>
              <p class="text-sm flex justify-between"><strong class="text-gray-700">Utile totale:</strong> <span class="text-green-700 font-semibold">€{{ calcolaTotaleUtile(preventivo).toFixed(2) }}</span></p>

              <!-- Sezione Materiali del Preventivo -->
              <div class="mt-3 pt-3 border-t border-gray-300">
                <div class="flex gap-1 flex-row items-center mb-2">
                  <button @click="isVisibleMateriali = !isVisibleMateriali" class="flex items-center justify-center w-8 h-8" :class="{ 'rotate-180': isVisibleMateriali }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <p class="text-sm font-semibold text-gray-700">Materiali:</p>
                </div>
                <div v-if="preventivo.materiali && preventivo.materiali.length > 0" class="space-y-2">
                  <!-- Raggruppa per tipo di materiale -->
                  <div v-for="gruppo in raggruppaMaterialiPerTipo(preventivo)" :key="gruppo.type_mat_name" class="border border-gray-200 rounded-lg p-2 bg-gray-50">
                    <!-- Header del gruppo -->
                    <div class="flex justify-between items-center">

                      <div class="font-semibold text-gray-700 text-sm"> {{ gruppo.type_mat_name }} </div>
                      <div class="text-xs text-gray-600">
                        <span class="mr-2">Qtà tot: {{ gruppo.totaleQuantita }}</span>
                        <span class="font-semibold text-blue-600">€{{ gruppo.totaleSubtotale.toFixed(2) }}</span>
                      </div>
                    </div>

                    <!-- Materiali del gruppo -->
                    <div v-if="isVisibleMateriali" class="space-y-1">
                      <div v-for="materiale in gruppo.materiali" :key="materiale.preventivo_mat_mat_id" class="text-xs bg-white p-2 rounded border">
                        <div class="flex justify-between items-center">
                          <span class="font-medium text-gray-800">{{ materiale.materiale_name }}</span>
                          <span class="text-gray-600">Qtà: {{ materiale.preventivo_mat_quantita }}</span>
                        </div>
                        <div class="flex justify-between items-center mt-1">
                          <span class="text-gray-400 text-xs">{{ materiale.type_mat_name }}</span>
                          <span class="font-semibold text-blue-600">€{{ parseFloat(materiale.subtotale).toFixed(2) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-xs text-gray-500 italic">
                  Nessun materiale associato
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="startEdit(preventivo)" class="flex-1 px-3 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors">Modifica</button>
              <button @click="deletePreventivo(preventivo.preventivo_id)" class="flex-1 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">Elimina</button>
            </div>
          </div>
        </div>
      </main>
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
const isVisible = ref(false);
const isVisibleMateriali = ref(false);
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
  preventivo_data_creazione: new Date().toISOString().split('T')[0], // Data corrente in formato YYYY-MM-DD per input date
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
 * Carica anche i materiali associati a ogni preventivo
 */
async function fetchData() {
  loading.value = true;
  message.value = '';
  
  try {
    // Carica preventivi
    const preventiviResponse = await fetch(`${API_URL}/get-all`);
    if (!preventiviResponse.ok) throw new Error('Errore nel caricamento dei preventivi');
    const preventiviData = await preventiviResponse.json();
    
    // Per ogni preventivo, carica i materiali associati (sequenzialmente invece che con Promise.all)
    const preventiviConMateriali = [];
    
    // Elaborazione sequenziale dei preventivi
    console.log("Inizio elaborazione sequenziale preventivi");
    for (const preventivo of preventiviData) {
      try {
        const materialiResponse = await fetch(`${API_URL}/${preventivo.preventivo_id}/materiali`);
        if (materialiResponse.ok) {
          const materialiPreventivo = await materialiResponse.json();
          preventiviConMateriali.push({ ...preventivo, materiali: materialiPreventivo });
        } else {
          preventiviConMateriali.push({ ...preventivo, materiali: [] });
        }
      } catch (error) {
        console.warn(`Errore nel caricamento materiali per preventivo ${preventivo.preventivo_id}:`, error);
        preventiviConMateriali.push({ ...preventivo, materiali: [] });
      }
    }
    
    preventivi.value = preventiviConMateriali;

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

    // Converte le date dal formato YYYY-MM-DD al formato DD-MM-YYYY
    const dataEvento = convertDateInputToBackend(editablePreventivo.value.preventivo_data_evento);
    const dataCreazione = convertDateInputToBackend(editablePreventivo.value.preventivo_data_creazione);

    // Prepara i dati del preventivo
    const preventivoData = {
      ...editablePreventivo.value,
      preventivo_data_evento: dataEvento,
      preventivo_data_creazione: dataCreazione,
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
 * Calcola il totale del costo unitario dei materiali selezionati
 * Utilizza il campo materiale_costo_unit invece di materiale_prezzo_unit
 */
const calcolaTotaleCostoUnitario = computed(() => {
  let totaleCosto = 0;

  // Calcola il totale dei costi unitari dei materiali
  Object.entries(materialiSelezionati.value).forEach(([materialeId, quantita]) => {
    if (quantita > 0) {
      const materiale = materiali.value.find(m => m.materiale_id == materialeId);
      if (materiale && materiale.materiale_costo_unit) {
        totaleCosto += materiale.materiale_costo_unit * quantita;
      }
    }
  });

  return totaleCosto;
});

//calcola il totale dei costi dei materiali presenti in un preventivo
function calcolaTotaleCostiMateriali(preventivo) {
  
  let totaleCosto = 0;
  
  // Controlli di sicurezza
  if (!preventivo || !preventivo.preventivo_id || !preventivo.materiali || !Array.isArray(preventivo.materiali)) {
    return 0;
  }

  for (let i = 0; i < preventivo.materiali.length; i++) {
    const materiale = preventivo.materiali[i];
    
    // Controlli per ogni materiale
    if (!materiale) {
      continue;
    }
    
    const quantita = parseFloat(materiale.preventivo_mat_quantita) || 0;
    const costo_unitario = parseFloat(materiale.materiale_costo_unit) || 0;
        
    // Calcola solo se entrambi i valori sono validi
    if (!isNaN(quantita) && !isNaN(costo_unitario)) {
      const costo = quantita * costo_unitario;

      totaleCosto += costo;
    }
  }
  
  return parseFloat(totaleCosto) || 0;
}

function calcolaTotaleUtile(preventivo) {
  // Controlli di sicurezza
  if (!preventivo) return 0;
  
  const totaleCosto = calcolaTotaleCostiMateriali(preventivo);
  const totalePrezzo = parseFloat(preventivo.preventivo_costo_totale) || 0;

  const id_trasporto = preventivo.preventivo_trasporto_id_fk;
  const calcolaCostoTrasporto = (id_trasporto) => {
    // Controlli di sicurezza
    if (!id_trasporto || !trasporti.value || !Array.isArray(trasporti.value)) {
      return 0;
    }
    
    const trasporto = trasporti.value.find(t => t.trasporto_id === id_trasporto);
    if (!trasporto) {
      return 0;
    }
    
    return parseFloat(trasporto.trasporto_costo) || 0;
  };

  const costoTrasporto = calcolaCostoTrasporto(id_trasporto);
  const utile = totalePrezzo - totaleCosto - costoTrasporto;
  
  return parseFloat(utile) || 0;
}

/**
 * Funzione per ricalcolare il totale (chiamata dagli input)
 */
function calculateTotal() {
  // Il totale viene calcolato automaticamente dal computed
}













// Calcola il totale di tutti i preventivi nello storico
function calcolaAllPreventiviTotale() {
  let totale = 0;

  preventivi.value.forEach(preventivo => {
    totale += parseFloat(preventivo.preventivo_costo_totale) || 0;
  });

  return totale.toFixed(2);
}

// Calcola il totale di tutti i costi dei preventivi nello storico
function calcolaAllPreventiviCosti() {
  let totale =0;

  preventivi.value.forEach(preventivo => {
    totale += parseFloat(calcolaTotaleCostiMateriali(preventivo)) || 0;
  });

  return totale.toFixed(2);
}

// Calcola il totale di tutti gli utili dei preventivi nello storico

function calcolaAllPreventiviUtile() {
  let totale = 0;

  preventivi.value.forEach(preventivo => {
    totale += parseFloat(calcolaTotaleUtile(preventivo)) || 0;
  });

  return totale.toFixed(2);
}




/**
 * Raggruppa i materiali di un preventivo per type_mat_name
 * @param {Object} preventivo - il preventivo con i suoi materiali
 * @returns {Array} Array di gruppi di materiali 
 */

 function raggruppaMaterialiPerTipo(preventivo) {
  if (!preventivo || !preventivo.materiali || !Array.isArray(preventivo.materiali)) {
    return [];
  }

  //Raggruppa i materiali per type_mat_name
  const gruppi = preventivo.materiali.reduce((acc, materiale) => {
    const tipoMateriale = materiale.type_mat_name || 'Tipo non specificato';

    if (!acc[tipoMateriale]) {
      acc[tipoMateriale] = {
        type_mat_name: tipoMateriale,
        materiali: [],
        totaleQuantita:0,
        totaleSubtotale:0
      };
    }

    acc[tipoMateriale].materiali.push(materiale);
    acc[tipoMateriale].totaleQuantita += parseInt(materiale.preventivo_mat_quantita) || 0;
    acc[tipoMateriale].totaleSubtotale += (parseFloat(materiale.subtotale) || 0);

    return acc;
  }, {});

  //Converte l'oggetto in array per facilitare l'iterazione nel template
  return Object.values(gruppi);
 }









/**
 * Converte una data dal formato ISO (database) al formato YYYY-MM-DD (input date)
 */
function convertISOToDateInput(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toISOString().split('T')[0];
}

/**
 * Converte una data dal formato YYYY-MM-DD (input date) al formato DD-MM-YYYY (backend)
 */
function convertDateInputToBackend(dateInput) {
  if (!dateInput) return '';
  const [year, month, day] = dateInput.split('-');
  return `${day}-${month}-${year}`;
}

/**
 * Avvia la modifica di un preventivo esistente
 * Carica anche i materiali associati al preventivo
 */
async function startEdit(preventivo) {
  isEditing.value = true;
  editablePreventivo.value = { 
    ...preventivo,
    // Converte le date dal formato ISO al formato richiesto dai campi input
    preventivo_data_evento: convertISOToDateInput(preventivo.preventivo_data_evento),
    preventivo_data_creazione: convertISOToDateInput(preventivo.preventivo_data_creazione)
  };
  
  // Reset materiali selezionati
  materialiSelezionati.value = {};
  
  try {
    // Carica i materiali associati al preventivo
    const response = await fetch(`${API_URL}/${preventivo.preventivo_id}/materiali`);
    if (response.ok) {
      const materialiPreventivo = await response.json();
      
      // Popola materialiSelezionati con i materiali del preventivo
      materialiPreventivo.forEach(materiale => {
        materialiSelezionati.value[materiale.preventivo_mat_mat_id] = materiale.preventivo_mat_quantita;
      });
    } else {
      console.warn('Errore nel caricamento dei materiali del preventivo:', response.statusText);
    }
  } catch (error) {
    console.error('Errore nel caricamento dei materiali del preventivo:', error);
    message.value = 'Errore nel caricamento dei materiali del preventivo';
    messageType.value = 'error';
  }
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
    preventivo_data_creazione: new Date().toISOString().split('T')[0], // Data corrente in formato YYYY-MM-DD per input date
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

function getScontoValue(id) {
  if (!id) return 'Nessuno'
  const sconto = sconti.value.find(s => s.sconto_id === id);
  return sconto ? `- ${sconto.sconto_percentuale}%` : 'N/A';
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