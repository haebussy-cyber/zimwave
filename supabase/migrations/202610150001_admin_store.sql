create extension if not exists pgcrypto;

create sequence if not exists public.order_number_seq;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  category text,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key check (id = 1),
  content jsonb not null default '{}'::jsonb,
  low_stock_threshold integer not null default 3 check (low_stock_threshold between 0 and 1000),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  payment_status text not null check (payment_status in ('paid', 'pending-cod', 'verifying')),
  fulfillment_status text not null check (fulfillment_status in ('confirmed', 'packing', 'dispatching', 'delivered', 'cancelled')),
  total_usd numeric(12,2) not null check (total_usd >= 0),
  data jsonb not null,
  inventory_released boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_customer_phone_idx on public.orders (customer_phone);

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Public reads catalog" on public.products;
create policy "Public reads catalog" on public.products for select to anon, authenticated using (true);

drop policy if exists "Public reads active categories" on public.categories;
create policy "Public reads active categories" on public.categories for select to anon, authenticated using (active);

drop policy if exists "Public reads homepage content" on public.site_settings;
create policy "Public reads homepage content" on public.site_settings for select to anon, authenticated using (true);

revoke all on public.admin_users, public.orders from anon, authenticated;
revoke insert, update, delete on public.products, public.categories, public.site_settings from anon, authenticated;
grant select on public.products, public.categories, public.site_settings to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog-images', 'catalog-images', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.place_customer_order(p_order jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_product jsonb;
  v_variant jsonb;
  v_variant_index integer;
  v_variants jsonb;
  v_order_items jsonb := '[]'::jsonb;
  v_subtotal numeric(12,2) := 0;
  v_delivery_fee numeric(12,2) := 0;
  v_total numeric(12,2);
  v_quantity integer;
  v_stock integer;
  v_product_id text;
  v_variant_id text;
  v_delivery_method text := p_order->>'delivery_method';
  v_payment_method text := p_order->>'payment_method';
  v_payment_status text;
  v_order_id uuid := gen_random_uuid();
  v_order_number text := 'ZM-' || lpad(nextval('public.order_number_seq')::text, 7, '0');
  v_result jsonb;
begin
  if jsonb_typeof(p_order->'items') <> 'array' or jsonb_array_length(p_order->'items') not between 1 and 20 then
    raise exception 'INVALID_ORDER';
  end if;

  for v_item in select value from jsonb_array_elements(p_order->'items')
  loop
    v_product_id := v_item->>'productId';
    v_variant_id := v_item->>'variantId';
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity < 1 or v_quantity > 20 then raise exception 'INVALID_QUANTITY'; end if;

    select data into v_product from public.products where id = v_product_id for update;
    if not found then raise exception 'PRODUCT_NOT_FOUND'; end if;

    select (entry.ordinality - 1)::integer, entry.value
      into v_variant_index, v_variant
      from jsonb_array_elements(v_product->'variants') with ordinality as entry(value, ordinality)
      where entry.value->>'id' = v_variant_id;
    if v_variant is null then raise exception 'VARIANT_NOT_FOUND'; end if;
    v_stock := (v_variant->>'stock')::integer;
    if v_stock < v_quantity then raise exception 'INSUFFICIENT_STOCK'; end if;

    v_subtotal := v_subtotal + ((v_variant->>'priceUSD')::numeric * v_quantity);
    v_variants := (
      select jsonb_agg(
        case when (entry.ordinality - 1)::integer = v_variant_index
          then jsonb_set(entry.value, '{stock}', to_jsonb(v_stock - v_quantity))
          else entry.value
        end order by entry.ordinality
      )
      from jsonb_array_elements(v_product->'variants') with ordinality as entry(value, ordinality)
    );
    update public.products
      set data = jsonb_set(v_product, '{variants}', v_variants), updated_at = now()
      where id = v_product_id;

    v_order_items := v_order_items || jsonb_build_array(jsonb_build_object(
      'productId', v_product_id,
      'variantId', v_variant_id,
      'productName', v_product->>'name',
      'variantLabel', coalesce(v_variant->>'storage', '') || ' - ' || coalesce(v_variant->>'colorName', ''),
      'priceUSD', (v_variant->>'priceUSD')::numeric,
      'quantity', v_quantity,
      'image', v_variant->>'image'
    ));
  end loop;

  if v_delivery_method = 'harare-same-day' then
    v_delivery_fee := case when v_subtotal >= 100 then 0 else 5 end;
  elsif v_delivery_method = 'chitungwiza-same-day' then v_delivery_fee := 7;
  elsif v_delivery_method = 'provincial-courier' then v_delivery_fee := 10;
  elsif v_delivery_method not in ('store-pickup-eastgate', 'store-pickup-avondale', 'store-pickup-bulawayo') then
    raise exception 'INVALID_DELIVERY_METHOD';
  end if;
  if v_payment_method not in ('ecocash', 'paynow', 'onemoney', 'cod', 'store-pay') then
    raise exception 'INVALID_PAYMENT_METHOD';
  end if;
  v_total := v_subtotal + v_delivery_fee;
  v_payment_status := case when v_payment_method = 'cod' then 'pending-cod' else 'verifying' end;
  v_result := jsonb_build_object(
    'id', v_order_id,
    'orderNumber', v_order_number,
    'createdAt', now(),
    'customerName', p_order->>'customer_name',
    'customerPhone', p_order->>'customer_phone',
    'customerEmail', p_order->>'customer_email',
    'deliveryCity', p_order->>'delivery_city',
    'deliveryAddress', p_order->>'delivery_address',
    'deliveryMethod', v_delivery_method,
    'deliveryFeeUSD', v_delivery_fee,
    'paymentMethod', v_payment_method,
    'paymentPhone', p_order->>'payment_phone',
    'paymentStatus', v_payment_status,
    'subtotalUSD', v_subtotal,
    'discountUSD', 0,
    'totalUSD', v_total,
    'totalZWL', v_total * 28.5,
    'exchangeRate', 28.5,
    'items', v_order_items,
    'status', 'confirmed',
    'trackingUpdates', jsonb_build_array(jsonb_build_object(
      'status', 'Order Placed',
      'timestamp', now(),
      'description', 'Order received. Payment is awaiting independent verification.'
    ))
  );
  insert into public.orders (
    id, order_number, customer_name, customer_phone, customer_email,
    payment_status, fulfillment_status, total_usd, data
  ) values (
    v_order_id, v_order_number, p_order->>'customer_name', p_order->>'customer_phone',
    nullif(p_order->>'customer_email', ''), v_payment_status, 'confirmed', v_total, v_result
  );
  return v_result;
end;
$$;

revoke all on function public.place_customer_order(jsonb) from public, anon, authenticated;
grant execute on function public.place_customer_order(jsonb) to service_role;

create or replace function public.admin_save_product(p_product jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id text := p_product->>'id';
  v_current jsonb;
  v_variants jsonb;
  v_product jsonb;
begin
  select data into v_current from public.products where id = v_id for update;
  if found then
    v_variants := (
      select jsonb_agg(
        case when current_variant.value is not null
          then jsonb_set(submitted_variant.value, '{stock}', current_variant.value->'stock')
          else submitted_variant.value
        end order by submitted_variant.ordinality
      )
      from jsonb_array_elements(p_product->'variants') with ordinality as submitted_variant(value, ordinality)
      left join lateral (
        select item.value
        from jsonb_array_elements(v_current->'variants') as item(value)
        where item.value->>'id' = submitted_variant.value->>'id'
        limit 1
      ) current_variant on true
    );
    v_product := jsonb_set(p_product, '{variants}', v_variants);
    update public.products
      set slug = v_product->>'slug', category = nullif(v_product->>'category', ''),
          data = v_product, updated_at = now()
      where id = v_id;
  else
    v_product := p_product;
    insert into public.products (id, slug, category, data)
      values (v_id, v_product->>'slug', nullif(v_product->>'category', ''), v_product);
  end if;
  return v_product;
end;
$$;

revoke all on function public.admin_save_product(jsonb) from public, anon, authenticated;
grant execute on function public.admin_save_product(jsonb) to service_role;

create or replace function public.set_variant_stock(p_product_id text, p_variant_id text, p_quantity integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product jsonb;
  v_variant_index integer;
  v_variant jsonb;
  v_variants jsonb;
begin
  if p_quantity < 0 or p_quantity > 100000 then raise exception 'INVALID_QUANTITY'; end if;
  select data into v_product from public.products where id = p_product_id for update;
  if not found then raise exception 'PRODUCT_NOT_FOUND'; end if;
  select (entry.ordinality - 1)::integer, entry.value
    into v_variant_index, v_variant
    from jsonb_array_elements(v_product->'variants') with ordinality as entry(value, ordinality)
    where entry.value->>'id' = p_variant_id;
  if v_variant is null then raise exception 'VARIANT_NOT_FOUND'; end if;
  v_variants := (
    select jsonb_agg(
      case when (entry.ordinality - 1)::integer = v_variant_index
        then jsonb_set(entry.value, '{stock}', to_jsonb(p_quantity))
        else entry.value
      end order by entry.ordinality
    )
    from jsonb_array_elements(v_product->'variants') with ordinality as entry(value, ordinality)
  );
  v_product := jsonb_set(v_product, '{variants}', v_variants);
  update public.products set data = v_product, updated_at = now() where id = p_product_id;
  return v_product;
end;
$$;

revoke all on function public.set_variant_stock(text, text, integer) from public, anon, authenticated;
grant execute on function public.set_variant_stock(text, text, integer) to service_role;

create or replace function public.cancel_unpaid_order(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item jsonb;
  v_product jsonb;
  v_variant jsonb;
  v_variant_index integer;
  v_variants jsonb;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if v_order.payment_status = 'paid' then raise exception 'PAID_ORDER_CANNOT_BE_CANCELLED'; end if;
  if v_order.fulfillment_status <> 'cancelled' then
    update public.orders set fulfillment_status = 'cancelled', data = jsonb_set(data, '{status}', '"cancelled"'::jsonb), updated_at = now()
      where id = p_order_id returning * into v_order;
  end if;
  if not v_order.inventory_released then
    for v_item in select value from jsonb_array_elements(v_order.data->'items')
    loop
      select data into v_product from public.products where id = v_item->>'productId' for update;
      if not found then continue; end if;
      select (entry.ordinality - 1)::integer, entry.value
        into v_variant_index, v_variant
        from jsonb_array_elements(v_product->'variants') with ordinality as entry(value, ordinality)
        where entry.value->>'id' = v_item->>'variantId';
      if v_variant is null then continue; end if;
      v_variants := (
        select jsonb_agg(
          case when (entry.ordinality - 1)::integer = v_variant_index
            then jsonb_set(entry.value, '{stock}', to_jsonb((entry.value->>'stock')::integer + (v_item->>'quantity')::integer))
            else entry.value
          end order by entry.ordinality
        )
        from jsonb_array_elements(v_product->'variants') with ordinality as entry(value, ordinality)
      );
      update public.products set data = jsonb_set(v_product, '{variants}', v_variants), updated_at = now()
        where id = v_item->>'productId';
    end loop;
    update public.orders set inventory_released = true, updated_at = now() where id = p_order_id;
  end if;
  return v_order.data || jsonb_build_object('status', 'cancelled');
end;
$$;

revoke all on function public.cancel_unpaid_order(uuid) from public, anon, authenticated;
grant execute on function public.cancel_unpaid_order(uuid) to service_role;

create or replace function public.admin_store_summary()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'productCount', (select count(*) from public.products),
    'inStock', (select count(*) from public.products p cross join lateral jsonb_array_elements(p.data->'variants') as variant(value) where (variant.value->>'stock')::integer > 0),
    'outOfStock', (select count(*) from public.products p cross join lateral jsonb_array_elements(p.data->'variants') as variant(value) where (variant.value->>'stock')::integer = 0),
    'lowStock', (select count(*) from public.products p cross join lateral jsonb_array_elements(p.data->'variants') as variant(value) cross join public.site_settings s where (variant.value->>'stock')::integer > 0 and (variant.value->>'stock')::integer <= s.low_stock_threshold and s.id = 1),
    'totalOrders', (select count(*) from public.orders),
    'pendingOrders', (select count(*) from public.orders where payment_status <> 'paid' or fulfillment_status <> 'delivered'),
    'salesUSD', (select coalesce(sum(total_usd), 0) from public.orders where payment_status = 'paid'),
    'customers', (select count(distinct customer_phone) from public.orders)
  );
$$;

revoke all on function public.admin_store_summary() from public, anon, authenticated;
grant execute on function public.admin_store_summary() to service_role;

create or replace function public.admin_save_category(p_id text, p_name text, p_slug text, p_sort_order integer, p_active boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_name text;
begin
  select name into v_old_name from public.categories where id = p_id for update;
  insert into public.categories (id, name, slug, sort_order, active)
    values (p_id, p_name, p_slug, p_sort_order, p_active)
    on conflict (id) do update set name = excluded.name, slug = excluded.slug,
      sort_order = excluded.sort_order, active = excluded.active;
  if v_old_name is not null and v_old_name <> p_name then
    update public.products
      set category = p_name, data = jsonb_set(data, '{category}', to_jsonb(p_name)), updated_at = now()
      where category = v_old_name;
  end if;
end;
$$;

revoke all on function public.admin_save_category(text, text, text, integer, boolean) from public, anon, authenticated;
grant execute on function public.admin_save_category(text, text, text, integer, boolean) to service_role;

create or replace function public.admin_delete_category(p_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  select name into v_name from public.categories where id = p_id for update;
  if v_name is null then raise exception 'CATEGORY_NOT_FOUND'; end if;
  update public.products
    set category = null, data = data - 'category', updated_at = now()
    where category = v_name;
  delete from public.categories where id = p_id;
end;
$$;

revoke all on function public.admin_delete_category(text) from public, anon, authenticated;
grant execute on function public.admin_delete_category(text) to service_role;
