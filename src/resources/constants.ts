import { Dimensions } from "react-native"
import Constants from "expo-constants"

// =============================================================================
// DEVICE & LAYOUT
// =============================================================================

const screenDimensions = Dimensions.get("screen")
const windowDimensions = Dimensions.get("window")

export const [SCREEN_WIDTH, SCREEN_HEIGHT] = [
	screenDimensions.width,
	screenDimensions.height
]
export const [WINDOW_WIDTH, WINDOW_HEIGHT] = [
	windowDimensions.width,
	windowDimensions.height
]
export const STATUS_BAR_HEIGHT = Constants.statusBarHeight

// =============================================================================
// URLS
// =============================================================================

export const SUPABASE_PROJECT_URL = "https://vsugngdxqialvqoxqbnq.supabase.co"

// =============================================================================
// KEYS, API & AUTHENTICATION
// =============================================================================

export const SUPABASE_PROJECT_API_KEY =
	"sb_publishable_MNQin0U79IkgxhTqD4k4GA_1oglYspV"

// =============================================================================
// VALUES
// =============================================================================

export const MAX_CODE_LENGTH = 3
export const MIN_PASSWORD_LENGTH = 6
export const MAX_NAME_LENGTH = 64
export const MAX_DESCRIPTION_LENGTH = 255
