export const en = {
	common: {
		appName: "Repp",
		loading: "Loading...",
		cancel: "Cancel",
		next: "Next",
		skip: "Skip",
		save: "Save",
		delete: "Delete",
		edit: "Edit",
		done: "Done",
		retry: "Retry",
		showPassword: "Show password",
		hidePassword: "Hide password",
	},
	tabs: {
		home: "Home",
		workouts: "Workouts",
		routines: "Routines",
		exercises: "Exercises",
		profile: "Profile",
	},
	welcome: {
		tagline: "Plan, log and progress every workout. Built for lifters who track everything.",
		getStarted: "Get started",
		haveAccount: "I already have an account",
	},
	onboarding: {
		step: "{{current}} / {{total}}",
		slides: {
			track: {
				title: "Track every set",
				body: "Log reps, weight, and progression at a tap. Your full history, always available offline.",
			},
			plan: {
				title: "Plan with mesocycles",
				body: "Build routines, schedule training days, and run real blocks — not just random workouts.",
			},
			progress: {
				title: "See your progress",
				body: "Hit milestones, unlock progressions, and watch your numbers climb week over week.",
			},
		},
		createAccount: "Create account",
		signInInstead: "Sign in instead",
	},
	auth: {
		signIn: {
			title: "Welcome back",
			subtitle: "Sign in to keep tracking your progress.",
			emailLabel: "Email",
			emailPlaceholder: "you@example.com",
			passwordLabel: "Password",
			passwordPlaceholder: "••••••••",
			submit: "Sign in",
			newHere: "New here?",
			createAccount: "Create an account",
			errors: {
				emailRequired: "Email is required",
				emailInvalid: "Enter a valid email",
				passwordRequired: "Password is required",
				generic: "Could not sign in",
			},
		},
		signUp: {
			title: "Create your account",
			subtitle: "It only takes a minute. Start tracking your training today.",
			emailLabel: "Email",
			emailPlaceholder: "you@example.com",
			passwordLabel: "Password",
			passwordPlaceholder: "At least {{min}} characters",
			confirmLabel: "Confirm password",
			confirmPlaceholder: "Repeat your password",
			submit: "Create account",
			alreadyHaveAccount: "Already have an account?",
			signIn: "Sign in",
			successMessage:
				"Account created! Check your inbox to confirm your email, then sign in.",
			errors: {
				emailRequired: "Email is required",
				emailInvalid: "Enter a valid email",
				passwordRequired: "Password is required",
				passwordTooShort: "Use at least {{min}} characters",
				confirmRequired: "Please confirm your password",
				confirmMismatch: "Passwords do not match",
				generic: "Could not create account",
			},
		},
	},
}

export type Translations = typeof en
