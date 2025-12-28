import { CreateExerciseValidationSchema } from '../utils/valdiationSchemas';
import { CreateExerciseValues } from '../types/forms';
import { DraftProgression } from '../types/exercises';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { theme } from '../resources/theme';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../components/buttons/Button';
import CreateExerciseInput from '../components/inputs/CreateExerciseInput';
import DraftProgressionCard from '../components/cards/DraftProgressionCard';
import ExerciseTypeCard from '../components/cards/ExerciseTypeCard';
import StyledText from '../components/texts/StyledText';
import TextButton from '../components/buttons/TextButton';

export default function CreateExercise() {
    const { t } = useTranslation()
    
    const {
        handleSubmit,
		control,
		formState: { isLoading, isSubmitting },
	} = useForm<CreateExerciseValues>({
        defaultValues: { name: "", description: "" },
	    // @ts-ignore
		resolver: yupResolver(CreateExerciseValidationSchema),
	})

    const [isBodyweight, setIsBodyweight] = useState(false)
    const [isFreeweight, setIsFreeweight] = useState(false)
    const [isIsometric, setIsIsometric] = useState(false)
    const [progressions, setProgressions] = useState<DraftProgression[]>([{name: undefined, order: 1}])

    function handleCreateExercise() {
        console.log(progressions)
    }
    
    function handleAddProgression() {
        const sorted = [...progressions].sort((a, b) => b.order - a.order);

        const nextOrder = (sorted[0]?.order ?? 0) + 1;

        const emptyProgression: DraftProgression = {
            name: undefined,
            order: nextOrder
        };
        
        setProgressions(prev => [emptyProgression, ...prev]);
    }

    const onUpdateProgression = useCallback((txt: string, progOrder: number) => {
        setProgressions(prev => 
            prev.map(p => p.order === progOrder ? {...p, name: txt} : p))
    }, [])

    function onDeleteProgression(progOrder: number) {
        const filtered = progressions
            .filter(p => p.order !== progOrder) 
        
        if (progOrder === progressions.length) {
            setProgressions(filtered)
            return
        }

        const reordered = filtered.map(p => (p.order - 1 >= progOrder ? {...p, order: p.order - 1} : p))

        setProgressions(reordered)
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior='height'>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View>
                    {/* @ts-ignore */}
                    <CreateExerciseInput name='name' control={control} />
                    {/* @ts-ignore */}
                    <CreateExerciseInput name='description' control={control} />
                </View>
            
                <View style={styles.exerciseCategoriesContainer}>
                    <View style={styles.titleAndCardsContainer}>
                        <StyledText type='boldText'>{t('attributes.type')}</StyledText>
            
                        <View style={styles.exerciseTypeCardsContainer}>
                            <ExerciseTypeCard 
                                name='bodyweight' 
                                isSelected={isBodyweight} 
                                onSelect={setIsBodyweight}
                                isDisabled={isFreeweight}
                            />
                            <ExerciseTypeCard
                                name='freeweight'
                                isSelected={isFreeweight}
                                onSelect={setIsFreeweight}
                                isDisabled={isBodyweight}
                            />
                        </View>
                    </View>
            
                    <View style={styles.titleAndCardsContainer}>
                        <StyledText type='boldText'>{t('attributes.properties')}</StyledText>
                        
                        <ExerciseTypeCard
                            name='isometric'
                            isSelected={isIsometric}
                            onSelect={setIsIsometric}
                        />
                    </View>
                </View>
            
                <View style={styles.progressionsContainer}>
                    <View style={styles.progressionsTitleContainer}>
                        <StyledText type='subtitle'>{t('titles.progressions')}</StyledText>
                        
                        <TextButton 
                            title={t('actions.add')}
                            onPress={handleAddProgression}
                            icon='plus'
                            color='primary'
                            textType='subtitle'
                        />
                    </View>
                    
                    {
                        progressions.map(prog => (
                            <DraftProgressionCard 
                                progression={prog} 
                                onUpdate={onUpdateProgression}
                                onDelete={onDeleteProgression}
                                key={prog.order}
                            />
                        ))
                    }
                </View>
            
                <Button 
                    title={t('actions.create-exercise')}
                    onPress={handleSubmit(handleCreateExercise)}
                    isLoading={isLoading || isSubmitting}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
       flex: 1,
       backgroundColor: theme.colors.backgroundBlack,
       paddingHorizontal: theme.spacing.s,
    },
    contentContainer: {
        gap: theme.spacing.xl,
        paddingBottom: theme.spacing.xl
    },
    exerciseCategoriesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        // marginVertical: theme.spacing.xl,
        paddingHorizontal: theme.spacing.s
    },
    titleAndCardsContainer: {
        alignItems: "center",
        gap: theme.spacing.xxs
    },
    exerciseTypeCardsContainer: {
        flexDirection: "row",
        gap: theme.spacing.s
    },
    progressionsContainer: {
        gap: theme.spacing.xs
    },
    progressionsTitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
});