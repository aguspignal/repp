import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { navigationStyles } from './styles';
import { RootStackParams } from './params';
import { theme } from '../resources/theme';
import Home from '../screens/Home';
import HomeHeader from '../components/header/HomeHeader';
import Settings from '../screens/Settings';
import ExerciseRepository from '../screens/ExerciseRepository';
import i18next from 'i18next';
import CreateExercise from '../screens/CreateExercise';

type Props = {
    uuid: string
}
export default function Root({uuid}: Props) {
    return <RootNavigator />
}

const RootStack = createNativeStackNavigator<RootStackParams>()

function RootNavigator() {
    return (
        <RootStack.Navigator
            screenOptions={{
                headerStyle: navigationStyles.headerBackground,
                headerTitleStyle: navigationStyles.headerTitle,
                headerTintColor: theme.colors.textLight,
                headerShadowVisible: false
            }}
        >
            <RootStack.Screen 
                name='Home' 
                component={Home} 
                options={{
                    header: ({navigation, back}) => <HomeHeader navigation={navigation} back={back} />
                }}
            />
            <RootStack.Screen
                name='Settings'
                component={Settings}
            />
            <RootStack.Screen 
                name='ExerciseRepository'
                component={ExerciseRepository}
                options={{
                    headerTitle: i18next.t('titles.exercise-repository')
                }}
            />
            <RootStack.Screen 
                name='CreateExercise'
                component={CreateExercise}
                options={{
                    headerTitle: i18next.t('actions.create-exercise')
                }}
            />
        </RootStack.Navigator>
    );
}