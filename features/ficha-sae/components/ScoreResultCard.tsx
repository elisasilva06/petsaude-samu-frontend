import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

type ScoreResultCardProps = {
  label: string;
  value: string;
  status: string;
  backgroundColor: string;
  badge?: string;
};

export function ScoreResultCard({
  label,
  value,
  status,
  backgroundColor,
  badge,
}: ScoreResultCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
        },
      ]}
    >
      <View style={styles.scoreContainer}>
        <Text style={styles.label}>
          {label}
        </Text>

        <Text style={styles.value}>
          {value}
        </Text>
      </View>

      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badge}
          </Text>
        </View>
      ) : (
        <Text style={styles.status}>
          {status}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginBottom: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
  },

  scoreContainer: {
    flex: 1,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.9,
  },

  value: {
    marginTop: 3,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },

  status: {
    maxWidth: '48%',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
  },

  badge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});