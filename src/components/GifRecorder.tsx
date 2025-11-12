"use client";

import {
	Camera,
	Download,
	RotateCcw,
	Settings,
	Square,
	Upload,
	Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useWebcamGifRecorder } from "@/hooks/useWebcamGifRecorder";
import { getTixteDisplayUrl } from "@/lib/tixteUtils";

export default function WebcamGifRecorder() {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadedGif, setUploadedGif] = useState<{
		url: string;
		filename: string;
	} | null>(null);
	const [isPublic, setIsPublic] = useState(false);
	const [qualitySettings, _setQualitySettings] = useState({
		width: 1280,
		height: 720,
		frameRate: 10, // Exact same as original Sergif
		gifQuality: 10, // Exact same as original Sergif (best quality)
	});

	const videoRef = useRef<HTMLVideoElement>(null);

	const {
		isRecording,
		isPermissionGranted,
		recordedBlob,
		previewUrl,
		error,
		duration,
		stream,
		recordingOptions,
		requestCameraPermission,
		startRecording,
		stopRecording,
		reset,
	} = useWebcamGifRecorder(qualitySettings);

	// Display live camera feed
	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	const formatDuration = (ms: number) => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const handleDownload = async () => {
		if (!recordedBlob) return;

		try {
			const url = URL.createObjectURL(recordedBlob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `webcam-gif-${Date.now()}.gif`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			toast({ title: "Success!", description: "GIF downloaded successfully." });
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to download GIF.",
				variant: "destructive",
			});
			console.error("Download error:", error);
		}
	};

	const handleUpload = async () => {
		if (!recordedBlob) return;

		try {
			setIsUploading(true);

			toast({
				title: "Uploading GIF...",
				description: "Please wait while we upload your GIF.",
			});

			const formData = new FormData();
			formData.append("gif", recordedBlob, `webcam-gif-${Date.now()}`);
			formData.append("isPublic", String(isPublic));

			const response = await fetch("/api/gifs", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Upload failed");
			}

			setUploadedGif({ url: data.url, filename: data.filename });
			toast({
				title: "Success!",
				description: "GIF uploaded successfully to Tixte!",
			});
		} catch (error) {
			toast({
				title: "Upload Error",
				description:
					error instanceof Error ? error.message : "Failed to upload GIF.",
				variant: "destructive",
			});
			console.error("Upload error:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const handleStartNew = () => {
		reset();
		setUploadedGif(null);
	};

	const handleRequestCamera = async () => {
		try {
			await requestCameraPermission();
			toast({
				title: "Camera access granted!",
				description: "You can now start recording.",
			});
		} catch (_error) {
			toast({
				title: "Camera Access Denied",
				description: "Please allow camera access to record GIFs.",
				variant: "destructive",
			});
		}
	};

	return (
		<Card className="w-full max-w-4xl mx-auto">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					📹 Webcam GIF Recorder
				</CardTitle>
				<CardDescription>
					Record high-quality GIFs using your webcam. Perfect for reactions,
					tutorials, and sharing moments!
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				{error && (
					<div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
						<strong>Error:</strong> {error}
					</div>
				)}

				{/* Quality Settings */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
					<div className="text-center">
						<p className="text-sm text-gray-600">Resolution</p>
						<p className="font-semibold">
							{recordingOptions.width}x{recordingOptions.height}
						</p>
					</div>
					<div className="text-center">
						<p className="text-sm text-gray-600">Frame Rate</p>
						<p className="font-semibold">{recordingOptions.frameRate} fps</p>
					</div>
					<div className="text-center">
						<p className="text-sm text-gray-600">Quality</p>
						<p className="font-semibold">
							{recordingOptions.gifQuality <= 3
								? "High"
								: recordingOptions.gifQuality <= 6
									? "Medium"
									: "Low"}
						</p>
					</div>
					<div className="text-center">
						<p className="text-sm text-gray-600">Timing</p>
						<p className="font-semibold">1:1 Real-time</p>
					</div>
				</div>

				{/* Camera Preview/Result */}
				<div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
					{!isPermissionGranted ? (
						<div className="absolute inset-0 flex flex-col items-center justify-center text-white">
							<Camera size={64} className="mb-4 opacity-50" />
							<p className="text-lg font-medium mb-2">Camera Access Required</p>
							<p className="text-sm opacity-75 text-center max-w-md">
								Click "Enable Camera" to start recording high-quality webcam
								GIFs
							</p>
						</div>
					) : previewUrl ? (
						<div className="w-full h-full flex items-center justify-center bg-black">
							<img
								src={previewUrl}
								alt="Recorded GIF"
								className="max-w-full max-h-full object-contain"
								onError={(e) => {
									console.error("GIF failed to load:", previewUrl);
									console.error("Error details:", e);
								}}
								onLoad={() => {
									console.log("GIF loaded successfully:", previewUrl);
								}}
							/>
						</div>
					) : (
						<video
							ref={videoRef}
							autoPlay
							muted
							playsInline
							className="w-full h-full object-cover scale-x-[-1]" // Mirror effect like a selfie camera
						/>
					)}

					{/* Recording Status Overlay */}
					{isRecording && (
						<div className="absolute top-4 left-4 flex items-center gap-2">
							<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
							<Badge variant="destructive" className="bg-red-500">
								REC {duration > 0 && formatDuration(duration)}
							</Badge>
						</div>
					)}

					{/* Permission Status */}
					{isPermissionGranted && !isRecording && !previewUrl && (
						<div className="absolute bottom-4 right-4">
							<Badge
								variant="outline"
								className="bg-green-500/20 border-green-500 text-green-700"
							>
								Camera Ready
							</Badge>
						</div>
					)}
				</div>

				{/* Controls */}
				<div className="flex flex-wrap gap-3 justify-center">
					{!isPermissionGranted ? (
						<Button
							onClick={handleRequestCamera}
							size="lg"
							className="flex items-center gap-2"
						>
							<Camera size={20} />
							Enable Camera
						</Button>
					) : !isRecording && !recordedBlob ? (
						<Button
							onClick={startRecording}
							size="lg"
							className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
						>
							<Video size={20} />
							Start Recording
						</Button>
					) : isRecording ? (
						<Button
							onClick={stopRecording}
							variant="destructive"
							size="lg"
							className="flex items-center gap-2"
						>
							<Square size={20} />
							Stop Recording
						</Button>
					) : (
						<div className="space-y-4">
							{/* Privacy Toggle */}
							<div className="flex items-center justify-center gap-3 p-3 bg-gray-50 rounded-lg">
								<label className="text-sm font-medium text-gray-700">
									Private
								</label>
								<button
									onClick={() => setIsPublic(!isPublic)}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
										isPublic ? "bg-indigo-600" : "bg-gray-200"
									}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
											isPublic ? "translate-x-6" : "translate-x-1"
										}`}
									/>
								</button>
								<label className="text-sm font-medium text-gray-700">
									Public
								</label>
							</div>

							<div className="text-xs text-center text-gray-500">
								{isPublic ? (
									<span className="text-indigo-600">
										✓ Will appear in public gallery
									</span>
								) : (
									<span>🔒 Only you have the link</span>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex flex-wrap gap-3 justify-center">
								<Button
									onClick={handleDownload}
									variant="outline"
									size="lg"
									className="flex items-center gap-2"
								>
									<Download size={20} />
									Download GIF
								</Button>

								<Button
									onClick={handleUpload}
									disabled={isUploading}
									size="lg"
									className="flex items-center gap-2"
								>
									<Upload size={20} />
									{isUploading ? "Uploading..." : "Upload & Share"}
								</Button>

								<Button
									onClick={handleStartNew}
									variant="outline"
									size="lg"
									className="flex items-center gap-2"
								>
									<RotateCcw size={20} />
									Record Another
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Upload Success */}
				{uploadedGif && (
					<div className="p-6 bg-green-50 border border-green-200 rounded-lg">
						<h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
							🎉 GIF Ready to Share!
						</h3>
						<p className="text-green-700 mb-4">
							Your GIF has been uploaded and is ready to share with your
							friends!
						</p>

						{/* Display the actual GIF */}
						<div className="mb-4 flex justify-center">
							<img
								src={getTixteDisplayUrl(uploadedGif.url)}
								alt="Uploaded GIF"
								className="max-w-sm max-h-64 rounded-lg border border-green-300"
								onError={() =>
									console.error("Failed to load uploaded GIF:", uploadedGif.url)
								}
								onLoad={() =>
									console.log(
										"GIF loaded successfully:",
										getTixteDisplayUrl(uploadedGif.url),
									)
								}
							/>
						</div>

						<div className="flex flex-col gap-3">
							{/* Shareable Link */}
							<div className="p-3 bg-white rounded border border-green-300">
								<p className="text-sm text-green-700 mb-2 font-medium">
									Share this link:
								</p>
								<div className="flex items-center gap-2">
									<input
										type="text"
										value={uploadedGif.url}
										readOnly
										className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded"
									/>
									<button
										onClick={async () => {
											await navigator.clipboard.writeText(uploadedGif.url);
											toast({
												title: "Copied!",
												description: "Link copied to clipboard",
											});
										}}
										className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
									>
										Copy
									</button>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-2">
								<a
									href={uploadedGif.url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
								>
									Open in New Tab
								</a>
								<button
									onClick={() => {
										const tweetText = `Check out this GIF I made with Sergif 2026! 🎥✨`;
										const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(uploadedGif.url)}`;
										window.open(tweetUrl, "_blank");
									}}
									className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
								>
									Share on Twitter
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Instructions */}
				<div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
					<h4 className="font-medium mb-3 flex items-center gap-2">
						<Settings size={16} />
						High-Quality Recording Tips:
					</h4>
					<ul className="space-y-1 list-disc list-inside">
						<li>Ensure good lighting for the best video quality</li>
						<li>Keep the camera steady during recording</li>
						<li>
							Recording at {recordingOptions.width}x{recordingOptions.height} @{" "}
							{recordingOptions.frameRate}fps for perfect timing
						</li>
						<li>
							GIF duration matches recording time exactly (3 seconds = 3 second
							GIF)
						</li>
						<li>
							Keep recordings under 10 seconds for best file size and quality
						</li>
						<li>
							Frame rate optimized for smooth playback without speed issues
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
