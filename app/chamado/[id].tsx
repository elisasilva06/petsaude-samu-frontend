import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import { useState } from 'react';

import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

import { DestinationCard } from '@/features/chamados/components/DestinationCard';
import { LocationCard } from '@/features/chamados/components/LocationCard';
import { PatientCard } from '@/features/chamados/components/PatientCard';
import { RiskCard } from '@/features/chamados/components/RiskCard';

import { criarChamadoMock } from '@/features/chamados/mocks';

export default function ChamadoScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const chamado = criarChamadoMock(id ?? '1');

  const [atendimentoIniciado, setAtendimentoIniciado] =
    useState(false);

  function iniciarAtendimento() {
    /*
     * Estado temporário da interface.
     *
     * Quando o backend real for integrado,
     * essa ação deverá chamar o service
     * responsável pelo atendimento.
     */
    setAtendimentoIniciado(true);
  }

  function ligarParaPaciente() {
    Linking.openURL(`tel:${chamado.telefone}`);
  }

  function abrirGPS() {
    const destino =
      `${chamado.latitude},${chamado.longitude}`;

    const url =
      `https://www.google.com/maps/dir/?api=1&destination=${destino}`;

    Linking.openURL(url);
  }

  function abrirFichaSae() {
    if (!atendimentoIniciado) {
      return;
    }

    router.push({
      pathname: '/ficha-sae/[id]',
      params: {
        id: chamado.id,
      },
    });
  }

  function abrirMensagens() {
    router.push({
      pathname: '/mensagens/[id]',
      params: {
        id: chamado.id,
      },
    });
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Ocorrência #{chamado.id}
        </Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            EMERGÊNCIA
          </Text>
        </View>

        <View style={styles.timerBadge}>
          <Ionicons
            name="time-outline"
            size={14}
            color={Colors.emergency}
          />

          <Text style={styles.timerText}>
            2 min
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* PACIENTE */}
        <PatientCard
          chamado={chamado}
          onCall={ligarParaPaciente}
        />

        {/* LOCALIZAÇÃO */}
        <LocationCard
          chamado={chamado}
          onOpenGPS={abrirGPS}
        />

        {/* CLASSIFICAÇÃO */}
        <RiskCard />

        {/* RELATO */}
        <Text style={styles.sectionTitle}>
          Relato do Médico Regulador
        </Text>

        <View style={styles.reportCard}>
          <Text style={styles.reportText}>
            {chamado.relato}
          </Text>
        </View>

        {/* AÇÕES */}
        <Text style={styles.sectionTitle}>
          Ações Disponíveis
        </Text>

        <TouchableOpacity
          style={[
            styles.menuItem,
            !atendimentoIniciado &&
              styles.menuItemDisabled,
          ]}
          disabled={!atendimentoIniciado}
          onPress={abrirFichaSae}
        >
          <Ionicons
            name="document-text-outline"
            size={23}
            color={Colors.primary}
          />

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>
              Preencher Ficha SAE
            </Text>

            {!atendimentoIniciado && (
              <Text style={styles.menuSubtitle}>
                Inicie o atendimento primeiro
              </Text>
            )}
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.border}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.menuItem,
            styles.menuItemSpacing,
          ]}
          onPress={abrirMensagens}
        >
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={Colors.success}
          />

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>
              Mensagens com Solicitante
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.border}
          />
        </TouchableOpacity>

        {/* ENCAMINHAMENTO */}
        <DestinationCard
          chamado={chamado}
        />

        {/* INICIAR ATENDIMENTO */}
        <TouchableOpacity
          style={[
            styles.startButton,
            atendimentoIniciado &&
              styles.startButtonActive,
          ]}
          onPress={iniciarAtendimento}
          disabled={atendimentoIniciado}
        >
          <Ionicons
            name={
              atendimentoIniciado
                ? 'checkmark-circle-outline'
                : 'play'
            }
            size={22}
            color={Colors.background}
          />

          <Text style={styles.startButtonText}>
            {atendimentoIniciado
              ? 'ATENDIMENTO EM CURSO'
              : 'INICIAR ATENDIMENTO'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceMuted,
  },

  header: {
    minHeight: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceSecondary,
  },

  backButton: {
    paddingRight: 10,
    paddingVertical: 8,
  },

  headerTitle: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  statusBadge: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.emergency,
    borderRadius: 12,
  },

  statusText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '800',
  },

  timerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerSurface,
    borderRadius: 12,
  },

  timerText: {
    marginLeft: 4,
    color: Colors.emergency,
    fontSize: 11,
    fontWeight: '700',
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    color: Colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  reportCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: Colors.border,
    borderLeftColor: Colors.primary,
    borderRadius: 16,
  },

  reportText: {
    color: Colors.textLabel,
    fontSize: 14,
    lineHeight: 22,
  },

  menuItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
  },

  menuItemDisabled: {
    opacity: 0.5,
  },

  menuItemSpacing: {
    marginTop: 8,
  },

  menuContent: {
    flex: 1,
    marginLeft: 12,
  },

  menuTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  menuSubtitle: {
    marginTop: 2,
    color: Colors.danger,
    fontSize: 11,
  },

  startButton: {
    marginTop: 10,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 16,
  },

  startButtonActive: {
    backgroundColor: Colors.success,
  },

  startButtonText: {
    marginLeft: 10,
    color: Colors.background,
    fontSize: 16,
    fontWeight: '900',
  },
});