# Sergif 2026 📹

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
   cd sergif-2026
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

- View all uploaded GIFs in the gallery
- Click "View GIF" to open in a new tab
- Copy direct links for easy sharing
- All GIFs are stored with metadata in SQLite

## Project Structure 📁

```
sergif-2026/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/gifs/          # API endpoints
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── GifRecorder.tsx    # Main recording component
│   │   └── GifGallery.tsx     # Gallery component
│   ├── hooks/                 # Custom React hooks
│   │   └── useGifRecorder.ts  # Recording logic hook
│   └── lib/                   # Utilities and services
│       ├── database.ts        # SQLite database setup
│       ├── gifConverter.ts    # Video to GIF conversion
│       ├── tixte.ts          # Tixte upload service
│       └── utils.ts          # General utilities
├── public/                    # Static files
│   └── gif.worker.js         # GIF.js worker script
└── gifs.db                   # SQLite database (created automatically)
```

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

This project uses **T3 Env** for type-safe environment variable validation. The environment schema is defined in `src/env.ts` which provides:

- ✅ **Type Safety**: Environment variables are validated at build time
- ✅ **Runtime Validation**: Zod schemas ensure correct values
- ✅ **Development Safety**: Missing or invalid env vars cause build failures
- ✅ **IntelliSense**: Full TypeScript support for environment variables

Required environment variables:

- `TIXTE_API_KEY` - Your Tixte API key (server-side)
- `NEXT_PUBLIC_APP_URL` - Your application URL (client-side)
- `NODE_ENV` - Environment mode (automatically set)

### Tixte Setup

1. Create a [Tixte account](https://tixte.com/register)
2. Go to [API Settings](https://tixte.com/dashboard/api)
3. Generate an API key
4. Add your API key to `.env.local`

### Custom Domain (Optional)

If you have a custom domain configured in Tixte, update the domain in `src/lib/tixte.ts`:

```typescript
const tixteClient = new TixteClient(process.env.TIXTE_API_KEY!, {
  defaultURL: "your-custom-domain.com", // Change this
});
```

## Development Scripts 📝

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## Browser Support 🌐

This application requires modern browser features:

- **getUserMedia API** (for webcam access)
- **MediaRecorder API** (for video recording)
- **File API** (for file handling)
- **WebRTC** (for real-time communication)

Supported browsers:

- Chrome/Chromium 72+ (recommended)
- Firefox 66+
- Safari 13+
- Edge 79+

## Troubleshooting 🔧

### Common Issues

1. **"Camera access denied"**

   - Ensure you're using HTTPS or localhost
   - Check browser permissions for camera access
   - Try refreshing the page and allowing camera access

2. **"Upload failed"**

   - Check your Tixte API key in `.env.local`
   - Verify your Tixte account has sufficient storage
   - Ensure file size is under Tixte limits

3. **"Poor GIF quality"**

   - Ensure good lighting when recording
   - Keep recordings short (under 10 seconds)
   - Check that camera resolution is set correctly

4. **"Recording doesn't start"**

   - Verify camera permissions are granted
   - Check that no other application is using the camera
   - Try closing other tabs that might be using the camera

5. **"Database error: no column named is_public"**
   - Restart the development server to trigger automatic migration
   - The app will automatically add the missing column
   - See `DATABASE_MIGRATIONS.md` for detailed troubleshooting

### Browser Permissions

The app requires these permissions:

- Camera/webcam access
- File download permissions

### Quality Comparison

**Original Sergif (2022):**

- Resolution: 360x240
- Frame Rate: 10fps
- Quality: Basic

**Sergif 2026:**

- Resolution: 1280x720 HD
- Frame Rate: 30fps
- Quality: High (8Mbps bitrate)

## Contributing 🤝

This project was generated as a tutorial example. Feel free to:

- Fork and modify for your needs
- Submit issues for bugs
- Suggest improvements

## License 📄

This project is provided as-is for educational purposes.

---

**Enjoy creating and sharing your screen recordings! 🎉**
