create or replace function public.create_cod_order(
  p_idempotency_key text,
  p_customer jsonb,
  p_address jsonb,
  p_items jsonb,
  p_shipping_charges integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_address_id uuid;
  v_order_id uuid;
  v_reference text;
  v_item jsonb;
  v_variant record;
  v_quantity integer;
  v_subtotal integer := 0;
  v_unit_price integer;
  v_line_total integer;
  v_item_count integer := 0;
begin
  if coalesce(trim(p_idempotency_key),'') = '' then
    raise exception 'idempotency key is required';
  end if;

  if coalesce(jsonb_array_length(p_items),0) = 0 then
    raise exception 'cart is empty';
  end if;

  select o.id, o.reference into v_order_id, v_reference
  from public.orders o
  where o.idempotency_key = p_idempotency_key;

  if v_order_id is not null then
    return jsonb_build_object('reference',v_reference,'order_id',v_order_id,'duplicate',true);
  end if;

  if coalesce(trim(p_customer->>'email'),'') = ''
     or coalesce(trim(p_address->>'full_name'),'') = ''
     or coalesce(trim(p_address->>'phone'),'') = ''
     or coalesce(trim(p_address->>'line1'),'') = ''
     or coalesce(trim(p_address->>'city'),'') = ''
     or coalesce(trim(p_address->>'country'),'') = '' then
    raise exception 'customer and shipping information is incomplete';
  end if;

  if p_shipping_charges < 0 then
    raise exception 'shipping charges cannot be negative';
  end if;

  insert into public.customers (email,phone,full_name)
  values (
    lower(trim(p_customer->>'email')),
    trim(p_customer->>'phone'),
    trim(p_customer->>'full_name')
  )
  on conflict (email) do update
    set phone = excluded.phone,
        full_name = excluded.full_name
  returning id into v_customer_id;

  insert into public.addresses (
    customer_id,full_name,phone,line1,city,region,postal_code,country,is_default
  )
  values (
    v_customer_id,
    trim(p_address->>'full_name'),
    trim(p_address->>'phone'),
    trim(p_address->>'line1'),
    trim(p_address->>'city'),
    nullif(trim(p_address->>'region'),''),
    nullif(trim(p_address->>'postal_code'),''),
    trim(p_address->>'country'),
    true
  )
  returning id into v_address_id;

  v_reference := 'BMS-' || upper(replace(gen_random_uuid()::text,'-',''));
  insert into public.orders (
    reference,idempotency_key,customer_id,address_id,status,payment_method,payment_status,
    subtotal,shipping_charges,total
  )
  values (
    v_reference,p_idempotency_key,v_customer_id,v_address_id,'pending',
    'cash_on_delivery','unpaid',0,p_shipping_charges,p_shipping_charges
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := greatest(coalesce((v_item->>'quantity')::integer,0),0);
    v_item_count := v_item_count + v_quantity;
    if v_quantity < 1 or v_quantity > 20 then
      raise exception 'invalid item quantity';
    end if;

    select v.id,v.product_id,p.name,p.status,p.sku,inv.quantity,v.is_active,
           coalesce(v.sale_price,v.regular_price,p.sale_price,p.regular_price) as price,
           v.size,v.color,v.sku
    into v_variant
    from public.product_variants v
    join public.products p on p.id = v.product_id
    join public.product_inventory inv on inv.variant_id = v.id
    where v.id = (v_item->>'variant_id')::uuid
      and v.product_id = (v_item->>'product_id')::uuid
      for update;

    if not found then
      raise exception 'invalid product variant';
    end if;
    if v_variant.status <> 'published' or not v_variant.is_active or not v_variant.quantity >= v_quantity then
      raise exception 'product is unavailable';
    end if;

    v_unit_price := v_variant.price;
    v_line_total := v_unit_price * v_quantity;
    v_subtotal := v_subtotal + v_line_total;

    insert into public.order_items (
      order_id,product_id,variant_id,product_name,sku,size,color,unit_price,quantity,line_total
    )
    values (
      v_order_id,v_variant.product_id,v_variant.id,v_variant.name,
      coalesce(v_variant.sku,v_variant.sku),v_variant.size,v_variant.color,
      v_unit_price,v_quantity,v_line_total
    );

    update public.product_inventory
    set quantity = quantity - v_quantity, updated_at = now()
    where variant_id = v_variant.id;
  end loop;

  if v_item_count > 100 then
    raise exception 'cart contains too many items';
  end if;

  update public.orders
  set subtotal = v_subtotal,
      total = v_subtotal + p_shipping_charges,
      updated_at = now()
  where id = v_order_id;

  insert into public.audit_logs (action,entity_type,entity_id,metadata)
  values ('order_created','order',v_order_id::text,
          jsonb_build_object('reference',v_reference,'payment_method','cash_on_delivery'));

  return jsonb_build_object(
    'reference',v_reference,
    'order_id',v_order_id,
    'subtotal',v_subtotal,
    'shipping_charges',p_shipping_charges,
    'total',v_subtotal+p_shipping_charges,
    'duplicate',false
  );
end;
$$;

create or replace function public.update_order_status(p_order_id uuid,p_status order_status,p_note text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old order_status;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select status into v_old from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'order not found';
  end if;

  if v_old not in ('cancelled','returned') and p_status = 'cancelled' then
    update public.product_inventory inv
    set quantity = inv.quantity + oi.quantity, updated_at = now()
    from public.order_items oi
    where oi.order_id = p_order_id
      and inv.variant_id = oi.variant_id;
  end if;

  update public.orders
  set status = p_status,
      internal_notes = coalesce(p_note,internal_notes),
      updated_at = now()
  where id = p_order_id;

  insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata)
  values (
    auth.uid(),'status_changed','order',p_order_id::text,
    jsonb_build_object('from',v_old,'to',p_status,'note',p_note)
  );
end;
$$;

revoke all on function public.create_cod_order(text,jsonb,jsonb,jsonb,integer) from public;
grant execute on function public.create_cod_order(text,jsonb,jsonb,jsonb,integer) to anon,authenticated;
revoke all on function public.update_order_status(uuid,order_status,text) from public;
grant execute on function public.update_order_status(uuid,order_status,text) to authenticated;
