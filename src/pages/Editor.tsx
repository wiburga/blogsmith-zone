import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, ArrowLeft } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    checkAuth();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    
    if (id) {
      fetchPost();
    }
  };

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al cargar",
        description: error.message,
      });
      navigate("/admin");
      return;
    }

    if (data) {
      setTitle(data.title);
      setContent(data.content);
      setExcerpt(data.excerpt || "");
      setExistingImage(data.featured_image || "");
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const uploadImage = async () => {
    if (!featuredImage) return existingImage;

    const fileExt = featuredImage.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('post-images')
      .upload(filePath, featuredImage);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSave = async (publish: boolean = false) => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: "El título y contenido son obligatorios",
      });
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage();
      const slug = generateSlug(title);

      const postData = {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200).replace(/<[^>]*>/g, ''),
        featured_image: imageUrl,
        author_id: user.id,
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
      };

      if (id) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([postData]);

        if (error) throw error;
      }

      toast({
        title: publish ? "¡Publicado!" : "Guardado como borrador",
        description: "Tu publicación ha sido guardada exitosamente",
      });

      navigate("/admin");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{id ? "Editar Publicación" : "Nueva Publicación"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Escribe un título atractivo..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Extracto</Label>
              <Input
                id="excerpt"
                placeholder="Breve descripción (opcional)"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen Destacada</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              {existingImage && !featuredImage && (
                <img src={existingImage} alt="Preview" className="mt-2 h-32 rounded object-cover" />
              )}
            </div>

            <div className="space-y-2">
              <Label>Contenido *</Label>
              <div className="border rounded-md">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  className="min-h-[300px]"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={loading}
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" />
                Guardar Borrador
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Guardando..." : "Publicar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Editor;
