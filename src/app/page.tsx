import { Footer } from "@/components/Footer";
import GifGallery from "@/components/GifGallery";
import WebcamGifRecorder from "@/components/GifRecorder";
import { Header } from "@/components/Header";
import { PrivacyNote } from "@/components/PrivacyNote";

export default function Home() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
			<div className="container mx-auto px-4 space-y-8">
				<Header />

				<WebcamGifRecorder />

				<GifGallery />

				<PrivacyNote />

				<Footer />
			</div>
		</main>
	);
}
