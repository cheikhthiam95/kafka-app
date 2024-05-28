# Utiliser une image Node.js plus récente
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de développement et de production
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Installer ts-node-dev globalement
RUN npm install -g ts-node-dev

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application en mode développement
CMD ["npm", "run", "start:dev"]
