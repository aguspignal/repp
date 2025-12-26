import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginStackParams } from "./params";
import { navigationStyles } from "./styles";
import { theme } from "../resources/theme";
import SignIn from "../screens/Login/SignIn";
import SignUp from "../screens/Login/SignUp";
import Welcome from "../screens/Login/Welcome";

const LoginStack = createNativeStackNavigator<LoginStackParams>()

export default function LoginNavigator() {
    return (
        <LoginStack.Navigator
            screenOptions={{
                headerStyle: navigationStyles.headerBackground,
                headerTitleStyle: navigationStyles.headerTitle,
                headerTintColor: theme.colors.textLight,
                headerShadowVisible: false
            }}
        >
            <LoginStack.Screen name="Welcome" component={Welcome} />    
            <LoginStack.Screen name="SignIn" component={SignIn} />    
            <LoginStack.Screen name="SignUp" component={SignUp} />    
        </LoginStack.Navigator>
    );
}