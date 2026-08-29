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

type LogoutConfirmModalProps = {
  visible: boolean;
  loading: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Modal de confirmação de logout.
 *
 * Foi implementado como componente próprio para manter
 * o mesmo comportamento visual no Web, Android e iOS.
 *
 * Este componente não executa autenticação diretamente.
 * Ele apenas comunica a decisão do usuário para a tela.
 */
export function LogoutConfirmModal({
  visible,
  loading,
  error,
  onCancel,
  onConfirm,
}: LogoutConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!loading) {
          onCancel();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="log-out-outline"
              size={30}
              color={Colors.danger}
            />
          </View>

          <Text style={styles.title}>
            Sair da conta?
          </Text>

          <Text style={styles.description}>
            Você precisará entrar novamente para acessar o aplicativo.
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={Colors.danger}
              />

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                loading && styles.disabled,
              ]}
              disabled={loading}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.logoutButton,
                loading && styles.disabled,
              ]}
              disabled={loading}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={Colors.background}
                  />

                  <Text style={styles.logoutButtonText}>
                    Saindo...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="log-out-outline"
                    size={18}
                    color={Colors.background}
                  />

                  <Text style={styles.logoutButtonText}>
                    Sair
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
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  modal: {
    width: '100%',
    maxWidth: 380,
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 20,
  },

  iconContainer: {
    width: 62,
    height: 62,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dangerSurface,
    borderRadius: 31,
  },

  title: {
    color: Colors.text,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },

  description: {
    marginTop: 8,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  errorBox: {
    width: '100%',
    marginTop: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.dangerSurface,
    borderRadius: 10,
  },

  errorText: {
    flex: 1,
    color: Colors.danger,
    fontSize: 12,
    lineHeight: 17,
  },

  actions: {
    width: '100%',
    marginTop: 24,
    flexDirection: 'row',
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  cancelButtonText: {
    color: Colors.textLabel,
    fontSize: 13,
    fontWeight: '700',
  },

  logoutButton: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: Colors.danger,
    borderRadius: 12,
  },

  logoutButtonText: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: '800',
  },

  disabled: {
    opacity: 0.65,
  },
});