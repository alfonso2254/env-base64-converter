<template>
  <div class="min-h-screen transition-colors duration-300" :class="{ 'dark': isDarkMode, 'dark-theme': isDarkMode }">
    <div class="container mx-auto py-8 px-4 fade-in">
      <Toast position="bottom-right" />
      
      <!-- Selector de tema -->
      <div class="absolute top-4 right-4 z-10 flex items-center gap-2">
        <span class="text-sm font-medium hidden sm:inline" :class="{ 'text-gray-600': !isDarkMode, 'text-gray-300': isDarkMode }">
          <i class="pi pi-sun" v-if="!isDarkMode"></i>
          <i class="pi pi-moon" v-else></i>
        </span>
        <InputSwitch v-model="isDarkMode" @change="toggleTheme" class="theme-switch" />
      </div>
      
      <header class="text-center mb-10 float-in">
        <div class="flex flex-col items-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 animated-text">
            <span class="text-primary-500 dark:text-primary-400">
              Convertidor ENV-Base64
            </span>
          </h1>
          <p class="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Codifica y decodifica fácilmente tus archivos .env con seguridad y eficiencia
          </p>
          
          <!-- Botones de acción rápida -->
          <div class="flex flex-wrap justify-center gap-3 mt-2">
            <Button 
              icon="pi pi-github" 
              label="Ver en GitHub" 
              class="p-button-rounded p-button-outlined"
              @click="openGitHub"
              v-tooltip.bottom="'Ver código fuente'"
            />
            <Button 
              icon="pi pi-question-circle" 
              label="Ayuda" 
              class="p-button-rounded p-button-outlined"
              @click="showHelp = true"
              v-tooltip.bottom="'Ver instrucciones'"
            />
          </div>
        </div>
      </header>
      
      <Card class="card mb-8 shadow-2xl transition-all duration-300 hover:shadow-neon dark:shadow-none dark:bg-dark-200 dark:border-dark-300 scale-in">
        <template #content>
          <TabView class="custom-tabview">
            <!-- Pestaña de Codificación -->
            <TabPanel header="Codificar .env a Base64">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="flex flex-col">
                  <div class="flex justify-between items-center mb-3">
                    <h2 class="text-xl font-medium flex items-center">
                      <i class="pi pi-file-edit text-primary-500 mr-2"></i>
                      <span>Archivo .env Original</span>
                    </h2>
                    <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-300 rounded-full px-3 py-1 shadow-sm" v-if="envStats.lines > 0">
                      <i class="pi pi-list mr-1"></i> {{ envStats.lines }} líneas | 
                      <i class="pi pi-key mr-1"></i> {{ envStats.vars }} variables
                    </div>
                  </div>
                  
                  <div 
                    class="dropzone mb-3 transition-all duration-300 border-dashed border-2 border-gray-300 dark:border-dark-400 hover:border-primary-400 dark:hover:border-primary-400 rounded-xl"
                    :class="{'border-primary-500 bg-primary-50 dark:bg-dark-300': isDraggingEncode}"
                    @dragover.prevent="isDraggingEncode = true"
                    @dragleave.prevent="isDraggingEncode = false"
                    @drop.prevent="handleFileDrop($event, 'encode')"
                  >
                    <div class="flex flex-wrap items-center gap-2 p-3">
                      <Button 
                        icon="pi pi-upload" 
                        label="Cargar archivo .env" 
                        class="p-button-rounded shadow-sm"
                        @click="triggerFileInput('encode')"
                        v-tooltip.bottom="'Cargar archivo .env'"
                      />
                      <input 
                        type="file" 
                        ref="encodeFileInput" 
                        class="hidden" 
                        accept=".env,.txt" 
                        @change="handleFileUpload('encode')"
                      />
                      <Button 
                        icon="pi pi-file" 
                        label="Ejemplo" 
                        class="p-button-rounded p-button-outlined" 
                        @click="loadExample('encode')"
                        v-tooltip.bottom="'Cargar datos de ejemplo'" 
                      />
                      <span class="text-sm text-gray-500 dark:text-gray-400 ml-auto flex items-center">
                        <i class="pi pi-info-circle mr-1"></i> Arrastra y suelta
                      </span>
                    </div>
                  </div>
                  
                  <Textarea 
                    v-model="envInput" 
                    class="textarea flex-grow custom-textarea font-mono text-sm dark:bg-dark-200 dark:border-dark-300"
                    :class="{'has-content': envInput.trim(), 'shadow-lg': envInput.trim()}"
                    rows="15" 
                    placeholder="Pega tu contenido de archivo .env aquí..."
                    @keydown.tab.prevent="handleTabKey"
                    @keydown.ctrl.enter="encodeEnvToBase64"
                    @input="updateEnvStats"
                  />
                  <div class="text-right mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end">
                    <i class="pi pi-bolt text-primary-500 mr-1"></i> Atajo: 
                    <kbd class="ml-1 bg-gray-100 dark:bg-dark-300 p-1 rounded">Ctrl</kbd>+<kbd class="bg-gray-100 dark:bg-dark-300 p-1 rounded">Enter</kbd>
                  </div>
                </div>
                
                <div class="flex flex-col">
                  <div class="flex justify-between items-center mb-3">
                    <h2 class="text-xl font-medium flex items-center">
                      <i class="pi pi-lock text-accent-secondary mr-2"></i>
                      <span>Resultado (Base64)</span>
                    </h2>
                    <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-300 rounded-full px-3 py-1 shadow-sm" v-if="base64Output">
                      <i class="pi pi-list mr-1"></i> {{ base64Output.split('\n').filter(line => line.trim()).length }} líneas
                    </div>
                  </div>
                  
                <div class="action-bar mb-3 p-3 bg-white dark:bg-dark-400 rounded-xl shadow-sm border border-gray-100 dark:border-dark-500">
                    <div class="flex flex-wrap justify-center sm:justify-end gap-3">
                        <!-- <Button 
                            icon="pi pi-refresh" 
                            label="Convertir" 
                            @click="encodeEnvToBase64"
                            :disabled="!envInput.trim()"
                            :loading="isProcessingEncode"
                            class="p-button-raised p-button-primary shadow-md transition-all duration-200 hover:shadow-lg flex-grow-0 min-w-[120px]"
                            v-tooltip.bottom="'Convertir a formato Base64'"
                        /> -->
                        <div class="flex flex-wrap gap-2 justify-end">
                            <Button 
                                icon="pi pi-copy" 
                                label="Copiar" 
                                class="p-button-raised p-button-secondary transition-all duration-200 hover:shadow-md" 
                                @click="copyToClipboard(base64Output)"
                                v-tooltip.bottom="'Copiar al portapapeles'"
                                :disabled="!base64Output.trim()"
                            />
                            <Button 
                                icon="pi pi-download" 
                                label="Descargar" 
                                class="p-button-raised p-button-success transition-all duration-200 hover:shadow-md"
                                @click="downloadFile(base64Output, 'env-base64.txt')"
                                v-tooltip.bottom="'Descargar como archivo .txt'"
                                :disabled="!base64Output.trim()" 
                            />
                            <Button 
                                icon="pi pi-trash" 
                                class="p-button-raised p-button-danger transition-all duration-200 hover:shadow-md" 
                                @click="clearFields('encode')"
                                v-tooltip.bottom="'Limpiar campos'"
                                :disabled="!envInput.trim() && !base64Output.trim()" 
                            />
                        </div>
                    </div>
                </div>
                  
                  <div class="relative flex-grow">
                    <Textarea 
                      v-model="base64Output" 
                      class="textarea flex-grow custom-textarea result-area font-mono text-sm dark:bg-dark-200 dark:border-dark-300"
                      :class="{'has-content': base64Output.trim(), 'shadow-lg': base64Output.trim()}"
                      rows="15" 
                      readonly 
                      placeholder="El resultado aparecerá aquí..."
                    />
                    
                    <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center" v-if="isProcessingEncode">
                      <div class="p-4 rounded-lg bg-white dark:bg-dark-200 shadow-lg">
                        <i class="pi pi-spin pi-spinner text-primary-500 text-2xl"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div class="result-actions mt-3 flex justify-end gap-2" v-if="base64Output.trim()">
                    <Badge value="Listo para usar" severity="success" class="animate-pulse-slow" />
                    <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <i class="pi pi-check-circle text-accent-success mr-1"></i> Datos codificados con éxito
                    </span>
                  </div>
                </div>
              </div>
            </TabPanel>
            
            <!-- Pestaña de Decodificación -->
            <TabPanel header="Decodificar Base64 a .env">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="flex flex-col">
                  <div class="flex justify-between items-center mb-3">
                    <h2 class="text-xl font-medium flex items-center">
                      <i class="pi pi-lock text-accent-secondary mr-2"></i>
                      <span>Valores Base64</span>
                    </h2>
                    <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-300 rounded-full px-3 py-1 shadow-sm" v-if="base64Input.trim()">
                      <i class="pi pi-list mr-1"></i> {{ base64Input.split('\n').filter(line => line.trim()).length }} líneas
                    </div>
                  </div>
                  
                  <div 
                    class="dropzone mb-3 transition-all duration-300 border-dashed border-2 border-gray-300 dark:border-dark-400 hover:border-primary-400 dark:hover:border-primary-400 rounded-xl"
                    :class="{'border-primary-500 bg-primary-50 dark:bg-dark-300': isDraggingDecode}"
                    @dragover.prevent="isDraggingDecode = true"
                    @dragleave.prevent="isDraggingDecode = false"
                    @drop.prevent="handleFileDrop($event, 'decode')"
                  >
                    <div class="flex flex-wrap items-center gap-2 p-3">
                      <Button 
                        icon="pi pi-upload" 
                        label="Cargar archivo" 
                        class="p-button-rounded shadow-sm"
                        @click="triggerFileInput('decode')"
                        v-tooltip.bottom="'Cargar archivo de texto'"
                      />
                      <input 
                        type="file" 
                        ref="decodeFileInput" 
                        class="hidden" 
                        accept=".txt" 
                        @change="handleFileUpload('decode')"
                      />
                      <Button 
                        icon="pi pi-file" 
                        label="Ejemplo" 
                        class="p-button-rounded p-button-outlined" 
                        @click="loadExample('decode')"
                        v-tooltip.bottom="'Cargar datos de ejemplo'" 
                      />
                      <span class="text-sm text-gray-500 dark:text-gray-400 ml-auto flex items-center">
                        <i class="pi pi-info-circle mr-1"></i> Arrastra y suelta
                      </span>
                    </div>
                  </div>
                  
                  <Textarea 
                    v-model="base64Input" 
                    class="textarea flex-grow custom-textarea font-mono text-sm dark:bg-dark-200 dark:border-dark-300"
                    :class="{'has-content': base64Input.trim(), 'shadow-lg': base64Input.trim()}"
                    rows="15" 
                    placeholder="Pega tus pares KEY:base64value aquí..."
                    @keydown.tab.prevent="handleTabKey"
                    @keydown.ctrl.enter="decodeBase64ToEnv"
                    @input="decodeBase64ToEnv"
                  />
                  <div class="text-right mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end">
                    <i class="pi pi-bolt text-primary-500 mr-1"></i> Atajo: 
                    <kbd class="ml-1 bg-gray-100 dark:bg-dark-300 p-1 rounded">Ctrl</kbd>+<kbd class="bg-gray-100 dark:bg-dark-300 p-1 rounded">Enter</kbd>
                  </div>
                </div>
                
                <div class="flex flex-col">
                  <div class="flex justify-between items-center mb-3">
                    <h2 class="text-xl font-medium flex items-center">
                      <i class="pi pi-file-edit text-primary-500 mr-2"></i>
                      <span>Resultado (.env)</span>
                    </h2>
                    <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-300 rounded-full px-3 py-1 shadow-sm" v-if="envStats.decodedVars > 0">
                      <i class="pi pi-list mr-1"></i> {{ envOutput.split('\n').filter(line => line.trim()).length }} líneas | 
                      <i class="pi pi-key mr-1"></i> {{ envStats.decodedVars }} variables
                    </div>
                  </div>

                  <div class="action-bar mb-3 p-3 bg-white dark:bg-dark-400 rounded-xl shadow-sm border border-gray-100 dark:border-dark-500">
                    <div class="flex flex-wrap justify-center sm:justify-end gap-3">
                        <!-- <Button 
                            icon="pi pi-refresh" 
                            label="Convertir" 
                            @click="encodeEnvToBase64"
                            :disabled="!envInput.trim()"
                            :loading="isProcessingEncode"
                            class="p-button-raised p-button-primary shadow-md transition-all duration-200 hover:shadow-lg flex-grow-0 min-w-[120px]"
                            v-tooltip.bottom="'Convertir a formato Base64'"
                        /> -->
                        <div class="flex flex-wrap gap-2 justify-end">
                            <Button 
                                icon="pi pi-copy" 
                                label="Copiar" 
                                class="p-button-raised p-button-secondary transition-all duration-200 hover:shadow-md" 
                                @click="copyToClipboard(envOutput)"
                                v-tooltip.bottom="'Copiar al portapapeles'"
                                :disabled="!envOutput.trim()"
                            />
                            <Button 
                                icon="pi pi-download" 
                                label="Descargar .env"
                                class="p-button-raised p-button-success transition-all duration-200 hover:shadow-md"
                                @click="downloadEnvFile()"
                                v-tooltip.bottom="'Descargar como archivo .env'"
                                :disabled="!envOutput.trim()"
                            />
                            <Button 
                                icon="pi pi-trash" 
                                class="p-button-raised p-button-danger transition-all duration-200 hover:shadow-md" 
                                @click="clearFields('decode')"
                        v-tooltip.bottom="'Limpiar campos'"
                        :disabled="!base64Input.trim() && !envOutput.trim()"  
                            />
                        </div>
                    </div>
                </div>
                  
                  <div class="relative flex-grow">
                    <Textarea 
                      v-model="envOutput" 
                      class="textarea flex-grow custom-textarea result-area font-mono text-sm dark:bg-dark-200 dark:border-dark-300"
                      :class="{'has-content': envOutput.trim(), 'shadow-lg': envOutput.trim()}"
                      rows="15" 
                      readonly 
                      placeholder="El resultado aparecerá aquí..."
                    />
                    
                    <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center" v-if="isProcessingDecode">
                      <div class="p-4 rounded-lg bg-white dark:bg-dark-200 shadow-lg">
                        <i class="pi pi-spin pi-spinner text-primary-500 text-2xl"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div class="result-actions mt-3 flex justify-end gap-2" v-if="envOutput.trim()">
                    <Badge value="Listo para usar" severity="success" class="animate-pulse-slow" />
                    <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <i class="pi pi-check-circle text-accent-success mr-1"></i> Datos decodificados con éxito
                    </span>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </template>
      </Card>
      
      <Card class="card shadow-xl transition-all duration-300 dark:shadow-none dark:bg-dark-200 dark:border-dark-300 mb-8 float-in">
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-info-circle mr-2 text-primary-500"></i>
            <span>Instrucciones de uso</span>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="feature-card p-4">
              <h3 class="text-lg font-semibold mb-3 flex items-center">
                <i class="pi pi-arrow-up text-primary-500 mr-2"></i>
                Para codificar a Base64
              </h3>
              <ol class="list-decimal ml-5 space-y-3 text-gray-700 dark:text-gray-300">
                <li>Pega el contenido de tu archivo .env en el campo de entrada <span class="badge bg-gray-200 dark:bg-dark-400 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">o</span> arrastra y suelta tu archivo</li>
                <li>Haz clic en <Button label="Convertir" size="small" icon="pi pi-refresh" class="inline-button p-button-sm" disabled /> para generar el formato KEY:base64value</li>
                <li>Usa el botón <Button label="Copiar" size="small" icon="pi pi-copy" class="p-button-secondary inline-button p-button-sm" disabled /> para copiar el resultado al portapapeles</li>
                <li>También puedes descargar el resultado como un archivo de texto</li>
              </ol>
              <div class="mt-3 bg-white dark:bg-dark-200 p-3 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <div class="text-sm flex items-center"><i class="pi pi-bolt text-blue-500 mr-2"></i> <strong>Atajo:</strong> Presiona <kbd class="mx-1 bg-gray-100 dark:bg-dark-300 p-1 rounded text-xs">Ctrl</kbd>+<kbd class="bg-gray-100 dark:bg-dark-300 p-1 rounded text-xs">Enter</kbd> para convertir rápidamente.</div>
              </div>
            </div>
            <div class="feature-card p-4">
              <h3 class="text-lg font-semibold mb-3 flex items-center">
                <i class="pi pi-arrow-down text-primary-500 mr-2"></i>
                Para decodificar desde Base64
              </h3>
              <ol class="list-decimal ml-5 space-y-3 text-gray-700 dark:text-gray-300">
                <li>Pega el contenido en formato KEY:base64value <span class="badge bg-gray-200 dark:bg-dark-400 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">o</span> arrastra y suelta tu archivo</li>
                <li>Haz clic en <Button label="Convertir" size="small" icon="pi pi-refresh" class="inline-button p-button-sm" disabled /> para generar el archivo .env</li>
                <li>Usa <Button label="Copiar" size="small" icon="pi pi-copy" class="p-button-secondary inline-button p-button-sm" disabled /> para copiar el resultado</li>
                <li>Descarga el archivo .env completo con <Button label="Descargar" size="small" icon="pi pi-download" class="p-button-success inline-button p-button-sm" disabled /></li>
              </ol>
              <div class="mt-3 bg-white dark:bg-dark-200 p-3 rounded-lg border-l-4 border-green-500 shadow-sm">
                <div class="text-sm flex items-center"><i class="pi pi-check-circle text-green-500 mr-2"></i> <strong>Tip:</strong> Las variables que contengan espacios se guardarán automáticamente entre comillas.</div>
              </div>
            </div>
          </div>
        </template>
      </Card>
      
      <footer class="mt-10 text-center">
        <div class="p-4 bg-gray-50 dark:bg-dark-300 rounded-xl inline-block shadow-sm transition-all duration-300 hover:shadow-md">
          <div class="mb-2 text-gray-600 dark:text-gray-400 text-sm">
            <i class="pi pi-code mr-1"></i> Herramienta de código abierto
          </div>
          <a href="https://github.com/alfonso2254/env-base64-converter" target="_blank" class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium hover:underline flex items-center justify-center">
            <i class="pi pi-github mr-2"></i> Desarrollado por Alarcon
          </a>
        </div>
      </footer>
      
      <!-- Diálogo de ayuda -->
    <Dialog 
      v-model:visible="showHelp" 
      modal 
      header="Guía de uso" 
      :style="{width: '90%', maxWidth: '700px'}" 
      class="p-fluid help-dialog"
      :contentClass="isDarkMode ? 'dark-dialog-content' : ''"
      :headerClass="isDarkMode ? 'dark-dialog-header' : ''"
    >
      <div class="p-4 dark:text-gray-200">
        <h3 class="text-xl font-bold mb-4 text-center text-primary-600 dark:text-primary-400">¿Cómo funciona ENV-Base64 Converter?</h3>
        
        <div class="space-y-6">
        <div class="bg-gray-50 dark:bg-dark-400 p-4 rounded-lg shadow-sm">
          <h4 class="text-lg font-semibold mb-2 flex items-center">
            <i class="pi pi-question-circle text-primary-500 dark:text-primary-400 mr-2"></i>
            ¿Qué hace esta herramienta?
          </h4>
          <p class="text-gray-700 dark:text-gray-200">
            Esta herramienta permite convertir archivos .env a formato Base64 y viceversa, facilitando el almacenamiento seguro de variables de entorno sensibles o su transferencia entre sistemas de forma segura.
          </p>
        </div>
        
        <div class="bg-gray-50 dark:bg-dark-400 p-4 rounded-lg shadow-sm">
          <h4 class="text-lg font-semibold mb-2 flex items-center">
            <i class="pi pi-shield text-primary-500 dark:text-primary-400 mr-2"></i>
            Seguridad de tus datos
          </h4>
          <p class="text-gray-700 dark:text-gray-200">
            Toda la conversión se realiza localmente en tu navegador. Tus datos sensibles nunca se envían a ningún servidor externo, garantizando total privacidad y seguridad.
          </p>
        </div>
        
        <div class="bg-gray-50 dark:bg-dark-400 p-4 rounded-lg shadow-sm">
          <h4 class="text-lg font-semibold mb-2 flex items-center">
            <i class="pi pi-cog text-primary-500 dark:text-primary-400 mr-2"></i>
            Funcionalidades avanzadas
          </h4>
          <ul class="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200">
            <li>Codificación/decodificación instantánea con atajos de teclado</li>
            <li>Soporte para arrastrar y soltar archivos</li>
            <li>Preservación de comentarios en los archivos .env</li>
            <li>Detección automática de variables que necesitan comillas</li>
            <li>Tema claro/oscuro que se adapta a tus preferencias</li>
          </ul>
        </div>
        </div>
        
        <div class="mt-6 flex justify-end">
        <Button 
          label="Entendido" 
          icon="pi pi-check" 
          @click="showHelp = false" 
          class="dark:bg-primary-500 dark:hover:bg-primary-600 dark:text-white" 
        />
        </div>
      </div>
    </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

// Modo oscuro
const isDarkMode = ref(document.documentElement.classList.contains('dark-theme'));

// Estado del diálogo de ayuda
const showHelp = ref(false);

// Referencias para inputs de archivos
const encodeFileInput = ref(null);
const decodeFileInput = ref(null);

// Estados para los campos de texto
const envInput = ref('');
const base64Output = ref('');
const base64Input = ref('');
const envOutput = ref('');

// Estados de arrastrar y soltar
const isDraggingEncode = ref(false);
const isDraggingDecode = ref(false);

// Estados de procesamiento
const isProcessingEncode = ref(false);
const isProcessingDecode = ref(false);

// Estadísticas de variables
const envStats = reactive({
  lines: 0,
  vars: 0,
  decodedVars: 0
});

// Actualizar estadísticas cuando cambia el input
const updateEnvStats = () => {
  if (!envInput.value) {
    envStats.lines = 0;
    envStats.vars = 0;
    return;
  }
  
  const lines = envInput.value.split('\n');
  envStats.lines = lines.length;
  envStats.vars = lines.filter(line => 
    line.trim() && !line.trim().startsWith('#') && line.includes('=')
  ).length;

  encodeEnvToBase64();
};

// Actualizar estadísticas de decodificación
const updateDecodedStats = () => {
  if (!envOutput.value) {
    envStats.decodedVars = 0;
    return;
  }
  
  envStats.decodedVars = envOutput.value.split('\n').filter(line => 
    line.trim() && !line.trim().startsWith('#') && line.includes('=')
  ).length;
};

// Ejemplos para la demostración
const examples = reactive({
  env: `# Configuración de la aplicación
APP_ENV=local
APP_KEY="sgL09s4D964w35llE5hG+JVwRZmDIgUjcUyRAoHIvxU="
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

# Configuración de logging
LOG_CHANNEL=stack

# Variables en blanco o con espacios
EMPTY_VAR=
SPACE_VAR= valor con espacios 

# Comentario final`,
  base64: `# Configuración de la aplicación
APP_ENV:bG9jYWw=
APP_KEY:c2dMMDlzNEQ5NjR3MzVsbEU1aEcrSlZ3UlptRElnVWpjVXlSQW9ISXh4VT0=
APP_DEBUG:dHJ1ZQ==
APP_URL:aHR0cDovLzEyNy4wLjAuMTo4MDAw

# Configuración de logging
LOG_CHANNEL:c3RhY2s=

# Variables en blanco o con espacios
EMPTY_VAR:
SPACE_VAR:IHZhbG9yIGNvbiBlc3BhY2lvcyA=

# Comentario final`
});

// Cambiar tema claro/oscuro
const toggleTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
  
  toast.add({
    severity: 'info',
    summary: isDarkMode.value ? 'Modo oscuro activado' : 'Modo claro activado',
    detail: 'La configuración de tema ha sido actualizada',
    life: 2000
  });
};

// Manejar la tecla Tab en textareas
const handleTabKey = (event) => {
  const textarea = event.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  
  // Insertar espacios en lugar de cambiar el foco
  const spaces = '  ';
  const text = textarea.value;
  textarea.value = text.substring(0, start) + spaces + text.substring(end);
  textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
};

// Manejar arrastrar y soltar archivos
const handleFileDrop = (event, mode) => {
  if (mode === 'encode') {
    isDraggingEncode.value = false;
  } else {
    isDraggingDecode.value = false;
  }
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    
    // Verificar tipo de archivo
    if (mode === 'encode' && !file.name.endsWith('.env') && !file.name.endsWith('.txt')) {
      toast.add({
        severity: 'warn',
        summary: 'Tipo de archivo no válido',
        detail: 'Por favor arrastra un archivo .env o .txt',
        life: 3000
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (mode === 'encode') {
        envInput.value = e.target.result;
        updateEnvStats();
      } else {
        base64Input.value = e.target.result;
      }
      
      toast.add({
        severity: 'success',
        summary: 'Archivo cargado',
        detail: `Se ha cargado el archivo "${file.name}" correctamente`,
        life: 3000
      });
    };
    
    reader.readAsText(file);
  }
};

// Función para activar la carga de archivos
const triggerFileInput = (mode) => {
  if (mode === 'encode') {
    encodeFileInput.value.click();
  } else {
    decodeFileInput.value.click();
  }
};

// Manejar la carga de archivos
const handleFileUpload = (mode) => {
  const fileInput = mode === 'encode' ? encodeFileInput.value : decodeFileInput.value;
  
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (mode === 'encode') {
        envInput.value = e.target.result;
        updateEnvStats();
      } else {
        base64Input.value = e.target.result;
      }
      
      // Mostrar notificación
      toast.add({
        severity: 'success',
        summary: 'Archivo cargado',
        detail: `Se ha cargado el archivo "${fileInput.files[0].name}" correctamente`,
        life: 3000
      });
    };
    
    reader.readAsText(fileInput.files[0]);
  }
};

// Función para codificar de .env a Base64
const encodeEnvToBase64 = () => {
  try {
    if (!envInput.value.trim()) {
    //   toast.add({
    //     severity: 'warn',
    //     summary: 'Campo vacío',
    //     detail: 'Por favor introduce el contenido del archivo .env',
    //     life: 3000
    //   });
      return;
    }
    
    isProcessingEncode.value = true;
    
    // Simulamos un pequeño retraso para mostrar la animación de carga
  
      const lines = envInput.value.split('\n');
      const result = lines.map(line => {
        // Si es un comentario o línea vacía, preservarla
        if (line.trim() === '' || line.trim().startsWith('#')) {
          return line;
        }
        
        // Buscar el primer signo igual que no esté escapado
        const equalIndex = line.indexOf('=');
        
        if (equalIndex === -1) {
          // Si no hay signo igual, devolver la línea como está
          return line;
        }
        
        const key = line.substring(0, equalIndex).trim();
        const value = line.substring(equalIndex + 1);
        
        // Si el valor está vacío, devolver solo la clave con dos puntos
        if (!value.trim()) {
          return `${key}:`;
        }
        
        // Eliminar comillas que puedan rodear el valor
        let cleanValue = value.trim();
        if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) || 
            (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
          cleanValue = cleanValue.substring(1, cleanValue.length - 1);
        }
        
        // Codificar a Base64
        const base64Value = btoa(cleanValue);
        return `${key}: ${base64Value}`;
      });
      
      base64Output.value = result.join('\n');
      isProcessingEncode.value = false;
      
    //   toast.add({
    //     severity: 'success',
    //     summary: 'Codificación completada',
    //     detail: 'Variables codificadas a Base64 correctamente',
    //     life: 3000
    //   });

  } catch (error) {
    isProcessingEncode.value = false;
    console.error('Error al codificar:', error);
    toast.add({
      severity: 'error',
      summary: 'Error de codificación',
      detail: 'Ocurrió un error al codificar los valores: ' + error.message,
      life: 5000
    });
  }
};

// Función para decodificar de Base64 a .env
const decodeBase64ToEnv = () => {
  try {
    if (!base64Input.value.trim()) {
      return;
    }
    
    isProcessingDecode.value = true;
    
    // Simulamos un pequeño retraso para mostrar la animación de carga
      const lines = base64Input.value.split('\n');
      const result = lines.map(line => {
        // Si es un comentario o línea vacía, preservarla
        if (line.trim() === '' || line.trim().startsWith('#')) {
          return line;
        }
        
        // Encontrar el primer caracter de dos puntos
        const colonIndex = line.indexOf(':');
        
        if (colonIndex === -1) {
          // Si no hay dos puntos, devolver la línea como está
          return line;
        }
        
        const key = line.substring(0, colonIndex).trim();
        const base64Value = line.substring(colonIndex + 1);
        
        // Si el valor está vacío, devolver clave con signo igual
        if (!base64Value.trim()) {
          return `${key}=`;
        }
        
        try {
          // Decodificar de Base64
          const originalValue = atob(base64Value);
          
          // Verificar si el valor necesita comillas (contiene espacios o caracteres especiales)
          if (originalValue.includes(' ') || /[=;#"'`]/.test(originalValue)) {
            return `${key}="${originalValue}"`;
          } else {
            return `${key}=${originalValue}`;
          }
        } catch (decodeError) {
          console.warn(`Error al decodificar el valor de ${key}: ${decodeError}`);
          // Si hay un error en la decodificación, mantener el valor original
          return `${key}=${base64Value}`;
        }
      });
      
      envOutput.value = result.join('\n');
      updateDecodedStats();
      isProcessingDecode.value = false;
  
  } catch (error) {
    isProcessingDecode.value = false;
    console.error('Error al decodificar:', error);
    toast.add({
      severity: 'error',
      summary: 'Error de decodificación',
      detail: 'Ocurrió un error al decodificar los valores: ' + error.message,
      life: 5000
    });
  }
};

// Función para copiar al portapapeles
const copyToClipboard = (text) => {
  if (!text) return;
  
  navigator.clipboard.writeText(text).then(() => {
    toast.add({
      severity: 'info',
      summary: 'Copiado',
      detail: 'Contenido copiado al portapapeles',
      life: 2000,
      position: 'top'
    });
  }).catch(err => {
    console.error('Error al copiar:', err);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo copiar al portapapeles',
      life: 3000
    });
  });
};

// Función para limpiar campos
const clearFields = (mode) => {
  if (mode === 'encode') {
    envInput.value = '';
    base64Output.value = '';
    updateEnvStats();
  } else {
    base64Input.value = '';
    envOutput.value = '';
    envStats.decodedVars = 0;
  }
  
  toast.add({
    severity: 'info',
    summary: 'Campos limpiados',
    detail: 'Se han limpiado los campos de texto',
    life: 2000
  });
};

// Función general para descargar archivos
const downloadFile = (content, fileName) => {
  if (!content) return;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  toast.add({
    severity: 'success',
    summary: 'Descarga iniciada',
    detail: `El archivo ${fileName} se está descargando`,
    life: 2000
  });
};

// Función para descargar archivo .env
const downloadEnvFile = () => {
  downloadFile(envOutput.value, '.env');
};

// Función para cargar ejemplos
const loadExample = (mode) => {
  if (mode === 'encode') {
    envInput.value = examples.env;
    updateEnvStats();
  } else {
    base64Input.value = examples.base64;
  }
  
  toast.add({
    severity: 'info',
    summary: 'Ejemplo cargado',
    detail: 'Se ha cargado un ejemplo para demostración',
    life: 2000
  });
};

// Función para abrir GitHub
const openGitHub = () => {
  window.open('https://github.com/alfonso2254/env-base64-converter', '_blank');
};

// Observar cambios
watch(envInput, () => {
  updateEnvStats();
});

// Inicialización
onMounted(() => {
  // Atajo de teclado global para guardar (Ctrl+S)
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      if (envOutput.value) {
        downloadEnvFile();
      } else if (base64Output.value) {
        downloadFile(base64Output.value, 'env-base64.txt');
      }
    }
  });
  
  // Comprueba si es la primera visita para mostrar la ayuda
  const hasVisitedBefore = localStorage.getItem('visitedBefore');
  if (!hasVisitedBefore) {
    showHelp.value = true;
    localStorage.setItem('visitedBefore', 'true');
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.text-gradient {
  background-image: linear-gradient(45deg, #3b82f6, #6366f1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Estilos de las zonas de arrastre */
.dropzone {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 2px dashed #e5e7eb;
  transition: all 0.3s ease;
}

.dropzone.active {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

/* Estilos para textareas mejorados */
.custom-textarea {
  transition: all 0.3s ease;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  resize: vertical;
}

.custom-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

.custom-textarea.has-content {
  border-color: #9ca3af;
}

.custom-textarea.result-area {
  background-color: #f9fafb;
}

/* Estilos para los tabs */
:deep(.p-tabview-panels) {
  padding: 1.5rem 0;
}

:deep(.p-tabview-nav) {
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.p-tabview-nav li .p-tabview-nav-link) {
  padding: 1rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  background-color: #3b82f6;
  color: white;
}

/* Estilos para cards */
:deep(.p-card) {
  border-radius: 0.75rem;
  overflow: hidden;
}

/* Botones inline para instrucciones */
.inline-button {
  vertical-align: middle;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem;
}

/* Badge para instrucciones */
.badge {
  background-color: #e5e7eb;
  color: #4b5563;
  font-size: 0.7rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  display: inline-block;
  margin: 0 0.25rem;
}

/* Estilos para bloques de características */
.feature-block {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
}

/* Estilos para teclados */
kbd {
  background-color: #f3f4f6;
  border-radius: 3px;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  color: #374151;
  display: inline-block;
  font-size: 0.75rem;
  line-height: 1;
  padding: 0.1rem 0.4rem;
  margin: 0 0.1rem;
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.result-actions {
  animation: fadeIn 0.3s ease-in-out;
}

/* Estilos adicionales */
.animated-text {
  text-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
}

/* Estilos para botones de instrucciones */
.inline-button {
  vertical-align: middle !important;
  font-size: 0.75rem !important;
  padding: 0.25rem 0.5rem !important;
  margin: 0 0.25rem !important;
}

/* Mejoras para interruptor de tema */
.theme-switch :deep(.p-inputswitch-slider) {
  background-color: #334155 !important;
}

.dark-theme .theme-switch :deep(.p-inputswitch-slider) {
  background-color: #1e293b !important;
}

.theme-switch :deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  background-color: var(--primary-color) !important;
}
</style>
