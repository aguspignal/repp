import { Header } from "@react-navigation/elements"
import { Image } from "react-native"
import { navigationStyles } from "../../navigation/styles"

type Props = {
	back?: {
		title: string | undefined
		href: string | undefined
	}
}

export default function LogoHeader({ back }: Props) {
	return (
		<Header
			title=""
			headerTitle={() => (
				<Image
					source={require("../../../assets/icon.png")}
					style={navigationStyles.headerImage}
				/>
			)}
			headerTitleAlign="center"
			headerShadowVisible={false}
			headerStyle={navigationStyles.headerBackground}
			back={back}
		/>
	)
}
