'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Cadastro
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupNome, setSignupNome] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      // Verificar se usuário tem dados cadastrados
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', loginEmail)
        .single();

      if (userData) {
        // Salvar dados no localStorage
        localStorage.setItem('dadosUsuario', JSON.stringify({
          nome: userData.nome,
          idade: userData.idade,
          genero: userData.genero,
          peso: userData.peso,
          altura: userData.altura,
          objetivo: userData.objetivo,
          nivel: userData.nivel,
          diasTreino: userData.dias_treino,
          usaAnabolizantes: userData.usa_anabolizantes
        }));
        localStorage.setItem('isVIP', userData.is_vip ? 'true' : 'false');
        localStorage.setItem('preferenciasAlimentares', JSON.stringify(userData.preferencias_alimentares || {}));
        router.push('/');
      } else {
        // Redirecionar para onboarding
        router.push('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            nome: signupNome
          }
        }
      });

      if (error) throw error;

      // Redirecionar para onboarding
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-black/60 backdrop-blur-xl border-4 border-green-400 text-white">
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-600">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 p-4 rounded-full shadow-2xl shadow-green-500/50 animate-pulse">
              <Dumbbell className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
            BEAST MODE
          </CardTitle>
          <CardDescription className="text-green-100 text-lg font-bold">
            Transforme-se em uma MÁQUINA 🔥
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/60 border-2 border-green-400">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-bold"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-bold"
              >
                Cadastrar
              </TabsTrigger>
            </TabsList>

            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border-2 border-red-500 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-300" />
                <p className="text-sm text-red-100 font-semibold">{error}</p>
              </div>
            )}

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-green-200 font-bold">
                    Email
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="pl-10 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-green-200 font-bold">
                    Senha
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="pl-10 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 hover:from-green-500 hover:via-emerald-600 hover:to-teal-700 font-black text-xl py-6 shadow-2xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-nome" className="text-green-200 font-bold">
                    Nome
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <Input
                      id="signup-nome"
                      type="text"
                      placeholder="Seu nome"
                      value={signupNome}
                      onChange={(e) => setSignupNome(e.target.value)}
                      required
                      className="pl-10 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-green-200 font-bold">
                    Email
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="pl-10 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-password" className="text-green-200 font-bold">
                    Senha
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 bg-black/60 border-2 border-green-500/50 text-white font-semibold"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 hover:from-green-500 hover:via-emerald-600 hover:to-teal-700 font-black text-xl py-6 shadow-2xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg border-2 border-green-500/50">
            <p className="text-xs text-green-100 text-center font-semibold">
              🔒 Seus dados estão seguros e criptografados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
