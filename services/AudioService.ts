import { Audio } from "expo-av";
import { Recording, RecordingStatus } from "expo-av/build/Audio";

export interface RecordingResult {
    uri: string;
    duration: number;
}

class AudioService {
    private recording: Recording | null = null;
    private permissionGranted: boolean = false;

    async requestPermission(): Promise<boolean> {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            this.permissionGranted = status === "granted";
            return this.permissionGranted;
        } catch (error) {
            console.error("Failed to request audio permission:", error);
            return false;
        }
    }

    async checkPermission(): Promise<boolean> {
        try {
            const { status } = await Audio.getPermissionsAsync();
            this.permissionGranted = status === "granted";
            return this.permissionGranted;
        } catch (error) {
            console.error("Failed to check audio permission:", error);
            return false;
        }
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

            // Configure audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Create and prepare recording
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            this.recording = recording;
            return true;
        } catch (error) {
            console.error("Failed to start recording:", error);
            return false;
        }
    }

    async stopRecording(): Promise<RecordingResult | null> {
        try {
            if (!this.recording) {
                console.error("No active recording");
                return null;
            }

            const status: RecordingStatus = await this.recording.getStatusAsync();
            await this.recording.stopAndUnloadAsync();

            const uri = this.recording.getURI();
            this.recording = null;

            // Reset audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });

            if (!uri) {
                console.error("No recording URI");
                return null;
            }

            return {
                uri,
                duration: status.durationMillis || 0,
            };
        } catch (error) {
            console.error("Failed to stop recording:", error);
            this.recording = null;
            return null;
        }
    }

    async cancelRecording(): Promise<void> {
        try {
            if (this.recording) {
                await this.recording.stopAndUnloadAsync();
                this.recording = null;
            }
        } catch (error) {
            console.error("Failed to cancel recording:", error);
            this.recording = null;
        }
    }

    isRecording(): boolean {
        return this.recording !== null;
    }
}

// Singleton instance
export const audioService = new AudioService();
