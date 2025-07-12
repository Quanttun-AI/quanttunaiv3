
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

    if (!response.ok) {
      throw new Error("Erro ao criar conta");
    }

    // Criar registro na tabela users
    await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        email,
        name,
        routes: [],
        notes: [],
        points: 0
      })
    });

    return response.json();
  },

  async signIn({ email, password }: LoginCredentials) {
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

    if (!response.ok) {
      throw new Error("Credenciais inválidas");
    }

    return response.json();
  },

  async getUser(email: string): Promise<User | null> {
    const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${email}&select=*`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      }
    });

    const data = await response.json();
    return data[0] || null;
  },

  async updateUser(email: string, updates: Partial<User>) {
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
      throw new Error("Erro ao atualizar dados");
    }

    return response.json();
  }
};
