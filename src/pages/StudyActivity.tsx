
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Play, Pause, Square, Lightbulb, StickyNote, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { StudyRoute, StudyActivity as StudyActivityType, pollinationsClient } from "@/lib/pollinationsClient";
import { toast } from "@/hooks/use-toast";

const StudyActivity = () => {
  const { routeId, activityId } = useParams();
  const { user, updateUser } = useAuth();
  
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [note, setNote] = useState("");
  const [detailedExplanation, setDetailedExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const route: StudyRoute | undefined = user?.routes?.find(r => r.id === routeId);
  const activity: StudyActivityType | undefined = route?.activities.find(a => a.id === parseInt(activityId || "0"));

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timer]);

  // Load existing note
  useEffect(() => {
    if (user && routeId && activityId) {
      const noteKey = `${routeId}_${activityId}`;
      const existingNote = user.notes?.find((n: any) => n.key === noteKey);
      if (existingNote) {
        setNote(existingNote.content);
      }
    }
  }, [user, routeId, activityId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const stopTimer = () => {
    setIsRunning(false);
    setTimer(0);
  };

  const saveNote = async () => {
    if (!user || !routeId || !activityId) return;

    const noteKey = `${routeId}_${activityId}`;
    const newNote = {
      key: noteKey,
      routeId,
      activityId,
      activityTitle: activity?.title || "",
      content: note,
      createdAt: new Date().toISOString()
    };

    const existingNotes = user.notes || [];
    const noteIndex = existingNotes.findIndex((n: any) => n.key === noteKey);
    
    let updatedNotes;
    if (noteIndex >= 0) {
      updatedNotes = [...existingNotes];
      updatedNotes[noteIndex] = newNote;
    } else {
      updatedNotes = [...existingNotes, newNote];
    }

    await updateUser({ notes: updatedNotes });
    
    toast({
      title: "Anotação salva!",
      description: "Sua anotação foi salva com sucesso."
    });
  };

  const generateExplanation = async () => {
    if (!activity) return;
    
    setLoadingExplanation(true);
    try {
      const explanation = await pollinationsClient.generateDetailedExplanation(activity.content);
      setDetailedExplanation(explanation);
    } catch (error) {
      toast({
        title: "Erro ao gerar explicação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setLoadingExplanation(false);
    }
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

  if (!route || !activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center">
        <Card className="quantum-card text-center">
          <CardContent className="pt-6">
            <CardTitle>Atividade não encontrada</CardTitle>
            <CardDescription className="mt-2 mb-4">
              A atividade solicitada não existe.
            </CardDescription>
            <Link to="/dashboard">
              <Button>Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to={`/study-route/${routeId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{activity.title}</h1>
              <p className="text-muted-foreground">{route.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Info */}
            <Card className="quantum-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{activity.title}</CardTitle>
                    <CardDescription className="mt-2">{activity.description}</CardDescription>
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
            </Card>

            {/* Study Content */}
            <Card className="quantum-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Conteúdo de Estudo</CardTitle>
                  <Button 
                    onClick={generateExplanation}
                    disabled={loadingExplanation}
                    variant="outline"
                  >
                    {loadingExplanation ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Lightbulb className="h-4 w-4 mr-2" />
                    )}
                    Explicação Detalhada
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{activity.content}</div>
                </div>
                
                {detailedExplanation && (
                  <div className="mt-6 p-4 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
                    <h4 className="font-semibold text-violet-700 dark:text-violet-300 mb-2">
                      Explicação Detalhada por IA
                    </h4>
                    <div className="prose prose-sm max-w-none dark:prose-invert text-violet-800 dark:text-violet-200">
                      <div className="whitespace-pre-wrap">{detailedExplanation}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exercises */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle>Exercícios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{activity.exercises}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timer */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle>Cronômetro de Estudo</CardTitle>
                <CardDescription>Duração sugerida: {activity.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-4 font-mono">
                    {formatTime(timer)}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button 
                      onClick={startTimer} 
                      disabled={isRunning}
                      size="sm"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={pauseTimer} 
                      disabled={!isRunning}
                      variant="outline"
                      size="sm"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={stopTimer}
                      variant="outline"
                      size="sm"
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle>Anotações</CardTitle>
                <CardDescription>Faça suas anotações durante o estudo</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Digite suas anotações aqui..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={8}
                  className="mb-4"
                />
                <Button onClick={saveNote} className="w-full" variant="outline">
                  <StickyNote className="h-4 w-4 mr-2" />
                  Salvar Anotação
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyActivity;
