import { RootStackScreenProps } from '../navigation/params';
import { StyleSheet, View } from 'react-native';
import { theme } from '../resources/theme';
import IconButton from '../components/buttons/IconButton';
import StyledText from '../components/texts/StyledText';

export default function ExerciseRepository({navigation}: RootStackScreenProps<"ExerciseRepository">) {
    function handleCreateExercise() {
        navigation.navigate("CreateExercise")
    }

    return (
        <View style={styles.container}>
            <IconButton 
                icon='plus'
                onPress={handleCreateExercise}
                size='xl'
                style={styles.createExerciseBtn}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
        backgroundColor: theme.colors.backgroundBlack,
        paddingHorizontal: theme.spacing.s
    },
    createExerciseBtn: {
        position: "absolute",
        bottom: theme.spacing.xl,
        right: theme.spacing.xl,
    },
});