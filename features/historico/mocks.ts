import { HistoricoAtendimento } from './types';

export const historicoMock: HistoricoAtendimento[] = [
  {
    id: '101',
    paciente: 'Ana Beatriz Silva',
    idade: 67,
    sexo: 'Feminino',
    data: '18/08/2026',
    horario: '16:42',
    tipoOcorrencia: 'Clínica',
    classificacao: 'Urgente',
    endereco: 'Centro, Caxias - MA',
    hospitalDestino:
      'Hospital Regional de Caxias',
    profissional: 'Dr. Carlos Eduardo',
    status: 'finalizado',
  },
  {
    id: '102',
    paciente: 'José Raimundo Santos',
    idade: 48,
    sexo: 'Masculino',
    data: '17/08/2026',
    horario: '09:15',
    tipoOcorrencia: 'Trauma',
    classificacao: 'Emergência',
    endereco: 'Volta Redonda, Caxias - MA',
    hospitalDestino:
      'Hospital Regional de Caxias',
    profissional: 'Dr. Carlos Eduardo',
    status: 'finalizado',
  },
  {
    id: '103',
    paciente: 'Maria Oliveira',
    idade: 29,
    sexo: 'Feminino',
    data: '16/08/2026',
    horario: '21:08',
    tipoOcorrencia: 'Obstétrica',
    classificacao: 'Urgente',
    endereco: 'Cohab, Caxias - MA',
    hospitalDestino:
      'Maternidade Carmosina Coutinho',
    profissional: 'Dr. Carlos Eduardo',
    status: 'finalizado',
  },
];

export function buscarHistoricoPorId(
  id: string
) {
  return historicoMock.find(
    (item) => item.id === id
  );
}