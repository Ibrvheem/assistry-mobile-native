import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

const CircularProgress = ({
  timeLeft,
  totalTime,
}: {
  timeLeft: number;
  totalTime: number;
}) => {
  // Calculate the progress (percentage) based on time remaining
  const progress = timeLeft / totalTime;

  const radius = 15; // Smaller radius for a smaller circle
  const strokeWidth = 4; // Slightly smaller stroke width
  const fontSize = 10; // Smaller font size for text

  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View
      className="flex items-center justify-center"
      style={{
        overflow: "hidden", // Ensures the circle stays inside the rounded container
      }}
    >
      <Svg width={50} height={50}>
        {/* Background circle */}
        <Circle
          cx="25"
          cy="25"
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx="25"
          cy="25"
          r={radius}
          stroke="#4CAF50"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" // Add this line for rounded edges
          rotation="-90"
          origin="25,25"
        />
      </Svg>
      <Text
        style={{
          fontFamily: "PoppinsMedium",
          position: "absolute",
        }}
        className="text-[9px] text-green-700"
      >
        {timeLeft}m
      </Text>
    </View>
  );
};

export default CircularProgress;
