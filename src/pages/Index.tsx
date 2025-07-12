
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Target, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="quantum-gradient p-4 rounded-full quantum-glow">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
            Quanttun AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Conhecimento em escala quântica? <span className="font-bold text-violet-700">Só com Quanttun AI!</span>
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Transforme seu aprendizado com rotas de estudo personalizadas por IA. 
            Domine qualquer assunto de forma estruturada e eficiente.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="quantum-gradient text-white px-8 py-3 text-lg hover:scale-105 transition-transform">
                Começar Agora
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg hover:scale-105 transition-transform">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="quantum-card text-center">
            <CardHeader>
              <div className="mx-auto quantum-gradient-secondary p-3 rounded-full w-fit mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">IA Personalizada</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Rotas de estudo criadas especialmente para você, considerando seu nível e tempo disponível.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="quantum-card text-center">
            <CardHeader>
              <div className="mx-auto quantum-gradient p-3 rounded-full w-fit mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Aprendizado Estruturado</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Técnicas comprovadas como Pomodoro, flashcards e mapas mentais integradas ao seu plano.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="quantum-card text-center">
            <CardHeader>
              <div className="mx-auto quantum-gradient-secondary p-3 rounded-full w-fit mb-4">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Progresso Gamificado</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Acompanhe seu progresso, ganhe pontos e mantenha-se motivado em sua jornada de aprendizado.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="quantum-gradient rounded-2xl p-8 max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para revolucionar seus estudos?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Junte-se a milhares de estudantes que já transformaram seu aprendizado.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg hover:scale-105 transition-transform">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
