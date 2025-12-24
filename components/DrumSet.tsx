import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Ellipse } from "react-native-svg";

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
    frequency: number; // Dominant frequency in Hz
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

interface DrumSetProps {
    selectedDrum: DrumType | null;
    onSelectDrum: (drum: DrumType) => void;
    disabled?: boolean;
}

export default function DrumSet({
    selectedDrum,
    onSelectDrum,
    disabled = false,
}: DrumSetProps) {
    const getDrumStyle = (drumId: DrumType) => {
        const drum = DRUMS.find((d) => d.id === drumId);
        const isSelected = selectedDrum === drumId;
        return {
            fill: isSelected ? drum?.color : "#2a2a4a",
            stroke: drum?.color,
            strokeWidth: isSelected ? 3 : 1.5,
            opacity: disabled ? 0.5 : 1,
        };
    };

    const handlePress = (drumId: DrumType) => {
        if (!disabled) {
            onSelectDrum(drumId);
        }
    };

    return (
        <View className="items-center justify-center w-full">
            <Svg viewBox="0 0 400 320" width="100%" height={320}>
                {/* Hi-Hat - Left side */}
                <TouchableOpacity onPress={() => handlePress("hiHat")} disabled={disabled}>
                    <Ellipse
                        cx={60}
                        cy={80}
                        rx={45}
                        ry={15}
                        {...getDrumStyle("hiHat")}
                    />
                </TouchableOpacity>

                {/* Crash Cymbal - Top Left */}
                <TouchableOpacity onPress={() => handlePress("crash")} disabled={disabled}>
                    <Ellipse
                        cx={100}
                        cy={40}
                        rx={50}
                        ry={18}
                        {...getDrumStyle("crash")}
                    />
                </TouchableOpacity>

                {/* Hi Tom - Top Center Left */}
                <TouchableOpacity onPress={() => handlePress("hiTom")} disabled={disabled}>
                    <Ellipse
                        cx={160}
                        cy={100}
                        rx={40}
                        ry={25}
                        {...getDrumStyle("hiTom")}
                    />
                </TouchableOpacity>

                {/* Mid Tom - Top Center Right */}
                <TouchableOpacity onPress={() => handlePress("midTom")} disabled={disabled}>
                    <Ellipse
                        cx={240}
                        cy={100}
                        rx={40}
                        ry={25}
                        {...getDrumStyle("midTom")}
                    />
                </TouchableOpacity>

                {/* Ride Cymbal - Top Right */}
                <TouchableOpacity onPress={() => handlePress("ride")} disabled={disabled}>
                    <Ellipse
                        cx={320}
                        cy={50}
                        rx={55}
                        ry={20}
                        {...getDrumStyle("ride")}
                    />
                </TouchableOpacity>

                {/* Snare - Center Left */}
                <TouchableOpacity onPress={() => handlePress("snare")} disabled={disabled}>
                    <Ellipse
                        cx={120}
                        cy={180}
                        rx={45}
                        ry={30}
                        {...getDrumStyle("snare")}
                    />
                </TouchableOpacity>

                {/* Kick Drum - Center Bottom */}
                <TouchableOpacity onPress={() => handlePress("kick")} disabled={disabled}>
                    <Circle
                        cx={200}
                        cy={220}
                        r={60}
                        {...getDrumStyle("kick")}
                    />
                    <Circle
                        cx={200}
                        cy={220}
                        r={25}
                        fill="transparent"
                        stroke={getDrumStyle("kick").stroke}
                        strokeWidth={1}
                    />
                </TouchableOpacity>

                {/* Floor Tom - Right */}
                <TouchableOpacity onPress={() => handlePress("floorTom")} disabled={disabled}>
                    <Ellipse
                        cx={320}
                        cy={190}
                        rx={50}
                        ry={35}
                        {...getDrumStyle("floorTom")}
                    />
                </TouchableOpacity>
            </Svg>

            {/* Drum Labels */}
            <View className="flex-row flex-wrap justify-center gap-2 mt-4 px-4">
                {DRUMS.map((drum) => (
                    <TouchableOpacity
                        key={drum.id}
                        onPress={() => handlePress(drum.id)}
                        disabled={disabled}
                        className={`px-3 py-2 rounded-full border ${selectedDrum === drum.id ? "border-2" : "border"
                            }`}
                        style={{
                            backgroundColor: selectedDrum === drum.id ? drum.color : "#1a1a2e",
                            borderColor: drum.color,
                            opacity: disabled ? 0.5 : 1,
                        }}
                    >
                        <Text
                            className={`text-xs font-medium ${selectedDrum === drum.id ? "text-white" : "text-gray-300"
                                }`}
                        >
                            {drum.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
