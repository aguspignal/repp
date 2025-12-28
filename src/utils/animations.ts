import { Animated } from "react-native"

export const toastFromBottomAnim = (translateY: Animated.Value) => ({
	top: undefined,
	bottom: 20,
	transform: [
		{
			translateY: translateY.interpolate({
				inputRange: [-1000, 0],
				outputRange: [1000, 0],
				extrapolate: "clamp",
			}),
		},
	],
})
