export function Header() {
	return (
		<div className="text-center space-y-4">
			<h1 className="text-5xl font-bold text-gray-900">Quick GIF Lab</h1>
			<p className="text-xl text-gray-600 max-w-3xl mx-auto">
				🥳 Record high-quality GIFs with your webcam and share them with your
				friends! Completely rebuilt with modern tech for the best possible
				quality.
			</p>
			<div className="flex flex-wrap justify-center gap-2 text-sm">
				<span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
					1280x720 HD
				</span>
				<span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full">
					10fps Perfect Timing
				</span>
				<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
					1:1 Real-time
				</span>
				<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
					Public & Private
				</span>
			</div>
		</div>
	);
}
