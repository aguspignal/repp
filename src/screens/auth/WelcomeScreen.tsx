import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useTranslation } from "react-i18next"

import { Button, Screen, Stack, Text } from "../../components/ui"
import type { AuthStackParamList } from "../../navigation/types"
import { theme } from "../../theme"

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">

export const WelcomeScreen = ({ navigation }: Props) => {
	const { t } = useTranslation()

	return (
		<Screen padding="l">
			<Stack flex={1} gap="m" align="center" justify="center">
				<Stack
					align="center"
					justify="center"
					style={{
						width: 88,
						height: 88,
						borderRadius: theme.radii.l,
						backgroundColor: theme.colors.primary,
					}}
				>
					<Text variant="h2" color="textDark">
						R
					</Text>
				</Stack>
				<Text variant="h2">{t("common.appName")}</Text>
				<Text variant="body" color="grayDark" align="center">
					{t("welcome.tagline")}
				</Text>
			</Stack>

			<Stack gap="xs">
				<Button
					title={t("welcome.getStarted")}
					fullWidth
					onPress={() => navigation.navigate("Onboarding")}
				/>
				<Button
					title={t("welcome.haveAccount")}
					variant="ghost"
					fullWidth
					onPress={() => navigation.navigate("SignIn")}
				/>
			</Stack>
		</Screen>
	)
}
