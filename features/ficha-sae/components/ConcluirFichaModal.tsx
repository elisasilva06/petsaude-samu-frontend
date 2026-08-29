import { Ionicons } from '@expo/vector-icons';

import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

type Props = {
  visible: boolean;
  concluindo: boolean;
  erro?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConcluirFichaModal({
  visible,
  concluindo,
  erro,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={
        concluindo
          ? undefined
          : onCancel
      }
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.icon}>
            <Ionicons
              name="document-text-outline"
              size={30}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.title}>
            Concluir Ficha SAE?
          </Text>

          <Text style={styles.description}>
            Confirme que revisou as informações
            preenchidas. Depois da conclusão, a
            ocorrência poderá ser finalizada.
          </Text>

          {erro ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={Colors.danger}
              />

              <Text style={styles.errorText}>
                {erro}
              </Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              disabled={concluindo}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>
                Revisar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              disabled={concluindo}
              onPress={onConfirm}
            >
              {concluindo ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={Colors.background}
                  />

                  <Text style={styles.confirmText}>
                    Concluindo...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={19}
                    color={Colors.background}
                  />

                  <Text style={styles.confirmText}>
                    Concluir ficha
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  container: {
    width: '100%',
    maxWidth: 420,
    padding: 22,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },

  icon: {
    width: 60,
    height: 60,
    marginBottom: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 30,
  },

  title: {
    color: Colors.textStrong,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },

  description: {
    marginTop: 9,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  errorBox: {
    marginTop: 15,
    padding: 11,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.dangerSurface,
    borderRadius: 10,
  },

  errorText: {
    flex: 1,
    color: Colors.danger,
    fontSize: 11,
    lineHeight: 16,
  },

  actions: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 9,
  },

  cancelButton: {
    flex: 1,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 11,
  },

  cancelText: {
    color: Colors.textLabel,
    fontSize: 12,
    fontWeight: '700',
  },

  confirmButton: {
    flex: 1.4,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: Colors.success,
    borderRadius: 11,
  },

  confirmText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '800',
  },
});