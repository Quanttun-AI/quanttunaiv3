
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
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

    // Verificar se o usuário já existe
    const existingUser = await this.getUser(email);
    if (existingUser) {
      throw new Error("Este email já está cadastrado");
    }

    // Criar registro na tabela users
    const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        email,
        name,
        password, // Agora salvamos a senha no banco
        routes: [],
        notes: [],
        points: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log('Erro ao criar registro do usuário:', errorData);
      throw new Error("Erro ao criar conta");
    }

    const userData = await response.json();
    return userData[0];
  },

  async signIn({ email, password }: LoginCredentials) {
    console.log('Tentando fazer login para:', email);
    
    // Buscar usuário no banco de dados
    const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${email}&password=eq.${password}&select=*`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao verificar credenciais");
    }

    const users = await response.json();
    
    if (users.length === 0) {
      throw new Error("Email ou senha incorretos");
    }

    return users[0];
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
