# Usa Node.js 22 como base
FROM node:22

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración
COPY package.json package-lock.json ./

# Instala las dependencias sin incluir las de desarrollo
RUN npm install --omit=dev

# Copia el resto del código fuente
COPY . .

# Expone los puertos utilizados (REST y GraphQL)
EXPOSE 5001 4001

# Comando para ejecutar el servidor
CMD ["node", "src/server.js"]
