import { StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../resources/theme';
import MCIcon from '../icons/MCIcon';
import StyledText from '../texts/StyledText';

type Props = {
    title: string
    onPress: () => void
}
export default function ItemCard({title, onPress}: Props) {
    return (
        <TouchableOpacity 
            onPress={onPress}
            style={styles.container}
        >
            <StyledText type='boldText'>{title}</StyledText>

            <MCIcon name='chevron-right' color='grayDark' />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.s,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.backgroundGray,
        borderRadius: theme.spacing.xxs
    },
});