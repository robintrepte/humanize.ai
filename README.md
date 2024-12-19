# NextJS Login Template

## Inhaltsverzeichnis
1. [Anwendung entwickeln](#anwendung-entwickeln)
2. [Deployment-Prozess](#deployment-prozess)

## Anwendung entwickeln

### Entwicklungsumgebung einrichten

#### Node.js und npm installieren
1. Besuchen Sie [nodejs.org](https://nodejs.org/)
2. Laden Sie die LTS-Version herunter und installieren Sie sie
3. Überprüfen Sie die Installation:
   ```
   node --version
   npm --version
   ```

#### Git installieren
1. Laden Sie Git von [git-scm.com](https://git-scm.com/) herunter
2. Installieren Sie Git und folgen Sie den Anweisungen des Installers
3. Konfigurieren Sie Git:
   ```
   git config --global user.name "Ihr Name"
   git config --global user.email "ihre.email@beispiel.com"
   ```

#### Für Windows-Benutzer:
1. Git für Windows installieren:
   - Besuchen Sie https://git-scm.com/download/win
   - Laden Sie den Installer herunter und führen Sie ihn aus

2. Personal Access Token (PAT) erstellen:
   - Melden Sie sich bei GitHub an
   - Gehen Sie zu Einstellungen > Developer settings > Personal access tokens
   - Generieren Sie einen neuen Token mit 'repo'-Berechtigung

3. Anmeldeinformationen speichern (optional):
   ```
   git config --global credential.helper wincred
   ```

### Projekt klonen und einrichten
1. Klonen Sie das Repository:
   ```
   git clone https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git
   cd ${REPO_NAME}
   ```
2. Installieren Sie die Abhängigkeiten:
   ```
   npm install
   ```
3. Starten Sie den Entwicklungsserver:
   ```
   npm run dev
   ```
4. Öffnen Sie http://localhost:3000 in Ihrem Browser

### Lokale Änderungen vornehmen
1. Öffnen Sie das Projekt in Cursor.sh
2. Nehmen Sie Ihre Änderungen vor
3. Testen Sie die Änderungen lokal:
   ```
   npm run dev
   ```

### Änderungen committen und pushen
1. Überprüfen Sie den Status Ihrer Änderungen:
   ```
   git status
   ```
2. Fügen Sie Änderungen zum Staging-Bereich hinzu:
   ```
   git add .
   ```
3. Committen Sie die Änderungen:
   ```
   git commit -m "Beschreibung Ihrer Änderungen"
   ```
4. Pushen Sie die Änderungen:
   ```
   git push origin main
   ```

## Deployment-Prozess

### Hetzner-Server einrichten

#### SSH-Zugang einrichten
1. Generieren Sie ein SSH-Schlüsselpaar auf Ihrem lokalen Computer:
   ```
   ssh-keygen -t rsa -b 4096 -C "ihre.email@beispiel.com"
   ```
2. Kopieren Sie den öffentlichen Schlüssel auf den Hetzner-Server:
   ```
   ssh-copy-id benutzer@server-ip
   ```

### Node.js und npm auf dem Server installieren
```
sudo apt update
sudo apt install nodejs npm -y
```

### PM2 installieren
```
sudo npm install -g pm2
```

### PostgreSQL installieren und einrichten
```
sudo apt install postgresql postgresql-contrib -y
sudo -i -u postgres
psql
```
Im PostgreSQL-Prompt:
```sql
CREATE USER your_user WITH PASSWORD 'your_password';
CREATE DATABASE your_database;
GRANT ALL PRIVILEGES ON DATABASE your_database TO your_user;
\q
```

### Nginx installieren und konfigurieren
1. Installieren Sie Nginx:
   ```
   sudo apt install nginx -y
   ```
2. Erstellen Sie eine Nginx-Konfiguration:
   ```
   sudo nano /etc/nginx/sites-available/your-app
   ```
3. Fügen Sie folgende Konfiguration hinzu:
   ```nginx
   server {
      listen 80;
       server_name domain.com;

      location / {
         proxy_pass http://localhost:3000;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection 'upgrade';
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;
      }
   }
   ```
4. Aktivieren Sie die Konfiguration:
   ```
   sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Automatisches Deployment einrichten
1. Auf dem Server, navigieren Sie zum Projektverzeichnis:
   ```
   cd /var/www/domain.com
   ```
2. Erstellen Sie einen post-receive Hook:
   ```
   mkdir -p .git/hooks
   nano .git/hooks/post-receive
   ```
3. Fügen Sie folgenden Inhalt hinzu:
   ```bash
   #!/bin/sh
   git --work-tree=/var/www/domain.com --git-dir=/var/www/domain.com/.git pull origin main
   npm install
   npm run build
   pm2 restart your-app
   ```
4. Machen Sie den Hook ausführbar:
   ```
   chmod +x .git/hooks/post-receive
   ```

### Manuelles Deployment (falls nötig)
1. Verbinden Sie sich per SSH mit dem Server
2. Navigieren Sie zum Projektverzeichnis
3. Pullen Sie die neuesten Änderungen:
   ```
   git pull origin main
   ```
4. Installieren Sie Abhängigkeiten und bauen Sie das Projekt:
   ```
   npm install
   npm run build
   ```
5. Starten Sie die Anwendung neu:
   ```
   pm2 restart your-app
   ```