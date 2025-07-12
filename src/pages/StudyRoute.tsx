
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Trophy, CheckCircle, Circle, BookOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { StudyRoute as StudyRouteType } from "@/lib/pollinationsClient";
import { toast } from "@/hooks/use-toast";

const StudyRoute = () => {
  const { routeId } = useParams();
  const { user, updateUser } = useAuth();

  const route: StudyRouteType | undefined = user?.routes?.find(r => r.id === routeId);

  const markActivityCompleted = async (activityId: number) => {
    if (!user || !route) return;

    const updatedRoute = {
      ...route,
      activities: route.activities.map(activity => 
        activity.id === activityId ? { ...activity, completed: true } : activity
      ),
      completedActivities: route.completedActivities + 1
    };

    const updatedRoutes = user.routes.map(r => 
      r.id === routeId ? updatedRoute : r
    );

    // Calculate points based on difficulty
    const activity = route.activities.find(a => a.id === activityId);
    const pointsToAdd = activity?.difficulty === "Difícil" ? 30 : 
                      activity?.difficulty === "Médio" ? 20 : 10;

    await updateUser({ 
      routes: updatedRoutes,
      points: (user.points || 0) + pointsToAdd
    });

    toast({
      title: "Atividade concluída!",
      description: `Você ganhou ${pointsToAdd} pontos!`
    });
  };

  const getTechniqueColor = (technique: string) => {
    const lowerTechnique = technique.toLowerCase();
    if (lowerTechnique.includes('pomodoro')) return 'technique-pomodoro';
    if (lowerTechnique.includes('flashcard')) return 'technique-flashcards';
    if (lowerTechnique.includes('resumo')) return 'technique-resumo';
    if (lowerTechnique.includes('prática') || lowerTechnique.includes('pratica')) return 'technique-pratica';
    if (lowerTechnique.includes('mind') || lowerTechnique.includes('mapa')) return 'technique-mindmap';
    return 'technique-pomodoro';
  };

  const getDifficultyColor = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty.includes('fácil') || lowerDifficulty.includes('facil')) return 'difficulty-easy';
    if (lowerDifficulty.includes('médio') || lowerDifficulty.includes('medio')) return 'difficulty-medium';
    if (lowerDifficulty.includes('difícil') || lowerDifficulty.includes('dificil')) return 'difficulty-hard';
    return 'difficulty-medium';
  };

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center">
        <Card className="quantum-card text-center">
          <CardContent className="pt-6">
            <CardTitle>Rota não encontrada</CardTitle>
            <CardDescription className="mt-2 mb-4">
              A rota solicitada não existe ou foi removida.
            </CardDescription>
            <Link to="/dashboard">
              <Button>Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = (route.completedActivities / route.activities.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{route.title}</h1>
              <p className="text-muted-foreground">{route.subject}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Route Info */}
        <Card className="quantum-card mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="mb-2">{route.title}</CardTitle>
                <CardDescription>{route.description}</CardDescription>
              </div>
              <Badge variant="secondary">{route.dedication}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{route.dailyTime} min/dia</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{route.activities.length} atividades</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{route.completedActivities} concluídas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{Math.round(progressPercentage)}% completo</span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Activities */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Atividades</h2>
          
          {route.activities.map((activity, index) => (
            <Card key={activity.id} className={`quantum-card ${activity.completed ? 'opacity-75' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {activity.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground mt-1" />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {index + 1}. {activity.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {activity.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getTechniqueColor(activity.technique)}>
                      {activity.technique}
                    </Badge>
                    <Badge className={getDifficultyColor(activity.difficulty)}>
                      {activity.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/study-activity/${routeId}/${activity.id}`}>
                      <Button variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Estudar
                      </Button>
                    </Link>
                    {!activity.completed && (
                      <Button 
                        onClick={() => markActivityCompleted(activity.id)}
                        className="quantum-gradient"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Concluir
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyRoute;
