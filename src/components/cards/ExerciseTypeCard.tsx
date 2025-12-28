import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '../../resources/theme';
import { useTranslation } from 'react-i18next';
import MCIcon from '../icons/MCIcon';
import StyledText from '../texts/StyledText';

type Props = {
    name: "bodyweight" | "freeweight" | "isometric" | "weighted"
    isSelected: boolean
    onSelect: Dispatch<SetStateAction<boolean>>
    isDisabled?: boolean
}
export default function ExerciseTypeCard({name, isSelected, onSelect, isDisabled = false}: Props) {
    const { t } = useTranslation()

    const iconName: React.ComponentProps<typeof MCIcon>["name"] =
        name === "bodyweight" ? "gymnastics"
        : name === "freeweight" ? "dumbbell"
        : name === "isometric" ? "timer-outline"
        : "weight"

    const label = t(`attributes.${name}`)

    function handleSelect() {
        if (!isDisabled) onSelect(!isSelected)
    }

    return (
        <TouchableOpacity 
            onPress={handleSelect} 
            style={[styles.container]}
        >
            <View 
                style={[styles.iconContainer, 
                    isDisabled ? styles.disabledContainer 
                    : isSelected ? styles.filledContainer 
                    : styles.borderedContainer]}
            >
                <MCIcon name={iconName} size='h3' color={isDisabled || isSelected ? "textDark" : "textLight"} />
            </View>

            <StyledText type='note' color={isDisabled ? "grayDark" : "textLight"}>{label}</StyledText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 4
    },
    iconContainer: {
        padding: theme.spacing.s,
        borderRadius: theme.spacing.xs,
        borderWidth: 1,
    },
    filledContainer: {
        backgroundColor: theme.colors.primary
    },
    borderedContainer: {
        borderColor: theme.colors.grayDark
    },
    disabledContainer: {
        backgroundColor: theme.colors.backgroundGray
    },
});