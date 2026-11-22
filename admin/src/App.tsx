import { FormEvent, useEffect, useState } from "react";
import { supabase } from "./supabase";

type Page =
  | "Dashboard"
  | "Products"
  | "Categories"
  | "Orders"
  | "Customers"
  | "Inventory"
  | "Coupons"
  | "Banners"
  | "Analytics"
  | "Settings"
  | "Profile";

type TableRow = Record<string, unknown>;

const nav: Page[] = [
  "Dashboard","Products","Categories","Orders","Customers","Inventory",
  "Coupons","Banners","Analytics","Settings","Profile",
];

export function App() {
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [page, setPage] = useState<Page>("Dashboard");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) {
        const { data: role } = await supabase
          .from("admin_users")
          .select("role")
          .eq("user_id", data.session.user.id)
          .maybeSingle();
        setAdmin(Boolean(role));
      }
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAdmin(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return <ShellError message="Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." />;
  }
  if (loading) return <main className="admin-loading">Loading admin…</main>;
  if (!session) return <Login onLoggedIn={() => window.location.reload()} />;
  if (!admin) return <AccessDenied />;

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">BM <span>SOLICITOR</span></div>
        <nav>
          {nav.map((item) => (
            <button key={item} className={page === item ? "active" : ""} onClick={() => setPage(item)}>
              {item}
            </button>
          ))}
        </nav>
        <button className="logout" onClick={() => supabase.auth.signOut().then(() => window.location.reload())}>
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div><small>ADMINISTRATION</small><h1>{page}</h1></div>
        </header>
        <section className="admin-content">
          {page === "Dashboard" && <Dashboard />}
          {page === "Products" && <ProductManager />}
          {page === "Categories" && <CategoryManager />}
          {page === "Orders" && <OrderManager />}
          {page === "Customers" && <DataTable table="customers" title="Customers" />}
          {page === "Inventory" && <InventoryManager />}
          {page === "Coupons" && <DataTable table="coupons" title="Coupons" />}
          {page === "Banners" && <BannerManager />}
          {page === "Analytics" && <Analytics />}
          {page === "Settings" && <SettingsManager />}
          {page === "Profile" && <Profile />}
        </section>
      </main>
    </div>
  );
}

function Login({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError(authError.message);
    else onLoggedIn();
    setBusy(false);
  }
  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand">BM <span>SOLICITOR</span></div>
        <small>ADMIN PORTAL</small>
        <h1>Sign in</h1>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p className="error">{error}</p>}
        <button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

function ShellError({ message }: { message: string }) {
  return <main className="admin-loading"><strong>BM Solicitor Admin</strong><p>{message}</p></main>;
}

function AccessDenied() {
  return (
    <main className="access-denied">
      <h1>Access denied</h1>
      <p>This account is not registered as an administrator.</p>
      <button onClick={() => supabase?.auth.signOut().then(() => location.reload())}>Sign out</button>
    </main>
  );
}

function Dashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<TableRow[]>([]);
  useEffect(() => {
    if (!supabase) return;
    Promise.all([
      supabase.from("orders").select("id,status,total",{ count:"exact", head:true }),
      supabase.from("products").select("id",{ count:"exact", head:true }),
      supabase.from("customers").select("id",{ count:"exact", head:true }),
      supabase.from("orders").select("id,status,total,reference,created_at").order("created_at",{ascending:false}).limit(8),
      supabase.from("orders").select("status"),
    ]).then(([orders,products,customers,recentOrders,statuses]) => {
      const counts: Record<string,number> = {
        orders: orders.count || 0,
        products: products.count || 0,
        customers: customers.count || 0,
      };
      for (const row of statuses.data || []) {
        const status = String(row.status);
        counts[status] = (counts[status] || 0) + 1;
      }
      setStats(counts);
      setRecent(recentOrders.data || []);
    });
  }, []);
  return (
    <div>
      <div className="stats-grid">
        {[
          ["Total orders","orders"],["Pending","pending"],["Confirmed","confirmed"],
          ["Delivered","delivered"],["Products","products"],["Customers","customers"],
        ].map(([label,key]) => (
          <article key={key}><span>{label}</span><strong>{stats[key] || 0}</strong></article>
        ))}
      </div>
      <section className="panel">
        <h2>Recent orders</h2>
        <Table
          rows={recent}
          columns={[
            ["reference","Reference"],["customer_id","Customer"],["status","Status"],
            ["total","Total"],["created_at","Date"],
          ]}
        />
      </section>
    </div>
  );
}

function Table({ rows, columns }: { rows: TableRow[]; columns: [string,string][] }) {
  if (!rows.length) return <div className="empty-state">No records found.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{columns.map(([,label]) => <th key={label}>{label}</th>)}</tr></thead>
        <tbody>
          {rows.map((row,index) => (
            <tr key={String(row.id || index)}>
              {columns.map(([key]) => (
                <td key={key}>{formatValue(row[key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatValue(value: unknown) {
  if (value == null) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function DataTable({ table,title }: { table:string;title:string }) {
  const [rows,setRows] = useState<TableRow[]>([]);
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    if (!supabase) return;
    supabase.from(table).select("*").limit(200).then(({data}) => {
      setRows((data || []) as TableRow[]);
      setLoading(false);
    });
  }, [table]);
  const columns = rows[0]
    ? Object.keys(rows[0]).slice(0,8).map((key) => [key,key.replaceAll("_"," ").replace(/\b\w/g,(c) => c.toUpperCase())] as [string,string])
    : [["id","ID"],["created_at","Created"]];
  return <section className="panel"><div className="panel-heading"><h2>{title}</h2></div>{loading ? <p>Loading…</p> : <Table rows={rows} columns={columns} />}</section>;
}

function ProductManager() {
  const [rows,setRows] = useState<TableRow[]>([]);
  const [categories,setCategories] = useState<TableRow[]>([]);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");

  async function load() {
    if (!supabase) return;
    const [products,cats] = await Promise.all([
      supabase.from("products").select("*,categories(name)").order("created_at",{ascending:false}),
      supabase.from("categories").select("id,name").order("sort_order"),
    ]);
    setRows(products.data || []);
    setCategories(cats.data || []);
  }
  useEffect(() => { load(); },[]);

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    const slug = String(form.get("slug"));
    const { error } = await supabase.from("products").insert({
      name,
      slug,
      sku: String(form.get("sku")),
      category_id: String(form.get("category_id")),
      subcategory: String(form.get("subcategory") || ""),
      short_description: String(form.get("short_description") || ""),
      description: String(form.get("description") || ""),
      material: String(form.get("material") || ""),
      regular_price: Math.round(Number(form.get("regular_price")) * 100),
      sale_price: form.get("sale_price") ? Math.round(Number(form.get("sale_price")) * 100) : null,
      status: String(form.get("status")),
      is_featured: form.get("is_featured") === "on",
      is_new_arrival: form.get("is_new_arrival") === "on",
      is_best_seller: form.get("is_best_seller") === "on",
    });
    setMessage(error ? error.message : "Product created.");
    setBusy(false);
    if (!error) {
      event.currentTarget.reset();
      load();
    }
  }

  async function archiveProduct(id:string) {
    if (!supabase) return;
    await supabase.from("products").update({status:"archived"}).eq("id",id);
    load();
  }

  return (
    <div className="manager-grid">
      <section className="panel">
        <h2>Add product</h2>
        <form className="admin-form" onSubmit={createProduct}>
          <label>Product name<input name="name" required /></label>
          <label>Slug<input name="slug" required placeholder="mens-leather-jacket" /></label>
          <label>SKU<input name="sku" required /></label>
          <label>Category<select name="category_id" required><option value="">Select category</option>{categories.map((c) => <option key={String(c.id)} value={String(c.id)}>{String(c.name)}</option>)}</select></label>
          <label>Subcategory<input name="subcategory" /></label>
          <label>Regular price USD<input name="regular_price" type="number" min="0" step="0.01" required /></label>
          <label>Sale price USD<input name="sale_price" type="number" min="0" step="0.01" /></label>
          <label>Material<input name="material" /></label>
          <label>Short description<textarea name="short_description" /></label>
          <label>Detailed description<textarea name="description" /></label>
          <label>Status<select name="status"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          <label className="check"><input type="checkbox" name="is_featured" /> Featured</label>
          <label className="check"><input type="checkbox" name="is_new_arrival" /> New arrival</label>
          <label className="check"><input type="checkbox" name="is_best_seller" /> Best seller</label>
          <button disabled={busy}>{busy ? "Saving…" : "Create product"}</button>
          {message && <p className="notice">{message}</p>}
        </form>
      </section>
      <section className="panel">
        <h2>Products</h2>
        <Table rows={rows} columns={[["name","Name"],["sku","SKU"],["status","Status"],["regular_price","Price cents"],["is_featured","Featured"],["created_at","Created"]]} />
        {rows.map((row) => (
          <button key={String(row.id)} className="danger-small" onClick={() => archiveProduct(String(row.id))}>
            Archive {String(row.name)}
          </button>
        ))}
      </section>
    </div>
  );
}

function CategoryManager() {
  const [rows,setRows] = useState<TableRow[]>([]);
  async function load() {
    if (!supabase) return;
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setRows(data || []);
  }
  useEffect(() => { load(); },[]);
  async function create(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    await supabase.from("categories").insert({
      name:String(form.get("name")),
      slug:String(form.get("slug")),
      description:String(form.get("description") || ""),
      is_visible:form.get("is_visible") === "on",
    });
    event.currentTarget.reset();
    load();
  }
  return (
    <div className="manager-grid">
      <section className="panel"><h2>Add category</h2><form className="admin-form" onSubmit={create}>
        <label>Name<input name="name" required /></label>
        <label>Slug<input name="slug" required /></label>
        <label>Description<textarea name="description" /></label>
        <label className="check"><input type="checkbox" name="is_visible" defaultChecked /> Visible</label>
        <button>Create category</button>
      </form></section>
      <section className="panel"><h2>Categories</h2><Table rows={rows} columns={[["name","Name"],["slug","Slug"],["sort_order","Order"],["is_visible","Visible"]]} /></section>
    </div>
  );
}

function OrderManager() {
  const [rows,setRows] = useState<TableRow[]>([]);
  const [search,setSearch] = useState("");
  const [status,setStatus] = useState("");
  async function load() {
    if (!supabase) return;
    let query = supabase.from("orders").select("*,customers(full_name,email,phone),addresses(*)").order("created_at",{ascending:false}).limit(200);
    if (status) query = query.eq("status",status);
    const {data} = await query;
    setRows(data || []);
  }
  useEffect(() => { load(); },[status]);
  async function changeStatus(id:string,nextStatus:string) {
    if (!supabase) return;
    const {error} = await supabase.rpc("update_order_status",{
      p_order_id:id,
      p_status:nextStatus,
    });
    if (!error) load();
  }
  const filtered = rows.filter((row) => {
    const haystack = JSON.stringify(row).toLowerCase();
    return haystack.includes(search.toLowerCase());
  });
  return (
    <section className="panel">
      <div className="panel-heading"><h2>Orders</h2><div className="filters">
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search reference, name or phone" />
        <select value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {["pending","verification_required","confirmed","processing","packed","shipped","delivered","cancelled","returned"].map((item)=><option key={item} value={item}>{item.replaceAll("_"," ")}</option>)}
        </select>
      </div></div>
      {filtered.map((row) => (
        <article className="order-card" key={String(row.id)}>
          <div><small>#{String(row.reference)}</small><strong>{String(row.status).replaceAll("_"," ")}</strong></div>
          <div><span>Customer</span><b>{String((row.customers as TableRow | null)?.full_name || "—")}</b></div>
          <div><span>Total</span><b>${(Number(row.total)/100).toFixed(2)}</b></div>
          <select value={String(row.status)} onChange={(e)=>changeStatus(String(row.id),e.target.value)}>
            {["pending","verification_required","confirmed","processing","packed","shipped","delivered","cancelled","returned"].map((item)=><option key={item} value={item}>{item.replaceAll("_"," ")}</option>)}
          </select>
        </article>
      ))}
      {!filtered.length && <div className="empty-state">No matching orders.</div>}
    </section>
  );
}

function InventoryManager() {
  const [rows,setRows] = useState<TableRow[]>([]);
  async function load() {
    if (!supabase) return;
    const {data} = await supabase
      .from("product_variants")
      .select("id,sku,size,color,product_inventory(quantity),products(name)")
      .order("id");
    setRows(data || []);
  }
  useEffect(() => { load(); },[]);
  async function updateQuantity(variantId:string,quantity:number) {
    if (!supabase) return;
    await supabase.from("product_inventory").update({quantity:Math.max(0,quantity),updated_at:new Date().toISOString()}).eq("variant_id",variantId);
  }
  return (
    <section className="panel">
      <h2>Inventory</h2>
      {rows.map((row) => {
        const stock = (row.product_inventory as TableRow | null)?.quantity ?? 0;
        const product = row.products as TableRow | null;
        return (
          <article className="inventory-row" key={String(row.id)}>
            <div><strong>{String(product?.name || "Product")}</strong><small>{String(row.color || "—")} / {String(row.size || "—")} · {String(row.sku || "No SKU")}</small></div>
            <input type="number" min="0" defaultValue={Number(stock)} onBlur={(e)=>updateQuantity(String(row.id),Number(e.target.value))} />
          </article>
        );
      })}
      {!rows.length && <div className="empty-state">No variants found.</div>}
    </section>
  );
}

function BannerManager() {
  const [rows,setRows] = useState<TableRow[]>([]);
  async function load() {
    if (!supabase) return;
    const {data}=await supabase.from("banners").select("*").order("sort_order");
    setRows(data || []);
  }
  useEffect(()=>{load();},[]);
  async function create(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    const form=new FormData(event.currentTarget);
    await supabase.from("banners").insert({
      image_url:String(form.get("image_url")),
      heading:String(form.get("heading") || ""),
      description:String(form.get("description") || ""),
      button_text:String(form.get("button_text") || ""),
      button_destination:String(form.get("button_destination") || ""),
      is_enabled:form.get("is_enabled")==="on",
    });
    event.currentTarget.reset();
    load();
  }
  return <div className="manager-grid">
    <section className="panel"><h2>Add banner</h2><form className="admin-form" onSubmit={create}>
      <label>Image URL<input name="image_url" type="url" required /></label>
      <label>Heading<input name="heading" /></label>
      <label>Description<textarea name="description" /></label>
      <label>Button text<input name="button_text" /></label>
      <label>Button destination<input name="button_destination" /></label>
      <label className="check"><input type="checkbox" name="is_enabled" defaultChecked /> Enabled</label>
      <button>Create banner</button>
    </form></section>
    <section className="panel"><h2>Homepage banners</h2><Table rows={rows} columns={[["heading","Heading"],["image_url","Image"],["is_enabled","Enabled"],["sort_order","Order"]]} /></section>
  </div>;
}

function SettingsManager() {
  const [value,setValue] = useState("{}");
  const [message,setMessage] = useState("");
  useEffect(()=>{
    if(!supabase)return;
    supabase.from("store_settings").select("value").eq("key","store").maybeSingle().then(({data})=>{
      if(data) setValue(JSON.stringify(data.value,null,2));
    });
  },[]);
  async function save(event:FormEvent) {
    event.preventDefault();
    if(!supabase)return;
    try{
      const parsed=JSON.parse(value);
      const {error}=await supabase.from("store_settings").upsert({key:"store",value:parsed});
      setMessage(error?error.message:"Store settings saved.");
    }catch{
      setMessage("Invalid JSON.");
    }
  }
  return <section className="panel"><h2>Store settings</h2><form className="admin-form" onSubmit={save}>
    <label>JSON settings<textarea className="code-field" value={value} onChange={(e)=>setValue(e.target.value)} rows={16}/></label>
    <button>Save settings</button>{message&&<p className="notice">{message}</p>}
  </form></section>;
}

function Analytics() {
  return <section className="panel"><h2>Analytics</h2><p>Use real Supabase database metrics from the Dashboard. Add an analytics provider only after consent and domain configuration are approved.</p></section>;
}

function Profile() {
  const [email,setEmail]=useState("");
  useEffect(()=>{supabase?.auth.getUser().then(({data})=>setEmail(data.user?.email||""));},[]);
  async function resetPassword() {
    if(!supabase||!email)return;
    await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/`});
  }
  return <section className="panel"><h2>Admin profile</h2><p>{email}</p><button onClick={resetPassword}>Send password reset email</button></section>;
}
