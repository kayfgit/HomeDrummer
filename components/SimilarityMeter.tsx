import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface SimilarityMeterProps {
    similarity: number | null; // 0-100, null when not measured
    isRecording: boolean;
}

const SEGMENTS = 30; // Number of vertical stripes

const getColorForPosition = (index: number, total: number): string => {
    const ratio = index / total;
    if (ratio < 0.33) return "#ef4444"; // Red
    if (ratio < 0.66) return "#f59e0b"; // Yellow/Orange
    return "#10b981"; // Green
};

export default function SimilarityMeter({
    similarity,
    isRecording,
}: SimilarityMeterProps) {
    const arrowPosition = useSharedValue(50); // Percentage position
    const arrowOpacity = useSharedValue(0);

    useEffect(() => {
        if (isRecording) {
            // Animate arrow back and forth while recording
            arrowOpacity.value = withTiming(1, { duration: 300 });
            arrowPosition.value = withRepeat(
                withTiming(100, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        } else if (similarity !== null) {
            arrowOpacity.value = withTiming(1, { duration: 300 });
            arrowPosition.value = withSpring(similarity, {
                damping: 12,
                stiffness: 100,
            });
        } else {
            arrowOpacity.value = withTiming(0, { duration: 300 });
            arrowPosition.value = 50;
        }
    }, [similarity, isRecording]);

    const arrowAnimatedStyle = useAnimatedStyle(() => ({
        left: `${arrowPosition.value}%`,
        opacity: arrowOpacity.value,
    }));

    return (
        <View style={styles.container}>
            {/* Arrow pointer */}
            <Animated.View style={[styles.arrowContainer, arrowAnimatedStyle]}>
                <View style={styles.arrow} />
            </Animated.View>

            {/* Striped meter bar */}
            <View style={styles.meterContainer}>
                {Array.from({ length: SEGMENTS }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.segment,
                            { backgroundColor: getColorForPosition(index, SEGMENTS) },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    arrowContainer: {
        position: "absolute",
        top: 0,
        marginLeft: -8, // Center the arrow
        zIndex: 10,
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 12,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#ffffff",
    },
    meterContainer: {
        flexDirection: "row",
        height: 40,
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 16,
        gap: 2,
    },
    segment: {
        flex: 1,
        height: "100%",
        borderRadius: 2,
    },
});
