
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Loader2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { pollinationsClient } from "@/lib/pollinationsClient";
import { toast } from "@/hooks/use-toast";

const CreateRoute = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    dailyTime: "30",
    difficulty: "Médio"
  });

  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    
    try {
      const newRoute = await pollinationsClient.generateStudyRoute(
        `${formData.subject}: ${formData.description}`,
        formData.dailyTime,
        formData.difficulty
      );

      const updatedRoutes = [...(user.routes || []), newRoute];
      
      await updateUser({ routes: updatedRoutes });
      
      toast({
        title: "Rota criada com sucesso!",
        description: "Sua nova rota de estudo está pronta."
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao criar rota:", error);
      toast({
        title: "Erro ao criar rota",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="quantum-gradient p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nova Rota de Estudo</h1>
              <p className="text-muted-foreground">Personalizada por IA para você</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="quantum-card">
            <CardHeader>
              <CardTitle>Conte-nos o que você quer aprender</CardTitle>
              <CardDescription>
                A IA do Quanttun criará uma rota de estudo personalizada baseada em suas preferências.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto Principal</Label>
                  <Input
                    id="subject"
                    placeholder="Ex: Matemática, História, Programação..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Detalhada</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva especificamente o que você quer aprender, qual seu objetivo, nível atual, etc."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daily-time">Tempo Diário (minutos)</Label>
                    <Select value={formData.dailyTime} onValueChange={(value) => setFormData({ ...formData, dailyTime: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="90">1h 30min</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Nível de Dificuldade</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fácil">Iniciante</SelectItem>
                        <SelectItem value="Médio">Intermediário</SelectItem>
                        <SelectItem value="Difícil">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full quantum-gradient text-lg py-6" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Gerando rota com IA...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Gerar Rota de Estudo
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <Card className="quantum-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="quantum-gradient-secondary p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Personalização IA</h3>
                    <p className="text-sm text-muted-foreground">
                      Cada rota é única para suas necessidades
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="quantum-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="quantum-gradient p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Técnicas Comprovadas</h3>
                    <p className="text-sm text-muted-foreground">
                      Pomodoro, flashcards e mais
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoute;
