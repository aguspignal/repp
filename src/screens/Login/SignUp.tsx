import { LoginScreenProps } from "../../navigation/params"
import { parseSupabaseErrorToTranslation } from "../../utils/queriesHelpers"
import { SignUpSchema, SignUpValues } from "../../utils/zodSchemas"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { yupResolver } from "@hookform/resolvers/yup"
import LoginLayout from "./LoginLayout"
import SignUpInput from "../../components/inputs/SignUpInput"
import ToastNotification from "../../components/notifications/ToastNotification"
import useSession from "../../hooks/useSession"

export default function SignUp({ navigation }: LoginScreenProps<"SignUp">) {
	const { t } = useTranslation()
	const { signUpWithEmail } = useSession()

	const {
		handleSubmit,
		control,
		formState: { isLoading, isSubmitting }
	} = useForm<SignUpValues>({
		defaultValues: { email: "", password: "", confirmPassword: "" },
		resolver: yupResolver(SignUpSchema)
	})

	async function handleSignUp(values: SignUpValues) {
		const error = await signUpWithEmail(values)

		if (error)
			ToastNotification({
				title: t(parseSupabaseErrorToTranslation(error.code))
			})

		// navigation.navigate("EmailVerification", { email: values.email })
	}

	return (
		<LoginLayout
			type="signup"
			onSubmit={handleSubmit(handleSignUp)}
			isLoading={isLoading || isSubmitting}
			navigation={navigation}
		>
			<SignUpInput name="email" control={control} />
			<SignUpInput name="password" control={control} />
			<SignUpInput name="confirmPassword" control={control} />
		</LoginLayout>
	)
}
