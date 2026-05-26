import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useRef, useState } from "react"
import {
	FlatList,
	View,
	useWindowDimensions,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
} from "react-native"

import { Button, Row, Screen, Stack, Text } from "../../components/ui"
import { theme } from "../../theme"
import type { AuthStackParamList } from "../../navigation/types"
import { useOnboardingStore } from "../../stores/onboardingStore"

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">

type Slide = {
	key: string
	emoji: string
	title: string
	body: string
}

const slides: Slide[] = [
	{
		key: "track",
		emoji: "🏋️",
		title: "Track every set",
		body: "Log reps, weight, and progression at a tap. Your full history, always available offline.",
	},
	{
		key: "plan",
		emoji: "🗓️",
		title: "Plan with mesocycles",
		body: "Build routines, schedule training days, and run real blocks — not just random workouts.",
	},
	{
		key: "progress",
		emoji: "📈",
		title: "See your progress",
		body: "Hit milestones, unlock progressions, and watch your numbers climb week over week.",
	},
]

type DotsProps = { count: number; activeIndex: number }

const Dots = ({ count, activeIndex }: DotsProps) => (
	<Row gap="xxs" justify="center">
		{Array.from({ length: count }).map((_, i) => (
			<View
				key={i}
				style={{
					width: i === activeIndex ? 24 : 8,
					height: 8,
					borderRadius: theme.radii.pill,
					backgroundColor:
						i === activeIndex ? theme.colors.primary : theme.colors.backgroundGray,
				}}
			/>
		))}
	</Row>
)

export const OnboardingScreen = ({ navigation }: Props) => {
	const { width } = useWindowDimensions()
	const listRef = useRef<FlatList<Slide>>(null)
	const [index, setIndex] = useState(0)
	const complete = useOnboardingStore(s => s.complete)

	const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const nextIndex = Math.round(e.nativeEvent.contentOffset.x / width)
		setIndex(nextIndex)
	}

	const isLast = index === slides.length - 1

	const goToSignUp = async () => {
		await complete()
		navigation.replace("SignUp")
	}

	const goToSignIn = async () => {
		await complete()
		navigation.replace("SignIn")
	}

	const onNext = () => {
		if (isLast) {
			goToSignUp()
			return
		}
		listRef.current?.scrollToIndex({ index: index + 1, animated: true })
	}

	return (
		<Screen padding="l">
			<Row align="center" justify="space-between">
				<Text variant="caption" color="grayDark">
					{index + 1} / {slides.length}
				</Text>
				<Button title="Skip" variant="ghost" size="sm" onPress={goToSignIn} />
			</Row>

			<Stack flex={1}>
				<FlatList
					ref={listRef}
					data={slides}
					keyExtractor={item => item.key}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onMomentumScrollEnd={onMomentumEnd}
					renderItem={({ item }) => (
						<Stack
							align="center"
							justify="center"
							gap="m"
							style={{
								width: width - theme.spacing.l * 2,
								paddingHorizontal: theme.spacing.s,
							}}
						>
							<Text style={{ fontSize: 72 }}>{item.emoji}</Text>
							<Text variant="h3" align="center">
								{item.title}
							</Text>
							<Text variant="body" color="grayDark" align="center">
								{item.body}
							</Text>
						</Stack>
					)}
				/>
			</Stack>

			<Stack gap="m">
				<Dots count={slides.length} activeIndex={index} />
				<Stack gap="xxs">
					<Button title={isLast ? "Create account" : "Next"} fullWidth onPress={onNext} />
					{isLast ? (
						<Button
							title="Sign in instead"
							variant="ghost"
							fullWidth
							onPress={goToSignIn}
						/>
					) : null}
				</Stack>
			</Stack>
		</Screen>
	)
}
