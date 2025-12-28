import { DraftProgression } from '../../types/exercises';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../../resources/theme';
import { useTranslation } from 'react-i18next';
import MCIcon from '../icons/MCIcon';
import StyledText from '../texts/StyledText';

type Props = {
    progression: DraftProgression
    onUpdate: (txt: string, progOrder: number) => void
    onDelete: (progOrder: number) => void
}
export default function DraftProgressionCard({progression, onUpdate, onDelete}: Props) {
    const { t } = useTranslation();


    return (
        <View style={styles.container}>
            <StyledText type='subtitle' align='center' style={styles.order}>{progression.order}</StyledText>

            <TextInput
                value={progression.name}
                onChangeText={(txt) => {
                    onUpdate(txt, progression.order);
                }}
                placeholder={t('attributes.progression-name')}
                style={styles.input}
            />

            <TouchableOpacity onPress={() => onDelete(progression.order)}>
                <MCIcon name='trash-can' size='xxl' />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
    },
    order: {
        paddingHorizontal: theme.spacing.xxs
    },
    input: {
        flex: 1,
        fontSize: theme.fontSize.s,
        color: theme.colors.textLight,
        paddingHorizontal: theme.spacing.s,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.backgroundGray,
        borderRadius: theme.spacing.xxs,
    },
});