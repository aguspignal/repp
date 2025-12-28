import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginStackParams } from "./params";
import LogoHeader from "../components/header/LogoHeader";
import SignIn from "../screens/Login/SignIn";
import SignUp from "../screens/Login/SignUp";
import Welcome from "../screens/Login/Welcome";

const LoginStack = createNativeStackNavigator<LoginStackParams>()

export default function LoginNavigator() {
    return (
        <LoginStack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ header: ({ back }) => <LogoHeader back={back} /> }}
        >
            <LoginStack.Screen name="Welcome" component={Welcome} />    
            <LoginStack.Screen name="SignIn" component={SignIn} />    
            <LoginStack.Screen name="SignUp" component={SignUp} />    
        </LoginStack.Navigator>
    );
}