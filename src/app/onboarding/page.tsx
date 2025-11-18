'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { User, Target, Activity, Calendar, CreditCard, Crown, Syringe, CheckCircle2, AlertCircle, Utensils, Sparkles, Zap, Loader2 } from 'lucide-react';
import type { DadosUsuario, Objetivo, Nivel, Genero } from '@/lib/fitness-utils';
import { supabase } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const [etapa, setEtapa] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [dados, setDados] = useState<Partial<DadosUsuario>>({
    diasTreino: 3,
    usaAnabolizantes: false
  });
  const [preferenciasAlimentares, setPreferenciasAlimentares] = useState({
    alimentosGosta: '',
    alimentosNaoPodeFaltar: '',
    restricoes: ''
  });

  useEffect(() => {
    // Verificar se usuário está autenticado
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);
    };
    checkUser();
  }, [router]);

  const handlePagamento = async () => {
    setLoading(true);
    try {
      // Simular pagamento e ativar VIP
      const { error } = await supabase
        .from('usuarios')
        .update({ is_vip: true })
        .eq('id', userId);

      if (error) throw error;

      localStorage.setItem('isVIP', 'true');
      router.push('/');
    } catch (err) {
      console.error('Erro ao ativar VIP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Buscar email do usuário
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      // Salvar dados no Supabase
      const { error } = await supabase
        .from('usuarios')
        .upsert({
          id: userId,
          email: user.email!,
          nome: dados.nome!,
          idade: dados.idade!,
          genero: dados.genero!,
          peso: dados.peso!,
          altura: dados.altura!,
          objetivo: dados.objetivo!,
          nivel: dados.nivel!,
          dias_treino: dados.diasTreino!,
          usa_anabolizantes: dados.usaAnabolizantes || false,
          is_vip: false,
          preferencias_alimentares: preferenciasAlimentares,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Salvar também no localStorage para acesso offline
      localStorage.setItem('dadosUsuario', JSON.stringify(dados));
      localStorage.setItem('preferenciasAlimentares', JSON.stringify(preferenciasAlimentares));
      
      setEtapa(8); // Vai para o paywall
    } catch (err) {
      console.error('Erro ao salvar dados:', err);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const proximaEtapa = () => {
    if (etapa < 7) setEtapa(etapa + 1);
    else handleSubmit();
  };

  const etapaAnterior = () => {
    if (etapa > 1) setEtapa(etapa - 1);
  };

  const podeAvancar = () => {
    switch (etapa) {
      case 1:
        return dados.nome && dados.idade && dados.genero;
      case 2:
        return dados.peso && dados.altura;
      case 3:
        return dados.objetivo;
      case 4:
        return dados.nivel && dados.diasTreino;
      case 5:
        return dados.usaAnabolizantes !== undefined;
      case 6:
        return true;
      case 7:
        return preferenciasAlimentares.alimentosGosta && preferenciasAlimentares.alimentosNaoPodeFaltar;
      default:
        return false;
    }
  };

  // ETAPA 8: PAYWALL
  if (etapa === 8) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-2xl bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white border-0">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-8 rounded-full backdrop-blur-sm animate-pulse">
                <Crown className="w-24 h-24 text-green-300" />
              </div>
            </div>
            <CardTitle className="text-6xl font-black mb-4 drop-shadow-2xl">
              BEAST MODE
            </CardTitle>
            <CardDescription className="text-green-100 text-3xl font-black">
              Transforme-se em uma MÁQUINA 🔥
            </CardDescription>
            <p className="text-white text-xl mt-4 font-bold">
              O app mais completo para quem quer RESULTADOS REAIS
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform shadow-xl">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-xl mb-2">Treinos Personalizados</h4>
                    <p className="text-sm text-green-100 font-semibold">Planos adaptados ao seu nível e objetivo</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform shadow-xl">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-xl mb-2">Dieta Completa</h4>
                    <p className="text-sm text-green-100 font-semibold">Macros calculados e plano alimentar detalhado</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform shadow-xl">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-xl mb-2">Scanner de Comida</h4>
                    <p className="text-sm text-green-100 font-semibold">Tire foto e veja calorias e proteínas na hora</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform shadow-xl">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-xl mb-2">Controle de Ciclos VIP</h4>
                    <p className="text-sm text-green-100 font-semibold">Para quem usa, controle completo e seguro</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform shadow-xl">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-xl mb-2">Suplementação</h4>
                    <p className="text-sm text-green-100 font-semibold">Recomendações baseadas no seu objetivo</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform shadow-xl">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-xl mb-2">Monitoramento 24/7</h4>
                    <p className="text-sm text-green-100 font-semibold">Água, sono, notificações inteligentes</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-lime-600 to-green-600 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform shadow-2xl border-2 border-green-300">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-8 h-8 text-green-300 flex-shrink-0 mt-1 animate-pulse" />
                  <div>
                    <h4 className="font-black text-xl mb-2">Protocolos de Anabolizantes VIP</h4>
                    <p className="text-sm text-green-100 font-semibold">Ciclos completos, TPC e dicas avançadas</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-lime-600 to-green-600 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform shadow-2xl border-2 border-green-300">
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-green-300 flex-shrink-0 mt-1 animate-pulse" />
                  <div>
                    <h4 className="font-black text-xl mb-2">Análise de Exames VIP</h4>
                    <p className="text-sm text-green-100 font-semibold">Interpretação automática dos seus exames</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-white/20" />

            <div className="text-center space-y-6">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                <p className="text-base text-green-100 mb-3 font-black">OFERTA ESPECIAL DE LANÇAMENTO 🔥</p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-4xl line-through text-green-200 font-bold">R$ 97/mês</span>
                  <span className="text-8xl font-black drop-shadow-2xl">R$ 25</span>
                  <span className="text-3xl text-green-100 font-black">/mês</span>
                </div>
                <Badge className="bg-lime-600 text-white text-xl px-8 py-3 font-black shadow-2xl">
                  Economize 74% - Apenas hoje! ⚡
                </Badge>
              </div>

              <Button
                onClick={handlePagamento}
                disabled={loading}
                size="lg"
                className="w-full bg-white text-green-600 hover:bg-green-100 font-black text-3xl py-10 shadow-2xl transform hover:scale-110 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-10 h-10 mr-3 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-10 h-10 mr-3" />
                    GARANTIR MINHA VAGA AGORA
                    <Sparkles className="w-10 h-10 ml-3 animate-pulse" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-6 text-base text-green-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold">Pagamento Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold">Garantia 7 dias</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold">Cancele quando quiser</span>
                </div>
              </div>

              <p className="text-sm text-green-200 mt-4 font-bold">
                🔒 Seus dados estão protegidos. Processamento seguro via SSL.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl bg-black/60 backdrop-blur-xl border-4 border-green-400 text-white">
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 p-4 rounded-full shadow-2xl shadow-green-500/50 animate-pulse">
              {etapa === 1 && <User className="w-10 h-10 text-white" />}
              {etapa === 2 && <Activity className="w-10 h-10 text-white" />}
              {etapa === 3 && <Target className="w-10 h-10 text-white" />}
              {etapa === 4 && <Calendar className="w-10 h-10 text-white" />}
              {etapa === 5 && <Syringe className="w-10 h-10 text-white" />}
              {etapa === 6 && <AlertCircle className="w-10 h-10 text-white" />}
              {etapa === 7 && <Utensils className="w-10 h-10 text-white" />}
            </div>
          </div>
          <CardTitle className="text-4xl font-black bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
            Configure seu perfil
          </CardTitle>
          <CardDescription className="text-lg mt-2 text-green-100 font-bold">
            Etapa {etapa} de 7 - {
              etapa === 1 ? 'Informações Pessoais' :
              etapa === 2 ? 'Medidas Corporais' :
              etapa === 3 ? 'Seu Objetivo' :
              etapa === 4 ? 'Rotina de Treino' :
              etapa === 5 ? 'Uso de Anabolizantes' :
              etapa === 6 ? 'TPC - Terapia Pós-Ciclo' :
              'Preferências Alimentares'
            }
          </CardDescription>
          <div className="flex gap-2 mt-4 justify-center">
            {[1, 2, 3, 4, 5, 6, 7].map((e) => (
              <div
                key={e}
                className={`h-3 rounded-full transition-all shadow-lg ${
                  e === etapa ? 'w-16 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 animate-pulse' :
                  e < etapa ? 'w-10 bg-lime-500' :
                  'w-10 bg-gray-700'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Etapa 1: Informações Pessoais */}
          {etapa === 1 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div>
                <Label htmlFor="nome" className="text-green-200 font-bold">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  value={dados.nome || ''}
                  onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                  className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                />
              </div>
              <div>
                <Label htmlFor="idade" className="text-green-200 font-bold">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  placeholder="Sua idade"
                  value={dados.idade || ''}
                  onChange={(e) => setDados({ ...dados, idade: parseInt(e.target.value) })}
                  className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                />
              </div>
              <div>
                <Label htmlFor="genero" className="text-green-200 font-bold">Gênero</Label>
                <Select
                  value={dados.genero}
                  onValueChange={(value: Genero) => setDados({ ...dados, genero: value })}
                >
                  <SelectTrigger className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold">
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Etapa 2: Medidas */}
          {etapa === 2 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div>
                <Label htmlFor="peso" className="text-green-200 font-bold">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 75.5"
                  value={dados.peso || ''}
                  onChange={(e) => setDados({ ...dados, peso: parseFloat(e.target.value) })}
                  className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                />
              </div>
              <div>
                <Label htmlFor="altura" className="text-green-200 font-bold">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  placeholder="Ex: 175"
                  value={dados.altura || ''}
                  onChange={(e) => setDados({ ...dados, altura: parseInt(e.target.value) })}
                  className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                />
              </div>
              {dados.peso && dados.altura && (
                <div className="p-4 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg border-2 border-green-500/50 shadow-xl">
                  <p className="text-base font-black text-green-200">
                    IMC: {(dados.peso / ((dados.altura / 100) ** 2)).toFixed(1)}
                  </p>
                  <p className="text-sm text-green-300 mt-1 font-semibold">
                    {(() => {
                      const imc = dados.peso / ((dados.altura / 100) ** 2);
                      if (imc < 18.5) return 'Abaixo do peso';
                      if (imc < 25) return 'Peso normal';
                      if (imc < 30) return 'Sobrepeso';
                      return 'Obesidade';
                    })()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Etapa 3: Objetivo */}
          {etapa === 3 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <Label className="text-green-200 font-bold text-lg">Qual é o seu objetivo principal?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: 'perder-peso', label: 'Perder Peso', emoji: '🔥', desc: 'Queimar gordura e definir' },
                  { value: 'ganhar-massa', label: 'Ganhar Massa', emoji: '💪', desc: 'Hipertrofia muscular' },
                  { value: 'definicao', label: 'Definição', emoji: '⚡', desc: 'Manter massa e definir' },
                  { value: 'saude-geral', label: 'Saúde Geral', emoji: '🌟', desc: 'Bem-estar e qualidade de vida' }
                ].map((obj) => (
                  <button
                    key={obj.value}
                    onClick={() => setDados({ ...dados, objetivo: obj.value as Objetivo })}
                    className={`p-5 rounded-2xl border-4 text-left transition-all hover:scale-110 shadow-xl ${
                      dados.objetivo === obj.value
                        ? 'border-green-400 bg-gradient-to-br from-green-600 to-emerald-600 shadow-2xl shadow-green-500/50'
                        : 'border-green-500/30 bg-black/40 hover:border-green-400'
                    }`}
                  >
                    <div className="text-4xl mb-2">{obj.emoji}</div>
                    <div className="font-black text-base text-white">{obj.label}</div>
                    <div className="text-sm text-green-200 mt-1 font-semibold">{obj.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Etapa 4: Nível e Frequência */}
          {etapa === 4 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div>
                <Label htmlFor="nivel" className="text-green-200 font-bold">Nível de Experiência</Label>
                <Select
                  value={dados.nivel}
                  onValueChange={(value: Nivel) => setDados({ ...dados, nivel: value })}
                >
                  <SelectTrigger className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold">
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">🌱 Iniciante (0-6 meses)</SelectItem>
                    <SelectItem value="intermediario">💪 Intermediário (6 meses - 2 anos)</SelectItem>
                    <SelectItem value="avancado">🏆 Avançado (2+ anos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="diasTreino" className="text-green-200 font-bold">Quantos dias por semana pode treinar?</Label>
                <Select
                  value={dados.diasTreino?.toString()}
                  onValueChange={(value) => setDados({ ...dados, diasTreino: parseInt(value) })}
                >
                  <SelectTrigger className="mt-1 bg-black/60 border-2 border-green-500/50 text-white font-semibold">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 dias por semana</SelectItem>
                    <SelectItem value="4">4 dias por semana</SelectItem>
                    <SelectItem value="5">5 dias por semana</SelectItem>
                    <SelectItem value="6">6 dias por semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Etapa 5: Uso de Anabolizantes */}
          {etapa === 5 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="p-6 bg-gradient-to-br from-red-900/50 to-pink-900/50 rounded-xl border-4 border-red-500/50 shadow-xl">
                <p className="font-black text-red-100 text-center text-base">
                  ⚠️ Esta informação é confidencial e usada apenas para personalizar suas recomendações
                </p>
              </div>

              <Label className="text-green-200 font-bold text-lg">Você usa ou já usou anabolizantes?</Label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setDados({ ...dados, usaAnabolizantes: false })}
                  className={`p-6 rounded-2xl border-4 text-left transition-all hover:scale-105 shadow-xl ${
                    dados.usaAnabolizantes === false
                      ? 'border-green-400 bg-gradient-to-br from-green-600 to-emerald-600 shadow-2xl shadow-green-500/50'
                      : 'border-green-500/30 bg-black/40 hover:border-green-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">✅</div>
                    <div>
                      <div className="font-black text-xl text-white">Não uso</div>
                      <div className="text-base text-green-200 mt-1 font-semibold">
                        Treino natural, sem uso de substâncias
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setDados({ ...dados, usaAnabolizantes: true })}
                  className={`p-6 rounded-2xl border-4 text-left transition-all hover:scale-105 shadow-xl ${
                    dados.usaAnabolizantes === true
                      ? 'border-lime-400 bg-gradient-to-br from-lime-600 to-green-600 shadow-2xl shadow-lime-500/50'
                      : 'border-green-500/30 bg-black/40 hover:border-green-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">💉</div>
                    <div>
                      <div className="font-black text-xl text-white">Sim, uso ou já usei</div>
                      <div className="text-base text-lime-200 mt-1 font-semibold">
                        Vou receber orientações de segurança e TPC
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="p-6 bg-gradient-to-br from-teal-900/50 to-cyan-900/50 rounded-xl border-2 border-teal-500/50 mt-4 shadow-xl">
                <p className="text-sm text-teal-100 font-semibold">
                  💡 Se você usa, terá acesso a: controle de ciclos, orientações de TPC, exames recomendados e protocolos de segurança.
                </p>
              </div>
            </div>
          )}

          {/* Etapa 6: TPC */}
          {etapa === 6 && dados.usaAnabolizantes && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="p-6 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl border-4 border-green-500/50 shadow-xl">
                <h3 className="font-black text-green-100 text-center text-2xl mb-2">
                  🩺 TPC - Terapia Pós-Ciclo
                </h3>
                <p className="text-base text-green-100 text-center font-semibold">
                  Informações essenciais para sua segurança
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-5 bg-gradient-to-br from-lime-900/40 to-green-900/40 rounded-xl border-2 border-lime-500/50 shadow-lg">
                  <h4 className="font-black text-lime-100 mb-2 text-lg">O que é TPC?</h4>
                  <p className="text-sm text-lime-200 font-semibold">
                    A Terapia Pós-Ciclo é ESSENCIAL para recuperar sua produção natural de testosterona após um ciclo de anabolizantes. Sem TPC, você pode ter efeitos colaterais graves e permanentes.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-teal-900/40 to-cyan-900/40 rounded-xl border-2 border-teal-500/50 shadow-lg">
                  <h4 className="font-black text-teal-100 mb-2 text-lg">Quando fazer TPC?</h4>
                  <p className="text-sm text-teal-200 font-semibold">
                    • Após QUALQUER ciclo de anabolizantes<br/>
                    • Duração: 4-6 semanas geralmente<br/>
                    • Inicia após a meia-vida do último composto
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl border-2 border-green-500/50 shadow-lg">
                  <h4 className="font-black text-green-100 mb-2 text-lg">Compostos comuns na TPC</h4>
                  <p className="text-sm text-green-200 font-semibold">
                    • Tamoxifeno (Nolvadex): 20-40mg/dia<br/>
                    • Clomifeno (Clomid): 50-100mg/dia<br/>
                    • HCG: Durante ou após ciclo (protocolo específico)
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-red-900/50 to-pink-900/50 rounded-xl border-4 border-red-500/50 shadow-xl">
                  <h4 className="font-black text-red-100 mb-2 flex items-center gap-2 text-lg">
                    <AlertCircle className="w-6 h-6" />
                    ATENÇÃO - Muito Importante
                  </h4>
                  <p className="text-sm text-red-100 font-semibold">
                    • NUNCA faça ciclos sem TPC planejada<br/>
                    • Consulte um ENDOCRINOLOGISTA especializado<br/>
                    • Faça exames ANTES, DURANTE e DEPOIS<br/>
                    • Sem TPC = risco de infertilidade, ginecomastia, depressão
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl border-2 border-green-500/50 shadow-xl">
                <p className="text-sm text-green-100 text-center font-semibold">
                  📱 No app, você terá acesso a protocolos completos de TPC, calculadora de dosagens e lembretes automáticos.
                </p>
              </div>
            </div>
          )}

          {etapa === 6 && !dados.usaAnabolizantes && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="p-8 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl border-4 border-green-500/50 text-center shadow-xl">
                <div className="text-7xl mb-4">💪</div>
                <h3 className="font-black text-green-100 text-3xl mb-2">
                  Excelente escolha!
                </h3>
                <p className="text-base text-green-100 font-semibold">
                  Treinar natural é o caminho mais seguro e sustentável. Você terá acesso a todos os recursos do app para maximizar seus resultados de forma saudável!
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-teal-900/40 to-cyan-900/40 rounded-xl border-2 border-teal-500/50 shadow-xl">
                <h4 className="font-black text-teal-100 mb-3 text-lg">O que você terá acesso:</h4>
                <ul className="text-sm text-teal-200 space-y-2">
                  <li className="font-semibold">✓ Treinos personalizados para hipertrofia natural</li>
                  <li className="font-semibold">✓ Dieta otimizada para ganhos sem substâncias</li>
                  <li className="font-semibold">✓ Suplementação segura e eficaz</li>
                  <li className="font-semibold">✓ Scanner de comida para controle preciso</li>
                  <li className="font-semibold">✓ Monitoramento de progresso completo</li>
                </ul>
              </div>
            </div>
          )}

          {/* Etapa 7: Preferências Alimentares */}
          {etapa === 7 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="p-6 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl border-4 border-green-500/50 shadow-xl">
                <h3 className="font-black text-green-100 text-center text-2xl mb-2 flex items-center justify-center gap-2">
                  <Utensils className="w-8 h-8" />
                  Preferências Alimentares
                </h3>
                <p className="text-base text-green-100 text-center font-semibold">
                  Personalize sua dieta com os alimentos que você ama! 🍽️
                </p>
              </div>

              <div>
                <Label htmlFor="alimentosGosta" className="text-green-200 font-bold text-base">
                  Quais alimentos você GOSTA de comer? *
                </Label>
                <Textarea
                  id="alimentosGosta"
                  placeholder="Ex: Frango, arroz integral, batata doce, ovos, banana, aveia, salmão..."
                  value={preferenciasAlimentares.alimentosGosta}
                  onChange={(e) => setPreferenciasAlimentares({ ...preferenciasAlimentares, alimentosGosta: e.target.value })}
                  className="mt-2 bg-black/60 border-2 border-green-500/50 text-white font-semibold min-h-[100px]"
                />
                <p className="text-xs text-green-300 mt-1 font-semibold">
                  💡 Liste os alimentos que você mais gosta para montarmos uma dieta personalizada
                </p>
              </div>

              <div>
                <Label htmlFor="alimentosNaoPodeFaltar" className="text-green-200 font-bold text-base">
                  O que NÃO PODE FALTAR na sua dieta? *
                </Label>
                <Textarea
                  id="alimentosNaoPodeFaltar"
                  placeholder="Ex: Café da manhã com ovos, arroz no almoço, whey protein pós-treino..."
                  value={preferenciasAlimentares.alimentosNaoPodeFaltar}
                  onChange={(e) => setPreferenciasAlimentares({ ...preferenciasAlimentares, alimentosNaoPodeFaltar: e.target.value })}
                  className="mt-2 bg-black/60 border-2 border-green-500/50 text-white font-semibold min-h-[100px]"
                />
                <p className="text-xs text-green-300 mt-1 font-semibold">
                  💡 Alimentos essenciais que você não abre mão no dia a dia
                </p>
              </div>

              <div>
                <Label htmlFor="restricoes" className="text-green-200 font-bold text-base">
                  Tem alguma restrição alimentar? (Opcional)
                </Label>
                <Textarea
                  id="restricoes"
                  placeholder="Ex: Intolerância à lactose, alergia a frutos do mar, vegetariano..."
                  value={preferenciasAlimentares.restricoes}
                  onChange={(e) => setPreferenciasAlimentares({ ...preferenciasAlimentares, restricoes: e.target.value })}
                  className="mt-2 bg-black/60 border-2 border-green-500/50 text-white font-semibold min-h-[80px]"
                />
                <p className="text-xs text-green-300 mt-1 font-semibold">
                  ⚠️ Informe alergias, intolerâncias ou preferências alimentares
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-lime-900/50 to-green-900/50 rounded-xl border-2 border-lime-500/50 shadow-xl">
                <h4 className="font-black text-lime-100 mb-3 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Por que isso é importante?
                </h4>
                <ul className="text-sm text-lime-100 space-y-2">
                  <li className="font-semibold">✓ Dieta 100% personalizada com alimentos que você gosta</li>
                  <li className="font-semibold">✓ Maior aderência e resultados mais rápidos</li>
                  <li className="font-semibold">✓ Evita alimentos que você não tolera ou não gosta</li>
                  <li className="font-semibold">✓ Plano alimentar sustentável a longo prazo</li>
                </ul>
              </div>
            </div>
          )}

          {/* Botões de Navegação */}
          <div className="flex gap-3 pt-4">
            {etapa > 1 && (
              <Button
                variant="outline"
                onClick={etapaAnterior}
                disabled={loading}
                className="flex-1 border-2 border-green-500/50 text-green-300 hover:bg-green-500/20 font-bold text-lg py-6"
              >
                Voltar
              </Button>
            )}
            <Button
              onClick={proximaEtapa}
              disabled={!podeAvancar() || loading}
              className="flex-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 hover:from-green-500 hover:via-emerald-600 hover:to-teal-700 font-black text-xl py-6 shadow-2xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                etapa === 7 ? 'Continuar para Pagamento 🔥' : 'Próximo'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
