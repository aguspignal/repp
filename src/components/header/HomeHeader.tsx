import { Header } from "@react-navigation/elements"
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { navigationStyles } from "../../navigation/styles";
import { ParamListBase } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import MCIcon from "../icons/MCIcon";

type Props = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
	back?: {
		title: string | undefined
		href: string | undefined
	}
}

export default function HomeHeader({ navigation, back }: Props) {
	return (
		<Header
			title="Repp"
			headerTitleStyle={navigationStyles.headerTitle}
			headerRight={() => <HeaderRight navigation={navigation} />}
			headerStyle={navigationStyles.headerBackground}
			headerShadowVisible={false}
			back={back}
		/>
	)
}

type HeaderRightProps = {
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
}
function HeaderRight({ navigation }: HeaderRightProps) {
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate("Settings")}
			style={navigationStyles.headerRightContainer}
		>
			<MCIcon name="cog" style={navigationStyles.headerIcon} />
		</TouchableOpacity>
	)
}
