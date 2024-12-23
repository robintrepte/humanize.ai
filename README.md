# HumanizeAI - AI Text Humanizer

HumanizeAI is a Next.js application that helps users transform AI-generated text into more natural, human-like writing. It features user authentication, credit-based usage, and multiple language support.

## Features

- AI text humanization with multiple complexity levels
- Multi-language support
- User authentication (Email, Google)
- Credit-based system
- User profile management
- Admin dashboard
- Dark/Light mode support

## Getting Started

### Prerequisites

#### Node.js and npm
1. Visit [nodejs.org](https://nodejs.org/)
2. Download and install the LTS version
3. Verify installation:
   ```
   node --version
   npm --version
   ```

#### Git
1. Download Git from [git-scm.com](https://git-scm.com/)
2. Install and follow the installer instructions
3. Configure Git:
   ```
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### Project Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/humanizeai.git
   cd humanizeai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL="your-database-url"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3003"
   OPENAI_API_KEY="your-openai-api-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open http://localhost:3003 in your browser

## Deployment

### Prerequisites

- PostgreSQL database
- Node.js environment
- Nginx web server
- PM2 process manager

### Server Installation

1. Connect to your server via SSH:
   ```bash
   ssh user@your-server
   ```

2. Clone the repository using SSH:
   ```bash
   cd /var/www
   git clone git@github.com:robintrepte/humanize.ai.git humanize.twentyfirst.media
   cd humanize.twentyfirst.media
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create and configure the `.env` file:
   ```bash
   cp .env.example .env
   nano .env   # Edit with your configuration
   ```

5. Build the application:
   ```bash
   npm run build
   ```

6. Set up PM2 for process management:
   ```bash
   # Install PM2 globally if not already installed
   npm install -g pm2
   
   # Start the application with PM2
   pm2 start npm --name "humanizeai" -- start
   
   # Enable startup script
   pm2 startup
   pm2 save
   ```

7. Monitor the application:
   ```bash
   pm2 status
   pm2 logs humanize-ai
   ```

8. Configure Nginx as reverse proxy (example configuration):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3003;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Updating the Application

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Install any new dependencies:
   ```bash
   npm install
   ```

3. Rebuild the application:
   ```bash
   npm run build
   ```

4. Restart the PM2 process:
   ```bash
   pm2 restart humanizeai
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.