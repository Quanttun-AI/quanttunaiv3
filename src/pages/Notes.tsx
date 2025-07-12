
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Trash2, ExternalLink, StickyNote } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Notes = () => {
  const { user, updateUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const notes = user?.notes || [];
  const filteredNotes = notes.filter((note: any) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.activityTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteNote = async (noteKey: string) => {
    if (!user) return;

    const updatedNotes = user.notes.filter((note: any) => note.key !== noteKey);
    
    await updateUser({ notes: updatedNotes });
    
    toast({
      title: "Anotação excluída",
      description: "A anotação foi removida com sucesso."
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                Dashboard
              </Button>
            </Link>
            <div className="quantum-gradient p-2 rounded-lg">
              <StickyNote className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Minhas Anotações</h1>
              <p className="text-muted-foreground">Todas suas anotações de estudo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar anotações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <Card className="quantum-card text-center py-12">
            <CardContent>
              <div className="quantum-gradient p-4 rounded-full w-fit mx-auto mb-4">
                <StickyNote className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="mb-2">
                {notes.length === 0 ? "Nenhuma anotação ainda" : "Nenhuma anotação encontrada"}
              </CardTitle>
              <CardDescription className="mb-6">
                {notes.length === 0 
                  ? "Suas anotações de estudo aparecerão aqui conforme você for estudando."
                  : "Tente buscar com outros termos."
                }
              </CardDescription>
              {notes.length === 0 && (
                <Link to="/dashboard">
                  <Button className="quantum-gradient">
                    Ir para Dashboard
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                {filteredNotes.length} anotação{filteredNotes.length !== 1 ? 'ões' : ''} encontrada{filteredNotes.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredNotes.map((note: any) => (
              <Card key={note.key} className="quantum-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{note.activityTitle}</CardTitle>
                      <CardDescription>
                        {formatDate(note.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/study-activity/${note.routeId}/${note.activityId}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Atividade
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteNote(note.key)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                      {note.content}
                    </div>
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

export default Notes;
