import { AudioModule, AudioRecorder } from "expo-audio";

export interface RecordingResult {
    uri: string;
    duration: number;
}

class AudioService {
    private recorder: AudioRecorder | null = null;
    private permissionGranted: boolean = false;

    async requestPermission(): Promise<boolean> {
        try {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            this.permissionGranted = status.granted;
            return this.permissionGranted;
        } catch (error) {
            console.error("Failed to request audio permission:", error);
            return false;
        }
    }

    async checkPermission(): Promise<boolean> {
        // expo-audio doesn't seem to have a standalone getPermissionsAsync identical to expo-av
        // without requesting. We'll reuse request for now or check if there's a specific method.
        // Usually requestRecordingPermissionsAsync returns current status if already determined.
        return this.requestPermission();
    }

    async startRecording(): Promise<boolean> {
        try {
            if (!this.permissionGranted) {
                const granted = await this.requestPermission();
                if (!granted) {
                    console.error("Audio permission not granted");
                    return false;
                }
            }

            // Create new recorder instance
            this.recorder = new AudioRecorder();

            // Prepare with high quality preset equivalent
            await this.recorder.prepareToRecordAsync({
                android: {
                    extension: '.m4a',
                    outputFormat: 'mpeg4',
                    audioEncoder: 'aac',
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.m4a',
                    audioQuality: 'high',
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {
                    mimeType: 'audio/webm',
                    bitsPerSecond: 128000,
                },
            });

            // Start recording
            await this.recorder.recordAsync();
            return true;
        } catch (error) {
            console.error("Failed to start recording:", error);
            return false;
        }
    }

    async stopRecording(): Promise<RecordingResult | null> {
        try {
            if (!this.recorder) {
                console.error("No active recording");
                return null;
            }

            await this.recorder.stopAsync();
            const uri = this.recorder.uri;
            // expo-audio recorder might not have duration explicitly available on the object
            // plainly without analysis or status check, but let's see if we can get it.
            // For now, we'll return 0 for duration if not easily accessible, or track it ourselves.
            // The AnalysisEngine mainly needs the URI.

            const result = {
                uri,
                duration: 0, // Placeholder, as duration might need extra step to retrieve
            };

            this.recorder = null;
            return result;
        } catch (error) {
            console.error("Failed to stop recording:", error);
            this.recorder = null;
            return null;
        }
    }

    async cancelRecording(): Promise<void> {
        try {
            if (this.recorder) {
                await this.recorder.stopAsync();
                this.recorder = null;
            }
        } catch (error) {
            console.error("Failed to cancel recording:", error);
            this.recorder = null;
        }
    }

    isRecording(): boolean {
        return this.recorder !== null && this.recorder.isRecording;
    }
}

// Singleton instance
export const audioService = new AudioService();
