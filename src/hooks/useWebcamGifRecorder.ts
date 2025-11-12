'use client';

import { useState, useRef, useCallback } from 'react';
// @ts-ignore - RecordRTC doesn't have perfect TypeScript definitions
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';

export interface RecorderState {
  isRecording: boolean;
  isPermissionGranted: boolean;
  recordedBlob: Blob | null;
  previewUrl: string | null;
  error: string | null;
  duration: number;
  stream: MediaStream | null;
}

export interface RecordingOptions {
  width: number;
  height: number;
  frameRate: number;
  videoBitsPerSecond: number;
  gifQuality: number; // 1-10, lower = better quality
}

const DEFAULT_OPTIONS: RecordingOptions = {
  width: 1280,
  height: 720,
  frameRate: 15, // Lower frame rate for proper GIF timing
  videoBitsPerSecond: 4000000, // 4 Mbps - good balance
  gifQuality: 3, // Good quality with proper timing
};

export const useWebcamGifRecorder = (options: Partial<RecordingOptions> = {}) => {
  const recordingOptions = { ...DEFAULT_OPTIONS, ...options };

  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    isPermissionGranted: false,
    recordedBlob: null,
    previewUrl: null,
    error: null,
    duration: 0,
    stream: null,
  });

  const recorderRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const requestCameraPermission = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: recordingOptions.width },
          height: { ideal: recordingOptions.height },
          frameRate: { ideal: recordingOptions.frameRate },
          facingMode: 'user', // Front-facing camera
        },
        audio: false, // GIFs don't need audio
      });

      setState(prev => ({
        ...prev,
        isPermissionGranted: true,
        stream,
      }));

      return stream;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to access camera';
      setState(prev => ({
        ...prev,
        error: `Camera access denied: ${errorMessage}`,
        isPermissionGranted: false,
      }));
      throw error;
    }
  }, [recordingOptions.width, recordingOptions.height, recordingOptions.frameRate]);

  const startRecording = useCallback(async () => {
    try {
      let stream = state.stream;

      if (!stream || !state.isPermissionGranted) {
        stream = await requestCameraPermission();
      }

      if (!stream) return;

      // Create RecordRTC instance with proper timing settings
      const recorder = new RecordRTC(stream, {
        type: 'gif',
        frameRate: recordingOptions.frameRate,
        quality: recordingOptions.gifQuality,
        width: recordingOptions.width,
        height: recordingOptions.height,
        videoBitsPerSecond: recordingOptions.videoBitsPerSecond,
        // Critical for proper GIF timing
        timeSlice: 1000, // Capture data every second
        recorderType: RecordRTC.GifRecorder,
        gif: {
          frameRate: recordingOptions.frameRate,
          quality: recordingOptions.gifQuality,
        },
        onGifRecordingStarted: () => {
          console.log('GIF recording started');
        },
        onGifPreview: (gifURL: string) => {
          setState(prev => ({ ...prev, previewUrl: gifURL }));
        },
      });

      recorderRef.current = recorder;
      recorder.startRecording();

      // Start duration timer
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          duration: Date.now() - startTimeRef.current,
        }));
      }, 100);

      setState(prev => ({
        ...prev,
        isRecording: true,
        recordedBlob: null,
        previewUrl: null,
        duration: 0,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, [state.stream, state.isPermissionGranted, requestCameraPermission, recordingOptions]);

  const stopRecording = useCallback(() => {
    if (!recorderRef.current || !state.isRecording) return;

    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current.getBlob();
      const url = URL.createObjectURL(blob);

      setState(prev => ({
        ...prev,
        isRecording: false,
        recordedBlob: blob,
        previewUrl: url,
      }));

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    });
  }, [state.isRecording]);

  const reset = useCallback(() => {
    if (recorderRef.current) {
      if (state.isRecording) {
        recorderRef.current.stopRecording(() => {
          recorderRef.current.destroy();
        });
      } else {
        recorderRef.current.destroy();
      }
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }

    setState(prev => ({
      ...prev,
      isRecording: false,
      recordedBlob: null,
      previewUrl: null,
      duration: 0,
    }));
  }, [state.isRecording, state.previewUrl]);

  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
      setState(prev => ({
        ...prev,
        stream: null,
        isPermissionGranted: false,
      }));
    }
  }, [state.stream]);

  return {
    ...state,
    recordingOptions,
    requestCameraPermission,
    startRecording,
    stopRecording,
    reset,
    stopCamera,
  };
};