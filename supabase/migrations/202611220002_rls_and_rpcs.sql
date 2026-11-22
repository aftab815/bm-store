create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_inventory enable row level security;
alter table public.product_images enable row level security;
alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.banners enable row level security;
alter table public.store_settings enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles own or admin"
on public.profiles for all
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "admin users readable by admins"
on public.admin_users for select
to authenticated
using (public.is_admin());

create policy "public visible categories"
on public.categories for select
to anon, authenticated
using (is_visible);
create policy "admins manage categories"
on public.categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public published products"
on public.products for select
to anon, authenticated
using (status = 'published');
create policy "admins manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public active variants"
on public.product_variants for select
to anon, authenticated
using (
  is_active and exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'published'
  )
);
create policy "admins manage variants"
on public.product_variants for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public inventory quantity"
on public.product_inventory for select
to anon, authenticated
using (
  exists (
    select 1
    from public.product_variants v
    join public.products p on p.id = v.product_id
    where v.id = variant_id and v.is_active and p.status = 'published'
  )
);
create policy "admins manage inventory"
on public.product_inventory for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public published product images"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'published'
  )
);
create policy "admins manage product images"
on public.product_images for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins read customers"
on public.customers for select
to authenticated
using (public.is_admin());
create policy "admins manage customers"
on public.customers for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins read addresses"
on public.addresses for select
to authenticated
using (public.is_admin());
create policy "admins manage addresses"
on public.addresses for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins read orders"
on public.orders for select
to authenticated
using (public.is_admin());
create policy "admins manage orders"
on public.orders for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins read order items"
on public.order_items for select
to authenticated
using (public.is_admin());
create policy "admins manage order items"
on public.order_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public enabled banners"
on public.banners for select
to anon, authenticated
using (is_enabled);
create policy "admins manage banners"
on public.banners for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public store settings"
on public.store_settings for select
to anon, authenticated
using (true);
create policy "admins manage store settings"
on public.store_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins manage coupons"
on public.coupons for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins read audit logs"
on public.audit_logs for select
to authenticated
using (public.is_admin());
create policy "admins write audit logs"
on public.audit_logs for insert
to authenticated
with check (public.is_admin());

create policy "public product image reads"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "admin product image upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

create policy "admin product image update"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

create policy "admin product image delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id,email,full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name','')
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
