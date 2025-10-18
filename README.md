# 📝 Blog Profesional con React + Lovable Cloud

![Blog Demo](src/assets/hero-blog.jpg)

Un blog moderno y completo con sistema de gestión de contenidos (CMS), autenticación de usuarios, roles y permisos, inspirado en plataformas como Medium y Dev.to.

## 🎯 Características Principales

### ✨ Funcionalidades del Blog
- **CRUD Completo de Publicaciones**: Crear, leer, actualizar y eliminar posts
- **Editor WYSIWYG**: Editor de texto enriquecido con ReactQuill para formateo avanzado
- **Subida de Imágenes**: Sistema de almacenamiento de imágenes destacadas para cada post
- **Sistema de Borradores**: Guarda publicaciones como borradores antes de publicar
- **Generación Automática de Slugs**: URLs amigables generadas automáticamente desde el título
- **Extractos/Resúmenes**: Previsualización breve de cada artículo en las vistas de lista
- **Timestamps Automáticos**: Fechas de creación y actualización gestionadas automáticamente

### 🔐 Sistema de Autenticación y Roles
- **Autenticación Completa**: Registro e inicio de sesión con email/password
- **Sistema de Roles**: Dos roles diferenciados (Admin y Editor)
- **Protección de Rutas**: Rutas protegidas según el rol del usuario
- **Gestión de Sesiones**: Persistencia automática de sesión

#### Permisos por Rol

**👑 Administrador (Admin)**
- ✅ Ver todas las publicaciones (propias y de otros)
- ✅ Crear nuevas publicaciones
- ✅ Editar sus propias publicaciones
- ✅ Eliminar cualquier publicación
- ✅ Publicar/despublicar cualquier post
- ✅ Acceso completo al panel de administración

**✏️ Editor**
- ✅ Ver sus propias publicaciones
- ✅ Crear nuevas publicaciones
- ✅ Editar sus propias publicaciones
- ✅ Eliminar sus propias publicaciones
- ✅ Publicar/despublicar sus propios posts
- ❌ No puede gestionar posts de otros usuarios

### 🎨 Diseño y UX
- **Diseño Moderno**: Paleta de colores púrpura/azul profesional
- **Totalmente Responsive**: Optimizado para móvil, tablet y desktop
- **Modo Oscuro**: Soporte completo para tema claro/oscuro
- **Animaciones Suaves**: Transiciones y efectos visuales elegantes
- **Tipografía Clara**: Enfocada en legibilidad y jerarquía visual

## 🗄️ Estructura de Base de Datos

### Tablas Principales

#### `profiles` - Perfiles de Usuario
```sql
- id (uuid, PK): ID del usuario
- email (text): Email del usuario
- display_name (text): Nombre para mostrar
- avatar_url (text): URL del avatar
- role (enum): Rol del usuario (admin/editor)
- created_at (timestamp): Fecha de creación
- updated_at (timestamp): Fecha de actualización
```

**Políticas RLS:**
- ✅ Todos pueden ver todos los perfiles
- ✅ Los usuarios solo pueden actualizar su propio perfil

#### `posts` - Publicaciones
```sql
- id (uuid, PK): ID de la publicación
- title (text): Título del post
- slug (text, único): URL amigable
- content (text): Contenido HTML del post
- excerpt (text): Resumen/extracto
- featured_image (text): URL de imagen destacada
- author_id (uuid, FK): Referencia al autor (profiles.id)
- published (boolean): Estado de publicación
- published_at (timestamp): Fecha de publicación
- created_at (timestamp): Fecha de creación
- updated_at (timestamp): Fecha de actualización
```

**Políticas RLS:**
- ✅ Todos pueden ver posts publicados
- ✅ Los autores pueden ver sus propios posts (publicados o no)
- ✅ Los editores pueden crear posts (solo asociados a su user_id)
- ✅ Los autores pueden actualizar sus propios posts
- ✅ Los autores pueden eliminar sus propios posts
- ✅ Los admins pueden eliminar cualquier post

### 📦 Storage Buckets

#### `post-images` - Almacenamiento de Imágenes
- **Público**: Sí
- **Uso**: Imágenes destacadas de publicaciones

**Políticas de Storage:**
- ✅ Usuarios autenticados pueden subir imágenes a su carpeta
- ✅ Usuarios autenticados pueden actualizar sus propias imágenes
- ✅ Usuarios autenticados pueden eliminar sus propias imágenes

## 🚀 Guía de Uso

### Para Usuarios Finales (Lectores)

1. **Ver el Blog**: Visita la página principal (`/`) para ver todos los posts publicados
2. **Leer un Post**: Haz clic en cualquier tarjeta de post para leer el artículo completo
3. **Sin Registro Necesario**: Puedes leer todo el contenido sin necesidad de crear cuenta

### Para Editores y Administradores

#### 1️⃣ Crear una Cuenta
1. Ve a `/auth`
2. Completa el formulario de registro con tu email y contraseña
3. Tu cuenta se creará automáticamente con rol de **Editor**
4. Serás redirigido automáticamente a la página principal

> ⚠️ **Nota**: El primer usuario debe ser promovido manualmente a Admin usando el backend de Lovable Cloud.

#### 2️⃣ Acceder al Panel de Administración
1. Inicia sesión en `/auth`
2. Haz clic en "Panel Admin" en la barra de navegación
3. Verás la lista de tus publicaciones (o todas si eres admin)

#### 3️⃣ Crear una Nueva Publicación
1. En el panel admin, haz clic en "Nueva Publicación"
2. **Completa los campos**:
   - **Título**: El nombre de tu post (se generará un slug automático)
   - **Extracto**: Un resumen breve para las vistas de lista
   - **Imagen Destacada**: Sube una imagen desde tu computadora
   - **Contenido**: Usa el editor WYSIWYG para escribir tu artículo
3. **Guarda o Publica**:
   - **"Guardar Borrador"**: Guarda sin publicar (solo tú lo verás)
   - **"Publicar"**: Publica inmediatamente (visible para todos)

#### 4️⃣ Editar una Publicación Existente
1. En el panel admin, haz clic en el ícono de edición (✏️) junto al post
2. Modifica los campos que necesites
3. Guarda los cambios

#### 5️⃣ Gestionar Publicaciones
- **Publicar/Despublicar**: Usa el botón toggle en la lista de posts
- **Eliminar**: Haz clic en el ícono de eliminación (🗑️)
  - Editores solo pueden eliminar sus propios posts
  - Admins pueden eliminar cualquier post

#### 6️⃣ Cerrar Sesión
- Haz clic en "Cerrar Sesión" en la barra de navegación

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server
- **React Router**: Enrutamiento
- **TanStack Query**: Gestión de estado del servidor
- **ReactQuill**: Editor WYSIWYG
- **Tailwind CSS**: Framework de estilos
- **shadcn/ui**: Componentes de UI
- **Lucide React**: Iconos

### Backend (Lovable Cloud)
- **Supabase**: Backend as a Service
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Authentication
  - Storage
  - Real-time subscriptions

## 🔧 Instalación y Desarrollo Local

### Prerrequisitos
- Node.js 18+ y npm instalados
- Cuenta en Lovable (para backend)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
El archivo `.env` ya está configurado automáticamente con:
```env
VITE_SUPABASE_URL=<tu-url-de-supabase>
VITE_SUPABASE_PUBLISHABLE_KEY=<tu-key-publica>
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir en navegador**
```
http://localhost:5173
```

## 📁 Estructura del Proyecto

```
src/
├── assets/              # Imágenes y recursos estáticos
├── components/          # Componentes React reutilizables
│   ├── ui/             # Componentes de UI (shadcn)
│   └── Navbar.tsx      # Barra de navegación
├── hooks/              # Custom hooks
├── integrations/       # Integraciones externas
│   └── supabase/      # Cliente y tipos de Supabase
├── lib/               # Utilidades y helpers
├── pages/             # Páginas/rutas de la aplicación
│   ├── Index.tsx      # Página principal (lista de posts)
│   ├── Post.tsx       # Vista de post individual
│   ├── Admin.tsx      # Panel de administración
│   ├── Editor.tsx     # Editor de posts
│   ├── Auth.tsx       # Autenticación (login/registro)
│   └── NotFound.tsx   # Página 404
└── App.tsx            # Componente raíz y rutas
```

## 🔒 Seguridad

### Row Level Security (RLS)
Todas las tablas tienen políticas RLS habilitadas que aseguran:
- Los usuarios solo pueden modificar su propio contenido
- Los posts no publicados solo son visibles para sus autores
- Los admins tienen permisos elevados donde es apropiado

### Autenticación
- Las contraseñas se hashean automáticamente
- Las sesiones se gestionan de forma segura
- Auto-confirmación de email habilitada (desarrollo)

### Validación
- Validación de formularios en cliente y servidor
- Sanitización de contenido HTML
- Protección contra SQL injection (RLS policies)

## 🚀 Despliegue

### Opción 1: Lovable (Recomendado)
1. Haz clic en "Publish" en el editor de Lovable
2. Tu app estará disponible en `<tu-proyecto>.lovable.app`
3. Opcionalmente, conecta un dominio personalizado en Settings > Domains

### Opción 2: Otros Servicios
- **Vercel**: `vercel --prod`
- **Netlify**: Conecta tu repositorio de Git
- **GitHub Pages**: `npm run build` y sube la carpeta `dist`

## 📚 Próximas Funcionalidades Sugeridas

- [ ] **Sistema de Categorías**: Organizar posts por temas
- [ ] **Sistema de Comentarios**: Permitir interacción de lectores
- [ ] **Búsqueda**: Buscar posts por título o contenido
- [ ] **Tags/Etiquetas**: Sistema de etiquetado flexible
- [ ] **Estadísticas**: Vistas y analytics de posts
- [ ] **SEO Mejorado**: Meta tags dinámicos por post
- [ ] **Compartir en Redes Sociales**: Botones de compartir
- [ ] **RSS Feed**: Feed para lectores RSS
- [ ] **Modo de Lectura**: Vista optimizada para lectura
- [ ] **Notificaciones**: Alertas para nuevas publicaciones

## 🤝 Contribuir

Este proyecto fue creado con Lovable. Para contribuir:

1. Clona el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

- **Documentación de Lovable**: [https://docs.lovable.dev/](https://docs.lovable.dev/)
- **Comunidad Discord**: [Lovable Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)

## 📊 Project Info

**URL del Proyecto**: https://lovable.dev/projects/589d5c14-72ca-4345-9a29-c22fcfdeddd0

---

**Hecho con ❤️ usando Lovable**
