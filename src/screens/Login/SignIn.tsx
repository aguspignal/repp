import { LoginScreenProps } from "../../navigation/params"
import { parseSupabaseErrorToTranslation } from "../../utils/queriesHelpers"
import { SignInSchema, SignInValues } from "../../utils/zodSchemas"
import { SubmitErrorHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { yupResolver } from "@hookform/resolvers/yup"
import LoginLayout from "./LoginLayout"
import SignInInput from "../../components/inputs/SignInInput"
import ToastNotification from "../../components/notifications/ToastNotification"
import useSession from "../../hooks/useSession"
import { useState } from "react"

export default function SignIn({ navigation }: LoginScreenProps<"SignIn">) {
	const { t } = useTranslation()
	const { signInWithEmail } = useSession()

	const {
		handleSubmit,
		control,
		formState: { isLoading, isSubmitting },
		getValues,
		getFieldState
	} = useForm<SignInValues>({
		defaultValues: { email: "", password: "" },
		resolver: yupResolver(SignInSchema)
	})

	const [loading, setLoading] = useState(false)

	async function handleSignIn() {
		try {
			setLoading(true)
			const emailState = getFieldState("email")
			const pswState = getFieldState("password")
			console.log(emailState)
			console.log(pswState)

			const error = await signInWithEmail(getValues())

			if (error) {
				if (error.code === "email_not_confirmed") {
					// navigation.navigate("EmailVerification", { email: values.email })
					return
				}
				ToastNotification({
					title: t(parseSupabaseErrorToTranslation(error.code))
				})
			}
		} catch (error) {
			ToastNotification({
				title: t("error-messages.an-error-ocurred-try-again")
			})
		} finally {
			setLoading(false)
		}
	}

	const onInvalid: SubmitErrorHandler<SignInValues> = (errors) =>
		console.error(errors)

	return (
		<LoginLayout
			type="signin"
			// onSubmit={handleSubmit(handleSignIn)}
			onSubmit={handleSignIn}
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
