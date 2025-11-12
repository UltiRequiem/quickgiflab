# Quick GIF Lab

🥳 **Record high-quality GIFs with your webcam and share them with your friends!**

A complete rebuild of the original [Sergif](https://github.com/UltiRequiem/sergif) with modern technology stack for superior video quality and user experience. Built with Next.js 16, Bun, SQLite, and Tixte integration.

## ✨ Features

- 📹 **High-Quality Webcam Recording**: 1280x720 HD resolution at 30fps
- 🎨 **Direct GIF Recording**: No conversion needed - records GIFs natively with RecordRTC
- ⚡ **Superior Quality**: 8Mbps bitrate with optimized GIF compression (quality level 2)
- ☁️ **Instant Sharing**: Upload to Tixte with custom domain support (sergif.likes.cash)
- 📱 **Modern UI**: Beautiful interface with live camera preview and recording controls
- 💾 **Local Database**: SQLite database to track and manage all your GIF recordings
- 🔒 **Type-Safe**: Full TypeScript with T3 Env for environment validation
- ⚡ **Lightning Fast**: Built with Bun for optimal performance

## Getting Started 🚀

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- A [Tixte](https://tixte.com/) account and API key

### Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd quickgiflab
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Tixte API key:

   ```bash
   TIXTE_API_KEY=your_actual_tixte_api_key_here
   ```

4. **Start the development server**

   ```bash
   bun run dev
   ```

5. **Database Migration** (Automatic)
   The application automatically handles database migrations. You'll see console output like:

   ```
   ✅ Added is_public column to gifs table
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use 📖

### Recording a Webcam GIF

1. **Enable Camera**: Click "Enable Camera" and grant webcam permissions
2. **Start Recording**: Click "Start Recording" when ready
3. **Record**: Perform your action in front of the camera
4. **Stop Recording**: Click "Stop Recording" when finished
5. **Share or Download**: Either download locally or upload to Tixte for instant sharing

### Quality Settings

- **Resolution**: 1280x720 HD (16:9 aspect ratio)
- **Frame Rate**: 30 fps for smooth motion
- **Bitrate**: 8 Mbps for excellent quality
- **GIF Quality**: Level 2 (high quality, optimized file size)

### Managing GIFs

- View all public uploaded GIFs in the gallery
- Click "View GIF" to open in a new tab
- Copy direct links for easy sharing
- All GIFs are stored with metadata in SQLite

## API Endpoints 🔌

- `GET /api/gifs` - Fetch all GIFs
- `POST /api/gifs` - Upload a new GIF
- `GET /api/gifs/[id]` - Get specific GIF

## Technologies Used 🛠️

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[Bun](https://bun.sh/)** - Fast JavaScript runtime and package manager
- **[SQLite](https://www.sqlite.org/)** - Lightweight database via better-sqlite3
- **[Tixte](https://tixte.com/)** - File hosting service with API
- **[T3 Env](https://env.t3.gg/)** - Type-safe environment variable validation with Zod
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern UI component library
- **[GIF.js](https://github.com/jnordberg/gif.js)** - JavaScript GIF encoder
- **[RecordRTC](https://github.com/muaz-khan/RecordRTC)** - High-quality webcam recording and GIF generation

## Configuration ⚙️

### Environment Variables

- `TIXTE_API_KEY` - Your Tixte API key (server-side)
- `DEFAULT_TIXTE_DOMAIN` - Your default Tixte domain (server-side)

### Tixte Setup

1. Create a [Tixte account](https://tixte.com/register)
2. Go to [API Settings](https://tixte.com/dashboard/api)
3. Generate an API key
4. Add your API key to `.env.local`

## Development Scripts 📝

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
