# 08 — Modelo de Base de Datos

## 1. Esquema SQL Completo (Supabase / PostgreSQL)

### 1.1 Tabla: profiles

```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT NOT NULL DEFAULT '',
  avatar_url  TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_email ON profiles(email);
```

### 1.2 Tabla: user_roles

```sql
CREATE TABLE user_roles (
  user_id     UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'seller', 'buyer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 1.3 Tabla: categories

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort ON categories(sort_order);
```

### 1.4 Tabla: subcategories

```sql
CREATE TABLE subcategories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

CREATE INDEX idx_subcategories_category ON subcategories(category_id);
CREATE INDEX idx_subcategories_slug ON subcategories(slug);
```

### 1.5 Tabla: businesses

```sql
CREATE TABLE businesses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  logo_url     TEXT,
  category_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
  address      TEXT,
  city         TEXT,
  commune      TEXT,
  whatsapp     TEXT NOT NULL,
  instagram    TEXT,
  facebook     TEXT,
  schedule     JSONB,
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_commune ON businesses(commune);
CREATE INDEX idx_businesses_active ON businesses(is_active);
```

### 1.6 Tabla: products

```sql
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  currency        TEXT NOT NULL DEFAULT 'CLP',
  category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  subcategory_id  UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  stock           INTEGER,
  is_unlimited_stock BOOLEAN NOT NULL DEFAULT false,
  is_available    BOOLEAN NOT NULL DEFAULT true,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  status          TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  sku             TEXT,
  view_count      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  UNIQUE(business_id, slug)
);

CREATE INDEX idx_products_business ON products(business_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_deleted ON products(deleted_at);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('spanish', name || ' ' || COALESCE(description, '')));
```

### 1.7 Tabla: product_images

```sql
CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_sort ON product_images(product_id, sort_order);
```

### 1.8 Tabla: favorites

```sql
CREATE TABLE favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_product ON favorites(product_id);
```

### 1.9 Tabla: product_views

```sql
CREATE TABLE product_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_views_product ON product_views(product_id);
CREATE INDEX idx_product_views_created ON product_views(created_at DESC);
```

### 1.10 Tabla: whatsapp_clicks

```sql
CREATE TABLE whatsapp_clicks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_wa_clicks_product ON whatsapp_clicks(product_id);
CREATE INDEX idx_wa_clicks_business ON whatsapp_clicks(business_id);
CREATE INDEX idx_wa_clicks_created ON whatsapp_clicks(created_at DESC);
```

### 1.11 Tabla: business_views

```sql
CREATE TABLE business_views (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_views_business ON business_views(business_id);
CREATE INDEX idx_business_views_created ON business_views(created_at DESC);
```

### 1.12 Tabla: search_logs

```sql
CREATE TABLE search_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query          TEXT,
  filters        JSONB,
  results_count  INTEGER NOT NULL DEFAULT 0,
  user_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_search_logs_created ON search_logs(created_at DESC);
CREATE INDEX idx_search_logs_query ON search_logs(query);
```

### 1.13 Tabla: reported_products

```sql
CREATE TABLE reported_products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reported_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason       TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at  TIMESTAMPTZ
);

CREATE INDEX idx_reported_products_status ON reported_products(status);
CREATE INDEX idx_reported_products_product ON reported_products(product_id);
```

---

## 2. Triggers

### 2.1 Crear perfil automáticamente al registrarse

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'buyer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2.2 Actualizar updated_at automáticamente

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subcategories_updated_at BEFORE UPDATE ON subcategories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2.3 Incrementar view_count al insertar product_view

```sql
CREATE OR REPLACE FUNCTION increment_product_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET view_count = view_count + 1 WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_product_view_inserted
  AFTER INSERT ON product_views
  FOR EACH ROW EXECUTE FUNCTION increment_product_view_count();
```

### 2.4 Generar slug automáticamente si no se proporciona

```sql
CREATE OR REPLACE FUNCTION generate_business_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(
      regexp_replace(
        translate(NEW.name, 'áéíóúÁÉÍÓÚñÑ', 'aeiouaeiounn'),
        '[^a-z0-9]+', '-', 'g'
      )
    ) || '-' || substr(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_business_insert
  BEFORE INSERT ON businesses
  FOR EACH ROW EXECUTE FUNCTION generate_business_slug();

CREATE OR REPLACE FUNCTION generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(
      regexp_replace(
        translate(NEW.name, 'áéíóúÁÉÍÓÚñÑ', 'aeiouaeiounn'),
        '[^a-z0-9]+', '-', 'g'
      )
    ) || '-' || substr(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_product_insert
  BEFORE INSERT ON products
  FOR EACH ROW EXECUTE FUNCTION generate_product_slug();
```

### 2.5 Actualizar rol a seller al crear negocio

```sql
CREATE OR REPLACE FUNCTION set_seller_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_roles SET role = 'seller' WHERE user_id = NEW.owner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_business_created
  AFTER INSERT ON businesses
  FOR EACH ROW EXECUTE FUNCTION set_seller_role();
```

---

## 3. Políticas RLS (Row Level Security)

### 3.1 Habilitar RLS en todas las tablas

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reported_products ENABLE ROW LEVEL SECURITY;
```

### 3.2 Funciones helper

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_owner_of_business(business_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM businesses
    WHERE id = business_uuid AND owner_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### 3.3 Políticas: profiles

```sql
CREATE POLICY "profiles_select_self_or_admin"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_update_self"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_self"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 3.4 Políticas: user_roles

```sql
CREATE POLICY "user_roles_select_self_or_admin"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "user_roles_insert_admin"
  ON user_roles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "user_roles_update_admin"
  ON user_roles FOR UPDATE
  USING (is_admin());
```

### 3.5 Políticas: categories

```sql
CREATE POLICY "categories_select_all"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "categories_insert_admin"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "categories_update_admin"
  ON categories FOR UPDATE
  USING (is_admin());

CREATE POLICY "categories_delete_admin"
  ON categories FOR DELETE
  USING (is_admin());
```

### 3.6 Políticas: subcategories

```sql
CREATE POLICY "subcategories_select_all"
  ON subcategories FOR SELECT
  USING (true);

CREATE POLICY "subcategories_insert_admin"
  ON subcategories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "subcategories_update_admin"
  ON subcategories FOR UPDATE
  USING (is_admin());

CREATE POLICY "subcategories_delete_admin"
  ON subcategories FOR DELETE
  USING (is_admin());
```

### 3.7 Políticas: businesses

```sql
CREATE POLICY "businesses_select_active_or_owner"
  ON businesses FOR SELECT
  USING (is_active = true OR owner_id = auth.uid() OR is_admin());

CREATE POLICY "businesses_insert_owner"
  ON businesses FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "businesses_update_owner_or_admin"
  ON businesses FOR UPDATE
  USING (owner_id = auth.uid() OR is_admin());

CREATE POLICY "businesses_delete_owner"
  ON businesses FOR DELETE
  USING (owner_id = auth.uid());
```

### 3.8 Políticas: products

```sql
CREATE POLICY "products_select_published_or_owner_or_admin"
  ON products FOR SELECT
  USING (
    (status = 'published' AND deleted_at IS NULL)
    OR auth.uid() IN (SELECT owner_id FROM businesses WHERE id = products.business_id)
    OR is_admin()
  );

CREATE POLICY "products_insert_business_owner"
  ON products FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT owner_id FROM businesses WHERE id = products.business_id)
  );

CREATE POLICY "products_update_business_owner_or_admin"
  ON products FOR UPDATE
  USING (
    auth.uid() IN (SELECT owner_id FROM businesses WHERE id = products.business_id)
    OR is_admin()
  );

CREATE POLICY "products_delete_business_owner_or_admin"
  ON products FOR DELETE
  USING (
    auth.uid() IN (SELECT owner_id FROM businesses WHERE id = products.business_id)
    OR is_admin()
  );
```

### 3.9 Políticas: product_images

```sql
CREATE POLICY "product_images_select_all"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "product_images_insert_owner"
  ON product_images FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT b.owner_id FROM businesses b
      JOIN products p ON p.business_id = b.id
      WHERE p.id = product_images.product_id
    )
  );

CREATE POLICY "product_images_update_owner"
  ON product_images FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT b.owner_id FROM businesses b
      JOIN products p ON p.business_id = b.id
      WHERE p.id = product_images.product_id
    )
  );

CREATE POLICY "product_images_delete_owner"
  ON product_images FOR DELETE
  USING (
    auth.uid() IN (
      SELECT b.owner_id FROM businesses b
      JOIN products p ON p.business_id = b.id
      WHERE p.id = product_images.product_id
    )
  );
```

### 3.10 Políticas: favorites

```sql
CREATE POLICY "favorites_select_owner"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_owner"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_owner"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### 3.11 Políticas: product_views

```sql
CREATE POLICY "product_views_insert_all"
  ON product_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "product_views_select_owner_or_admin"
  ON product_views FOR SELECT
  USING (
    auth.uid() IN (
      SELECT b.owner_id FROM businesses b
      JOIN products p ON p.business_id = b.id
      WHERE p.id = product_views.product_id
    )
    OR is_admin()
  );
```

### 3.12 Políticas: whatsapp_clicks

```sql
CREATE POLICY "wa_clicks_insert_all"
  ON whatsapp_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "wa_clicks_select_owner_or_admin"
  ON whatsapp_clicks FOR SELECT
  USING (
    auth.uid() IN (SELECT owner_id FROM businesses WHERE id = whatsapp_clicks.business_id)
    OR is_admin()
  );
```

### 3.13 Políticas: business_views

```sql
CREATE POLICY "business_views_insert_all"
  ON business_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "business_views_select_owner_or_admin"
  ON business_views FOR SELECT
  USING (
    auth.uid() IN (SELECT owner_id FROM businesses WHERE id = business_views.business_id)
    OR is_admin()
  );
```

### 3.14 Políticas: search_logs

```sql
CREATE POLICY "search_logs_insert_all"
  ON search_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "search_logs_select_admin"
  ON search_logs FOR SELECT
  USING (is_admin());
```

### 3.15 Políticas: reported_products

```sql
CREATE POLICY "reported_insert_authenticated"
  ON reported_products FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "reported_select_admin"
  ON reported_products FOR SELECT
  USING (is_admin());

CREATE POLICY "reported_update_admin"
  ON reported_products FOR UPDATE
  USING (is_admin());
```

---

## 4. Buckets de Storage

```sql
INSERT INTO storage.buckets (id, name, public) VALUES
  ('product-images', 'product-images', true),
  ('business-logos', 'business-logos', true),
  ('user-avatars', 'user-avatars', true);
```

### Políticas de Storage

```sql
-- product-images: público lectura, solo owner escritura
CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "product_images_owner_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IN (
      SELECT b.owner_id FROM businesses b
      JOIN products p ON p.business_id = b.id
    )
  );

CREATE POLICY "product_images_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images'
    AND auth.uid() IN (
      SELECT b.owner_id FROM businesses b
      JOIN products p ON p.business_id = b.id
    )
  );

-- business-logos: público lectura, solo owner escritura
CREATE POLICY "business_logos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'business-logos');

CREATE POLICY "business_logos_owner_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'business-logos'
    AND auth.uid() IN (SELECT owner_id FROM businesses)
  );

CREATE POLICY "business_logos_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'business-logos'
    AND auth.uid() IN (SELECT owner_id FROM businesses)
  );

-- user-avatars: público lectura, solo self escritura
CREATE POLICY "user_avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "user_avatars_self_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' AND auth.uid() = owner
  );

CREATE POLICY "user_avatars_self_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars' AND auth.uid() = owner
  );
```

---

## 5. Datos Iniciales (Seed)

### Categorías base

```sql
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Alimentos y Bebidas', 'alimentos-y-bebidas', '🍔', 1),
  ('Moda y Calzado', 'moda-y-calzado', '👕', 2),
  ('Tecnología y Electrónica', 'tecnologia-y-electronica', '💻', 3),
  ('Hogar y Decoración', 'hogar-y-decoracion', '🏠', 4),
  ('Belleza y Cuidado Personal', 'belleza-y-cuidado-personal', '💄', 5),
  ('Salud y Bienestar', 'salud-y-bienestar', '💊', 6),
  ('Deportes y Aire Libre', 'deportes-y-aire-libre', '⚽', 7),
  ('Juguetes y Niños', 'juguetes-y-ninos', '🧸', 8),
  ('Mascotas', 'mascotas', '🐾', 9),
  ('Servicios', 'servicios', '🔧', 10),
  ('Artesanías y Manualidades', 'artesanias-y-manualidades', '🎨', 11),
  ('Otros', 'otros', '📦', 12);
```

### Ciudades base (para filtros)

```sql
CREATE TABLE cities (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO cities (name, sort_order) VALUES
  ('Santiago', 1),
  ('Valparaíso', 2),
  ('Concepción', 3),
  ('Antofagasta', 4),
  ('Viña del Mar', 5),
  ('La Serena', 6),
  ('Rancagua', 7),
  ('Temuco', 8),
  ('Puerto Montt', 9),
  ('Arica', 10);
```

> **Nota:** La tabla `cities` se usa para autocompletar y estandarizar filtros. Las comunas se pueden manejar como texto libre en el MVP o con una tabla relacionada en una fase posterior.
