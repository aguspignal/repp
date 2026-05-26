import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import {
	FlatList,
	View,
	useWindowDimensions,
	type NativeScrollEvent,
	type NativeSyntheticEvent,
} from "react-native"

import { Button, Icon, Row, Screen, Stack, Text, type IconName } from "../../components/ui"
import type { AuthStackParamList } from "../../navigation/types"
import { useOnboardingStore } from "../../stores/onboardingStore"
import { theme } from "../../theme"

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">

type SlideKey = "track" | "plan" | "progress"

const SLIDES: { key: SlideKey; icon: IconName }[] = [
	{ key: "track", icon: "barbell-outline" },
	{ key: "plan", icon: "calendar-outline" },
	{ key: "progress", icon: "trending-up-outline" },
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
	const { t } = useTranslation()
	const { width } = useWindowDimensions()
	const listRef = useRef<FlatList<(typeof SLIDES)[number]>>(null)
	const [index, setIndex] = useState(0)
	const complete = useOnboardingStore(s => s.complete)

	const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const nextIndex = Math.round(e.nativeEvent.contentOffset.x / width)
		setIndex(nextIndex)
	}

	const isLast = index === SLIDES.length - 1

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
					{t("onboarding.step", { current: index + 1, total: SLIDES.length })}
				</Text>
				<Button title={t("common.skip")} variant="ghost" size="sm" onPress={goToSignIn} />
			</Row>

			<Stack flex={1}>
				<FlatList
					ref={listRef}
					data={SLIDES}
					keyExtractor={slide => slide.key}
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
							<Stack
								align="center"
								justify="center"
								style={{
									width: 112,
									height: 112,
									borderRadius: theme.radii.l,
									backgroundColor: theme.colors.backgroundDark,
								}}
							>
								<Icon name={item.icon} size={64} color="primary" />
							</Stack>
							<Text variant="h3" align="center">
								{t(`onboarding.slides.${item.key}.title`)}
							</Text>
							<Text variant="body" color="grayDark" align="center">
								{t(`onboarding.slides.${item.key}.body`)}
							</Text>
						</Stack>
					)}
				/>
			</Stack>

			<Stack gap="m">
				<Dots count={SLIDES.length} activeIndex={index} />
				<Stack gap="xxs">
					<Button
						title={isLast ? t("onboarding.createAccount") : t("common.next")}
						fullWidth
						onPress={onNext}
					/>
					{isLast ? (
						<Button
							title={t("onboarding.signInInstead")}
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
