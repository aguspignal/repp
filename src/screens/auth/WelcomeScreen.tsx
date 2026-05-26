import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import { Button, Screen, Stack, Text } from "../../components/ui"
import { theme } from "../../theme"
import type { AuthStackParamList } from "../../navigation/types"

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">

export const WelcomeScreen = ({ navigation }: Props) => (
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
			<Text variant="h2">Repp</Text>
			<Text variant="body" color="grayDark" align="center">
				Plan, log and progress every workout. Built for lifters who track everything.
			</Text>
		</Stack>

		<Stack gap="xs">
			<Button
				title="Get started"
				fullWidth
				onPress={() => navigation.navigate("Onboarding")}
			/>
			<Button
				title="I already have an account"
				variant="ghost"
				fullWidth
				onPress={() => navigation.navigate("SignIn")}
			/>
		</Stack>
	</Screen>
)
