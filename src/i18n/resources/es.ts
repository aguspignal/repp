import type { Translations } from "./en"

export const es: Translations = {
	common: {
		appName: "Repp",
		loading: "Cargando...",
		cancel: "Cancelar",
		next: "Siguiente",
		skip: "Saltar",
		save: "Guardar",
		delete: "Eliminar",
		edit: "Editar",
		done: "Listo",
		retry: "Reintentar",
	},
	tabs: {
		home: "Inicio",
		workouts: "Entrenamientos",
		routines: "Rutinas",
		exercises: "Ejercicios",
		profile: "Perfil",
	},
	welcome: {
		tagline:
			"Planifica, registra y progresa en cada entrenamiento. Hecho para quienes miden todo.",
		getStarted: "Comenzar",
		haveAccount: "Ya tengo una cuenta",
	},
	onboarding: {
		step: "{{current}} / {{total}}",
		slides: {
			track: {
				title: "Registra cada serie",
				body: "Anota repeticiones, peso y progresión con un toque. Tu historial completo, siempre disponible sin conexión.",
			},
			plan: {
				title: "Planifica con mesociclos",
				body: "Crea rutinas, programa días de entrenamiento y corre bloques reales, no entrenamientos al azar.",
			},
			progress: {
				title: "Mira tu progreso",
				body: "Alcanza hitos, desbloquea progresiones y ve cómo tus números suben semana a semana.",
			},
		},
		createAccount: "Crear cuenta",
		signInInstead: "Iniciar sesión",
	},
	auth: {
		signIn: {
			title: "Bienvenido de nuevo",
			subtitle: "Inicia sesión para seguir registrando tu progreso.",
			emailLabel: "Correo",
			emailPlaceholder: "tu@ejemplo.com",
			passwordLabel: "Contraseña",
			passwordPlaceholder: "••••••••",
			submit: "Iniciar sesión",
			newHere: "¿Eres nuevo?",
			createAccount: "Crear una cuenta",
			errors: {
				emailRequired: "El correo es obligatorio",
				emailInvalid: "Ingresa un correo válido",
				passwordRequired: "La contraseña es obligatoria",
				generic: "No se pudo iniciar sesión",
			},
		},
		signUp: {
			title: "Crea tu cuenta",
			subtitle: "Solo toma un minuto. Empieza a registrar tu entrenamiento hoy.",
			emailLabel: "Correo",
			emailPlaceholder: "tu@ejemplo.com",
			passwordLabel: "Contraseña",
			passwordPlaceholder: "Al menos {{min}} caracteres",
			confirmLabel: "Confirmar contraseña",
			confirmPlaceholder: "Repite tu contraseña",
			submit: "Crear cuenta",
			alreadyHaveAccount: "¿Ya tienes una cuenta?",
			signIn: "Iniciar sesión",
			successMessage:
				"¡Cuenta creada! Revisa tu correo para confirmarlo, luego inicia sesión.",
			errors: {
				emailRequired: "El correo es obligatorio",
				emailInvalid: "Ingresa un correo válido",
				passwordRequired: "La contraseña es obligatoria",
				passwordTooShort: "Usa al menos {{min}} caracteres",
				confirmRequired: "Confirma tu contraseña",
				confirmMismatch: "Las contraseñas no coinciden",
				generic: "No se pudo crear la cuenta",
			},
		},
	},
}
