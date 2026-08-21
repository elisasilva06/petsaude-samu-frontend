import { FichaSaeState } from './types';

export const initialFichaSaeState: FichaSaeState = {
  identificacao: {
    chamado: {
      numero: '',
      data: '',
      horarios: {
        saidaBase: '',
        chegadaLocal: '',
        saidaLocal: '',
        chegadaDestino: '',
      },
      endereco: '',
      pontoReferencia: '',
    },

    paciente: {
      nome: '',
      nomeSocial: '',
      idade: '',
      sexo: null,
    },

    tipoOcorrencia: null,
  },

  avaliacaoPrimaria: {
    hemorragias: {
      contencao: false,
      compressao: false,
      preenchimento: false,
      torniquete: false,
      hemorragiaDireta: '',
    },

    viasAereas: {
      pervias: false,
      obstruidas: false,
      parcialmenteObstruidas: false,
      aspiracao: false,
      guedel: false,
      intubacao: false,
      cricotireoidostomia: false,
    },

    controleColuna: {
      colarCervical: false,
      talas: false,
      protetorLateral: false,
      headBlock: false,
      prancha: false,
    },

    respiracao: {
      padrao: null,
      suporte: null,
      fio2: '',
      tot: '',
    },
  },

  avaliacaoSecundaria: {
    sinaisVitais: {
      pa: '',
      fc: '',
      fr: '',
      spo2: '',
      tax: '',
      glicemia: '',
    },

    sampla: {
      temAlergia: null,
      alergiaQual: '',
      medicacoes: '',
      passadoMedico: '',
      liquidosAlimentos: '',
    },

    balancoSuporte: {
      viaAdministracao: null,
      solucao: null,
      sedacao: '',
      dva: '',

      saidas: {
        vomito: '',
        evacuacao: '',
        sangue: '',
        diurese: '',
      },
    },
  },

  glasgow: {
    ocular: null,
    verbal: null,
    motor: null,
    pupilar: null,
  },

  rass: {
    score: null,
  },

  trips: {
    temperatura: null,
    pressaoSistolica: null,
    estadoNeurologico: null,
    statusRespiratorio: null,
  },

  traumaQueimaduras: {
    mecanismo: '',
    lesoes: [],
    scqTotal: '',
    grauQueimadura: null,
    observacoes: '',
  },

  morse: {
    historicoQuedas: null,
    diagnosticoSecundario: null,
    auxilioDeambulacao: null,
    terapiaEndovenosa: null,
    marcha: null,
    estadoMental: null,
  },

  diagnosticosIntervencoes: {
    diagnosticos: [],
    outrosDiagnosticos: '',

    intervencoes: [],
    outrasIntervencoes: '',
  },

  finalizacao: {
    nomeProfissional: '',
    corenMatricula: '',
  },
};