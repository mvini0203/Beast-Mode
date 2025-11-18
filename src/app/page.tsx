'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dumbbell, 
  Utensils, 
  Droplets, 
  Moon, 
  Pill, 
  Flame,
  Target,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Crown,
  Syringe,
  Calendar,
  Plus,
  Trash2,
  Camera,
  Upload,
  Loader2,
  Lock,
  Shield,
  Activity,
  Sparkles,
  Zap
} from 'lucide-react';
import type { DadosUsuario } from '@/lib/fitness-utils';
import {
  calcularAguaDiaria,
  calcularCaloriasDiarias,
  calcularMacros,
  gerarTreino,
  gerarPlanoAlimentar,
  gerarSuplementacao,
  gerarOrientacoesAnabolizantes,
  gerarHorariosAgua
} from '@/lib/fitness-utils';

interface CicloAnabolizante {
  id: string;
  nome: string;
  dosagem: string;
  frequencia: string;
  dataInicio: string;
  duracao: number; // em semanas
  observacoes?: string;
}

interface ProtocoloAnabolizante {
  nome: string;
  tipo: string;
  dosagem: string;
  frequencia: string;
  duracao: string;
  objetivo: string;
  nivel: string;
  observacoes: string[];
}

export default function Home() {
  const router = useRouter();
  const [dados, setDados] = useState<DadosUsuario | null>(null);
  const [aguaConsumida, setAguaConsumida] = useState(0);
  const [horaAtual, setHoraAtual] = useState('');
  const [isVIP, setIsVIP] = useState(false);
  const [ciclos, setCiclos] = useState<CicloAnabolizante[]>([]);
  const [novoCiclo, setNovoCiclo] = useState<Partial<CicloAnabolizante>>({});
  const [mostrarFormCiclo, setMostrarFormCiclo] = useState(false);
  const [imagemComida, setImagemComida] = useState<string | null>(null);
  const [analisandoComida, setAnalisandoComida] = useState(false);
  const [resultadoAnalise, setResultadoAnalise] = useState<any>(null);

  // Protocolos de anabolizantes (VIP)
  const protocolosAnabolizantes: ProtocoloAnabolizante[] = [
    {
      nome: "Ciclo Iniciante - Testosterona",
      tipo: "Testosterona Enantato",
      dosagem: "250-500mg",
      frequencia: "2x por semana",
      duracao: "10-12 semanas",
      objetivo: "Ganho de massa muscular",
      nivel: "Iniciante",
      observacoes: [
        "Ideal para primeiro ciclo",
        "Ganhos sólidos e duradouros",
        "Menor risco de efeitos colaterais",
        "TPC obrigatória após o ciclo"
      ]
    },
    {
      nome: "Ciclo Intermediário - Testo + Deca",
      tipo: "Testosterona + Nandrolona (Deca)",
      dosagem: "500mg Testo + 400mg Deca",
      frequencia: "2x por semana cada",
      duracao: "12-14 semanas",
      objetivo: "Ganho de massa e força",
      nivel: "Intermediário",
      observacoes: [
        "Excelente para volume muscular",
        "Melhora recuperação articular",
        "Requer controle de prolactina",
        "TPC mais longa necessária"
      ]
    },
    {
      nome: "Ciclo Cutting - Testo + Trembolona",
      tipo: "Testosterona + Trembolona",
      dosagem: "300mg Testo + 200-300mg Trem",
      frequencia: "EOD (dia sim, dia não)",
      duracao: "8-10 semanas",
      objetivo: "Definição muscular",
      nivel: "Avançado",
      observacoes: [
        "Máxima definição e dureza muscular",
        "Queima de gordura acelerada",
        "Efeitos colaterais mais intensos",
        "Apenas para usuários experientes"
      ]
    },
    {
      nome: "Ciclo Oral - Oxandrolona",
      tipo: "Oxandrolona (Anavar)",
      dosagem: "40-80mg",
      frequencia: "Diário (dividido em 2 doses)",
      duracao: "6-8 semanas",
      objetivo: "Definição e força",
      nivel: "Iniciante/Intermediário",
      observacoes: [
        "Ideal para cutting e definição",
        "Menos supressão que injetáveis",
        "Protetor hepático obrigatório",
        "Bom para mulheres (doses menores)"
      ]
    },
    {
      nome: "Ciclo Avançado - Testo + Trem + Masteron",
      tipo: "Testosterona + Trembolona + Masteron",
      dosagem: "400mg Testo + 300mg Trem + 400mg Mast",
      frequencia: "EOD para todos",
      duracao: "10-12 semanas",
      objetivo: "Competição/Definição extrema",
      nivel: "Avançado",
      observacoes: [
        "Máxima definição e vascularização",
        "Apenas para competidores",
        "Monitoramento médico essencial",
        "Efeitos colaterais significativos"
      ]
    }
  ];

  const protocolosTPC = [
    {
      nome: "TPC Básica (Ciclos Leves)",
      protocolo: [
        "Semana 1-2: Tamoxifeno 40mg/dia",
        "Semana 3-4: Tamoxifeno 20mg/dia",
        "HCG opcional: 500ui 2x/semana nas últimas 2 semanas do ciclo"
      ],
      indicacao: "Ciclos de testosterona até 500mg/semana"
    },
    {
      nome: "TPC Intermediária",
      protocolo: [
        "Semana 1-2: Clomifeno 100mg/dia + Tamoxifeno 40mg/dia",
        "Semana 3-4: Clomifeno 50mg/dia + Tamoxifeno 20mg/dia",
        "HCG: 1000ui 2x/semana nas últimas 3 semanas do ciclo"
      ],
      indicacao: "Ciclos com Deca, Trem ou doses altas de testosterona"
    },
    {
      nome: "TPC Avançada (Ciclos Pesados)",
      protocolo: [
        "Semana 1: Clomifeno 150mg/dia + Tamoxifeno 60mg/dia",
        "Semana 2-3: Clomifeno 100mg/dia + Tamoxifeno 40mg/dia",
        "Semana 4-5: Clomifeno 50mg/dia + Tamoxifeno 20mg/dia",
        "HCG: 1500ui 2x/semana nas últimas 4 semanas do ciclo"
      ],
      indicacao: "Ciclos longos (>12 semanas) ou com múltiplos compostos"
    }
  ];

  const dicasAnabolizantes = [
    {
      titulo: "Exames Pré-Ciclo Obrigatórios",
      itens: [
        "Hemograma completo",
        "Perfil lipídico (colesterol total, HDL, LDL, triglicerídeos)",
        "Função hepática (TGO, TGP, GGT)",
        "Função renal (ureia, creatinina)",
        "Hormônios (testosterona total e livre, estradiol, prolactina)",
        "PSA (homens acima de 40 anos)"
      ]
    },
    {
      titulo: "Proteção Durante o Ciclo",
      itens: [
        "Protetor hepático: Silimarina 300mg/dia ou TUDCA 500mg/dia",
        "Controle de estrogênio: Anastrozol 0.5mg 2x/semana (se necessário)",
        "Controle de prolactina: Cabergolina 0.25mg 2x/semana (se usar Deca/Trem)",
        "Suporte cardiovascular: Omega 3, CoQ10, Citrus Bergamot",
        "Pressão arterial: Monitore diariamente"
      ]
    },
    {
      titulo: "Sinais de Alerta - Pare Imediatamente",
      itens: [
        "Dor no peito ou falta de ar",
        "Pressão arterial acima de 140/90 persistente",
        "Icterícia (pele/olhos amarelados)",
        "Urina muito escura",
        "Ginecomastia (crescimento de mama masculina)",
        "Alterações psicológicas graves (agressividade extrema, depressão)"
      ]
    },
    {
      titulo: "Otimizando Resultados",
      itens: [
        "Dieta hipercalórica: +500 kcal acima da manutenção",
        "Proteína: 2.5-3g por kg de peso corporal",
        "Treino: Volume alto, 5-6x por semana",
        "Sono: Mínimo 8 horas por noite",
        "Hidratação: Mínimo 4L de água por dia",
        "Cardio: 20-30min 3x/semana para saúde cardiovascular"
      ]
    }
  ];

  useEffect(() => {
    // Verificar se tem dados salvos
    const dadosSalvos = localStorage.getItem('dadosUsuario');
    if (!dadosSalvos) {
      router.push('/onboarding');
      return;
    }
    setDados(JSON.parse(dadosSalvos));

    // Verificar status VIP
    const vipStatus = localStorage.getItem('isVIP');
    setIsVIP(vipStatus === 'true');

    // Carregar ciclos salvos
    const ciclosSalvos = localStorage.getItem('ciclosAnabolizantes');
    if (ciclosSalvos) {
      setCiclos(JSON.parse(ciclosSalvos));
    }

    // Atualizar hora atual
    const updateTime = () => {
      const now = new Date();
      setHoraAtual(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [router]);

  const adicionarCiclo = () => {
    if (!novoCiclo.nome || !novoCiclo.dosagem || !novoCiclo.frequencia || !novoCiclo.dataInicio || !novoCiclo.duracao) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const ciclo: CicloAnabolizante = {
      id: Date.now().toString(),
      nome: novoCiclo.nome,
      dosagem: novoCiclo.dosagem,
      frequencia: novoCiclo.frequencia,
      dataInicio: novoCiclo.dataInicio,
      duracao: novoCiclo.duracao,
      observacoes: novoCiclo.observacoes
    };

    const novosCiclos = [...ciclos, ciclo];
    setCiclos(novosCiclos);
    localStorage.setItem('ciclosAnabolizantes', JSON.stringify(novosCiclos));
    setNovoCiclo({});
    setMostrarFormCiclo(false);
  };

  const removerCiclo = (id: string) => {
    const novosCiclos = ciclos.filter(c => c.id !== id);
    setCiclos(novosCiclos);
    localStorage.setItem('ciclosAnabolizantes', JSON.stringify(novosCiclos));
  };

  const calcularDiasRestantes = (dataInicio: string, duracao: number) => {
    const inicio = new Date(dataInicio);
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + (duracao * 7));
    const hoje = new Date();
    const diff = Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const ativarVIP = () => {
    setIsVIP(true);
    localStorage.setItem('isVIP', 'true');
  };

  const handleImagemComida = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Converter para base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImagemComida(base64);
      setAnalisandoComida(true);
      setResultadoAnalise(null);

      try {
        // Chamar API para analisar imagem
        const response = await fetch('/api/analisar-comida', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagem: base64 })
        });

        const resultado = await response.json();
        setResultadoAnalise(resultado);
      } catch (error) {
        console.error('Erro ao analisar comida:', error);
        setResultadoAnalise({
          erro: 'Não foi possível analisar a imagem. Tente novamente.'
        });
      } finally {
        setAnalisandoComida(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!dados) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const aguaTotal = calcularAguaDiaria(dados.peso, dados.objetivo);
  const calorias = calcularCaloriasDiarias(dados);
  const macros = calcularMacros(calorias, dados.objetivo);
  const treino = gerarTreino(dados);
  const planoAlimentar = gerarPlanoAlimentar(dados);
  const suplementacao = gerarSuplementacao(dados);
  const orientacoesAnabolizantes = gerarOrientacoesAnabolizantes();
  const horariosAgua = gerarHorariosAgua(aguaTotal);

  const objetivoLabels = {
    'perder-peso': 'Perder Peso',
    'ganhar-massa': 'Ganhar Massa',
    'definicao': 'Definição',
    'saude-geral': 'Saúde Geral'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-xl border-b-4 border-green-400 sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 p-3 rounded-xl shadow-2xl shadow-green-500/50 animate-pulse">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
                  BEAST MODE
                </h1>
                <p className="text-sm text-green-200 font-bold">Transforme-se em uma MÁQUINA 🔥</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isVIP && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
                  <Badge className="relative bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 text-black font-black text-base px-6 py-2 shadow-2xl border-2 border-green-300">
                    <Crown className="w-5 h-5 mr-2 animate-bounce" />
                    VIP ATIVO
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Badge>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('dadosUsuario');
                  router.push('/onboarding');
                }}
                className="border-2 border-green-400 text-green-300 hover:bg-green-400 hover:text-black font-bold"
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl shadow-green-500/50 transform hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{objetivoLabels[dados.objetivo]}</div>
              <p className="text-xs text-green-100 mt-1 font-semibold">Nível: {dados.nivel}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-0 shadow-2xl shadow-teal-500/50 transform hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Calorias/dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{calorias} kcal</div>
              <p className="text-xs text-teal-100 mt-1 font-semibold">Meta diária</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-2xl shadow-emerald-500/50 transform hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                Água/dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{(aguaTotal / 1000).toFixed(1)}L</div>
              <p className="text-xs text-emerald-100 mt-1 font-semibold">{Math.ceil(aguaTotal / 250)} copos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-lime-500 to-green-600 text-white border-0 shadow-2xl shadow-lime-500/50 transform hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Treinos/semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{dados.diasTreino}x</div>
              <p className="text-xs text-lime-100 mt-1 font-semibold">Frequência semanal</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Principais - REDESENHADAS */}
        <Tabs defaultValue="treino" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto bg-black/60 backdrop-blur-xl border-4 border-green-400 p-2 gap-2 shadow-2xl">
            <TabsTrigger 
              value="treino" 
              className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all rounded-xl"
            >
              <Dumbbell className="w-8 h-8" />
              <span className="text-xs font-bold">Treino</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dieta" 
              className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-lime-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all rounded-xl"
            >
              <Utensils className="w-8 h-8" />
              <span className="text-xs font-bold">Dieta</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scanner" 
              className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all rounded-xl"
            >
              <Camera className="w-8 h-8" />
              <span className="text-xs font-bold">Scanner</span>
            </TabsTrigger>
            <TabsTrigger 
              value="agua" 
              className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all rounded-xl"
            >
              <Droplets className="w-8 h-8" />
              <span className="text-xs font-bold">Água</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sono" 
              className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all rounded-xl"
            >
              <Moon className="w-8 h-8" />
              <span className="text-xs font-bold">Sono</span>
            </TabsTrigger>
            <TabsTrigger 
              value="suplementos" 
              className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-lime-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all rounded-xl"
            >
              <Pill className="w-8 h-8" />
              <span className="text-xs font-bold">Suplem.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ciclos" 
              className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-110 transition-all rounded-xl"
            >
              <Syringe className="w-8 h-8" />
              <span className="text-xs font-bold">Ciclos</span>
            </TabsTrigger>
          </TabsList>

          {/* ABA TREINO */}
          <TabsContent value="treino" className="space-y-4">
            <Card className="bg-black/60 backdrop-blur-xl border-4 border-green-400 text-white shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Dumbbell className="w-6 h-6" />
                  {treino.titulo}
                </CardTitle>
                <CardDescription className="text-green-100 font-semibold">
                  Treino personalizado para {objetivoLabels[dados.objetivo].toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {treino.divisao.map((dia: any, idx: number) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-lg px-4 py-2">
                        {dia.dia}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {dia.exercicios.map((ex: any, exIdx: number) => (
                        <div
                          key={exIdx}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl hover:from-green-800/60 hover:to-emerald-800/60 transition-all border-2 border-green-500/30 shadow-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-lg font-black shadow-lg">
                              {exIdx + 1}
                            </div>
                            <span className="font-bold text-lg">{ex.nome}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-black text-green-300 text-lg">{ex.series}</span>
                            <span className="text-xs font-semibold">⏱️ {ex.descanso}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {idx < treino.divisao.length - 1 && <Separator className="bg-green-500/50" />}
                  </div>
                ))}

                <div className="mt-6 p-6 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl border-2 border-green-500/50 shadow-xl">
                  <h4 className="font-black text-green-200 mb-3 text-lg">📋 Observações Importantes</h4>
                  <ul className="space-y-2 text-sm text-green-100">
                    {treino.observacoes.map((obs: string, idx: number) => (
                      <li key={idx} className="font-semibold">{obs}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA DIETA */}
          <TabsContent value="dieta" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/50 transform hover:scale-105 transition-transform">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Proteína</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black">{macros.proteina}g</div>
                  <p className="text-sm text-green-100 mt-1 font-semibold">por dia</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-lime-500 to-green-600 text-white shadow-2xl shadow-lime-500/50 transform hover:scale-105 transition-transform">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Carboidrato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black">{macros.carboidrato}g</div>
                  <p className="text-sm text-lime-100 mt-1 font-semibold">por dia</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-2xl shadow-teal-500/50 transform hover:scale-105 transition-transform">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Gordura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black">{macros.gordura}g</div>
                  <p className="text-sm text-teal-100 mt-1 font-semibold">por dia</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/60 backdrop-blur-xl border-4 border-green-400 text-white shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Utensils className="w-6 h-6" />
                  Plano Alimentar Diário
                </CardTitle>
                <CardDescription className="text-green-100 font-semibold">
                  {calorias} kcal/dia - Escolha uma opção de cada refeição
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {Object.entries(planoAlimentar.refeicoes).map(([key, refeicao]: [string, any]) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-xl capitalize">
                        {key === 'cafe' ? '☕ Café da Manhã' :
                         key === 'lanche1' ? '🍎 Lanche da Manhã' :
                         key === 'almoco' ? '🍽️ Almoço' :
                         key === 'lanche2' ? '🥤 Lanche da Tarde' :
                         key === 'jantar' ? '🌙 Jantar' :
                         '🌜 Ceia'}
                      </h4>
                      <Badge variant="outline" className="text-sm border-2 border-green-400 text-green-300 font-bold">
                        <Clock className="w-4 h-4 mr-1" />
                        {refeicao.horario}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {refeicao.opcoes.map((opcao: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl hover:from-green-800/60 hover:to-emerald-800/60 transition-all border-2 border-green-500/30 shadow-lg"
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-semibold">{opcao}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="bg-green-500/50" />
                  </div>
                ))}

                <div className="p-6 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl border-2 border-green-500/50 shadow-xl">
                  <h4 className="font-black text-green-200 mb-3 text-lg">💡 Dicas Nutricionais</h4>
                  <ul className="space-y-2 text-sm text-green-100">
                    {planoAlimentar.dicas.map((dica: string, idx: number) => (
                      <li key={idx} className="font-semibold">{dica}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA SCANNER */}
          <TabsContent value="scanner" className="space-y-4">
            <Card className="bg-black/60 backdrop-blur-xl border-4 border-teal-400 text-white shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Camera className="w-6 h-6" />
                  Scanner de Comida
                </CardTitle>
                <CardDescription className="text-teal-100 font-semibold">
                  Tire uma foto da sua comida e descubra as calorias e proteínas instantaneamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Upload de Imagem */}
                <div className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-teal-400 rounded-2xl bg-gradient-to-br from-teal-900/30 to-cyan-900/30 hover:from-teal-800/40 hover:to-cyan-800/40 transition-all shadow-xl">
                  <Camera className="w-20 h-20 text-teal-300 mb-4 animate-pulse" />
                  <h3 className="text-xl font-black mb-2">Tire ou envie uma foto</h3>
                  <p className="text-sm text-teal-200 text-center mb-4 font-semibold">
                    Fotografe sua refeição para análise nutricional automática
                  </p>
                  <label htmlFor="upload-comida" className="cursor-pointer">
                    <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 font-bold text-lg px-8 py-6 shadow-2xl">
                      <Upload className="w-5 h-5 mr-2" />
                      Escolher Foto
                    </Button>
                    <input
                      id="upload-comida"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImagemComida}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Imagem Carregada */}
                {imagemComida && (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border-4 border-teal-400 shadow-2xl">
                      <img
                        src={imagemComida}
                        alt="Comida analisada"
                        className="w-full h-auto max-h-96 object-cover"
                      />
                    </div>

                    {/* Loading */}
                    {analisandoComida && (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="w-16 h-16 text-teal-400 animate-spin mb-4" />
                        <p className="text-teal-200 font-bold text-lg">Analisando sua comida...</p>
                      </div>
                    )}

                    {/* Resultado da Análise */}
                    {resultadoAnalise && !analisandoComida && (
                      <div className="space-y-4">
                        {resultadoAnalise.erro ? (
                          <div className="p-6 bg-gradient-to-br from-red-900/50 to-pink-900/50 rounded-xl border-2 border-red-500/50 shadow-xl">
                            <p className="text-red-100 text-center font-bold">{resultadoAnalise.erro}</p>
                          </div>
                        ) : (
                          <>
                            {/* Cards de Macros */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <Card className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-2xl transform hover:scale-105 transition-transform">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-xs font-bold">Calorias</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-3xl font-black">{resultadoAnalise.calorias_estimadas}</div>
                                  <p className="text-xs text-teal-100 font-semibold">kcal</p>
                                </CardContent>
                              </Card>

                              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl transform hover:scale-105 transition-transform">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-xs font-bold">Proteína</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-3xl font-black">{resultadoAnalise.proteinas}</div>
                                  <p className="text-xs text-green-100 font-semibold">gramas</p>
                                </CardContent>
                              </Card>

                              <Card className="bg-gradient-to-br from-lime-500 to-green-600 text-white shadow-2xl transform hover:scale-105 transition-transform">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-xs font-bold">Carboidratos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-3xl font-black">{resultadoAnalise.carboidratos}</div>
                                  <p className="text-xs text-lime-100 font-semibold">gramas</p>
                                </CardContent>
                              </Card>

                              <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl transform hover:scale-105 transition-transform">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-xs font-bold">Gorduras</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-3xl font-black">{resultadoAnalise.gorduras}</div>
                                  <p className="text-xs text-emerald-100 font-semibold">gramas</p>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Alimentos Identificados */}
                            {resultadoAnalise.alimentos && resultadoAnalise.alimentos.length > 0 && (
                              <div className="p-6 bg-gradient-to-br from-teal-900/50 to-cyan-900/50 rounded-xl border-2 border-teal-500/50 shadow-xl">
                                <h4 className="font-black text-teal-100 mb-3 text-lg">🍽️ Alimentos Identificados</h4>
                                <div className="flex flex-wrap gap-2">
                                  {resultadoAnalise.alimentos.map((alimento: string, idx: number) => (
                                    <Badge key={idx} className="bg-gradient-to-r from-teal-500 to-cyan-600 font-bold text-sm px-4 py-2">
                                      {alimento}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Porção Estimada */}
                            {resultadoAnalise.porcao_estimada && (
                              <div className="p-6 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl border-2 border-green-500/50 shadow-xl">
                                <h4 className="font-black text-green-100 mb-2 text-lg">📏 Porção Estimada</h4>
                                <p className="text-sm text-green-200 font-semibold">{resultadoAnalise.porcao_estimada}</p>
                              </div>
                            )}

                            {/* Observações */}
                            {resultadoAnalise.observacoes && (
                              <div className="p-6 bg-gradient-to-br from-lime-900/50 to-green-900/50 rounded-xl border-2 border-lime-500/50 shadow-xl">
                                <h4 className="font-black text-lime-200 mb-2 text-lg">💡 Observações</h4>
                                <p className="text-sm text-lime-100 font-semibold">{resultadoAnalise.observacoes}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Dicas */}
                <div className="p-6 bg-gradient-to-br from-teal-900/50 to-cyan-900/50 rounded-xl border-2 border-teal-500/50 shadow-xl">
                  <h4 className="font-black text-teal-200 mb-3 text-lg">📸 Dicas para melhor análise</h4>
                  <ul className="space-y-2 text-sm text-teal-100">
                    <li className="font-semibold">✓ Tire a foto de cima, mostrando todo o prato</li>
                    <li className="font-semibold">✓ Certifique-se de que há boa iluminação</li>
                    <li className="font-semibold">✓ Evite sombras sobre a comida</li>
                    <li className="font-semibold">✓ Quanto mais clara a foto, melhor a análise</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA ÁGUA */}
          <TabsContent value="agua" className="space-y-4">
            <Card className="bg-black/60 backdrop-blur-xl border-4 border-emerald-400 text-white shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Droplets className="w-6 h-6" />
                  Hidratação Diária
                </CardTitle>
                <CardDescription className="text-emerald-100 font-semibold">
                  Meta: {(aguaTotal / 1000).toFixed(1)}L por dia ({Math.ceil(aguaTotal / 250)} copos de 250ml)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-base font-black">Progresso</span>
                    <span className="text-base text-emerald-200 font-bold">
                      {aguaConsumida}ml / {aguaTotal}ml
                    </span>
                  </div>
                  <Progress value={(aguaConsumida / aguaTotal) * 100} className="h-4 bg-emerald-900" />
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => setAguaConsumida(Math.min(aguaConsumida + 250, aguaTotal))}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-bold text-lg px-6 py-6 shadow-2xl"
                  >
                    + 250ml (1 copo)
                  </Button>
                  <Button
                    onClick={() => setAguaConsumida(Math.min(aguaConsumida + 500, aguaTotal))}
                    variant="outline"
                    className="border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-400 hover:text-black font-bold text-lg px-6 py-6"
                  >
                    + 500ml (garrafa)
                  </Button>
                  <Button
                    onClick={() => setAguaConsumida(0)}
                    variant="outline"
                    className="border-2 border-red-400 text-red-300 hover:bg-red-400 hover:text-white font-bold text-lg px-6 py-6"
                  >
                    Resetar
                  </Button>
                </div>

                <Separator className="bg-emerald-500/50" />

                <div>
                  <h4 className="font-black mb-4 flex items-center gap-2 text-xl">
                    <Clock className="w-5 h-5" />
                    Horários Recomendados
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {horariosAgua.map((horario, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-xl border-2 border-emerald-500/50 text-center shadow-lg hover:scale-105 transition-transform"
                      >
                        <div className="text-2xl font-black text-emerald-300">
                          {horario}
                        </div>
                        <div className="text-xs text-emerald-200 mt-1 font-bold">
                          250ml
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-xl border-2 border-emerald-500/50 shadow-xl">
                  <h4 className="font-black text-emerald-200 mb-3 text-lg">💧 Benefícios da Hidratação</h4>
                  <ul className="space-y-2 text-sm text-emerald-100">
                    <li className="font-semibold">✓ Melhora performance no treino</li>
                    <li className="font-semibold">✓ Acelera recuperação muscular</li>
                    <li className="font-semibold">✓ Auxilia na queima de gordura</li>
                    <li className="font-semibold">✓ Melhora concentração e disposição</li>
                    <li className="font-semibold">✓ Regula temperatura corporal</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA SONO */}
          <TabsContent value="sono" className="space-y-4">
            <Card className="bg-black/60 backdrop-blur-xl border-4 border-green-400 text-white shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Moon className="w-6 h-6" />
                  Monitoramento do Sono
                </CardTitle>
                <CardDescription className="text-green-100 font-semibold">
                  O sono é essencial para recuperação e resultados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/50 transform hover:scale-105 transition-transform">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold">Meta de Sono</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-black">7-9h</div>
                      <p className="text-sm text-green-100 mt-1 font-semibold">por noite</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-lime-500 to-green-600 text-white shadow-2xl shadow-lime-500/50 transform hover:scale-105 transition-transform">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-bold">Horário Ideal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-black">22h-6h</div>
                      <p className="text-sm text-lime-100 mt-1 font-semibold">recomendado</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl border-2 border-green-500/50 shadow-xl">
                  <h4 className="font-black text-green-200 mb-4 text-lg">😴 Dicas para Melhor Sono</h4>
                  <ul className="space-y-3 text-sm text-green-100">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-300" />
                      <span className="font-semibold">Evite cafeína 6h antes de dormir</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-300" />
                      <span className="font-semibold">Desligue telas 1h antes de dormir</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-300" />
                      <span className="font-semibold">Mantenha o quarto escuro e fresco (18-21°C)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-300" />
                      <span className="font-semibold">Estabeleça uma rotina relaxante antes de dormir</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-300" />
                      <span className="font-semibold">Evite treinos intensos 3h antes de dormir</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-300" />
                      <span className="font-semibold">Considere suplementar com magnésio ou melatonina</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-teal-900/50 to-cyan-900/50 rounded-xl border-2 border-teal-500/50 shadow-xl">
                  <h4 className="font-black text-teal-200 mb-3 text-lg">💪 Impacto do Sono nos Resultados</h4>
                  <ul className="space-y-2 text-sm text-teal-100">
                    <li className="font-semibold">✓ 80% da recuperação muscular acontece durante o sono</li>
                    <li className="font-semibold">✓ Hormônio do crescimento (GH) é liberado principalmente à noite</li>
                    <li className="font-semibold">✓ Falta de sono aumenta cortisol (hormônio do estresse)</li>
                    <li className="font-semibold">✓ Sono inadequado reduz testosterona em até 15%</li>
                    <li className="font-semibold">✓ Dormir bem melhora foco e intensidade nos treinos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA SUPLEMENTOS */}
          <TabsContent value="suplementos" className="space-y-4">
            <Card className="bg-black/60 backdrop-blur-xl border-4 border-lime-400 text-white shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-lime-500 to-green-600">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Pill className="w-6 h-6" />
                  Suplementação Recomendada
                </CardTitle>
                <CardDescription className="text-lime-100 font-semibold">
                  Baseado no seu objetivo: {objetivoLabels[dados.objetivo]}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h4 className="font-black mb-4 text-xl">🌟 Suplementos Essenciais</h4>
                  <div className="space-y-3">
                    {suplementacao.essenciais.map((supl: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 bg-gradient-to-r from-lime-900/40 to-green-900/40 rounded-xl border-2 border-lime-500/30 shadow-lg hover:scale-105 transition-transform"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-black text-lg">{supl.nome}</h5>
                          <Badge
                            variant={supl.prioridade === 'Alta' ? 'default' : 'secondary'}
                            className={supl.prioridade === 'Alta' ? 'bg-green-600 font-bold' : 'font-bold'}
                          >
                            {supl.prioridade}
                          </Badge>
                        </div>
                        <p className="text-sm text-lime-200 mb-2 font-semibold">
                          📊 <strong>Dosagem:</strong> {supl.dosagem}
                        </p>
                        <p className="text-sm text-lime-100 font-semibold">
                          💡 {supl.beneficio}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-lime-500/50" />

                <div>
                  <h4 className="font-black mb-4 text-xl">🎯 Específicos para seu Objetivo</h4>
                  <div className="space-y-3">
                    {suplementacao.especificos.map((supl: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-500/30 shadow-lg hover:scale-105 transition-transform"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-black text-lg text-green-100">{supl.nome}</h5>
                          <Badge variant="outline" className="border-2 border-green-400 text-green-300 font-bold">
                            {supl.prioridade}
                          </Badge>
                        </div>
                        <p className="text-sm text-green-200 mb-2 font-semibold">
                          📊 <strong>Dosagem:</strong> {supl.dosagem}
                        </p>
                        <p className="text-sm text-green-100 font-semibold">
                          💡 {supl.beneficio}
                        </p>
                        {supl.observacao && (
                          <p className="text-xs text-lime-300 mt-2 font-bold">
                            {supl.observacao}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-lime-900/50 to-green-900/50 rounded-xl border-2 border-lime-500/50 shadow-xl">
                  <h4 className="font-black text-lime-200 mb-3 text-lg">⚠️ Observações Importantes</h4>
                  <ul className="space-y-2 text-sm text-lime-100">
                    {suplementacao.observacoes.map((obs: string, idx: number) => (
                      <li key={idx} className="font-semibold">{obs}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA CICLOS DE ANABOLIZANTES */}
          <TabsContent value="ciclos" className="space-y-4">
            {!isVIP ? (
              <Card className="bg-black/60 backdrop-blur-xl border-4 border-teal-400 text-white shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-green-600">
                  <div className="flex items-center justify-center mb-4">
                    <Lock className="w-20 h-20 text-teal-200 animate-pulse" />
                  </div>
                  <CardTitle className="text-center text-3xl font-black">
                    Conteúdo Exclusivo VIP
                  </CardTitle>
                  <CardDescription className="text-teal-100 text-center font-semibold text-lg">
                    Protocolos completos de anabolizantes, TPC e dicas avançadas disponíveis apenas para membros VIP
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="text-center">
                    <Button
                      onClick={ativarVIP}
                      size="lg"
                      className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 hover:from-green-500 hover:via-emerald-600 hover:to-teal-700 text-white font-black text-2xl px-12 py-8 shadow-2xl transform hover:scale-110 transition-all"
                    >
                      <Crown className="w-8 h-8 mr-3 animate-bounce" />
                      DESBLOQUEAR ACESSO VIP AGORA
                      <Zap className="w-8 h-8 ml-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/60 backdrop-blur-xl border-4 border-teal-400 text-white shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-green-600">
                  <CardTitle className="flex items-center gap-2 text-teal-100 text-2xl">
                    <Syringe className="w-6 h-6" />
                    Protocolos de Anabolizantes - Área VIP
                  </CardTitle>
                  <CardDescription className="text-teal-100 font-semibold">
                    Protocolos completos, TPC e controle de ciclos para membros VIP
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="p-6 bg-gradient-to-br from-red-900/50 to-pink-900/50 rounded-xl border-4 border-red-500/50 shadow-xl">
                    <p className="font-black text-red-100 text-center text-base">
                      ⚠️ ATENÇÃO: O uso de anabolizantes sem prescrição médica é ilegal e perigoso. Consulte sempre um endocrinologista especializado.
                    </p>
                  </div>

                  {/* Protocolos de Ciclos */}
                  <div>
                    <h3 className="text-3xl font-black mb-4 flex items-center gap-2">
                      <Shield className="w-8 h-8 text-green-400" />
                      Protocolos de Ciclos
                    </h3>
                    <div className="space-y-4">
                      {protocolosAnabolizantes.map((protocolo, idx) => (
                        <div
                          key={idx}
                          className="p-5 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-500/50 shadow-lg hover:scale-105 transition-transform"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-black text-xl text-green-100">{protocolo.nome}</h4>
                              <p className="text-sm text-green-300 font-semibold">{protocolo.tipo}</p>
                            </div>
                            <Badge className={
                              protocolo.nivel === 'Iniciante' ? 'bg-green-600 font-bold' :
                              protocolo.nivel === 'Intermediário' ? 'bg-lime-600 font-bold' :
                              'bg-teal-600 font-bold'
                            }>
                              {protocolo.nivel}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="p-3 bg-black/40 rounded-lg">
                              <p className="text-xs text-green-400 font-bold">Dosagem</p>
                              <p className="font-black">{protocolo.dosagem}</p>
                            </div>
                            <div className="p-3 bg-black/40 rounded-lg">
                              <p className="text-xs text-green-400 font-bold">Frequência</p>
                              <p className="font-black">{protocolo.frequencia}</p>
                            </div>
                            <div className="p-3 bg-black/40 rounded-lg">
                              <p className="text-xs text-green-400 font-bold">Duração</p>
                              <p className="font-black">{protocolo.duracao}</p>
                            </div>
                            <div className="p-3 bg-black/40 rounded-lg">
                              <p className="text-xs text-green-400 font-bold">Objetivo</p>
                              <p className="font-black">{protocolo.objetivo}</p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-black text-green-200">Observações:</p>
                            {protocolo.observacoes.map((obs, obsIdx) => (
                              <p key={obsIdx} className="text-sm text-green-100 font-semibold">• {obs}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-teal-500/50" />

                  {/* Protocolos de TPC */}
                  <div>
                    <h3 className="text-3xl font-black mb-4 flex items-center gap-2">
                      <Activity className="w-8 h-8 text-emerald-400" />
                      Protocolos de TPC (Terapia Pós-Ciclo)
                    </h3>
                    <div className="space-y-4">
                      {protocolosTPC.map((tpc, idx) => (
                        <div
                          key={idx}
                          className="p-5 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 rounded-xl border-2 border-emerald-500/50 shadow-lg"
                        >
                          <h4 className="font-black text-xl text-emerald-100 mb-2">{tpc.nome}</h4>
                          <p className="text-sm text-emerald-300 mb-3 italic font-semibold">{tpc.indicacao}</p>
                          <div className="space-y-2">
                            {tpc.protocolo.map((linha, lineIdx) => (
                              <div key={lineIdx} className="p-3 bg-black/40 rounded-lg text-sm font-semibold">
                                {linha}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-teal-500/50" />

                  {/* Dicas Avançadas */}
                  <div>
                    <h3 className="text-3xl font-black mb-4 flex items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-lime-400" />
                      Dicas e Orientações Avançadas
                    </h3>
                    <div className="space-y-4">
                      {dicasAnabolizantes.map((dica, idx) => (
                        <div
                          key={idx}
                          className="p-5 bg-gradient-to-r from-lime-900/40 to-green-900/40 rounded-xl border-2 border-lime-500/50 shadow-lg"
                        >
                          <h4 className="font-black text-xl text-lime-100 mb-3">{dica.titulo}</h4>
                          <ul className="space-y-2">
                            {dica.itens.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2 text-sm text-lime-100">
                                <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5 flex-shrink-0" />
                                <span className="font-semibold">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-teal-500/50" />

                  {/* Controle de Ciclos Pessoais */}
                  <div>
                    <h3 className="text-3xl font-black mb-4 flex items-center gap-2">
                      <Calendar className="w-8 h-8 text-teal-400" />
                      Meus Ciclos Ativos
                    </h3>

                    {!mostrarFormCiclo && (
                      <Button
                        onClick={() => setMostrarFormCiclo(true)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 mb-4 font-bold text-lg py-6 shadow-2xl"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Adicionar Novo Ciclo
                      </Button>
                    )}

                    {/* Formulário de Novo Ciclo */}
                    {mostrarFormCiclo && (
                      <div className="p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-500/50 space-y-4 mb-4 shadow-xl">
                        <h4 className="font-black text-green-200 text-lg">Registrar Novo Ciclo</h4>
                        
                        <div>
                          <Label htmlFor="nome" className="text-green-100 font-bold">Nome do Composto *</Label>
                          <Input
                            id="nome"
                            placeholder="Ex: Durateston, Deca, Oxandrolona..."
                            value={novoCiclo.nome || ''}
                            onChange={(e) => setNovoCiclo({ ...novoCiclo, nome: e.target.value })}
                            className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dosagem" className="text-green-100 font-bold">Dosagem *</Label>
                            <Input
                              id="dosagem"
                              placeholder="Ex: 500mg, 50mg..."
                              value={novoCiclo.dosagem || ''}
                              onChange={(e) => setNovoCiclo({ ...novoCiclo, dosagem: e.target.value })}
                              className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                            />
                          </div>

                          <div>
                            <Label htmlFor="frequencia" className="text-green-100 font-bold">Frequência *</Label>
                            <Input
                              id="frequencia"
                              placeholder="Ex: 2x semana, diário..."
                              value={novoCiclo.frequencia || ''}
                              onChange={(e) => setNovoCiclo({ ...novoCiclo, frequencia: e.target.value })}
                              className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dataInicio" className="text-green-100 font-bold">Data de Início *</Label>
                            <Input
                              id="dataInicio"
                              type="date"
                              value={novoCiclo.dataInicio || ''}
                              onChange={(e) => setNovoCiclo({ ...novoCiclo, dataInicio: e.target.value })}
                              className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                            />
                          </div>

                          <div>
                            <Label htmlFor="duracao" className="text-green-100 font-bold">Duração (semanas) *</Label>
                            <Input
                              id="duracao"
                              type="number"
                              placeholder="Ex: 8, 12, 16..."
                              value={novoCiclo.duracao || ''}
                              onChange={(e) => setNovoCiclo({ ...novoCiclo, duracao: parseInt(e.target.value) })}
                              className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="observacoes" className="text-green-100 font-bold">Observações</Label>
                          <Input
                            id="observacoes"
                            placeholder="Notas adicionais..."
                            value={novoCiclo.observacoes || ''}
                            onChange={(e) => setNovoCiclo({ ...novoCiclo, observacoes: e.target.value })}
                            className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={adicionarCiclo}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-bold text-lg py-6"
                          >
                            Salvar Ciclo
                          </Button>
                          <Button
                            onClick={() => {
                              setMostrarFormCiclo(false);
                              setNovoCiclo({});
                            }}
                            variant="outline"
                            className="border-2 border-green-500/50 text-green-300 hover:bg-green-500/20 font-bold text-lg py-6"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Lista de Ciclos */}
                    {ciclos.length === 0 ? (
                      <div className="text-center py-8 text-green-200">
                        <Syringe className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <p className="font-bold text-lg">Nenhum ciclo registrado ainda</p>
                        <p className="text-sm text-green-300 mt-1 font-semibold">Adicione um ciclo para começar o controle</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {ciclos.map((ciclo) => {
                          const diasRestantes = calcularDiasRestantes(ciclo.dataInicio, ciclo.duracao);
                          const diasTotais = ciclo.duracao * 7;
                          const progresso = ((diasTotais - diasRestantes) / diasTotais) * 100;

                          return (
                            <div
                              key={ciclo.id}
                              className="p-5 bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-500/50 shadow-lg"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h5 className="font-black text-xl text-green-100">{ciclo.nome}</h5>
                                  <p className="text-sm text-green-300 font-semibold">
                                    {ciclo.dosagem} • {ciclo.frequencia}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => removerCiclo(ciclo.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-green-200 flex items-center gap-1 font-semibold">
                                    <Calendar className="w-4 h-4" />
                                    Início: {new Date(ciclo.dataInicio).toLocaleDateString('pt-BR')}
                                  </span>
                                  <span className="text-green-200 font-bold">
                                    {diasRestantes > 0 ? `${diasRestantes} dias restantes` : 'Ciclo finalizado'}
                                  </span>
                                </div>
                                
                                <Progress value={progresso} className="h-3" />
                                
                                <div className="flex items-center justify-between text-xs text-green-300">
                                  <span className="font-bold">{ciclo.duracao} semanas ({diasTotais} dias)</span>
                                  <span className="font-bold">{Math.round(progresso)}% concluído</span>
                                </div>

                                {ciclo.observacoes && (
                                  <p className="text-xs text-green-200 mt-2 italic font-semibold">
                                    📝 {ciclo.observacoes}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-xl border-4 border-orange-500/50 shadow-xl">
                    <p className="font-black text-orange-100 text-center text-base">
                      👨‍⚕️ LEMBRE-SE: Acompanhamento médico é OBRIGATÓRIO. Faça exames regulares e nunca se automedique.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-xl border-t-4 border-green-400 mt-12 shadow-2xl">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-green-200">
          <p className="font-black text-lg">💪 BEAST MODE - Transforme-se em uma MÁQUINA 🔥</p>
          <p className="mt-2 text-xs text-green-300 font-semibold">
            ⚠️ Consulte sempre profissionais qualificados antes de iniciar qualquer programa de treino, dieta ou suplementação.
          </p>
        </div>
      </footer>
    </div>
  );
}
