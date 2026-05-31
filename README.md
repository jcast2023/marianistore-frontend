# 🛒 tiendaonline Frontend - Angular 20

Interfaz moderna y reactiva para sistema de comercio electrónico con gestión completa de productos, pedidos, direcciones de envío, simulador de pagos y visualización de facturas PDF.

---

## 🚀 Características Principales

### **Gestión de Usuarios**
- ✅ Registro de nuevos usuarios
- ✅ Login con JWT authentication
- ✅ Roles: Usuario y Administrador
- ✅ Persistencia de sesión con localStorage
- ✅ Guards para protección de rutas

### **Catálogo de Productos**
- ✅ Vista de cuadrícula con imágenes
- ✅ Detalles de producto con galería
- ✅ Filtrado por categorías
- ✅ Control de stock en tiempo real
- ✅ Agregar al carrito con validación

### **Carrito de Compras**
- ✅ Agregar/eliminar productos
- ✅ Modificar cantidades con validación de stock
- ✅ **Selector de múltiples direcciones de envío**
- ✅ Vista previa de dirección seleccionada
- ✅ Cálculo de totales en tiempo real
- ✅ Creación de pedido con dirección asociada

### **Gestión de Direcciones**
- ✅ CRUD completo de direcciones
- ✅ Múltiples direcciones por usuario
- ✅ Formulario reactivo con validaciones
- ✅ Selección de dirección en el checkout
- ✅ **Protección:** No eliminar direcciones con pedidos asociados
- ✅ Mensajes de error descriptivos con SweetAlert2

### **Sistema de Pagos**
- ✅ **Simulador de pasarela de pagos**
- ✅ **3 métodos:** Tarjeta de Crédito, PayPal, Transferencia
- ✅ Formulario de tarjeta con validación
- ✅ Delay de procesamiento (2 segundos)
- ✅ Confirmación visual con SweetAlert2
- ✅ Registro del método en el pedido

### **Mis Pedidos**
- ✅ Historial completo de pedidos
- ✅ Estados con badges de colores
- ✅ Vista de detalles con modal
- ✅ **Mostrar método de pago** usado
- ✅ **Mostrar dirección de envío** completa
- ✅ Miniaturas de productos
- ✅ **Descargar factura PDF**
- ✅ **Visualizar PDF en navegador** (sin error 403)

### **Facturas PDF**
- ✅ Generación desde el backend
- ✅ QR Code y código de barras
- ✅ Información completa del pedido
- ✅ Dirección de envío incluida
- ✅ Método de pago especificado
- ✅ Botones: Ver PDF inline y Descargar

### **Dashboard Administrativo**
- ✅ Estadísticas de ventas totales
- ✅ Pedidos pendientes de envío
- ✅ Productos con stock crítico
- ✅ Gráficas interactivas con Chart.js
- ✅ Vista en tiempo real

### **Panel de Administración**
- ✅ Gestión de productos (CRUD)
- ✅ Control de stock
- ✅ Listado de todos los pedidos
- ✅ Cambio de estado de pedidos
- ✅ Visualización de estadísticas

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| **Framework** | Angular | 19.x |
| **Componentes** | Standalone Components | ✅ |
| **Estado** | RxJS & Signals | ✅ |
| **Estilos** | Bootstrap | 5.3 |
| **Iconos** | Bootstrap Icons | 1.11 |
| **Alertas** | SweetAlert2 | 11.x |
| **Gráficas** | Chart.js & ng2-charts | 6.x |
| **Autenticación** | JWT Interceptor | ✅ |
| **HTTP Client** | HttpClient | Angular |
| **Routing** | Angular Router | 19.x |
| **Formularios** | Reactive Forms | Angular |

---

<p align="center">
  <img src="src/assets/screenshots/dashboard.png" alt="tiendaonline Dashboard" width="900">
</p>


## 🔗 Enlace al Backend
Este frontend consume la API REST de:
👉 [tiendaonline Backend (Spring Boot)](https://github.com/jcast2023/e-commerce)
