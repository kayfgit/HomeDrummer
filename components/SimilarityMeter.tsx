import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";

interface SimilarityMeterProps {
    similarity: number | null; // 0-100, null when not measured
    isRecording: boolean;
    drumLabel?: string;
}

const getColorForSimilarity = (similarity: number): string => {
    if (similarity >= 70) return "#10b981"; // Green - close match
    if (similarity >= 40) return "#f59e0b"; // Yellow - somewhat close
    return "#ef4444"; // Red - not close
};

const getLabel = (similarity: number): string => {
    if (similarity >= 70) return "Great Match!";
    if (similarity >= 40) return "Getting Close";
    return "Keep Trying";
};

export default function SimilarityMeter({
    similarity,
    isRecording,
    drumLabel,
}: SimilarityMeterProps) {
    const width = useSharedValue(0);
    const opacity = useSharedValue(0);
    const pulseScale = useSharedValue(1);

    useEffect(() => {
        if (isRecording) {
            // Pulsing animation while recording
            const pulse = () => {
                pulseScale.value = withTiming(1.05, { duration: 500 }, () => {
                    pulseScale.value = withTiming(1, { duration: 500 });
                });
            };
            const interval = setInterval(pulse, 1000);
            opacity.value = withTiming(1, { duration: 300 });
            width.value = withTiming(30, { duration: 300 }); // Show partial bar while recording
            return () => clearInterval(interval);
        } else if (similarity !== null) {
            opacity.value = withTiming(1, { duration: 300 });
            width.value = withSpring(similarity, {
                damping: 12,
                stiffness: 100,
            });
        } else {
            opacity.value = withTiming(0, { duration: 300 });
            width.value = withTiming(0, { duration: 300 });
        }
    }, [similarity, isRecording]);

    const barAnimatedStyle = useAnimatedStyle(() => ({
        width: `${width.value}%`,
    }));

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: pulseScale.value }],
    }));

    const color =
        similarity !== null ? getColorForSimilarity(similarity) : "#6b7280";
    const label = similarity !== null ? getLabel(similarity) : "Recording...";

    return (
        <Animated.View
            style={containerAnimatedStyle}
            className="w-full px-6 py-4"
        >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-400 text-sm">
                    {isRecording ? "Listening..." : drumLabel ? `Matching: ${drumLabel}` : "Result"}
                </Text>
                {similarity !== null && !isRecording && (
                    <Text className="text-white font-bold text-lg">{Math.round(similarity)}%</Text>
                )}
            </View>

            {/* Progress Bar Background */}
            <View className="h-4 bg-surface rounded-full overflow-hidden border border-gray-700">
                {/* Gradient Background Track */}
                <View className="absolute inset-0 flex-row">
                    <View className="flex-1 bg-danger opacity-30" />
                    <View className="flex-1 bg-warning opacity-30" />
                    <View className="flex-1 bg-success opacity-30" />
                </View>

                {/* Animated Fill */}
                <Animated.View
                    style={[barAnimatedStyle, { backgroundColor: color }]}
                    className="h-full rounded-full"
                />
            </View>

            {/* Label */}
            <View className="mt-3 items-center">
                <Text
                    style={{ color }}
                    className="text-lg font-semibold"
                >
                    {isRecording ? "Hit an object..." : label}
                </Text>
            </View>

            {/* Scale Labels */}
            <View className="flex-row justify-between mt-2 px-1">
                <Text className="text-gray-500 text-xs">Not Close</Text>
                <Text className="text-gray-500 text-xs">Close</Text>
                <Text className="text-gray-500 text-xs">Perfect</Text>
            </View>
        </Animated.View>
    );
}
