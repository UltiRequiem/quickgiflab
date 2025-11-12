import WebcamGifRecorder from '@/components/GifRecorder';
import GifGallery from '@/components/GifGallery';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Sergif 2026
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            🥳 Record high-quality GIFs with your webcam and share them with your friends!
            Completely rebuilt with modern tech for the best possible quality.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">1280x720 HD</span>
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full">10fps Perfect Timing</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">1:1 Real-time</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Instant Sharing</span>
          </div>
        </div>

        {/* Main Recorder Component */}
        <WebcamGifRecorder />

        {/* Gallery Component */}
        <GifGallery />

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <p className="mb-2">
            🚀 Sergif 2026 - Built with Next.js 16, Bun, SQLite, T3 Env, and Tixte
          </p>
          <p>
            <a
              href="https://github.com/UltiRequiem/sergif"
              className="hover:text-gray-700 underline mr-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Original Sergif
            </a>
            •
            <a
              href="https://github.com/anthropics/claude-code"
              className="ml-4 hover:text-gray-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by Claude Code
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}