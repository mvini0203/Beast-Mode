import { Camera, Upload, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ScannerComidaProps {
  imagemComida: string | null;
  analisandoComida: boolean;
  resultadoAnalise: any;
  onImagemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ScannerComida({ imagemComida, analisandoComida, resultadoAnalise, onImagemChange }: ScannerComidaProps) {
  return (
    <Card className="bg-black/40 border-purple-500/30 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-orange-400" />
          Scanner de Comida
        </CardTitle>
        <CardDescription className="text-purple-300">
          Tire uma foto da sua comida e descubra as calorias e proteínas instantaneamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload de Imagem */}
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-purple-500/50 rounded-lg bg-purple-900/10 hover:bg-purple-900/20 transition-colors">
          <Camera className="w-16 h-16 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tire ou envie uma foto</h3>
          <p className="text-sm text-purple-300 text-center mb-4">
            Fotografe sua refeição para análise nutricional automática
          </p>
          <label htmlFor="upload-comida" className="cursor-pointer">
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              <Upload className="w-4 h-4 mr-2" />
              Escolher Foto
            </Button>
            <input
              id="upload-comida"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onImagemChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Imagem Carregada */}
        {imagemComida && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={imagemComida}
                alt="Comida analisada"
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>

            {/* Loading */}
            {analisandoComida && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                <p className="text-purple-300">Analisando sua comida...</p>
              </div>
            )}

            {/* Resultado da Análise */}
            {resultadoAnalise && !analisandoComida && (
              <div className="space-y-4">
                {resultadoAnalise.erro ? (
                  <div className="p-4 bg-red-900/30 rounded-lg border border-red-500/50">
                    <p className="text-red-200 text-center">{resultadoAnalise.erro}</p>
                  </div>
                ) : (
                  <>
                    {/* Cards de Macros */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-lg">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs">Calorias</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{resultadoAnalise.calorias_estimadas}</div>
                          <p className="text-xs text-orange-100">kcal</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs">Proteína</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{resultadoAnalise.proteinas}</div>
                          <p className="text-xs text-green-100">gramas</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 text-white shadow-lg">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs">Carboidratos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{resultadoAnalise.carboidratos}</div>
                          <p className="text-xs text-yellow-100">gramas</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs">Gorduras</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{resultadoAnalise.gorduras}</div>
                          <p className="text-xs text-purple-100">gramas</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Alimentos Identificados */}
                    {resultadoAnalise.alimentos && resultadoAnalise.alimentos.length > 0 && (
                      <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                        <h4 className="font-semibold text-purple-200 mb-3">🍽️ Alimentos Identificados</h4>
                        <div className="flex flex-wrap gap-2">
                          {resultadoAnalise.alimentos.map((alimento: string, idx: number) => (
                            <Badge key={idx} className="bg-purple-600">
                              {alimento}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Porção Estimada */}
                    {resultadoAnalise.porcao_estimada && (
                      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                        <h4 className="font-semibold text-blue-200 mb-2">📏 Porção Estimada</h4>
                        <p className="text-sm text-blue-300">{resultadoAnalise.porcao_estimada}</p>
                      </div>
                    )}

                    {/* Observações */}
                    {resultadoAnalise.observacoes && (
                      <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                        <h4 className="font-semibold text-yellow-300 mb-2">💡 Observações</h4>
                        <p className="text-sm text-yellow-200">{resultadoAnalise.observacoes}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Dicas */}
        <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
          <h4 className="font-semibold text-purple-300 mb-2">📸 Dicas para melhor análise</h4>
          <ul className="space-y-1 text-sm text-purple-200">
            <li>✓ Tire a foto de cima, mostrando todo o prato</li>
            <li>✓ Certifique-se de que há boa iluminação</li>
            <li>✓ Evite sombras sobre a comida</li>
            <li>✓ Quanto mais clara a foto, melhor a análise</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
