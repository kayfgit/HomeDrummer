import React, { useCallback, useEffect, useState } from "react";
import { Alert, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import DrumSet, { DRUMS, DrumType } from "../components/DrumSet";
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

    const handleReset = useCallback(() => {
        setSelectedDrum(null);
        setSimilarity(null);
        setLastResult(null);
        setAppState("idle");
    }, []);

    const getInstructionText = (): string => {
        switch (appState) {
            case "idle":
                return "Select a drum to match";
            case "selecting":
                return "Tap a drum component";
            case "recording":
                return "Hit your object now!";
            case "analyzing":
                return "Analyzing sound...";
            case "result":
                return "Tap the drum again to retry";
            default:
                return "";
        }
    };

    const selectedDrumInfo = selectedDrum
        ? DRUMS.find((d) => d.id === selectedDrum)
        : null;

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

            {/* Header */}
            <View className="px-6 pt-4 pb-2">
                <Text className="text-3xl font-bold text-white text-center">
                    HomeDrummer
                </Text>
                <Text className="text-gray-400 text-center mt-1">
                    Find your rhythm everywhere
                </Text>
            </View>

            {/* Instruction */}
            <View className="px-6 py-4">
                <View className="bg-secondary rounded-2xl px-4 py-3">
                    <Text className="text-white text-center text-lg">
                        {getInstructionText()}
                    </Text>
                    {selectedDrumInfo && appState !== "idle" && (
                        <Text
                            className="text-center mt-1 font-medium"
                            style={{ color: selectedDrumInfo.color }}
                        >
                            Target: {selectedDrumInfo.label}
                        </Text>
                    )}
                </View>
            </View>

            {/* Drum Set */}
            <View className="flex-1 justify-center">
                <DrumSet
                    selectedDrum={selectedDrum}
                    onSelectDrum={handleSelectDrum}
                    disabled={appState === "recording" || appState === "analyzing"}
                />
            </View>

            {/* Similarity Meter */}
            <View className="bg-secondary mx-4 rounded-2xl mb-4">
                <SimilarityMeter
                    similarity={appState === "result" ? similarity : null}
                    isRecording={appState === "recording"}
                    drumLabel={selectedDrumInfo?.label}
                />
            </View>

            {/* Reset Button */}
            {(appState === "result" || selectedDrum) && (
                <TouchableOpacity
                    onPress={handleReset}
                    className="mx-6 mb-6 bg-accent py-4 rounded-xl"
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Start Over
                    </Text>
                </TouchableOpacity>
            )}

            {/* Footer */}
            <View className="pb-4">
                <Text className="text-gray-500 text-center text-xs">
                    Tap a drum, then hit an object with a stick
                </Text>
            </View>
        </SafeAreaView>
    );
}
