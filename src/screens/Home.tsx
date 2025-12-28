import { RootStackScreenProps } from '../navigation/params';
import { StyleSheet, View } from 'react-native';
import { theme } from '../resources/theme';
import { useTranslation } from 'react-i18next';
import Button from '../components/buttons/Button';
import MCIcon from '../components/icons/MCIcon';
import StyledText from '../components/texts/StyledText';
import ItemCard from '../components/cards/ItemCard';

export default function Home({navigation}: RootStackScreenProps<"Home">) {
    const { t } = useTranslation()

    function handleCreateRoutine() {
        
    }

    function goToExerciseRepository() {
        navigation.navigate("ExerciseRepository")
    }

    return (
        <View style={styles.container}>
            <View style={styles.noRoutinesContainer}>
                <MCIcon name='dumbbell' size={'h1'} color='grayDark'/>
                <StyledText type='subtitle'>{t('messages.you-dont-have-routines-yet')}</StyledText>
                <StyledText type='boldNote'>{t('messages.create-routine-to-start-workingout')}</StyledText>

            </View>

            <Button 
                title='Create new routine'
                onPress={handleCreateRoutine}
                size='l'
                alignSelf
            />

            <ItemCard 
                title={t('titles.exercise-repository')}
                onPress={goToExerciseRepository}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundBlack,
        gap: theme.spacing.xl,
        paddingHorizontal: theme.spacing.s
    },
    noRoutinesContainer: {
        alignItems: "center",
        gap: theme.spacing.s
    },
});