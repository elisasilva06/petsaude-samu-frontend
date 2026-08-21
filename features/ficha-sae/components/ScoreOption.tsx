import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

type ScoreOptionProps = {
  label: string;
  description?: string;
  points: number;
  pointsLabel?: string;
  selected: boolean;
  onPress: () => void;
  badgeBackgroundColor?: string;
};

export function ScoreOption({
  label,
  description,
  points,
  pointsLabel,
  selected,
  onPress,
  badgeBackgroundColor,
}: ScoreOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        selected && styles.optionSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.radio,
          selected && styles.radioActive,
        ]}
      />

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            selected && styles.labelSelected,
          ]}
        >
          {label}
        </Text>

        {description && (
          <Text style={styles.description}>
            {description}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.pointsBadge,
          badgeBackgroundColor
            ? {
                backgroundColor:
                  badgeBackgroundColor,
              }
            : null,
        ]}
      >
        <Text style={styles.pointsText}>
          {pointsLabel ?? `${points} pts`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 52,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceSecondary,
  },

  optionSelected: {
    backgroundColor: Colors.surfaceMuted,
  },

  radio: {
    width: 18,
    height: 18,
    marginRight: 10,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.border,
  },

  radioActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  textContainer: {
    flex: 1,
    paddingRight: 8,
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 12,
  },

  labelSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },

  description: {
    marginTop: 2,
    color: Colors.muted,
    fontSize: 10,
    lineHeight: 15,
  },

  pointsBadge: {
    minWidth: 48,
    paddingHorizontal: 7,
    paddingVertical: 4,
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 6,
  },

  pointsText: {
    color: Colors.textLabel,
    fontSize: 10,
    fontWeight: '800',
  },
});