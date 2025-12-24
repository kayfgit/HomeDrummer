import React, { useCallback, useEffect, useState } from "react";
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import DrumSet, { DrumType } from "../components/DrumSet";
import SimilarityMeter from "../components/SimilarityMeter";
import "../global.css";
import { analysisEngine, AnalysisResult } from "../services/AnalysisEngine";
import { audioService } from "../services/AudioService";

type AppState = "idle" | "selecting" | "recording" | "analyzing" | "result";

export default function Index() {
    const [appState, setAppState] = useState<AppState>("idle");
    const [selectedDrum, setSelectedDrum] = useState<DrumType | null>(null);
    const [similarity, setSimilarity] = useState<number | null>(null);
    const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);

    // Request permissions on mount
    useEffect(() => {
        audioService.requestPermission();
    }, []);

    const handleSelectDrum = useCallback(async (drumId: DrumType) => {
        // If same drum is selected and we're in result state, start new recording
        if (selectedDrum === drumId && appState === "result") {
            await startRecording(drumId);
            return;
        }

        setSelectedDrum(drumId);
        setSimilarity(null);
        setLastResult(null);

        // Auto-start recording after selection
        await startRecording(drumId);
    }, [selectedDrum, appState]);

    const startRecording = async (drumId: DrumType) => {
        setAppState("recording");
        setSimilarity(null);

        const started = await audioService.startRecording();
        if (!started) {
            Alert.alert("Error", "Could not start recording. Please check permissions.");
            setAppState("idle");
            return;
        }

        // Auto-stop after 3 seconds
        setTimeout(async () => {
            await stopAndAnalyze(drumId);
        }, 3000);
    };

    const stopAndAnalyze = async (drumId: DrumType) => {
        setAppState("analyzing");

        const recording = await audioService.stopRecording();
        if (!recording) {
            setAppState("result");
            setSimilarity(30); // Low score for failed recording
            return;
        }

        // Analyze the recording
        const result = await analysisEngine.analyzeSound(recording.uri, drumId);
        setLastResult(result);
        setSimilarity(result.similarity);
        setAppState("result");
    };

    const getInstructionText = (): string => {
        switch (appState) {
            case "idle":
                return "select a drum to match";
            case "recording":
                return "hit your object now!";
            case "analyzing":
                return "analyzing...";
            case "result":
                return "tap drum again to retry";
            default:
                return "select a drum to match";
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>HomeDrummer</Text>
                <Text style={styles.subtitle}>{getInstructionText()}</Text>
            </View>

            {/* Drum Set */}
            <View style={styles.drumContainer}>
                <DrumSet
                    selectedDrum={selectedDrum}
                    onSelectDrum={handleSelectDrum}
                    disabled={appState === "recording" || appState === "analyzing"}
                    accuracy={appState === "result" ? similarity : null}
                />
            </View>

            {/* Similarity Meter */}
            <View style={styles.meterContainer}>
                <SimilarityMeter
                    similarity={appState === "result" ? similarity : null}
                    isRecording={appState === "recording"}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a2e",
    },
    header: {
        marginTop: 30,
        paddingTop: 20,
        paddingHorizontal: 24,
        alignItems: "center",
    },
    title: {
        fontSize: 38,
        fontWeight: "300",
        color: "#ffffff",
        fontStyle: "italic",
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 14,
        color: "#9ca3af",
        marginTop: 4,
    },
    drumContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    meterContainer: {
        paddingBottom: 40,
    },
});
