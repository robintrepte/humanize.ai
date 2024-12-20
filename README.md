# HumanizeAI - AI Text Humanizer

HumanizeAI is a Next.js application that helps users transform AI-generated text into more natural, human-like writing. It features user authentication, credit-based usage, and multiple language support.

## Features

- AI text humanization with multiple complexity levels
- Multi-language support
- User authentication (Email, Discord, Google)
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
   DISCORD_CLIENT_ID="your-discord-client-id"
   DISCORD_CLIENT_SECRET="your-discord-client-secret"
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

[Original deployment instructions remain the same...]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.