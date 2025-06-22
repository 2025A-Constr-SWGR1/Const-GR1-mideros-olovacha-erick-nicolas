# Usa Node.js v22.15 como base
FROM node:22.15

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos de definición del proyecto
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto (cambia según tu app)
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]