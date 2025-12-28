import { LoginScreenProps } from "../../navigation/params"
import { parseSupabaseErrorToTranslation } from "../../utils/queriesHelpers"
import { SignInFormValues } from "../../types/forms"
import { SignInValidationSchema } from "../../utils/valdiationSchemas"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { yupResolver } from "@hookform/resolvers/yup"
import LoginLayout from "./LoginLayout"
import SignInInput from "../../components/inputs/SignInInput"
import ToastNotification from "../../components/notifications/ToastNotification"
import useSession from "../../hooks/useSession"

export default function SignIn({ navigation }: LoginScreenProps<"SignIn">) {
	const { t } = useTranslation()
	const { signInWithEmail } = useSession()

	const {
		handleSubmit,
		control,
		formState: { isLoading, isSubmitting },
	} = useForm<SignInFormValues>({
		defaultValues: { email: "", password: "" },
		resolver: yupResolver(SignInValidationSchema),
	})

	async function handleSignIn(values: SignInFormValues) {
		const error = await signInWithEmail(values)

		if (error) {
			if (error.code === "email_not_confirmed") {
				// navigation.navigate("EmailVerification", { email: values.email })
				return
			}
			ToastNotification({ title: t(parseSupabaseErrorToTranslation(error.code)) })
		}
	}

	return (
		<LoginLayout
			type="signin"
			onSubmit={handleSubmit(handleSignIn)}
			isLoading={isLoading || isSubmitting}
			navigation={navigation}
		>
			<SignInInput name="email" control={control} />
			<SignInInput
				name="password"
				control={control}
				forgotPswBtn={true}
				navigation={navigation}
			/>
		</LoginLayout>
	)
}
