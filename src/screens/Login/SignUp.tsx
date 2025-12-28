import { LoginScreenProps } from "../../navigation/params"
import { parseSupabaseErrorToTranslation } from "../../utils/queriesHelpers"
import { SignUpFormValues } from "../../types/forms"
import { SignUpValidationSchema } from "../../utils/valdiationSchemas"
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
		formState: { isLoading, isSubmitting },
	} = useForm<SignUpFormValues>({
		defaultValues: { email: "", password: "", confirmPassword: "" },
		resolver: yupResolver(SignUpValidationSchema),
	})

	async function handleSignUp(values: SignUpFormValues) {
		const error = await signUpWithEmail(values)

		if (error) ToastNotification({ title: t(parseSupabaseErrorToTranslation(error.code)) })

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
