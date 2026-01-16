import { useEffect, useState } from "react"
import { Keyboard } from "react-native"

export default function useKeyboardBehaviour() {
	const [behaviour, setBehaviour] = useState<"height" | undefined>("height")

	useEffect(() => {
		const showListener = Keyboard.addListener("keyboardDidShow", () => {
			setBehaviour("height")
		})
		const hideListener = Keyboard.addListener("keyboardDidHide", () => {
			setBehaviour(undefined)
		})

		return () => {
			showListener.remove()
			hideListener.remove()
		}
	}, [])

	return {
		behaviour
	}
}
