import { useCallback, useRef, useState } from "react";

export interface RecorderState {
	isRecording: boolean;
	isPaused: boolean;
	recordedBlob: Blob | null;
	error: string | null;
	duration: number;
}

export const useGifRecorder = () => {
	const [state, setState] = useState<RecorderState>({
		isRecording: false,
		isPaused: false,
		recordedBlob: null,
		error: null,
		duration: 0,
	});

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const startTimeRef = useRef<number>(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const startRecording = useCallback(async () => {
		try {
			setState((prev) => ({ ...prev, error: null }));

			// Request screen capture
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					frameRate: 30,
				},
				audio: false, // GIFs don't have audio
			});

			streamRef.current = stream;
			chunksRef.current = [];

			// Create MediaRecorder with appropriate options for GIF creation
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "video/webm;codecs=vp8", // VP8 works well for conversion to GIF
			});

			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunksRef.current, { type: "video/webm" });
				setState((prev) => ({
					...prev,
					recordedBlob: blob,
					isRecording: false,
					isPaused: false,
				}));

				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			};

			mediaRecorder.onerror = (_event) => {
				setState((prev) => ({
					...prev,
					error: "Recording error occurred",
					isRecording: false,
					isPaused: false,
				}));
			};

			// Handle stream ending (user stops screen share)
			stream.getVideoTracks()[0].addEventListener("ended", () => {
				stopRecording();
			});

			mediaRecorder.start();
			startTimeRef.current = Date.now();

			// Start duration timer
			intervalRef.current = setInterval(() => {
				setState((prev) => ({
					...prev,
					duration: Date.now() - startTimeRef.current,
				}));
			}, 100);

			setState((prev) => ({
				...prev,
				isRecording: true,
				isPaused: false,
				recordedBlob: null,
				duration: 0,
			}));
		} catch (error) {
			setState((prev) => ({
				...prev,
				error:
					error instanceof Error ? error.message : "Failed to start recording",
			}));
		}
	}, [stopRecording]);

	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current && state.isRecording) {
			mediaRecorderRef.current.stop();

			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}

			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}
	}, [state.isRecording]);

	const pauseRecording = useCallback(() => {
		if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
			mediaRecorderRef.current.pause();
			setState((prev) => ({ ...prev, isPaused: true }));

			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}
	}, [state.isRecording, state.isPaused]);

	const resumeRecording = useCallback(() => {
		if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
			mediaRecorderRef.current.resume();
			setState((prev) => ({ ...prev, isPaused: false }));

			// Resume duration timer
			const pausedDuration = state.duration;
			startTimeRef.current = Date.now() - pausedDuration;

			intervalRef.current = setInterval(() => {
				setState((prev) => ({
					...prev,
					duration: Date.now() - startTimeRef.current,
				}));
			}, 100);
		}
	}, [state.isRecording, state.isPaused, state.duration]);

	const reset = useCallback(() => {
		stopRecording();
		setState({
			isRecording: false,
			isPaused: false,
			recordedBlob: null,
			error: null,
			duration: 0,
		});
		chunksRef.current = [];
	}, [stopRecording]);

	return {
		...state,
		startRecording,
		stopRecording,
		pauseRecording,
		resumeRecording,
		reset,
	};
};
