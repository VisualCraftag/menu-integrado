# Mesa Viva - MVP de menu digital

Aplicacion web completa para demostrar un menu digital moderno integrado en un sitio de restaurante. Esta construida con Next.js 15, React, TypeScript, Tailwind CSS y Supabase.

## Ejecutar localmente

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:3000`.

Si no configuras Supabase, el sitio publico funciona en modo demo con categorias y 15 productos de ejemplo.

## Conectar Supabase

1. Crea un proyecto en Supabase.
2. Copia `.env.example` a `.env.local`.
3. Completa estas variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. En Supabase, abre SQL Editor y ejecuta el script:

```bash
supabase/schema.sql
```

El script crea:

- `categories`
- `products`
- `admins`
- relacion `products.category_id -> categories.id`
- bucket publico `menu-images`
- policies de lectura publica para menu e imagenes
- permisos de escritura para usuarios autenticados
- datos de ejemplo

## Administrador local de prueba

El panel `/admin` no usa Supabase Auth en este MVP. Usa una sesion local con cookie para poder probar rapido.

Credenciales:

```bash
Usuario: Admin
Password: 123
URL: http://localhost:3000/admin
```

Para que este panel pueda crear, editar, borrar y subir imagenes usando solo la anon key, ejecuta tambien:

```bash
supabase/demo-anon-admin-policies.sql
```

Estas policies son solo para demo local porque permiten escritura con la clave anonima. Para produccion, cambia esto por Supabase Auth, service role en servidor o policies ligadas a usuarios reales.

## Funciones incluidas

- Sitio responsive con navbar: Inicio, Nosotros, Menu y Contacto.
- Menu visual tipo app con tarjetas grandes, categorias navegables, buscador y orden por precio.
- Carga de datos desde Supabase y suscripciones realtime.
- Panel `/admin` protegido con login local de prueba.
- CRUD de categorias.
- CRUD de productos.
- Subida de imagenes a Supabase Storage en el bucket `menu-images`.
- Guardado de URL publica en `products.image_url`.
- Validacion de formularios con Zod.
- Middleware para refrescar sesion de Supabase.

## Preparar Realtime

Para que los cambios del panel aparezcan instantaneamente en el menu publico:

1. En Supabase, abre Database > Replication.
2. Activa realtime para las tablas `categories` y `products`.

## Scripts

```bash
npm run dev
npm run build
npm run start
```
