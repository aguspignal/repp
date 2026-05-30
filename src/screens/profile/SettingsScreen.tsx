import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useTranslation } from "react-i18next"

import { Button, ListItem, Screen, Stack, Text } from "../../components/ui"
import { signOut } from "../../hooks/useAuth"
import { changeLanguage, type SupportedLocale } from "../../i18n"
import type { ProfileStackParamList } from "../../navigation/types"
import { useAuthStore } from "../../stores/authStore"
import { usePreferencesStore, type WeightUnit } from "../../stores/preferencesStore"

type Props = NativeStackScreenProps<ProfileStackParamList, "Settings">

const languages: {
	code: SupportedLocale
	labelKey: "settings.languageEnglish" | "settings.languageSpanish"
}[] = [
	{ code: "en", labelKey: "settings.languageEnglish" },
	{ code: "es", labelKey: "settings.languageSpanish" },
]

const units: { value: WeightUnit; labelKey: "settings.weightUnitKg" | "settings.weightUnitLb" }[] =
	[
		{ value: "kg", labelKey: "settings.weightUnitKg" },
		{ value: "lb", labelKey: "settings.weightUnitLb" },
	]

export const SettingsScreen = ({ navigation }: Props) => {
	const { t, i18n } = useTranslation()
	const profile = useAuthStore(s => s.profile)
	const session = useAuthStore(s => s.session)
	const language = usePreferencesStore(s => s.language)
	const setLanguage = usePreferencesStore(s => s.setLanguage)
	const weightUnit = usePreferencesStore(s => s.weightUnit)
	const setWeightUnit = usePreferencesStore(s => s.setWeightUnit)

	const currentLanguage = (language ?? (i18n.resolvedLanguage as SupportedLocale)) || "en"
	const email = profile?.email ?? session?.user.email ?? null

	const onPickLanguage = async (code: SupportedLocale) => {
		setLanguage(code)
		await changeLanguage(code)
	}

	return (
		<Screen scroll>
			<Stack gap="l">
				{email ? (
					<Stack gap="x3s">
						<Text variant="caption" color="grayDark">
							{t("settings.signedInAs")}
						</Text>
						<Text variant="subtitle">{email}</Text>
					</Stack>
				) : null}

				<Stack gap="xs">
					<Text variant="caption" color="grayDark">
						{t("settings.language")}
					</Text>
					<Stack>
						{languages.map(l => (
							<ListItem
								key={l.code}
								variant="plain"
								title={t(l.labelKey)}
								rightIcon={
									currentLanguage === l.code ? "checkmark" : "chevron-forward"
								}
								onPress={() => onPickLanguage(l.code)}
							/>
						))}
					</Stack>
				</Stack>

				<Stack gap="xs">
					<Text variant="caption" color="grayDark">
						{t("settings.weightUnit")}
					</Text>
					<Stack>
						{units.map(u => (
							<ListItem
								key={u.value}
								variant="plain"
								title={t(u.labelKey)}
								rightIcon={weightUnit === u.value ? "checkmark" : "chevron-forward"}
								onPress={() => setWeightUnit(u.value)}
							/>
						))}
					</Stack>
				</Stack>

				<Stack gap="xs">
					<Text variant="caption" color="grayDark">
						{t("settings.data")}
					</Text>
					<Stack>
						<ListItem
							variant="plain"
							title={t("settings.deletedExercises")}
							onPress={() => navigation.navigate("DeletedExercises")}
						/>
					</Stack>
				</Stack>

				<Button
					title={t("settings.signOut")}
					variant="danger"
					fullWidth
					onPress={() => {
						signOut().catch(err => console.warn("[Settings] signOut failed", err))
					}}
				/>
			</Stack>
		</Screen>
	)
}
