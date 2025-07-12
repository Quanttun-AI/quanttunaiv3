
interface User {
  id: string;
  name: string;
  email: string;
  routes: any[];
  notes: any[];
  points: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const supabaseUrl = "https://hscuxtrojlrbhixejtbu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzY3V4dHJvamxyYmhpeGVqdGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjg5MjMsImV4cCI6MjA2NzkwNDkyM30._0JCS4WIcXwH9I1k5C5N1RLcjtjAhdDlB6ZgRwdmM1U";

export const supabaseClient = {
  async signUp({ email, password, name }: LoginCredentials & { name: string }) {
    console.log('Tentando criar conta para:', email);
    
    // Validar senha localmente antes de enviar
    if (password.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
      },
      body: JSON.stringify({
        email,
        password,
        data: { name }
      })
    });

    const authData = await response.json();
    console.log('Resposta do signup:', authData);

    if (!response.ok) {
      throw new Error(authData.msg || authData.error_description || "Erro ao criar conta");
    }

    // Criar registro na tabela users após sucesso na autenticação
    const userResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        id: authData.user?.id || crypto.randomUUID(),
        email,
        name,
        routes: [],
        notes: [],
        points: 0
      })
    });

    if (!userResponse.ok) {
      console.log('Erro ao criar registro do usuário:', await userResponse.text());
    }

    return authData;
  },

  async signIn({ email, password }: LoginCredentials) {
    console.log('Tentando fazer login para:', email);
    
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const authData = await response.json();
    console.log('Resposta do login:', authData);

    if (!response.ok) {
      throw new Error(authData.error_description || "Email ou senha incorretos");
    }

    return authData;
  },

  async getUser(email: string): Promise<User | null> {
    console.log('Buscando dados do usuário:', email);
    
    const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${email}&select=*`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      }
    });

    const data = await response.json();
    console.log('Dados do usuário encontrados:', data);
    
    return data[0] || null;
  },

  async updateUser(email: string, updates: Partial<User>) {
    console.log('Atualizando usuário:', email, updates);
    
    const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${email}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar dados do usuário");
    }

    return response.json();
  }
};
