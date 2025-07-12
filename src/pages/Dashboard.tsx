import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Plus, BookOpen, Trophy, Clock, Target, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { StudyRoute } from "@/lib/pollinationsClient";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<StudyRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.email) {
        try {
          const userData = await supabaseClient.getUser(user.email);
          if (userData && userData.routes) {
            setRoutes(userData.routes);
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
        }
      }
      setLoading(false);
    };

    loadUserData();
  }, [user?.email]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-spin mx-auto mb-4 text-violet-700" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const totalActivities = routes.reduce((acc, route) => acc + route.activities.length, 0);
  const completedActivities = routes.reduce((acc, route) => acc + route.completedActivities, 0);
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="quantum-gradient p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Olá, {user?.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/notes">
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Anotações
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="quantum-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos Totais</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-700">{user?.points || 0}</div>
            </CardContent>
          </Card>

          <Card className="quantum-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rotas de Estudo</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{routes.length}</div>
            </CardContent>
          </Card>

          <Card className="quantum-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atividades</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedActivities}/{totalActivities}</div>
            </CardContent>
          </Card>

          <Card className="quantum-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Suas Rotas de Estudo</h2>
            <p className="text-muted-foreground">Gerencie e acompanhe seu progresso</p>
          </div>
          <Link to="/create-route">
            <Button className="quantum-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Nova Rota
            </Button>
          </Link>
        </div>

        {/* Routes Grid */}
        {routes.length === 0 ? (
          <Card className="quantum-card text-center py-12">
            <CardContent>
              <div className="quantum-gradient p-4 rounded-full w-fit mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="mb-2">Nenhuma rota criada ainda</CardTitle>
              <CardDescription className="mb-6">
                Crie sua primeira rota de estudo personalizada com IA
              </CardDescription>
              <Link to="/create-route">
                <Button className="quantum-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Rota
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card key={route.id} className="quantum-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-2">{route.title}</CardTitle>
                    <Badge variant="secondary" className="ml-2 shrink-0">
                      {route.dedication}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {route.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{route.completedActivities}/{route.activities.length}</span>
                    </div>
                    <Progress 
                      value={(route.completedActivities / route.activities.length) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{route.dailyTime} min/dia</span>
                      <span>{route.activities.length} atividades</span>
                    </div>
                    <Link to={`/study-route/${route.id}`}>
                      <Button className="w-full" variant="outline">
                        Continuar Estudos
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
