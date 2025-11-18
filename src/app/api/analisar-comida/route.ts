import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { imagem } = await request.json();

    if (!imagem) {
      return NextResponse.json(
        { erro: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // Analisar imagem com GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analise esta imagem de comida e forneça as seguintes informações em formato JSON:
              
              {
                "alimentos": ["lista de alimentos identificados"],
                "calorias_estimadas": número total estimado de calorias,
                "proteinas": gramas estimadas de proteína,
                "carboidratos": gramas estimadas de carboidratos,
                "gorduras": gramas estimadas de gorduras,
                "porcao_estimada": descrição da porção (ex: "1 prato médio", "200g"),
                "observacoes": "observações relevantes sobre a refeição"
              }
              
              Seja o mais preciso possível nas estimativas. Se não conseguir identificar claramente, indique isso nas observações.`
            },
            {
              type: 'image_url',
              image_url: {
                url: imagem
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const conteudo = response.choices[0].message.content;
    
    if (!conteudo) {
      throw new Error('Resposta vazia da API');
    }

    // Extrair JSON da resposta
    const jsonMatch = conteudo.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Não foi possível extrair dados da análise');
    }

    const resultado = JSON.parse(jsonMatch[0]);

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro ao analisar comida:', error);
    return NextResponse.json(
      { erro: 'Erro ao processar a imagem. Tente novamente.' },
      { status: 500 }
    );
  }
}
