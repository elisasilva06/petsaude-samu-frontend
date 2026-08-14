import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useCadastro } from '@/contexts/CadastroContext';

const listaEspecialidades = [
  'Clínica Médica',
  'Pediatria',
  'Cirurgia Geral',
  'Ortopedia',
  'Cardiologia',
  'Neurologia',
  'Medicina de Emergência',
  'Anestesiologia',
  'Medicina Intensiva',
  'Ginecologia e Obstetrícia',
  'Psiquiatria',
  'Infectologia',
  'Pneumologia',
  'Nefrologia',
  'Gastroenterologia',
];

export default function EspecialidadesScreen() {
  const {
    especialidades,
    atualizarEspecialidades,
  } = useCadastro();

  const possuiEspecialidade =
    especialidades.length > 0;

  function toggleEspecialidade(
    especialidade: string,
  ) {
    if (
      especialidades.includes(
        especialidade,
      )
    ) {
      atualizarEspecialidades(
        especialidades.filter(
          (item) =>
            item !== especialidade,
        ),
      );

      return;
    }

    atualizarEspecialidades([
      ...especialidades,
      especialidade,
    ]);
  }

  function handleFinalizar() {
    if (!possuiEspecialidade) {
      return;
    }

    // Temporário.
    // Quando integrarmos o backend, será aqui
    // que enviaremos o cadastro completo.
    router.replace('/cadastro/sucesso');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.replace(
              '/cadastro/dados-profissionais',
            )
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.background}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>
            Criar conta
          </Text>

          <Text style={styles.stepText}>
            Etapa 3 de 3 — Especialidades
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Feather
              name="award"
              size={40}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.title}>
            Suas Especialidades
          </Text>

          <Text style={styles.description}>
            Selecione uma ou mais áreas de atuação
          </Text>

          <View style={styles.chipContainer}>
            {listaEspecialidades.map(
              (especialidade) => {
                const selecionada =
                  especialidades.includes(
                    especialidade,
                  );

                return (
                  <TouchableOpacity
                    key={especialidade}
                    style={[
                      styles.chip,
                      selecionada &&
                        styles.chipSelected,
                    ]}
                    onPress={() =>
                      toggleEspecialidade(
                        especialidade,
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selecionada &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {especialidade}
                    </Text>
                  </TouchableOpacity>
                );
              },
            )}
          </View>

          {!possuiEspecialidade && (
            <Text style={styles.helperText}>
              Selecione pelo menos uma especialidade.
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.finishButton,
              !possuiEspecialidade &&
                styles.finishButtonDisabled,
            ]}
            onPress={handleFinalizar}
            disabled={!possuiEspecialidade}
          >
            <Text style={styles.finishButtonText}>
              Criar minha conta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.previousButton}
            onPress={() =>
              router.replace(
                '/cadastro/dados-profissionais',
              )
            }
          >
            <Ionicons
              name="arrow-back"
              size={17}
              color={Colors.textSecondary}
            />

            <Text style={styles.previousText}>
              Voltar para etapa anterior
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },

  header: {
    minHeight: 110,
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
  },

  backButton: {
    width: 40,
    height: 40,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: Colors.background,
    fontSize: 20,
    fontWeight: '700',
  },

  stepText: {
    marginTop: 3,
    color: Colors.muted,
    fontSize: 12,
  },

  scrollContent: {
    flexGrow: 1,
  },

  card: {
    flexGrow: 1,
    width: '100%',
    paddingTop: 35,
    paddingHorizontal: '7%',
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  iconCircle: {
    width: 80,
    height: 80,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.border,
    borderRadius: 40,
  },

  title: {
    marginBottom: 5,
    color: Colors.textStrong,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  description: {
    marginBottom: 25,
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },

  chipContainer: {
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  chip: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 25,
  },

  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  chipText: {
    color: Colors.textLabel,
    fontSize: 13,
    fontWeight: '500',
  },

  chipTextSelected: {
    color: Colors.background,
    fontWeight: '700',
  },

  helperText: {
    marginTop: 10,
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },

  finishButton: {
    width: '100%',
    minHeight: 56,
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
  },

  finishButtonDisabled: {
    backgroundColor: Colors.disabled,
  },

  finishButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  previousButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  previousText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});