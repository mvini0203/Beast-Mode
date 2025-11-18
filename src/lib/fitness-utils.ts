// Tipos e interfaces
export type Objetivo = 'perder-peso' | 'ganhar-massa' | 'definicao' | 'saude-geral';
export type Nivel = 'iniciante' | 'intermediario' | 'avancado';
export type Genero = 'masculino' | 'feminino';

export interface DadosUsuario {
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  genero: Genero;
  objetivo: Objetivo;
  nivel: Nivel;
  diasTreino: number;
}

// Cálculo de água diária (ml)
export function calcularAguaDiaria(peso: number, objetivo: Objetivo): number {
  const baseAgua = peso * 35; // 35ml por kg (padrão)
  
  const multiplicadores: Record<Objetivo, number> = {
    'perder-peso': 1.2,
    'ganhar-massa': 1.3,
    'definicao': 1.25,
    'saude-geral': 1.0
  };
  
  return Math.round(baseAgua * multiplicadores[objetivo]);
}

// Cálculo de TMB (Taxa Metabólica Basal) - Fórmula de Harris-Benedict
export function calcularTMB(dados: DadosUsuario): number {
  const { peso, altura, idade, genero } = dados;
  
  if (genero === 'masculino') {
    return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
  } else {
    return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
  }
}

// Cálculo de calorias diárias
export function calcularCaloriasDiarias(dados: DadosUsuario): number {
  const tmb = calcularTMB(dados);
  
  // Fator de atividade baseado em dias de treino
  const fatoresAtividade: Record<number, number> = {
    0: 1.2,   // sedentário
    1: 1.2,
    2: 1.375, // levemente ativo
    3: 1.375,
    4: 1.55,  // moderadamente ativo
    5: 1.55,
    6: 1.725, // muito ativo
    7: 1.725
  };
  
  const fatorAtividade = fatoresAtividade[dados.diasTreino] || 1.55;
  const caloriasMantencao = tmb * fatorAtividade;
  
  // Ajuste por objetivo
  const ajustes: Record<Objetivo, number> = {
    'perder-peso': -500,
    'ganhar-massa': 300,
    'definicao': -200,
    'saude-geral': 0
  };
  
  return Math.round(caloriasMantencao + ajustes[dados.objetivo]);
}

// Distribuição de macronutrientes
export function calcularMacros(calorias: number, objetivo: Objetivo) {
  const distribuicoes: Record<Objetivo, { proteina: number; carboidrato: number; gordura: number }> = {
    'perder-peso': { proteina: 0.35, carboidrato: 0.30, gordura: 0.35 },
    'ganhar-massa': { proteina: 0.30, carboidrato: 0.45, gordura: 0.25 },
    'definicao': { proteina: 0.40, carboidrato: 0.35, gordura: 0.25 },
    'saude-geral': { proteina: 0.30, carboidrato: 0.40, gordura: 0.30 }
  };
  
  const dist = distribuicoes[objetivo];
  
  return {
    proteina: Math.round((calorias * dist.proteina) / 4), // 4 cal/g
    carboidrato: Math.round((calorias * dist.carboidrato) / 4), // 4 cal/g
    gordura: Math.round((calorias * dist.gordura) / 9) // 9 cal/g
  };
}

// Gerador de treino personalizado
export function gerarTreino(dados: DadosUsuario) {
  const { nivel, objetivo, diasTreino } = dados;
  
  const treinosPorDias: Record<number, any> = {
    3: {
      titulo: 'Treino ABC - 3x por semana',
      divisao: [
        {
          dia: 'A - Peito, Ombro e Tríceps',
          exercicios: [
            { nome: 'Supino reto', series: nivel === 'iniciante' ? '3x12' : nivel === 'intermediario' ? '4x10' : '4x8', descanso: '90s' },
            { nome: 'Supino inclinado', series: nivel === 'iniciante' ? '3x12' : '3x10', descanso: '90s' },
            { nome: 'Desenvolvimento com halteres', series: '3x12', descanso: '60s' },
            { nome: 'Elevação lateral', series: '3x15', descanso: '45s' },
            { nome: 'Tríceps na polia', series: '3x12', descanso: '45s' },
            { nome: 'Tríceps testa', series: '3x12', descanso: '60s' }
          ]
        },
        {
          dia: 'B - Costas e Bíceps',
          exercicios: [
            { nome: 'Barra fixa (ou puxada)', series: nivel === 'iniciante' ? '3x8' : '4x10', descanso: '90s' },
            { nome: 'Remada curvada', series: '4x10', descanso: '90s' },
            { nome: 'Remada cavalinho', series: '3x12', descanso: '60s' },
            { nome: 'Pulldown', series: '3x12', descanso: '60s' },
            { nome: 'Rosca direta', series: '3x12', descanso: '45s' },
            { nome: 'Rosca martelo', series: '3x12', descanso: '45s' }
          ]
        },
        {
          dia: 'C - Pernas e Abdômen',
          exercicios: [
            { nome: 'Agachamento livre', series: nivel === 'iniciante' ? '3x12' : '4x10', descanso: '120s' },
            { nome: 'Leg press 45°', series: '4x12', descanso: '90s' },
            { nome: 'Cadeira extensora', series: '3x15', descanso: '60s' },
            { nome: 'Cadeira flexora', series: '3x15', descanso: '60s' },
            { nome: 'Panturrilha em pé', series: '4x20', descanso: '45s' },
            { nome: 'Abdominal supra', series: '4x20', descanso: '30s' }
          ]
        }
      ]
    },
    4: {
      titulo: 'Treino ABCD - 4x por semana',
      divisao: [
        {
          dia: 'A - Peito e Tríceps',
          exercicios: [
            { nome: 'Supino reto', series: '4x10', descanso: '90s' },
            { nome: 'Supino inclinado', series: '4x10', descanso: '90s' },
            { nome: 'Crucifixo', series: '3x12', descanso: '60s' },
            { nome: 'Tríceps na polia', series: '3x12', descanso: '45s' },
            { nome: 'Tríceps francês', series: '3x12', descanso: '60s' }
          ]
        },
        {
          dia: 'B - Costas e Bíceps',
          exercicios: [
            { nome: 'Barra fixa', series: '4x8', descanso: '90s' },
            { nome: 'Remada curvada', series: '4x10', descanso: '90s' },
            { nome: 'Pulldown', series: '3x12', descanso: '60s' },
            { nome: 'Rosca direta', series: '3x12', descanso: '45s' },
            { nome: 'Rosca martelo', series: '3x12', descanso: '45s' }
          ]
        },
        {
          dia: 'C - Ombro e Abdômen',
          exercicios: [
            { nome: 'Desenvolvimento militar', series: '4x10', descanso: '90s' },
            { nome: 'Elevação lateral', series: '4x12', descanso: '60s' },
            { nome: 'Elevação frontal', series: '3x12', descanso: '60s' },
            { nome: 'Crucifixo invertido', series: '3x15', descanso: '60s' },
            { nome: 'Abdominal supra', series: '4x20', descanso: '30s' }
          ]
        },
        {
          dia: 'D - Pernas',
          exercicios: [
            { nome: 'Agachamento livre', series: '4x10', descanso: '120s' },
            { nome: 'Leg press', series: '4x12', descanso: '90s' },
            { nome: 'Cadeira extensora', series: '3x15', descanso: '60s' },
            { nome: 'Stiff', series: '3x12', descanso: '90s' },
            { nome: 'Panturrilha', series: '4x20', descanso: '45s' }
          ]
        }
      ]
    },
    5: {
      titulo: 'Treino 5x por semana - Foco Hipertrofia',
      divisao: [
        {
          dia: 'Dia 1 - Peito',
          exercicios: [
            { nome: 'Supino reto', series: '4x8-10', descanso: '90s' },
            { nome: 'Supino inclinado', series: '4x10', descanso: '90s' },
            { nome: 'Crucifixo inclinado', series: '3x12', descanso: '60s' },
            { nome: 'Crossover', series: '3x15', descanso: '45s' },
            { nome: 'Flexão diamante', series: '3x máx', descanso: '60s' }
          ]
        },
        {
          dia: 'Dia 2 - Costas',
          exercicios: [
            { nome: 'Barra fixa', series: '4x8', descanso: '90s' },
            { nome: 'Remada curvada', series: '4x10', descanso: '90s' },
            { nome: 'Remada cavalinho', series: '3x12', descanso: '60s' },
            { nome: 'Pulldown', series: '3x12', descanso: '60s' },
            { nome: 'Remada unilateral', series: '3x12', descanso: '60s' }
          ]
        },
        {
          dia: 'Dia 3 - Pernas',
          exercicios: [
            { nome: 'Agachamento livre', series: '4x8-10', descanso: '120s' },
            { nome: 'Leg press', series: '4x12', descanso: '90s' },
            { nome: 'Cadeira extensora', series: '4x15', descanso: '60s' },
            { nome: 'Stiff', series: '4x10', descanso: '90s' },
            { nome: 'Panturrilha', series: '5x20', descanso: '45s' }
          ]
        },
        {
          dia: 'Dia 4 - Ombro e Trapézio',
          exercicios: [
            { nome: 'Desenvolvimento militar', series: '4x10', descanso: '90s' },
            { nome: 'Elevação lateral', series: '4x12', descanso: '60s' },
            { nome: 'Elevação frontal', series: '3x12', descanso: '60s' },
            { nome: 'Crucifixo invertido', series: '4x15', descanso: '60s' },
            { nome: 'Encolhimento', series: '4x15', descanso: '60s' }
          ]
        },
        {
          dia: 'Dia 5 - Braços e Abdômen',
          exercicios: [
            { nome: 'Rosca direta', series: '4x10', descanso: '60s' },
            { nome: 'Rosca martelo', series: '4x12', descanso: '60s' },
            { nome: 'Rosca concentrada', series: '3x12', descanso: '45s' },
            { nome: 'Tríceps testa', series: '4x10', descanso: '60s' },
            { nome: 'Tríceps na polia', series: '4x12', descanso: '45s' },
            { nome: 'Abdominal completo', series: '4x20', descanso: '30s' }
          ]
        }
      ]
    }
  };
  
  // Se não tiver treino específico, usa o de 4 dias
  const treinoBase = treinosPorDias[diasTreino] || treinosPorDias[4];
  
  return {
    ...treinoBase,
    observacoes: gerarObservacoesTreino(objetivo, nivel)
  };
}

function gerarObservacoesTreino(objetivo: Objetivo, nivel: Nivel): string[] {
  const obs: string[] = [];
  
  if (nivel === 'iniciante') {
    obs.push('⚠️ Foque na execução correta antes de aumentar a carga');
    obs.push('📝 Anote suas cargas para acompanhar evolução');
  }
  
  if (objetivo === 'perder-peso') {
    obs.push('🔥 Adicione 20-30min de cardio após o treino');
    obs.push('⏱️ Reduza o tempo de descanso entre séries (45-60s)');
  }
  
  if (objetivo === 'ganhar-massa') {
    obs.push('💪 Priorize cargas progressivas a cada semana');
    obs.push('🍽️ Não pule refeições pós-treino');
  }
  
  obs.push('💧 Mantenha-se hidratado durante o treino');
  obs.push('😴 Durma pelo menos 7-8 horas por noite');
  
  return obs;
}

// Plano alimentar
export function gerarPlanoAlimentar(dados: DadosUsuario) {
  const calorias = calcularCaloriasDiarias(dados);
  const macros = calcularMacros(calorias, dados.objetivo);
  
  const refeicoesPorObjetivo: Record<Objetivo, any> = {
    'perder-peso': {
      cafe: {
        horario: '07:00 - 08:00',
        opcoes: [
          '2 ovos mexidos + 1 fatia de pão integral + café sem açúcar',
          'Omelete (2 ovos) com vegetais + chá verde',
          'Iogurte grego (200g) + granola light (30g) + frutas vermelhas'
        ]
      },
      lanche1: {
        horario: '10:00 - 10:30',
        opcoes: [
          '1 fruta (maçã ou pera) + 10 castanhas',
          'Whey protein + 1 banana',
          'Iogurte natural + chia (1 colher)'
        ]
      },
      almoco: {
        horario: '12:00 - 13:00',
        opcoes: [
          'Peito de frango grelhado (150g) + arroz integral (3 col) + brócolis + salada',
          'Peixe grelhado (180g) + batata doce (100g) + legumes',
          'Carne magra (150g) + quinoa (3 col) + vegetais'
        ]
      },
      lanche2: {
        horario: '16:00 - 16:30',
        opcoes: [
          'Pasta de amendoim (1 col) + 1 banana',
          'Queijo cottage (100g) + torradas integrais',
          'Shake de whey + aveia'
        ]
      },
      jantar: {
        horario: '19:00 - 20:00',
        opcoes: [
          'Omelete (3 claras + 1 gema) + salada verde',
          'Peixe grelhado (150g) + legumes no vapor',
          'Frango desfiado (150g) + sopa de legumes'
        ]
      }
    },
    'ganhar-massa': {
      cafe: {
        horario: '07:00 - 08:00',
        opcoes: [
          '4 ovos mexidos + 2 fatias de pão integral + abacate + suco natural',
          'Panqueca de aveia (100g) + mel + pasta de amendoim',
          'Tapioca recheada com frango + queijo + suco'
        ]
      },
      lanche1: {
        horario: '10:00 - 10:30',
        opcoes: [
          'Vitamina: whey + banana + aveia + pasta de amendoim',
          'Sanduíche natural de frango + suco',
          'Iogurte integral + granola + mel'
        ]
      },
      almoco: {
        horario: '12:00 - 13:00',
        opcoes: [
          'Carne vermelha (200g) + arroz (5 col) + feijão + batata + salada',
          'Frango (200g) + macarrão integral + molho + legumes',
          'Peixe (200g) + arroz + batata doce + vegetais'
        ]
      },
      lanche2: {
        horario: '16:00 - 16:30',
        opcoes: [
          'Pão integral + atum + queijo + suco',
          'Batata doce (200g) + whey protein',
          'Tapioca + frango desfiado + queijo'
        ]
      },
      jantar: {
        horario: '19:00 - 20:00',
        opcoes: [
          'Carne (180g) + arroz integral (4 col) + legumes',
          'Frango (200g) + batata doce (150g) + salada',
          'Peixe (200g) + quinoa + vegetais'
        ]
      },
      ceia: {
        horario: '22:00 - 23:00',
        opcoes: [
          'Caseína ou iogurte grego (200g) + pasta de amendoim',
          'Queijo cottage (150g) + castanhas',
          'Omelete de claras + abacate'
        ]
      }
    },
    'definicao': {
      cafe: {
        horario: '07:00 - 08:00',
        opcoes: [
          '3 ovos (2 inteiros + 1 clara) + aveia (30g) + café',
          'Omelete de claras + 1 fatia de pão integral + chá verde',
          'Iogurte grego + whey + frutas vermelhas'
        ]
      },
      lanche1: {
        horario: '10:00 - 10:30',
        opcoes: [
          'Whey protein + 1 fruta',
          'Castanhas (15 unidades) + 1 maçã',
          'Iogurte natural + chia'
        ]
      },
      almoco: {
        horario: '12:00 - 13:00',
        opcoes: [
          'Peito de frango (180g) + arroz integral (4 col) + brócolis + salada',
          'Peixe (200g) + batata doce (120g) + aspargos',
          'Carne magra (180g) + quinoa (4 col) + vegetais'
        ]
      },
      lanche2: {
        horario: '16:00 - 16:30',
        opcoes: [
          'Batata doce (100g) + whey protein',
          'Pasta de amendoim (1 col) + torradas integrais',
          'Queijo cottage + frutas'
        ]
      },
      jantar: {
        horario: '19:00 - 20:00',
        opcoes: [
          'Frango grelhado (180g) + salada grande + azeite',
          'Peixe (180g) + legumes no vapor',
          'Omelete (3 claras + 1 gema) + vegetais'
        ]
      }
    },
    'saude-geral': {
      cafe: {
        horario: '07:00 - 08:00',
        opcoes: [
          '2 ovos + 1 fatia de pão integral + fruta + café',
          'Tapioca com queijo + suco natural',
          'Iogurte + granola + frutas'
        ]
      },
      lanche1: {
        horario: '10:00 - 10:30',
        opcoes: [
          '1 fruta + castanhas',
          'Iogurte natural',
          'Vitamina de frutas'
        ]
      },
      almoco: {
        horario: '12:00 - 13:00',
        opcoes: [
          'Proteína (150g) + arroz (4 col) + feijão + salada',
          'Peixe + batata + legumes',
          'Frango + macarrão integral + vegetais'
        ]
      },
      lanche2: {
        horario: '16:00 - 16:30',
        opcoes: [
          'Pão integral + queijo + suco',
          'Frutas + castanhas',
          'Iogurte + aveia'
        ]
      },
      jantar: {
        horario: '19:00 - 20:00',
        opcoes: [
          'Sopa de legumes + proteína',
          'Salada completa + frango',
          'Omelete + vegetais'
        ]
      }
    }
  };
  
  return {
    calorias,
    macros,
    refeicoes: refeicoesPorObjetivo[dados.objetivo],
    dicas: gerarDicasAlimentacao(dados.objetivo)
  };
}

function gerarDicasAlimentacao(objetivo: Objetivo): string[] {
  const dicasBase = [
    '💧 Beba água ao longo do dia',
    '🥗 Priorize alimentos naturais e minimamente processados',
    '⏰ Mantenha horários regulares de refeições'
  ];
  
  const dicasPorObjetivo: Record<Objetivo, string[]> = {
    'perder-peso': [
      '🔥 Evite alimentos ultraprocessados e açúcares',
      '🍽️ Controle as porções',
      '🚫 Evite comer 3h antes de dormir'
    ],
    'ganhar-massa': [
      '💪 Não pule refeições, especialmente pós-treino',
      '🍚 Aumente gradualmente a ingestão de carboidratos',
      '🥩 Consuma proteína em todas as refeições'
    ],
    'definicao': [
      '⚖️ Pese e meça os alimentos para controle preciso',
      '🥦 Aumente o consumo de vegetais',
      '🍖 Mantenha proteína alta'
    ],
    'saude-geral': [
      '🌈 Varie as cores dos alimentos no prato',
      '🥗 Inclua vegetais em todas as refeições',
      '🍎 Prefira frutas inteiras a sucos'
    ]
  };
  
  return [...dicasBase, ...dicasPorObjetivo[objetivo]];
}

// Suplementação recomendada
export function gerarSuplementacao(dados: DadosUsuario) {
  const { objetivo, nivel } = dados;
  
  const suplementosBase = [
    {
      nome: 'Whey Protein',
      dosagem: '30g após treino',
      beneficio: 'Recuperação muscular e síntese proteica',
      prioridade: 'Alta'
    },
    {
      nome: 'Creatina',
      dosagem: '5g por dia (qualquer horário)',
      beneficio: 'Aumento de força e volume muscular',
      prioridade: 'Alta'
    },
    {
      nome: 'Multivitamínico',
      dosagem: '1 dose pela manhã',
      beneficio: 'Suprir possíveis deficiências nutricionais',
      prioridade: 'Média'
    },
    {
      nome: 'Ômega 3',
      dosagem: '2-3g por dia',
      beneficio: 'Saúde cardiovascular e anti-inflamatório',
      prioridade: 'Média'
    }
  ];
  
  const suplementosAdicionais: Record<Objetivo, any[]> = {
    'perder-peso': [
      {
        nome: 'Termogênico (Cafeína)',
        dosagem: '200-400mg antes do treino',
        beneficio: 'Aumento do metabolismo e energia',
        prioridade: 'Média',
        observacao: '⚠️ Evite após 16h para não afetar o sono'
      },
      {
        nome: 'CLA (Ácido Linoleico Conjugado)',
        dosagem: '3-6g por dia',
        beneficio: 'Auxilia na queima de gordura',
        prioridade: 'Baixa'
      }
    ],
    'ganhar-massa': [
      {
        nome: 'Hipercalórico (Mass Gainer)',
        dosagem: '1 dose entre refeições',
        beneficio: 'Facilita atingir superávit calórico',
        prioridade: 'Média'
      },
      {
        nome: 'BCAA',
        dosagem: '5-10g durante treino',
        beneficio: 'Reduz catabolismo muscular',
        prioridade: 'Baixa'
      },
      {
        nome: 'Glutamina',
        dosagem: '5g pós-treino',
        beneficio: 'Recuperação e sistema imunológico',
        prioridade: 'Baixa'
      }
    ],
    'definicao': [
      {
        nome: 'Termogênico',
        dosagem: '200-400mg antes do treino',
        beneficio: 'Energia e queima de gordura',
        prioridade: 'Média'
      },
      {
        nome: 'L-Carnitina',
        dosagem: '2g antes do treino',
        beneficio: 'Transporte de gordura para energia',
        prioridade: 'Baixa'
      }
    ],
    'saude-geral': [
      {
        nome: 'Vitamina D',
        dosagem: '2000-4000 UI por dia',
        beneficio: 'Saúde óssea e imunológica',
        prioridade: 'Alta'
      }
    ]
  };
  
  return {
    essenciais: suplementosBase,
    especificos: suplementosAdicionais[objetivo],
    observacoes: [
      '⚠️ Suplementos não substituem uma alimentação equilibrada',
      '👨‍⚕️ Consulte um nutricionista antes de iniciar suplementação',
      '💊 Compre apenas de marcas confiáveis e certificadas',
      '📊 Faça exames periódicos para avaliar necessidades'
    ]
  };
}

// Orientações sobre anabolizantes (EDUCACIONAL E DE SEGURANÇA)
export function gerarOrientacoesAnabolizantes() {
  return {
    avisoImportante: '⚠️ ATENÇÃO: O uso de esteroides anabolizantes sem prescrição médica é ilegal e perigoso. Esta seção é apenas educacional.',
    
    riscos: [
      '❌ Danos hepáticos e renais',
      '❌ Problemas cardiovasculares (hipertensão, infarto)',
      '❌ Alterações hormonais (ginecomastia, atrofia testicular)',
      '❌ Problemas psicológicos (agressividade, depressão)',
      '❌ Acne severa e queda de cabelo',
      '❌ Dependência química'
    ],
    
    examesObrigatorios: [
      {
        nome: 'Hemograma Completo',
        frequencia: 'A cada 3 meses',
        motivo: 'Avaliar células sanguíneas e possível policitemia'
      },
      {
        nome: 'Perfil Lipídico',
        frequencia: 'A cada 3 meses',
        motivo: 'Monitorar colesterol e triglicerídeos'
      },
      {
        nome: 'Função Hepática (TGO, TGP, GGT)',
        frequencia: 'A cada 3 meses',
        motivo: 'Detectar danos no fígado'
      },
      {
        nome: 'Função Renal (Ureia, Creatinina)',
        frequencia: 'A cada 3 meses',
        motivo: 'Avaliar saúde dos rins'
      },
      {
        nome: 'Perfil Hormonal (Testosterona, Estradiol, LH, FSH)',
        frequencia: 'A cada 3-6 meses',
        motivo: 'Monitorar eixo hormonal'
      },
      {
        nome: 'PSA (Antígeno Prostático)',
        frequencia: 'A cada 6 meses (homens >40 anos)',
        motivo: 'Detectar problemas na próstata'
      }
    ],
    
    protecaoHepatica: [
      {
        nome: 'Silimarina (Cardo Mariano)',
        dosagem: '200-400mg por dia',
        funcao: 'Proteção hepática'
      },
      {
        nome: 'NAC (N-Acetilcisteína)',
        dosagem: '600-1200mg por dia',
        funcao: 'Antioxidante e proteção hepática'
      },
      {
        nome: 'TUDCA',
        dosagem: '500-1000mg por dia',
        funcao: 'Proteção hepática avançada'
      }
    ],
    
    tpc: {
      titulo: 'TPC - Terapia Pós-Ciclo (ESSENCIAL)',
      importancia: 'Fundamental para recuperar produção natural de testosterona',
      medicamentos: [
        {
          nome: 'Tamoxifeno (Nolvadex)',
          protocolo: '40mg/dia (semana 1-2), 20mg/dia (semana 3-4)',
          funcao: 'Bloqueador de estrogênio'
        },
        {
          nome: 'Clomifeno (Clomid)',
          protocolo: '50mg/dia por 4 semanas',
          funcao: 'Estimula produção de testosterona'
        },
        {
          nome: 'HCG (Gonadotrofina)',
          protocolo: '500-1000 UI, 2x por semana (últimas 2 semanas do ciclo)',
          funcao: 'Previne atrofia testicular'
        }
      ]
    },
    
    alternativasNaturais: [
      '🌿 Tribulus Terrestris - Estimula testosterona naturalmente',
      '🌿 Ashwagandha - Reduz cortisol e aumenta testosterona',
      '🌿 Feno-grego - Suporte hormonal natural',
      '🌿 Zinco e Magnésio (ZMA) - Essenciais para produção hormonal',
      '🌿 Vitamina D - Fundamental para testosterona',
      '💪 Treinamento intenso e sono adequado - Base natural'
    ],
    
    recomendacaoFinal: '👨‍⚕️ PROCURE UM ENDOCRINOLOGISTA ESPECIALIZADO. Nunca se automedique. Os riscos são reais e podem ser irreversíveis.'
  };
}

// Horários de notificação de água
export function gerarHorariosAgua(quantidadeTotal: number): string[] {
  const coposPorDia = Math.ceil(quantidadeTotal / 250); // 250ml por copo
  const horarios: string[] = [];
  
  // Distribuir ao longo do dia (7h às 22h)
  const horaInicio = 7;
  const horaFim = 22;
  const intervalo = (horaFim - horaInicio) / coposPorDia;
  
  for (let i = 0; i < coposPorDia; i++) {
    const hora = Math.floor(horaInicio + (intervalo * i));
    const minuto = Math.floor((intervalo * i % 1) * 60);
    horarios.push(`${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`);
  }
  
  return horarios;
}
