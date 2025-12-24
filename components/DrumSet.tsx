import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export type DrumType =
    | "kick"
    | "snare"
    | "hiTom"
    | "midTom"
    | "floorTom"
    | "hiHat"
    | "crash"
    | "ride";

export interface DrumInfo {
    id: DrumType;
    label: string;
    frequency: number;
    color: string;
}

export const DRUMS: DrumInfo[] = [
    { id: "kick", label: "Kick", frequency: 60, color: "#ef4444" },
    { id: "snare", label: "Snare", frequency: 200, color: "#f97316" },
    { id: "hiTom", label: "Hi Tom", frequency: 300, color: "#eab308" },
    { id: "midTom", label: "Mid Tom", frequency: 200, color: "#22c55e" },
    { id: "floorTom", label: "Floor Tom", frequency: 100, color: "#06b6d4" },
    { id: "hiHat", label: "Hi-Hat", frequency: 8000, color: "#8b5cf6" },
    { id: "crash", label: "Crash", frequency: 6000, color: "#ec4899" },
    { id: "ride", label: "Ride", frequency: 5000, color: "#14b8a6" },
];

// Hotspot positions as percentages of image dimensions
// These are eyeballed from drumset.png - adjust as needed
interface Hotspot {
    id: DrumType;
    x: number; // % from left
    y: number; // % from top
    width: number; // % of image width
    height: number; // % of image height
}

const HOTSPOTS: Hotspot[] = [
    // Cymbals (top row)
    { id: "hiHat", x: 2, y: 43, width: 20, height: 22 },
    { id: "crash", x: 15, y: 12, width: 23, height: 20 },
    { id: "ride", x: 59, y: 7, width: 25, height: 25 },
    // Toms (upper middle)
    { id: "hiTom", x: 33, y: 26, width: 14, height: 15 },
    { id: "midTom", x: 50, y: 25, width: 16, height: 18 },
    // Snare (left side)
    { id: "snare", x: 25, y: 52, width: 18, height: 23 },
    // Floor tom (right side)
    { id: "floorTom", x: 58, y: 53, width: 18, height: 23 },
    // Kick drum (center bottom)
    { id: "kick", x: 43, y: 50, width: 10, height: 40 },
];

interface DrumSetProps {
    selectedDrum: DrumType | null;
    onSelectDrum: (drum: DrumType) => void;
    disabled?: boolean;
    accuracy?: number | null; // 0-100 for glow color
}

export default function DrumSet({
    selectedDrum,
    onSelectDrum,
    disabled = false,
    accuracy = null,
}: DrumSetProps) {
    const handlePress = (drumId: DrumType) => {
        if (!disabled) {
            onSelectDrum(drumId);
        }
    };

    const getGlowColor = (): string => {
        if (accuracy === null) return "#ffffff"; // Default white glow when just selected
        if (accuracy >= 70) return "#10b981"; // Green
        if (accuracy >= 40) return "#f59e0b"; // Yellow
        return "#ef4444"; // Red
    };

    const getGlowStyle = (drumId: DrumType) => {
        if (selectedDrum !== drumId) return {};

        const glowColor = getGlowColor();
        return {
            shadowColor: glowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 15,
            elevation: 10,
            backgroundColor: `${glowColor}33`, // 20% opacity background
            borderWidth: 2,
            borderColor: glowColor,
        };
    };

    return (
        <View style={styles.container}>
            {/* Drumset Image */}
            <Image
                source={require("../assets/images/drumset.png")}
                style={styles.drumImage}
                resizeMode="contain"
            />

            {/* Hotspot Overlays */}
            {HOTSPOTS.map((hotspot) => (
                <TouchableOpacity
                    key={hotspot.id}
                    style={[
                        styles.hotspot,
                        {
                            left: `${hotspot.x}%`,
                            top: `${hotspot.y}%`,
                            width: `${hotspot.width}%`,
                            height: `${hotspot.height}%`,
                        },
                        getGlowStyle(hotspot.id),
                    ]}
                    onPress={() => handlePress(hotspot.id)}
                    disabled={disabled}
                    activeOpacity={0.7}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        aspectRatio: 1.3,
        position: "relative",
    },
    drumImage: {
        width: "100%",
        height: "100%",
    },
    hotspot: {
        position: "absolute",
        borderRadius: 8,
        // Debug: uncomment to see hotspots
        // backgroundColor: "rgba(255, 0, 0, 0.3)",
    },
});
