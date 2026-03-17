# ETAPA 1: Construcción (Build) - ACTUALIZADO A NODE 22
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build --configuration=production

# ETAPA 2: Servidor (Nginx) - CORREGIDA
FROM nginx:stable-alpine

# Eliminamos la línea genérica y dejamos solo la ruta específica de Angular 17+
COPY --from=build /app/dist/techshop-frontend/browser /usr/share/nginx/html

# Opcional: Copiar un archivo de configuración de Nginx si tienes uno para manejar rutas
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
