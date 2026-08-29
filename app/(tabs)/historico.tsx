import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

import {
  HistoricoCard,
} from '@/features/historico/components/HistoricoCard';

import {
  historicoService,
} from '@/features/historico/services';

import type {
  HistoricoAtendimento,
} from '@/features/historico/types';

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
  const [dia, mes, ano] =
    data
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

/**
 * Histórico de atendimentos finalizados.
 *
 * A tela não acessa mocks diretamente.
 *
 * Fluxo:
 *
 * HistoricoScreen
 *      ↓
 * historicoService
 *      ↓
 * mock hoje
 *      ↓
 * API futuramente
 */
export default function HistoricoScreen() {
  const [
    filtro,
    setFiltro,
  ] =
    useState<FiltroHistorico>(
      'todos'
    );

  const [
    atendimentos,
    setAtendimentos,
  ] = useState<
    HistoricoAtendimento[]
  >([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    atualizando,
    setAtualizando,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState('');

  /**
   * Carrega novamente o Histórico.
   *
   * Isso é importante porque uma ocorrência
   * pode ter sido finalizada em outra tela.
   */
  const carregarHistorico =
    useCallback(async () => {
      try {
        setCarregando(true);
        setErro('');

        const resultado =
          await historicoService.listarAtendimentos();

        setAtendimentos(
          resultado
        );
      } catch (error) {
        console.error(
          'Erro ao carregar histórico:',
          error
        );

        setErro(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o histórico.'
        );
      } finally {
        setCarregando(false);
      }
    }, []);

  /**
   * Toda vez que a aba Histórico recebe foco,
   * buscamos os registros novamente.
   *
   * Portanto:
   *
   * finalizar ocorrência
   *      ↓
   * abrir Histórico
   *      ↓
   * registro aparece
   */
  useFocusEffect(
    useCallback(() => {
      void carregarHistorico();
    }, [carregarHistorico])
  );

  async function atualizarHistorico() {
    if (atualizando) {
      return;
    }

    try {
      setAtualizando(true);

      await carregarHistorico();
    } finally {
      setAtualizando(false);
    }
  }

  function abrirDetalhes(
    atendimento:
      HistoricoAtendimento
  ) {
    router.push({
      pathname:
        '/detalhesHistorico/[id]',

      params: {
        id: atendimento.id,
      },
    });
  }

  /**
   * Os filtros continuam locais por enquanto.
   *
   * TODO(BACKEND):
   * Se o endpoint real usar paginação/filtros,
   * esta lógica poderá migrar para o service.
   */
  const historicoFiltrado =
    useMemo(() => {
      const hoje =
        inicioDoDia(
          new Date()
        );

      if (
        filtro === 'todos'
      ) {
        return atendimentos;
      }

      return atendimentos.filter(
        (atendimento) => {
          const dataAtendimento =
            inicioDoDia(
              converterData(
                atendimento.data
              )
            );

          if (
            filtro === 'hoje'
          ) {
            return (
              dataAtendimento.getTime() ===
              hoje.getTime()
            );
          }

          if (
            filtro === 'semana'
          ) {
            const inicioSemana =
              inicioDaSemana(
                hoje
              );

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

          if (
            filtro === 'mes'
          ) {
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
    }, [
      filtro,
      atendimentos,
    ]);

  if (
    carregando &&
    atendimentos.length === 0
  ) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Carregando histórico...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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

          <Text
            style={styles.subtitle}
          >
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

      {/* ERRO */}
      {erro ? (
        <View
          style={
            styles.errorContainer
          }
        >
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={Colors.danger}
          />

          <Text
            style={
              styles.errorText
            }
          >
            {erro}
          </Text>

          <TouchableOpacity
            onPress={() => {
              void carregarHistorico();
            }}
          >
            <Ionicons
              name="refresh"
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* FILTROS */}
      <View
        style={
          styles.filtersContainer
        }
      >
        {FILTROS.map(
          (item) => {
            const selecionado =
              filtro ===
              item.key;

            return (
              <TouchableOpacity
                key={
                  item.key
                }
                style={[
                  styles.filterButton,

                  selecionado &&
                    styles.filterButtonActive,
                ]}
                onPress={() =>
                  setFiltro(
                    item.key
                  )
                }
                activeOpacity={
                  0.8
                }
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
          }
        )}
      </View>

      {/* LISTA */}
      <FlatList
        data={
          historicoFiltrado
        }
        keyExtractor={(
          item
        ) => item.id}
        renderItem={({
          item,
        }) => (
          <HistoricoCard
            atendimento={item}
            onPress={() =>
              abrirDetalhes(
                item
              )
            }
          />
        )}
        contentContainerStyle={
          styles.listContent
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              atualizando
            }
            onRefresh={
              atualizarHistorico
            }
          />
        }
        ListHeaderComponent={
          <View
            style={
              styles.summary
            }
          >
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
              para o período selecionado.
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

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginTop: 12,
      color:
        Colors.textSecondary,
      fontSize: 13,
    },

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

    errorContainer: {
      marginHorizontal: 16,
      marginTop: 12,
      padding: 11,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor:
        Colors.dangerSurface,
      borderRadius: 10,
    },

    errorText: {
      flex: 1,
      color:
        Colors.danger,
      fontSize: 11,
    },

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

    listContent: {
      padding: 16,
      paddingBottom: 30,
      flexGrow: 1,
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
      color:
        Colors.primary,
      fontSize: 22,
      fontWeight: '900',
    },

    summaryText: {
      color:
        Colors.textSecondary,
      fontSize: 12,
    },

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