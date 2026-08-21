import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

import { HistoricoCard } from '@/features/historico/components/HistoricoCard';
import { historicoMock } from '@/features/historico/mocks';
import { HistoricoAtendimento } from '@/features/historico/types';

type FiltroHistorico =
  | 'todos'
  | 'hoje'
  | 'semana'
  | 'mes';

type FiltroConfig = {
  key: FiltroHistorico;
  label: string;
};

const FILTROS: FiltroConfig[] = [
  {
    key: 'todos',
    label: 'Todos',
  },
  {
    key: 'hoje',
    label: 'Hoje',
  },
  {
    key: 'semana',
    label: 'Semana',
  },
  {
    key: 'mes',
    label: 'Mês',
  },
];

function converterData(
  data: string
): Date {
  const [dia, mes, ano] = data
    .split('/')
    .map(Number);

  return new Date(
    ano,
    mes - 1,
    dia
  );
}

function inicioDoDia(
  data: Date
): Date {
  return new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate()
  );
}

function inicioDaSemana(
  data: Date
): Date {
  const resultado =
    inicioDoDia(data);

  const diaSemana =
    resultado.getDay();

  /*
   * getDay:
   * domingo = 0
   * segunda = 1
   * ...
   *
   * Queremos a semana começando
   * na segunda-feira.
   */
  const diferenca =
    diaSemana === 0
      ? -6
      : 1 - diaSemana;

  resultado.setDate(
    resultado.getDate() +
      diferenca
  );

  return resultado;
}

export default function HistoricoScreen() {
  const [filtro, setFiltro] =
    useState<FiltroHistorico>(
      'todos'
    );

  function abrirDetalhes(
    atendimento: HistoricoAtendimento
  ) {
    router.push({
      pathname:
        '/detalhesHistorico/[id]',

      params: {
        id: atendimento.id,
      },
    });
  }

  const historicoFiltrado =
    useMemo(() => {
      const hoje =
        inicioDoDia(new Date());

      if (filtro === 'todos') {
        return historicoMock;
      }

      return historicoMock.filter(
        (atendimento) => {
          const dataAtendimento =
            inicioDoDia(
              converterData(
                atendimento.data
              )
            );

          if (filtro === 'hoje') {
            return (
              dataAtendimento.getTime() ===
              hoje.getTime()
            );
          }

          if (
            filtro === 'semana'
          ) {
            const inicioSemana =
              inicioDaSemana(hoje);

            const fimSemana =
              new Date(
                inicioSemana
              );

            fimSemana.setDate(
              inicioSemana.getDate() +
                6
            );

            fimSemana.setHours(
              23,
              59,
              59,
              999
            );

            return (
              dataAtendimento >=
                inicioSemana &&
              dataAtendimento <=
                fimSemana
            );
          }

          if (filtro === 'mes') {
            return (
              dataAtendimento.getMonth() ===
                hoje.getMonth() &&
              dataAtendimento.getFullYear() ===
                hoje.getFullYear()
            );
          }

          return true;
        }
      );
    }, [filtro]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Histórico
          </Text>

          <Text style={styles.subtitle}>
            Atendimentos finalizados
          </Text>
        </View>

        <View
          style={
            styles.iconContainer
          }
        >
          <Ionicons
            name="time-outline"
            size={22}
            color={Colors.primary}
          />
        </View>
      </View>

      {/* FILTROS */}
      <View
        style={
          styles.filtersContainer
        }
      >
        {FILTROS.map((item) => {
          const selecionado =
            filtro === item.key;

          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.filterButton,

                selecionado &&
                  styles.filterButtonActive,
              ]}
              onPress={() =>
                setFiltro(item.key)
              }
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,

                  selecionado &&
                    styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* HISTÓRICO */}
      <FlatList
        data={historicoFiltrado}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={({ item }) => (
          <HistoricoCard
            atendimento={item}
            onPress={() =>
              abrirDetalhes(item)
            }
          />
        )}
        contentContainerStyle={
          styles.listContent
        }
        showsVerticalScrollIndicator={
          false
        }
        ListHeaderComponent={
          <View style={styles.summary}>
            <Text
              style={
                styles.summaryNumber
              }
            >
              {
                historicoFiltrado.length
              }
            </Text>

            <Text
              style={
                styles.summaryText
              }
            >
              {historicoFiltrado.length ===
              1
                ? 'atendimento encontrado'
                : 'atendimentos encontrados'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <Ionicons
              name="document-text-outline"
              size={42}
              color={Colors.muted}
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              Nenhum atendimento
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Não existem atendimentos
              para o período
              selecionado.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.surfaceMuted,
    },

    // HEADER
    header: {
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      backgroundColor:
        Colors.background,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    title: {
      color: Colors.text,
      fontSize: 24,
      fontWeight: '900',
    },

    subtitle: {
      marginTop: 3,
      color:
        Colors.textSecondary,
      fontSize: 12,
    },

    iconContainer: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 21,
    },

    // FILTROS
    filtersContainer: {
      paddingHorizontal: 16,
      paddingTop: 13,
      paddingBottom: 4,
      flexDirection: 'row',
      gap: 7,
      backgroundColor:
        Colors.surfaceMuted,
    },

    filterButton: {
      flex: 1,
      minHeight: 38,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 20,
    },

    filterButtonActive: {
      backgroundColor:
        Colors.primary,
      borderColor:
        Colors.primary,
    },

    filterText: {
      color:
        Colors.textSecondary,
      fontSize: 11,
      fontWeight: '700',
    },

    filterTextActive: {
      color:
        Colors.background,
    },

    // LISTA
    listContent: {
      padding: 16,
      paddingBottom: 30,
    },

    summary: {
      marginBottom: 14,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 7,
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 12,
    },

    summaryNumber: {
      color: Colors.primary,
      fontSize: 22,
      fontWeight: '900',
    },

    summaryText: {
      color:
        Colors.textSecondary,
      fontSize: 12,
    },

    // VAZIO
    emptyContainer: {
      minHeight: 300,
      paddingHorizontal: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },

    emptyTitle: {
      marginTop: 12,
      color: Colors.text,
      fontSize: 16,
      fontWeight: '800',
    },

    emptyText: {
      marginTop: 5,
      color:
        Colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
    },
  });