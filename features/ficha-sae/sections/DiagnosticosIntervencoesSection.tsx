import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

import { CheckListItem } from '../components/CheckListItem';
import { useFichaSae } from '../context/FichaSaeContext';

const DIAGNOSTICOS = [
  'Desobstrução Ineficaz de Vias aéreas',
  'Padrão respiratório Ineficaz',
  'Risco de broncoaspiração',
  'Risco de choque',
  'Integridade da pele prejudicada',
  'Envenenamento/Intoxicação',
  'Dor aguda',
  'Confusão aguda',
  'Glicemia instável',
  'Mobilidade física prejudicada',
  'Risco de trauma/Quedas',
];

const INTERVENCOES = [
  'Monitorar nível de consciência/sedação',
  'Monitoração Cardíaca/Sinais Vitais',
  'Manutenção da ventilação mecânica',
  'Aspirar vias aéreas',
  'Oxigenoterapia',
  'Acesso Venoso Periférico',
  'Instalação de Sonda',
  'Imobilização de membros',
  'Curativo/Cobertura',
  'Controle de Hemorragias',
];

export function DiagnosticosIntervencoesSection() {
  const { state, dispatch } = useFichaSae();

  const dados =
    state.diagnosticosIntervencoes;

  function atualizar(
    campo: keyof typeof dados,
    valor: string | string[]
  ) {
    dispatch({
      type:
        'SET_DIAGNOSTICOS_INTERVENCOES',

      payload: {
        ...dados,
        [campo]: valor,
      },
    });
  }

  function alternarItem(
    campo: 'diagnosticos' | 'intervencoes',
    item: string
  ) {
    const lista = dados[campo];

    const novaLista = lista.includes(item)
      ? lista.filter(
          (atual) => atual !== item
        )
      : [...lista, item];

    atualizar(
      campo,
      novaLista
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>
        DIAGNÓSTICOS E INTERVENÇÕES
      </Text>

      <View style={styles.card}>
        <Text style={styles.subTitle}>
          DIAGNÓSTICOS DE ENFERMAGEM
        </Text>

        {DIAGNOSTICOS.map(
          (diagnostico) => (
            <CheckListItem
              key={diagnostico}
              label={diagnostico}
              selected={dados.diagnosticos.includes(
                diagnostico
              )}
              onPress={() =>
                alternarItem(
                  'diagnosticos',
                  diagnostico
                )
              }
            />
          )
        )}

        <Text style={styles.label}>
          Outros Diagnósticos
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
          ]}
          multiline
          placeholder="Informe outros diagnósticos..."
          placeholderTextColor={Colors.muted}
          value={
            dados.outrosDiagnosticos
          }
          onChangeText={(valor) =>
            atualizar(
              'outrosDiagnosticos',
              valor
            )
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subTitle}>
          INTERVENÇÕES DE ENFERMAGEM
        </Text>

        {INTERVENCOES.map(
          (intervencao) => (
            <CheckListItem
              key={intervencao}
              label={intervencao}
              selected={dados.intervencoes.includes(
                intervencao
              )}
              onPress={() =>
                alternarItem(
                  'intervencoes',
                  intervencao
                )
              }
            />
          )
        )}

        <Text style={styles.label}>
          Outras Intervenções / Conduta
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
          ]}
          multiline
          placeholder="Descreva condutas específicas..."
          placeholderTextColor={Colors.muted}
          value={
            dados.outrasIntervencoes
          }
          onChangeText={(valor) =>
            atualizar(
              'outrasIntervencoes',
              valor
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 15,
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  card: {
    marginBottom: 14,
    padding: 15,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  subTitle: {
    marginBottom: 12,
    paddingBottom: 7,
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  label: {
    marginTop: 13,
    marginBottom: 6,
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 11,
    color: Colors.text,
    fontSize: 14,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 9,
  },

  multilineInput: {
    minHeight: 85,
    paddingTop: 11,
    textAlignVertical: 'top',
  },
});