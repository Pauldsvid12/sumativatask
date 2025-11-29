# 📝 TaskFlow - Gestor de Tareas Inteligente

Una aplicación moderna de gestión de tareas desarrollada con **React Native (Expo)**, diseñada para ser intuitiva, visualmente atractiva y funcional. Incluye soporte completo para modo oscuro, gestión de plazos y una arquitectura robusta.

## 🚀 Características Principales

- **Gestión de Tareas:** Crear, leer, editar y eliminar tareas (CRUD completo).
- **⏰ Gestión de Tiempo:**
  - Establecer fecha y hora de inicio.
  - Definir fechas de vencimiento (Deadlines).
  - Alertas visuales para tareas vencidas o próximas a vencer.
- **🎨 Interfaz Moderna & Temas:**
  - **Modo Claro:** Diseño limpio y minimalista.
  - **Modo Oscuro:** Estilo "Cyberpunk/Glow" con acentos neón y alto contraste.
  - Cambio de tema persistente (se guarda tu preferencia).
- **🔍 Ordenamiento Inteligente:** Las tareas se ordenan automáticamente por urgencia (fecha de vencimiento) y luego por creación.
- **📱 Experiencia Nativa:**
  - Uso de iconos profesionales (`lucide-react-native`).
  - Selectores de fecha/hora nativos (Android/iOS).
  - Animaciones y feedback táctil.
- **⚙️ Configuración Avanzada:**
  - Panel de ajustes dedicado.
  - Opción de "Zona de Peligro" para eliminar todas las tareas.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React Native, Expo Router, TypeScript.
- **Estilos:** StyleSheet nativo, Lucide Icons.
- **Estado:** React Context API (TaskContext, ThemeContext).
- **Backend (Simulado):** `json-server` para simular una API REST completa.
- **Persistencia:** AsyncStorage (para temas) y API REST (para datos).
- **Validación:** Lógica robusta para formularios y manejo de errores.
