export interface ConversionOptions {
	width?: number;
	height?: number;
	quality?: number;
	frameRate?: number;
}

export const convertVideoToGif = async (
	videoBlob: Blob,
	options: ConversionOptions = {},
): Promise<Blob> => {
	// @ts-expect-error - gif.js doesn't have proper TypeScript definitions
	const GIF = (await import("gif.js")).default;

	return new Promise((resolve, reject) => {
		const video = document.createElement("video");
		const canvas = document.createElement("canvas");

		const ctx = canvas.getContext("2d");

		if (!ctx) {
			reject(new Error("Failed to get canvas context"));
			return;
		}

		video.src = URL.createObjectURL(videoBlob);
		video.muted = true;

		video.onloadedmetadata = () => {
			const {
				width = 480,
				height = 320,
				quality = 10,
				frameRate = 10,
			} = options;

			canvas.width = width;
			canvas.height = height;

			const gif = new GIF({
				workers: 2,
				quality: quality,
				width: width,
				height: height,
				workerScript: "/gif.worker.js",
			});

			const duration = video.duration;
			const frameInterval = 1 / frameRate;
			let currentTime = 0;

			const captureFrame = () => {
				if (currentTime >= duration) {
					gif.render();
					return;
				}

				video.currentTime = currentTime;
				video.onseeked = () => {
					// Scale video to canvas size
					ctx.drawImage(video, 0, 0, width, height);

					// Add frame to GIF
					gif.addFrame(canvas, { delay: frameInterval * 1000 });

					currentTime += frameInterval;
					setTimeout(captureFrame, 10);
				};
			};

			gif.on("finished", (blob: Blob) => {
				URL.revokeObjectURL(video.src);
				resolve(blob);
			});

			gif.on("error", (error: Error) => {
				URL.revokeObjectURL(video.src);
				reject(error);
			});

			video.onseeked = null;
			captureFrame();
		};

		video.onerror = () => {
			URL.revokeObjectURL(video.src);
			reject(new Error("Failed to load video"));
		};
	});
};
