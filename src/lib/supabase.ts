import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          email: string;
          nome: string;
          idade: number;
          genero: string;
          peso: number;
          altura: number;
          objetivo: string;
          nivel: string;
          dias_treino: number;
          usa_anabolizantes: boolean;
          is_vip: boolean;
          preferencias_alimentares: {
            alimentosGosta: string;
            alimentosNaoPodeFaltar: string;
            restricoes: string;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          nome: string;
          idade: number;
          genero: string;
          peso: number;
          altura: number;
          objetivo: string;
          nivel: string;
          dias_treino: number;
          usa_anabolizantes?: boolean;
          is_vip?: boolean;
          preferencias_alimentares?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nome?: string;
          idade?: number;
          genero?: string;
          peso?: number;
          altura?: number;
          objetivo?: string;
          nivel?: string;
          dias_treino?: number;
          usa_anabolizantes?: boolean;
          is_vip?: boolean;
          preferencias_alimentares?: any;
          updated_at?: string;
        };
      };
      ciclos_anabolizantes: {
        Row: {
          id: string;
          usuario_id: string;
          nome: string;
          dosagem: string;
          frequencia: string;
          data_inicio: string;
          duracao: number;
          observacoes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          nome: string;
          dosagem: string;
          frequencia: string;
          data_inicio: string;
          duracao: number;
          observacoes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          nome?: string;
          dosagem?: string;
          frequencia?: string;
          data_inicio?: string;
          duracao?: number;
          observacoes?: string | null;
        };
      };
      progresso_agua: {
        Row: {
          id: string;
          usuario_id: string;
          data: string;
          quantidade_ml: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          data: string;
          quantidade_ml: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          data?: string;
          quantidade_ml?: number;
        };
      };
    };
  };
};
