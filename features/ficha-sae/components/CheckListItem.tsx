import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

type CheckListItemProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  accentColor?: string;
  selectedBackgroundColor?: string;
};

export function CheckListItem({
  label,
  selected,
  onPress,
  accentColor = Colors.primary,
  selectedBackgroundColor = Colors.surfaceSecondary,
}: CheckListItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && {
          borderColor: accentColor,
          backgroundColor: selectedBackgroundColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.checkbox,
          selected && {
            backgroundColor: accentColor,
            borderColor: accentColor,
          },
        ]}
      >
        {selected && (
          <Text style={styles.checkmark}>
            ✓
          </Text>
        )}
      </View>

      <Text
        style={[
          styles.label,
          selected && {
            color: accentColor,
            fontWeight: '700',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 43,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 9,
  },

  checkbox: {
    width: 18,
    height: 18,
    marginRight: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 4,
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  label: {
    flex: 1,
    color: Colors.text,
    fontSize: 11,
    lineHeight: 16,
  },
});