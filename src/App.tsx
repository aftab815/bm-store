import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { products, productSlugAliases, type Product } from "./products";

type Page =
  | "home"
  | "shop"
  | "men"
  | "women"
  | "unisex"
  | "overcoat"
  | "new-arrivals"
  | "product"
  | "cart"
  | "checkout"
  | "order-confirmation"
  | "account"
  | "wishlist"
  | "about"
  | "contact"
  | "faq"
  | "size-guide"
  | "track"
  | "privacy"
  | "terms"
  | "returns"
  | "shipping";
const collectionPath = (collection: string) => `shop?collection=${collection}`;

const pageTitles: Record<string, { eyebrow: string; title: string; copy: string }> = {
  about: {
    eyebrow: "OUR MAISON",
    title: "Designed for the life you lead.",
    copy: "BM Solicitor brings distinctive leather outerwear to modern wardrobes through confident silhouettes and considered details.",
  },
  privacy: {
    eyebrow: "LEGAL",
    title: "Privacy Policy",
    copy: "How we collect, use, and safeguard your personal information.",
  },
  terms: {
    eyebrow: "LEGAL",
    title: "Terms & Conditions",
    copy: "The terms that govern your experience with BM Solicitor.",
  },
  returns: {
    eyebrow: "CLIENT SERVICES",
    title: "Returns & Exchanges",
    copy: "Complimentary returns within 30 days, designed to make every purchase effortless.",
  },
  shipping: {
    eyebrow: "CLIENT SERVICES",
    title: "Shipping & Delivery",
    copy: "Complimentary express delivery on every order, worldwide.",
  },
};

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    bag: (
      <>
        <path d="M6 8h12l1 13H5L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    menu: (
      <>
        <path d="M3 7h18M3 12h18M3 17h18" />
      </>
    ),
    close: <path d="m5 5 14 14M19 5 5 19" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    truck: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </>
    ),
    shield: <path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3Zm-3 9 2 2 4-5" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function SocialIcon({ name }: { name: "instagram" | "facebook" | "tiktok" | "pinterest" }) {
  const paths = {
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>,
    facebook: <path d="M14 21v-8h3l.5-3H14V8.2c0-.9.3-1.5 1.7-1.5h1.9V4a24 24 0 0 0-2.8-.2C12 3.8 10 5.5 10 8.5V10H7v3h3v8h4Z" fill="currentColor" stroke="none" />,
    tiktok: <path d="M14 3v11.1a3.3 3.3 0 1 1-2.8-3.3V8a6.5 6.5 0 1 0 6 6.5V8.8a8 8 0 0 0 3.5.9V6.5c-3.4-.1-5.4-1.7-6.7-3.5Z" fill="currentColor" stroke="none" />,
    pinterest: <path d="M12 3a9 9 0 0 0-3.3 17.4c0-.8 0-1.8.2-2.7l1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.3 1.1.5 2 1.6 2 1.9 0 3.3-2.4 3.3-5.2 0-2.2-1.5-3.9-4.2-3.9-3 0-4.8 2.2-4.8 4.6 0 .8.2 1.5.7 2 .2.2.2.3.2.6l-.3 1c-.1.3-.3.4-.6.3-1.3-.5-1.9-1.9-1.9-3.5 0-2.6 2.2-5.8 6.8-5.8 3.6 0 6 2.6 6 5.4 0 3.7-2 6.5-5 6.5-1 0-2-.6-2.3-1.2l-.7 2.7c-.2 1-.8 1.9-1.2 2.6A9 9 0 1 0 12 3Z" fill="currentColor" stroke="none" />,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <button className={`logo ${light ? "logo-light" : ""}`} onClick={() => navigate("home")} aria-label="BM Solicitor home">
      <img src="/assets/images/bm-solicitor-logo.png" alt="BM Solicitor" />
    </button>
  );
}

let navigate = (_page: Page | string) => {};
let openDrawer = (_page: string) => {};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function Header({
  cartCount,
  wishlistCount,
  currentPage,
}: {
  cartCount: number;
  wishlistCount: number;
  currentPage: string;
}) {
  const [mobile, setMobile] = useState(false);
  const [mega, setMega] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const go = (page: Page | string) => {
    navigate(page);
    setMobile(false);
    setMega(false);
  };
  return (
    <>
      <div className="topbar">
        <a href="mailto:info@bmsolicitor.co"><Icon name="mail" size={14} />info@bmsolicitor.co</a>
        <span>COMPLIMENTARY WORLDWIDE SHIPPING</span>
        <div className="topbar-socials" aria-label="Social media">
          <span aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></span>
          <span aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></span>
          <span aria-label="TikTok" title="TikTok"><SocialIcon name="tiktok" /></span>
          <span aria-label="Pinterest" title="Pinterest"><SocialIcon name="pinterest" /></span>
        </div>
      </div>
      <header className={`header ${currentPage === "home" ? "header-overlay" : ""}`}>
        <button
          className="mobile-trigger"
          onClick={() => setMobile(!mobile)}
          aria-label={mobile ? "Close menu" : "Open menu"}
          aria-expanded={mobile}
        >
          <Icon name={mobile ? "close" : "menu"} />
        </button>
        <Logo />
        <nav className="desktop-nav">
          <button
            className={currentPage === "new-arrivals" ? "active" : ""}
            aria-current={currentPage === "new-arrivals" ? "page" : undefined}
            onClick={() => go("new-arrivals")}
          >
            NEW IN
          </button>
        <button
          className={currentPage === "men" ? "active" : ""}
          aria-current={currentPage === "men" ? "page" : undefined}
          onClick={() => go("men")}
        >
          MEN JACKETS
        </button>
        <button
          className={currentPage === "women" ? "active" : ""}
          aria-current={currentPage === "women" ? "page" : undefined}
          onClick={() => go("women")}
        >
          WOMEN JACKETS
        </button>
        <button
          className={currentPage === "overcoat" ? "active" : ""}
          aria-current={currentPage === "overcoat" ? "page" : undefined}
          onClick={() => go("overcoat")}
        >
          COATS
        </button>
        <button
          className={currentPage === "shop" ? "active" : ""}
          aria-current={currentPage === "shop" ? "page" : undefined}
          onClick={() => go("shop")}
        >
          ALL PRODUCTS
        </button>
        <button onClick={() => go("contact")}>BULK ORDERS</button>
        </nav>
        <div className="header-actions">
          <button
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Icon name="search" />
          </button>
          <button aria-label="Account" onClick={() => go("account")}>
            <Icon name="user" />
          </button>
          <button aria-label="Wishlist" onClick={() => go("wishlist")}>
            <Icon name="heart" />
            {wishlistCount > 0 && <b>{wishlistCount}</b>}
          </button>
          <button aria-label="Shopping bag" onClick={() => go("cart")}>
            <Icon name="bag" />
            <b>{cartCount}</b>
          </button>
        </div>
        {mega && (
          <div className="mega">
            <div>
              <small>SHOP BY COLLECTION</small>
              <button onClick={() => go("shop?collection=new")}>New Arrivals</button>
              <button onClick={() => go("shop?collection=best")}>Best Sellers</button>
              <button onClick={() => go("shop?collection=sale")}>Sale</button>
              <button onClick={() => go("shop?collection=premium")}>The Atelier Edit</button>
              <button onClick={() => go("shop")}>Winter Essentials</button>
              <button onClick={() => go("overcoat")}>Coats & Layers</button>
            </div>
            <div>
              <small>MEN</small>
              <button onClick={() => go("men")}>
                Puffer Jackets
              </button>
              <button onClick={() => go("men")}>
                Leather Jackets
              </button>
              <button onClick={() => go("men")}>
                Wool Coats
              </button>
              <button onClick={() => go("men")}>
                Bomber Jackets
              </button>
            </div>
            <div>
              <small>WOMEN</small>
              <button onClick={() => go("women")}>
                Long Coats
              </button>
              <button onClick={() => go("women")}>
                Cashmere Coats
              </button>
              <button onClick={() => go("women")}>
                Hooded Jackets
              </button>
              <button onClick={() => go("women")}>Shop All Women</button>
            </div>
            <button className="mega-image" onClick={() => go("product?slug=milano-espresso-leather-bomber")}>
              <img
                src="/assets/images/men/leather-bomber.png"
                alt="Model wearing the Milano Espresso Leather Bomber"
                loading="lazy"
              />
              <span>
                THE LEATHER EDIT <Icon name="arrow" size={16} />
              </span>
            </button>
          </div>
        )}
      </header>
      {searchOpen && (
        <form
          className="search-panel"
          onSubmit={(event) => {
            event.preventDefault();
            const query = new FormData(event.currentTarget).get("query")?.toString().trim();
            if (query) go(`shop?q=${encodeURIComponent(query)}`);
            setSearchOpen(false);
          }}
        >
          <Icon name="search" />
          <input name="query" autoFocus placeholder="Search jackets, coats, leather..." />
          <button type="submit">SEARCH</button>
          <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <Icon name="close" />
          </button>
        </form>
      )}
      {mobile && (
        <div className="mobile-menu">
          {[
            ["NEW IN", "new-arrivals"],
            ["MEN JACKETS", "men"],
            ["WOMEN JACKETS", "women"],
            ["COATS & LAYERS", "overcoat"],
            ["ALL PRODUCTS", "shop"],
            ["BULK ORDERS", "contact"],
          ].map(([label, route]) => (
            <button key={label} onClick={() => go(route)}>
              {label}
              <Icon name="arrow" />
            </button>
          ))}
          <button onClick={() => go("about")}>
            OUR MAISON
            <Icon name="arrow" />
          </button>
          <button onClick={() => go("contact")}>
            CONTACT
            <Icon name="arrow" />
          </button>
        </div>
      )}
    </>
  );
}

function ProductCard({
  product,
  onAdd,
  onWish,
  wished = false,
  compact = false,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  onWish: (id: number) => void;
  wished?: boolean;
  compact?: boolean;
}) {
  return (
    <article className={`product-card ${compact ? "product-card-compact" : ""}`}>
      <div className="product-image">
        <button
          className={`wish ${wished ? "active" : ""}`}
          onClick={() => onWish(product.id)}
          aria-label="Add to wishlist"
        >
          <Icon name="heart" />
        </button>
        {product.badge && <span className="badge">{product.badge}</span>}
        <button className="image-link" onClick={() => navigate(`product?slug=${product.slug}`)}>
          <img src={product.image} alt={product.images[0].alt} loading="lazy" />
        </button>
        <div className="quick-actions">
          <button onClick={() => navigate(`product?slug=${product.slug}`)}>QUICK VIEW</button>
          <button onClick={() => onAdd(product)}>ADD TO BAG</button>
        </div>
      </div>
      <div className="product-meta">
        <button onClick={() => navigate(`product?slug=${product.slug}`)}>
          <h3>{product.name}</h3>
        </button>
        <p>{product.gender.toUpperCase()} · {product.subcategory.toUpperCase()}</p>
        <div className="price">
          ${product.price.toFixed(2)}{" "}
          {product.compareAtPrice && <del>${product.compareAtPrice.toFixed(2)}</del>}
        </div>
        <div className="rating">
          <span>{product.sizes.length} sizes · {product.colors.length} color</span>
        </div>
        <button className="mobile-add-to-bag" onClick={() => onAdd(product)}>ADD TO BAG <span>+</span></button>
      </div>
    </article>
  );
}

function ProductCarousel({
  items,
  onAdd,
  onWish,
  wishlist,
}: {
  items: Product[];
  onAdd: (product: Product) => void;
  onWish: (id: number) => void;
  wishlist: number[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const slide = (direction: -1 | 1) =>
    track.current?.scrollBy({ left: direction * Math.max(300, track.current.clientWidth * 0.72), behavior: "smooth" });
  return (
    <div className="product-carousel">
      <div className="carousel-controls">
        <button aria-label="Previous products" onClick={() => slide(-1)}>‹</button>
        <button aria-label="Next products" onClick={() => slide(1)}>›</button>
      </div>
      <div className="product-grid carousel-track" ref={track}>
        {items.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} onWish={onWish} wished={wishlist.includes(product.id)} />
        ))}
      </div>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  link,
  linkRoute = "shop",
}: {
  eyebrow: string;
  title: string;
  link?: string;
  linkRoute?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <small>{eyebrow}</small>
        <h2>{title}</h2>
      </div>
      {link && (
        <button className="text-link" onClick={() => navigate(linkRoute)}>
          {link} <Icon name="arrow" size={17} />
        </button>
      )}
    </div>
  );
}

function Home({
  onAdd,
  onWish,
  wishlist,
}: {
  onAdd: (p: Product) => void;
  onWish: (id: number) => void;
  wishlist: number[];
}) {
  return (
    <main>
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/images/mohana/black-leather-vintage-campaign.png"
          aria-label="BM Solicitor leather outerwear campaign"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        >
          <source src="/assets/videos/home-editorial-web.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-copy">
          <span>BM SOLICITOR · MOHANA LEATHER</span>
          <h1>
            Leather,
            <br />
            <i>made yours.</i>
          </h1>
          <p>Shop the collection. Choose your size, then order directly or call us for help.</p>
          <div>
            <button className="btn btn-light" onClick={() => navigate("shop")}>
              SHOP JACKETS
            </button>
            <button className="btn btn-ghost" onClick={() => navigate("contact")}>
              ASK ABOUT A SIZE
            </button>
          </div>
        </div>
        <div className="video-mark">MOHANA LEATHER / THE JACKET EDIT</div>
      </section>

      <CategoryTicker />

      <section className="brand-note">
        <small>THE BM SOLICITOR STANDARD</small>
        <p>
          Outerwear with character—considered in proportion, made with care, and designed to
          become part of your everyday wardrobe.
        </p>
      </section>

      <section className="collections section">
        <SectionHead
          eyebrow="CURATED LEATHER / THE SEASON’S EDIT"
          title="The Leather Edit"
          link="SHOP ALL"
          linkRoute="shop"
        />
        <div className="collection-grid">
          <button className="collection-large" onClick={() => navigate("men")}>
            <img
              src="/assets/images/mohana/black-leather-overshirt-model.png"
              alt="Men's leather bomber editorial image"
              loading="lazy"
            />
            <span>
              MEN’S COLLECTION
              <Icon name="arrow" />
            </span>
          </button>
          <button onClick={() => navigate("women")}>
            <img
              src="/assets/images/mohana/womens-brown-jacket-editorial.png"
              alt="Women's outerwear editorial image"
              loading="lazy"
            />
            <span>
              WOMEN’S COLLECTION
              <Icon name="arrow" />
            </span>
          </button>
          <button onClick={() => navigate("overcoat")}>
            <img
              src="/assets/images/mohana/brown-trench.png"
              alt="Brown leather double-breasted trench coat"
              loading="lazy"
            />
            <span>
              COATS & LONGER LAYERS
              <Icon name="arrow" />
            </span>
          </button>
        </div>
      </section>

      <section className="section products-section">
        <SectionHead
          eyebrow="JUST IN / NEW SEASON"
          title="New Arrivals"
          link="VIEW ALL"
          linkRoute="new-arrivals"
        />
        <ProductCarousel items={products.filter((product) => product.isNewArrival)} onAdd={onAdd} onWish={onWish} wishlist={wishlist} />
      </section>

      <section className="atelier">
        <div className="atelier-copy">
          <small>BM SOLICITOR ATELIER</small>
          <h2>
            Crafted to
            <br />
            <i>endure.</i>
          </h2>
          <p>
            From the texture of the cloth to the placement of every seam, each detail shapes the
            character of a layer. Discover the codes behind our outerwear edit.
          </p>
          <button className="btn btn-dark" onClick={() => navigate("about")}>
            OUR CRAFT
          </button>
        </div>
        <div className="atelier-image">
          <img
            src="/assets/images/mohana/black-leather-overshirt-model.png"
            alt="Model wearing a dark brown leather bomber jacket"
            loading="lazy"
          />
          <span>01 / THE LEATHER EDIT</span>
        </div>
      </section>

      <section className="section new-arrivals">
        <SectionHead
          eyebrow="THE HOUSE ICONS"
          title="Best Sellers"
          link="VIEW ALL"
          linkRoute="shop?collection=best"
        />
        <ProductCarousel items={products.filter((product) => product.isBestSeller).slice(0, 8)} onAdd={onAdd} onWish={onWish} wishlist={wishlist} />
      </section>

      <section className="section products-section home-gender-shelf">
        <SectionHead eyebrow="THE MEN’S EDIT" title="Men’s Jackets" link="SHOP MEN" linkRoute="men" />
        <div className="product-grid">
          {products.filter((product) => product.category === "men" && product.gender === "men").slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} onWish={onWish} wished={wishlist.includes(product.id)} compact />
          ))}
        </div>
      </section>

      <section className="section products-section home-gender-shelf">
        <SectionHead eyebrow="THE WOMEN’S EDIT" title="Women’s Jackets" link="SHOP WOMEN" linkRoute="women" />
        <div className="product-grid">
          {products.filter((product) => product.category === "women" && product.gender === "women").slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} onWish={onWish} wished={wishlist.includes(product.id)} compact />
          ))}
        </div>
      </section>

      <section className="testimonials">
        <small>THE BM SOLICITOR STANDARD</small>
        <blockquote>
          Considered silhouettes. Tactile materials. Modern outerwear made for the way you move.
        </blockquote>
        <p>DESIGNED WITH INTENTION</p>
        <div className="dots">
          <i />
          <i />
          <i />
        </div>
      </section>

      <ServiceBar />
      <Newsletter />
    </main>
  );
}

function CategoryTicker() {
  const categories = [
    ["NEW ARRIVALS", "new-arrivals"],
    ["MEN’S JACKETS", "men"],
    ["WOMEN’S JACKETS", "women"],
    ["COATS & LAYERS", "overcoat"],
    ["ALL LEATHER", "shop"],
    ["BULK ORDERS", "contact"],
  ];
  return (
    <div className="category-ticker" aria-label="Shop categories">
      <div className="ticker-track">
        {[0, 1].map((pass) => (
          <div className="ticker-group" key={pass} aria-hidden={pass === 1}>
            {categories.map(([label, route]) => (
              <button key={label} tabIndex={pass === 1 ? -1 : 0} onClick={() => navigate(route)}>
                {label}<span aria-hidden="true">✦</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Shop({
  onAdd,
  onWish,
  wishlist,
  collection,
  initialCategory,
  searchTerm,
}: {
  onAdd: (p: Product) => void;
  onWish: (id: number) => void;
  wishlist: number[];
  collection: string;
  initialCategory: string;
  searchTerm: string;
}) {
  const [category, setCategory] = useState(initialCategory || "All");
  const [sort, setSort] = useState("Featured");
  const [filters, setFilters] = useState(false);
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [priceCap, setPriceCap] = useState(250);
  useEffect(() => setCategory(initialCategory || "All"), [collection, initialCategory]);
  const collectionDetails: Record<string, { title: string; eyebrow: string; copy: string }> = {
    all: {
      eyebrow: "THE MOHANA LEATHER EDIT",
      title: "Find your jacket.",
      copy: "Explore the collection by style, choose your size, and get in touch if you need advice.",
    },
    men: {
      eyebrow: "THE LEATHER EDIT / MEN",
      title: "Men’s leather jackets",
      copy: "Racers, bombers, varsity sleeves, and shearling-collar jackets in considered silhouettes.",
    },
    women: {
      eyebrow: "THE LEATHER EDIT / WOMEN",
      title: "Women’s leather jackets",
      copy: "Biker shapes, belted finishes, and tailored leather layers for everyday wear.",
    },
    unisex: {
      eyebrow: "THE SHARED OUTERWEAR EDIT",
      title: "Unisex Outerwear",
      copy: "Versatile shared silhouettes, designed to be worn your way.",
    },
    overcoat: {
      eyebrow: "COATS & LONGER LAYERS",
      title: "Leather coats & layers",
      copy: "Browse longer leather layers, shearling collars, and statement jackets.",
    },
    new: {
      eyebrow: "THE LATEST ARRIVALS",
      title: "New This Season",
      copy: "Freshly added leather jackets and longer outerwear from the Mohana edit.",
    },
    best: {
      eyebrow: "THE HOUSE ICONS",
      title: "Best Sellers",
      copy: "A considered edit of standout pieces from across the collection.",
    },
    sale: {
      eyebrow: "THE FINAL MARKDOWNS",
      title: "Sale",
      copy: "Selected pieces offered at a reduced price while available.",
    },
    premium: {
      eyebrow: "BM SOLICITOR ATELIER",
      title: "Premium Collection",
      copy: "Exceptional materials and precise construction in their purest form.",
    },
  };
  const details = collectionDetails[collection] || collectionDetails.all;
  const collectionProducts = useMemo(() => {
    if (collection === "men" || collection === "women") return products.filter((product) => product.category === collection && product.gender === collection);
    if (collection === "unisex") return products.filter((product) => product.gender === "unisex");
    if (collection === "overcoat") return products.filter((product) => product.category === "overcoat");
    if (collection === "new") return products.filter((product) => product.isNewArrival);
    if (collection === "best") return products.filter((product) => product.isBestSeller);
    if (collection === "sale") return products.filter((product) => Boolean(product.compareAtPrice && product.compareAtPrice > product.price));
    if (collection === "premium") return products.filter((product) => product.isPremium);
    return products;
  }, [collection]);
  const cats =
    collection === "new"
      ? ["All", "Men", "Women", ...(collectionProducts.some((product) => product.gender === "unisex") ? ["Unisex"] : [])]
      : ["All", ...new Set(collectionProducts.map((product) => product.category))];
  const visible = useMemo(() => {
    let list =
      category === "All"
        ? [...collectionProducts]
        : collection === "new"
          ? collectionProducts.filter((product) => product.gender === category.toLowerCase())
          : collectionProducts.filter((product) => product.category === category);
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      list = list.filter((product) =>
        `${product.name} ${product.category} ${product.gender} ${product.colors.join(" ")}`
          .toLowerCase()
          .includes(query),
      );
    }
    if (selectedColor !== "All") list = list.filter((product) => product.colors.includes(selectedColor));
    if (selectedSize !== "All") list = list.filter((product) => product.sizes.includes(selectedSize));
    if (selectedType !== "All") list = list.filter((product) => product.subcategory === selectedType);
    if (selectedMaterial !== "All") list = list.filter((product) => product.material === selectedMaterial);
    list = list.filter((product) => product.stockStatus === "in-stock");
    list = list.filter((product) => product.price <= priceCap);
    if (sort === "Newest") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    if (sort === "Best Sellers") list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, collection, collectionProducts, priceCap, searchTerm, selectedColor, selectedSize, selectedType, selectedMaterial, sort]);
  const colours = ["All", ...new Set(collectionProducts.flatMap((product) => product.colors))];
  const types = ["All", ...new Set(collectionProducts.map((product) => product.subcategory))];
  const materials = ["All", ...new Set(collectionProducts.map((product) => product.materialType))];
  const heroPoster =
        collection === "men"
      ? "/assets/images/mohana/black-leather-overshirt-model.png"
      : collection === "women"
        ? "/assets/images/mohana/womens-brown-jacket-editorial.png"
        : collection === "overcoat"
          ? "/assets/images/mohana/brown-trench.png"
        : collection === "unisex"
          ? "/assets/images/mohana/varsity-brown-sleeves.png"
        : collection === "new"
            ? "/assets/images/mohana/brown-biker-model.png"
            : "/assets/images/mohana/black-leather-vintage-campaign.png";
  const heroAlt =
    collection === "men"
      ? "Men's leather outerwear editorial campaign"
      : collection === "women"
        ? "Women's leather outerwear editorial campaign"
      : collection === "overcoat"
          ? "Brown leather trench coat from Mohana Leather"
        : collection === "unisex"
          ? "Unisex leather bomber and varsity jacket editorial"
          : collection === "new"
            ? "Latest men's, women's, and unisex leather jacket arrivals"
            : "BM Solicitor leather jacket collection";
  return (
    <main>
      <div className="shop-hero">
        <img src={heroPoster} alt={heroAlt} fetchPriority="high" />
        <div className="shop-hero-shade" />
        <div className="shop-hero-copy">
          <small>{searchTerm ? "SEARCH RESULTS" : details.eyebrow}</small>
          <h1>{searchTerm ? `Results for “${searchTerm}”` : details.title}</h1>
          <p>
            {searchTerm ? `${visible.length} matching pieces from the collection.` : details.copy}
          </p>
        </div>
      </div>
      {cats.length > 2 && (
        <div className="shop-tabs" aria-label="Filter products by collection">
          {cats.map((c) => (
            <button className={category === c ? "active" : ""} onClick={() => setCategory(c)} key={c}>
              {c === "All" ? c : c === "overcoat" ? "Coats & Shearling" : `${c[0].toUpperCase()}${c.slice(1)} Leather`}
            </button>
          ))}
        </div>
      )}
      <div className="catalog section">
        <div className="catalog-tools">
          <span>{visible.length} PIECES</span>
          <div>
            <button aria-expanded={filters} aria-controls="catalog-filters" onClick={() => setFilters(!filters)}>
              {filters ? "HIDE FILTERS" : "FILTER & SIZE"} <Icon name={filters ? "minus" : "plus"} size={16} />
            </button>
            <label>
              SORT BY{" "}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option>Featured</option>
                <option>Newest</option>
                <option>Best Sellers</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>
        {filters && (
          <div className="filter-panel" id="catalog-filters">
            <div>
              <small>SIZE</small>
              <div>
                {["All", "XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    className={selectedSize === size ? "active" : ""}
                    onClick={() => setSelectedSize(size)}
                    key={size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <small>COLOUR</small>
              <select
                value={selectedColor}
                onChange={(event) => setSelectedColor(event.target.value)}
              >
                {colours.map((colour) => (
                  <option key={colour}>{colour}</option>
                ))}
              </select>
            </div>
            <div>
              <small>PRODUCT TYPE</small>
              <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                {types.map((type) => <option key={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <small>MATERIAL</small>
              <select value={selectedMaterial} onChange={(event) => setSelectedMaterial(event.target.value)}>
                {materials.map((material) => <option key={material}>{material}</option>)}
              </select>
            </div>
            <div>
              <small>MAXIMUM PRICE</small>
              <select
                value={priceCap}
                onChange={(event) => setPriceCap(Number(event.target.value))}
              >
                <option value={60}>$60</option>
                <option value={80}>$80</option>
                <option value={100}>$100</option>
                <option value={150}>$150</option>
                <option value={250}>$250</option>
              </select>
            </div>
            <div>
              <small>AVAILABILITY</small>
              <p>{selectedSize === "All" ? "All sizes" : `Size ${selectedSize}`} · available items only</p>
            </div>
            <div>
              <small>ACTIVE FILTERS</small>
              <button
                onClick={() => {
                  setSelectedColor("All");
                  setSelectedSize("All");
                  setSelectedType("All");
                  setSelectedMaterial("All");
                  setPriceCap(250);
                  setCategory("All");
                }}
              >
                CLEAR ALL
              </button>
            </div>
          </div>
        )}
        {visible.length ? <div className="product-grid catalog-grid">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={onAdd}
              onWish={onWish}
              wished={wishlist.includes(p.id)}
            />
          ))}
        </div> : <div className="empty"><h2>{collection === "sale" ? "No marked-down pieces right now." : "No pieces match these filters."}</h2><p>Try another filter or browse the full collection.</p><button className="btn btn-dark" onClick={() => navigate("shop")}>EXPLORE ALL OUTERWEAR</button></div>}
      </div>
      <Newsletter />
    </main>
  );
}

function ProductDetail({
  product,
  onAdd,
  onWish,
  wished,
}: {
  product: Product;
  onAdd: (p: Product, size?: string, color?: string) => void;
  onWish: (id: number) => void;
  wished: boolean;
}) {
  const [size, setSize] = useState(product.sizes.includes("M") ? "M" : product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [detail, setDetail] = useState("DESCRIPTION");
  useEffect(() => {
    setSize(product.sizes.includes("M") ? "M" : product.sizes[0]);
    setColor(product.colors[0]);
    setQty(1);
  }, [product.id]);
  const colourHex: Record<string, string> = {
    Camel: "#a17d57",
    Cognac: "#875538",
    Chestnut: "#8b4b2d",
    Brown: "#74472d",
    Blue: "#49627f",
    Black: "#171717",
    Espresso: "#4a3026",
    Charcoal: "#343434",
    Ivory: "#e9e6dc",
    Burgundy: "#6e1f2a",
    Navy: "#182640",
    "Winter White": "#f0eee7",
    Olive: "#626447",
    Oat: "#c5b99f",
    Stone: "#b7ad9e",
  };
  const sameCategory = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category,
  );
  const sameAudience = products.filter(
    (candidate) => candidate.id !== product.id && candidate.gender === product.gender && !sameCategory.includes(candidate),
  );
  const related = [...sameCategory, ...sameAudience].slice(0, 4);
  return (
    <main className="product-page">
      <div className="breadcrumbs">
        HOME / {product.audience.toUpperCase()} / {product.category.toUpperCase()} /{" "}
        <b>{product.name.toUpperCase()}</b>
      </div>
      <div className="pdp">
        <div className="gallery">
          {product.images.map((image, i) => (
            <div className={`gallery-item g${i}`} key={i}>
              <img src={image.src} alt={image.alt} loading={i === 0 ? "eager" : "lazy"} />
              {i === 0 && <span>HOVER TO ZOOM</span>}
            </div>
          ))}
        </div>
        <div className="product-info">
          <small>BM SOLICITOR / {product.gender.toUpperCase()} / {product.subcategory.toUpperCase()}</small>
          <h1>{product.name}</h1>
          <div className="pdp-price">
            ${product.price.toFixed(2)}
            {product.compareAtPrice && <del>${product.compareAtPrice.toFixed(2)}</del>}
          </div>
          <p className="pdp-desc">{product.shortDescription}</p>
          <div className="option-row">
            <b>COLOUR</b>
            <span>{color.toUpperCase()}</span>
          </div>
          <div className="swatches">
            {product.colors.map((option) => (
              <button
                className={color === option ? "active" : ""}
                style={{ background: colourHex[option] || "#333" }}
                aria-label={`Select ${option}`}
                aria-pressed={color === option}
                onClick={() => setColor(option)}
                key={option}
              />
            ))}
          </div>
          <div className="option-row">
            <b>SELECT SIZE</b>
            <button className="under" onClick={() => navigate("size-guide")}>
              SIZE GUIDE
            </button>
          </div>
          <div className="sizes">
            {product.sizes.map((s) => (
              <button
                className={s === size ? "active" : ""}
                aria-pressed={s === size}
                onClick={() => setSize(s)}
                key={s}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="fit-note">Please refer to the size guide for garment measurements and fit details.</p>
          <div className="purchase-row">
            <div className="quantity">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>
                <Icon name="minus" size={15} />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>
                <Icon name="plus" size={15} />
              </button>
            </div>
            <button
              className="add-main"
              onClick={() =>
                Array.from({ length: qty }).forEach(() => onAdd(product, size, color))
              }
            >
              ADD TO BAG — ${(product.price * qty).toFixed(2)}
            </button>
            <button
              className={`heart-main ${wished ? "active" : ""}`}
              onClick={() => onWish(product.id)}
            >
              <Icon name="heart" />
            </button>
          </div>
          <button
            className="buy-now"
            onClick={() => {
              Array.from({ length: qty }).forEach(() => onAdd(product, size, color));
              navigate("checkout");
            }}
          >
            BUY NOW
          </button>
          <div className="benefits">
            <p>
              <Icon name="truck" /> Complimentary express delivery
            </p>
            <p>
              <Icon name="shield" /> Cash on Delivery · 30-day returns
            </p>
          </div>
          <div className="accordions">
            {["DESCRIPTION", "DETAILS & CARE", "SHIPPING & RETURNS"].map((x) => (
              <button onClick={() => setDetail(detail === x ? "" : x)} key={x}>
                <span>{x}</span>
                <Icon name={detail === x ? "minus" : "plus"} size={16} />
                {detail === x && (
                  <p>
                    {x === "DESCRIPTION"
                      ? product.description
                      : x === "DETAILS & CARE"
                        ? `Fabric: ${product.fabric} Fit: ${product.fit} Care: ${product.care} Styling: ${product.styleTips}`
                        : "Complimentary delivery in 2–4 business days. Returns accepted within 30 days in original condition."}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <section className="section products-section related">
        <SectionHead
          eyebrow="COMPLETE THE EDIT"
          title="You May Also Like"
          link="SEE ALL"
          linkRoute={product.category === "overcoat" ? "overcoat" : product.gender}
        />
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} onWish={onWish} />
          ))}
        </div>
      </section>
    </main>
  );
}

type CartItem = Product & {
  selectedSize: string;
  selectedColor: string;
};

const cartItemKey = (item: CartItem) => `${item.id}-${item.selectedSize}-${item.selectedColor}`;

function Cart({
  items,
  setItems,
}: {
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}) {
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const unique = [...new Map(items.map((item) => [cartItemKey(item), item])).values()];
  const subtotal = items.reduce((a, b) => a + b.price, 0);
  const count = (item: CartItem) =>
    items.filter((candidate) => cartItemKey(candidate) === cartItemKey(item)).length;
  return (
    <main className="light-page">
      <div className="page-title">
        <small>YOUR SELECTION</small>
        <h1>Shopping Bag</h1>
        <p>
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>
      {items.length === 0 ? (
        <div className="empty">
          <Icon name="bag" size={42} />
          <h2>Your bag is currently empty.</h2>
          <p>Discover our latest collection of considered winter pieces.</p>
          <button className="btn btn-dark" onClick={() => navigate("shop")}>
            EXPLORE THE COLLECTION
          </button>
        </div>
      ) : (
        <div className="cart-layout section">
          <div className="cart-items">
            {unique.map((item) => (
              <div className="cart-item" key={cartItemKey(item)}>
                <img src={item.image} alt={item.images[0].alt} />
                <div>
                  <small>{item.category}</small>
                  <h3>{item.name}</h3>
                  <p>
                    Colour: {item.selectedColor}
                    <br />
                    Size: {item.selectedSize}
                  </p>
                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        setItems((v) => {
                          const n = [...v];
                          n.splice(
                            n.findIndex((candidate) => cartItemKey(candidate) === cartItemKey(item)),
                            1,
                          );
                          return n;
                        })
                      }
                    >
                      −
                    </button>
                    <span>{count(item)}</span>
                    <button onClick={() => setItems((v) => [...v, item])}>+</button>
                  </div>
                  <button
                    className="remove"
                    onClick={() =>
                      setItems((v) =>
                        v.filter((candidate) => cartItemKey(candidate) !== cartItemKey(item)),
                      )
                    }
                  >
                    REMOVE
                  </button>
                </div>
                <b>${(item.price * count(item)).toFixed(2)}</b>
              </div>
            ))}
          </div>
          <aside className="summary">
            <h2>Order Summary</h2>
            <div>
              <span>Subtotal</span>
              <b>${subtotal.toFixed(2)}</b>
            </div>
            <div>
              <span>Express delivery</span>
              <b>COMPLIMENTARY</b>
            </div>
            <label>
              GIFT CARD OR PROMO CODE
              <span>
                <input value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="Enter code" />
                <button type="button" onClick={() => setPromoMessage(promoCode.trim() ? "No promotional code is available right now." : "Enter a code to check.")}>APPLY</button>
              </span>
              {promoMessage && <small role="status">{promoMessage}</small>}
            </label>
            <div className="total">
              <span>
                TOTAL <small>USD</small>
              </span>
              <b>${subtotal.toFixed(2)}</b>
            </div>
            <button className="checkout-btn" onClick={() => navigate("checkout")}>
              PROCEED TO CHECKOUT
            </button>
            <p>
              <Icon name="shield" size={17} /> Cash on Delivery · Complimentary returns
            </p>
          </aside>
        </div>
      )}
      <ServiceBar />
    </main>
  );
}

type CheckoutOrder = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  items: CartItem[];
  total: number;
  createdAt: string;
};

function readLastOrder(): CheckoutOrder | null {
  try {
    const value = localStorage.getItem("bms-last-order");
    return value ? (JSON.parse(value) as CheckoutOrder) : null;
  } catch {
    return null;
  }
}

function Checkout({ items, onComplete }: { items: CartItem[]; onComplete: (order: CheckoutOrder) => void }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  if (!items.length)
    return (
      <main className="checkout-page">
        <div className="empty">
          <h1>Your bag is empty.</h1>
          <p>Add a piece to your bag before continuing to checkout.</p>
          <button className="btn btn-dark" onClick={() => navigate("shop")}>EXPLORE THE COLLECTION</button>
        </div>
      </main>
    );
  return (
    <main className="checkout-page">
      <div className="checkout-head">
        <Logo />
      <span>CHECKOUT · CASH ON DELIVERY <Icon name="shield" size={16} /></span>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const order: CheckoutOrder = {
            reference: `BMS-${Date.now().toString(36).toUpperCase()}`,
            name: `${form.get("firstName")} ${form.get("lastName")}`.trim(),
            email: String(form.get("email")),
            phone: String(form.get("phone")),
            address: String(form.get("address")),
            city: String(form.get("city")),
            region: String(form.get("region")),
            postalCode: String(form.get("postalCode")),
            country: String(form.get("country")),
            items: [...items],
            total,
            createdAt: new Date().toISOString(),
          };
          try {
            const orders = JSON.parse(localStorage.getItem("bms-demo-orders") || "[]") as CheckoutOrder[];
            localStorage.setItem("bms-demo-orders", JSON.stringify([...orders, order]));
            localStorage.setItem("bms-last-order", JSON.stringify(order));
          } catch { /* The confirmation remains available in memory for this visit. */ }
          onComplete(order);
        }}>
          <button type="button" className="back" onClick={() => navigate("cart")}>← RETURN TO BAG</button>
          <h1>Checkout</h1>
          <section>
            <div className="form-section-title"><span>01</span><h2>Contact Information</h2></div>
            <input name="email" type="email" autoComplete="email" required placeholder="Email address" />
            <label className="checkbox"><input type="checkbox" name="newsletter" /> Send me collection updates</label>
          </section>
          <section>
            <div className="form-section-title"><span>02</span><h2>Delivery Address</h2></div>
            <div className="field-grid">
              <input name="firstName" autoComplete="given-name" required placeholder="First name" />
              <input name="lastName" autoComplete="family-name" required placeholder="Last name" />
              <input className="full" name="address" autoComplete="street-address" required placeholder="Street address" />
              <input name="city" autoComplete="address-level2" required placeholder="City" />
              <input name="region" autoComplete="address-level1" required placeholder="State / Province" />
              <input name="postalCode" autoComplete="postal-code" required placeholder="Postal code" />
              <input name="country" autoComplete="country-name" required placeholder="Country" />
              <input name="phone" type="tel" autoComplete="tel" required pattern="[+0-9() .-]{7,20}" placeholder="Phone number" />
            </div>
          </section>
          <section>
            <div className="form-section-title"><span>03</span><h2>Delivery Method</h2></div>
            <label className="delivery-option"><input defaultChecked type="radio" name="delivery" value="express" />
              <span><b>Complimentary Express</b><small>2–4 business days</small></span><b>FREE</b>
            </label>
          </section>
          <section>
            <div className="form-section-title"><span>04</span><h2>Payment</h2></div>
            <label className="delivery-option"><input defaultChecked type="radio" name="payment" value="cod" />
              <span><b>Cash on Delivery</b><small>Pay in cash when your order arrives.</small></span><b>COD</b>
            </label>
          </section>
          <button className="checkout-btn">PLACE ORDER — ${total.toFixed(2)}</button>
        </form>
        <aside className="checkout-summary">
          <h2>Your Order <span>{items.length}</span></h2>
          {items.map((item, index) => (
            <div className="mini-product" key={`${cartItemKey(item)}-${index}`}>
              <img src={item.image} alt={item.images[0].alt} />
              <div><b>{item.name}</b><small>{item.selectedColor} / {item.selectedSize}</small></div>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-lines">
            <p><span>Subtotal</span><b>${total.toFixed(2)}</b></p>
            <p><span>Delivery</span><b>FREE</b></p>
            <p><span>Payment</span><b>Cash on Delivery</b></p>
            <p><span>Total USD</span><b>${total.toFixed(2)}</b></p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function OrderConfirmation({ order, onContinue }: { order: CheckoutOrder | null; onContinue: () => void }) {
  if (!order) return <main className="confirmation"><div><h1>No recent order found.</h1><button className="btn btn-dark" onClick={onContinue}>CONTINUE SHOPPING</button></div></main>;
  return (
    <main className="confirmation"><div>
      <span className="check">✓</span><small>THANK YOU · CASH ON DELIVERY</small>
      <h1>Thank you, {order.name}.</h1>
      <p>Your order details have been recorded under reference <b>#{order.reference}</b>. Payment is due on delivery.</p>
      <h2>Order summary · ${order.total.toFixed(2)} USD</h2>
      {order.items.map((item, index) => <p key={`${item.id}-${index}`}>{item.name} · {item.selectedColor} / {item.selectedSize} · ${item.price.toFixed(2)}</p>)}
      <p>Delivery to: {order.city}, {order.country}<br />Payment: Cash on Delivery</p>
      <button className="btn btn-dark" onClick={onContinue}>CONTINUE SHOPPING</button>
    </div></main>
  );
}

function Account() {
  return (
    <main className="account-page">
      <div className="account-image">
        <img
          src="/assets/images/women/camel-coat.png"
          alt="Model in a camel wool coat for the BM Solicitor private client edit"
        />
        <p>THE PRIVATE CLIENT EXPERIENCE</p>
      </div>
      <div className="account-form">
        <small>YOUR BM SOLICITOR ACCOUNT</small>
        <h1>Your client edit.</h1>
        <p>Keep your favourite pieces close, revisit your bag, or check an order reference.</p>
        <div className="account-actions">
          <button className="account-action" onClick={() => navigate("wishlist")}><span><Icon name="heart" size={19}/></span><span><b>Wishlist</b><small>Pieces you have saved</small></span><i>→</i></button>
          <button className="account-action" onClick={() => navigate("cart")}><span><Icon name="bag" size={19}/></span><span><b>Shopping bag</b><small>Review your selected pieces</small></span><i>→</i></button>
          <button className="account-action" onClick={() => navigate("track")}><span><Icon name="search" size={19}/></span><span><b>Order lookup</b><small>Check using your reference</small></span><i>→</i></button>
        </div>
      </div>
    </main>
  );
}

function WishlistPanel({ wishlist, onAdd, onWish }: { wishlist: number[]; onAdd: (p: Product) => void; onWish: (id: number) => void }) {
  const saved = products.filter((product) => wishlist.includes(product.id));
  return <main className="light-page drawer-page"><div className="drawer-page-heading"><small>YOUR EDIT</small><h1>Wishlist</h1><p>{saved.length} saved {saved.length === 1 ? "piece" : "pieces"}</p></div>{saved.length ? <div className="drawer-wishlist-list">{saved.map((product) => <article key={product.id}><img src={product.image} alt={product.images[0].alt} /><div className="drawer-wishlist-info"><h3>{product.name}</h3><p>{product.colors[0]}</p><strong>${product.price.toFixed(2)}</strong><div className="drawer-wishlist-actions"><button onClick={() => { navigate(`product?slug=${product.slug}`); openDrawer(""); }}>VIEW</button><button onClick={() => onAdd(product)}>ADD TO BAG</button></div></div><button className="drawer-remove" aria-label={`Remove ${product.name} from wishlist`} onClick={() => onWish(product.id)}>×</button></article>)}</div> : <div className="drawer-empty"><Icon name="heart" size={34}/><h2>Your wishlist awaits.</h2><p>Save the pieces you love and return to them anytime.</p><button className="btn btn-dark" onClick={() => { openDrawer(""); navigate("shop"); }}>DISCOVER THE COLLECTION</button></div>}</main>;
}

function ChatAssistant({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    const question = message.trim();
    if (!question || busy) return;
    setMessages((current) => [...current, { role: "user", text: question }]);
    setMessage(""); setBusy(true); setError("");
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [...messages, { role: "user", content: question }] }) });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("The assistant service is not available right now. Please try again shortly.");
      }
      const data = await response.json() as { reply?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Assistant is temporarily unavailable.");
      const reply = data.reply;
      if (typeof reply !== "string") throw new Error("The assistant returned an invalid response. Please try again.");
      setMessages((current) => [...current, { role: "assistant", text: reply }]);
    } catch (err) { setError(err instanceof Error ? err.message : "Assistant is temporarily unavailable."); }
    finally { setBusy(false); }
  }
  return <section className="assistant-window" aria-label="BM Solicitors Assistant">
    <header className="assistant-head"><span className="assistant-mark"><img src="/assets/images/bm-solicitor-logo.png" alt="" /></span><div><strong>BM Solicitors Assistant</strong><small>Store support</small></div><button onClick={onClose} aria-label="Close assistant"><Icon name="close" size={19} /></button></header>
    <div className="assistant-messages"><div className="assistant-welcome"><small>WELCOME</small><p>Hello! I’m the BM Solicitors Assistant. Ask us about jackets, sizing, delivery or your order.</p></div>{messages.map((item, index) => <p key={index} className={`assistant-message assistant-message-${item.role}`}>{item.text}</p>)}{busy && <p className="assistant-message assistant-message-assistant">Please wait…</p>}{error && <p className="assistant-notice">{error}</p>}</div>
    <form className="assistant-compose" onSubmit={sendMessage}><input value={message} onChange={(event) => setMessage(event.target.value)} aria-label="Message the assistant" placeholder="Ask us anything…"/><button type="submit" aria-label="Send message" disabled={!message.trim() || busy}><Icon name="arrow" size={19} /></button></form>
    <small className="assistant-caption">BM Solicitors · Store assistant</small>
  </section>;
}

function EditorialPage({ page }: { page: Page }) {
  const data = pageTitles[page];
  if (!data) return null;
  const editorialImages: Record<string, string> = {
    privacy: "/assets/images/mohana/black-leather-blazer.png",
    terms: "/assets/images/mohana/black-leather-overshirt-model.png",
    returns: "/assets/images/mohana/womens-brown-jacket-editorial.png",
    shipping: "/assets/images/overcoat/womens-camel-street.jpg",
  };
  const policySections: Record<string, [string, string][]> = {
    privacy: [
      ["Information stored in this browser", "Cart contents, wishlist selections, newsletter interest, enquiries, and local checkout records are stored in browser storage on this device."],
      ["How information is used", "This preview uses saved details to keep your bag and order reference available while browsing. It has no connected account, email, analytics, or fulfilment service."],
      ["Your choices", "Clear this site's browser storage to remove locally saved information. Do not enter real customer or payment information in this preview."],
    ],
    terms: [
      ["Product information", "Product names, materials, sizes, colors, and prices are presented for this storefront preview. Check the product details before making a selection."],
      ["Orders and payment", "The checkout records a local Cash on Delivery order reference in this browser. It does not submit an order to a merchant or reserve stock."],
      ["Availability and pricing", "Prices are displayed in USD. Product availability, shipping terms, and legal terms must be confirmed by the store owner before accepting live orders."],
    ],
    returns: [
      ["Return window", "The current store copy describes returns within 30 days. The seller must confirm the return window and eligibility before this storefront accepts live orders."],
      ["Condition", "Keep garments unworn with original labels and packaging while arranging a return. Product care details are available on each product page."],
      ["Starting a return", "The preview does not connect to a returns portal. Use the Contact page to save an enquiry locally; it is not delivered to a service team."],
    ],
    shipping: [
      ["Delivery estimate", "The storefront displays complimentary express delivery with an estimated 2–4 business-day window. Actual service and timing need confirmation by the seller."],
      ["Destination and duties", "The checkout collects a destination but does not calculate shipping charges, import duties, or taxes."],
      ["Order processing", "A checkout order is stored in the current browser only. No carrier label, shipment, or tracking event is created by this preview."],
    ],
  };
  return (
    <main className="editorial-page">
      {page === "about" ? <div className="editorial-hero"><small>{data.eyebrow}</small><h1>{data.title}</h1><p>{data.copy}</p></div> : <section className="service-hero"><img src={editorialImages[page]} alt="BM Solicitor leather outerwear editorial"/><div><small>{data.eyebrow}</small><h1>{data.title}</h1><p>{data.copy}</p><span>BM SOLICITOR · CLIENT SERVICES</span></div></section>}
      {page === "about" ? (
        <>
          <div className="story-grid">
            <img
              src="/assets/images/overcoat/mens-charcoal-overcoat.png"
              alt="Model wearing a tailored charcoal overcoat"
            />
            <div>
              <small>FOUNDED ON PRINCIPLE</small>
              <h2>A modern house of outerwear.</h2>
              <p>
                BM Solicitor was founded with a singular conviction: winter clothing should be as
                beautifully resolved as it is functional. We work with specialist ateliers and
                exceptional mills to create pieces of permanence.
              </p>
              <p>
                Our name represents precision, advocacy, and trust—the same values that shape every
                garment bearing the BM Solicitor signature.
              </p>
            </div>
          </div>
          <div className="values section">
            {[
              ["01", "MATERIAL"],
              ["02", "PROPORTION"],
              ["03", "PERMANENCE"],
            ].map((x) => (
              <div key={x[0]}>
                <small>{x[0]}</small>
                <h3>{x[1]}</h3>
                <p>
                  Considered at every step, selected without compromise, and refined to its purest
                  expression.
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="legal-copy">
          <h2>
            {page === "returns"
              ? "Returns made simple."
              : page === "shipping"
                ? "From our house to your door."
                : "Our commitment to you."}
          </h2>
          <p>Store information</p>
          {(policySections[page] || []).map(([heading, copy], i) => (
            <section key={heading}>
              <h3>{i + 1}. {heading}</h3>
              <p>{copy}</p>
            </section>
          ))}
          <section className="legal-business-details">
            <h3>Business details</h3>
            <p>BM SOLICITOR LLC<br />30 N Gould St, Ste 70235<br />Sheridan, WY 82801-6317-301</p>
          </section>
        </div>
      )}
      <Newsletter />
    </main>
  );
}

function SupportPage({ page }: { page: Page }) {
  const [open, setOpen] = useState(0);
  const [contactSaved, setContactSaved] = useState(false);
  const [trackResult, setTrackResult] = useState<CheckoutOrder | false | null>(null);
  if (page === "contact")
    return (
      <main className="support-page">
        <section className="service-hero contact-hero"><img src="/assets/images/mohana/womens-campaign.png" alt="BM Solicitor leather jacket collection"/><div><small>CLIENT SERVICES</small><h1>How may we assist?</h1><p>Personal guidance for fit, fabric, delivery and your order.</p><span>HERE FOR EVERY DETAIL</span></div></section>
        <div className="contact-grid">
          <div>
            <section className="contact-callout">
              <small>SHOPPING HELP</small>
              <h3>Need help choosing?</h3>
              <p>Send us your question using the form. Include the jacket name and your usual size so we can guide you.</p>
            </section>
            {[
              ["PRODUCT ADVICE", "Fit, fabric, and care"],
              ["ORDER SUPPORT", "Order references and delivery details"],
              ["RETURNS", "Help with an existing purchase"],
            ].map((x) => (
              <section key={x[0]}>
                <small>{x[0]}</small>
                <h3>{x[1]}</h3>
                <p>Include the style name or order reference so your enquiry has the right context.</p>
              </section>
            ))}
          </div>
          {contactSaved ? <p role="status">Your enquiry has been saved in this browser. Connect a store inbox before sharing this form with customers.</p> : <form onSubmit={(e) => {
            e.preventDefault();
            const values = Object.fromEntries(new FormData(e.currentTarget).entries());
            try {
              const current = JSON.parse(localStorage.getItem("bms-enquiries") || "[]") as unknown[];
              localStorage.setItem("bms-enquiries", JSON.stringify([...current, { ...values, createdAt: new Date().toISOString() }]));
            } catch { /* Keep the acknowledgement available if storage is disabled. */ }
            setContactSaved(true);
          }}>
            <h2>Send an enquiry</h2>
            <div className="field-grid">
              <input name="firstName" required placeholder="First name" />
              <input name="lastName" required placeholder="Last name" />
            </div>
            <input name="email" required type="email" placeholder="Email address" />
            <select name="topic" required defaultValue="">
              <option value="" disabled>How can we help?</option>
              <option>Product advice</option>
              <option>Order support</option>
              <option>Returns</option>
            </select>
            <textarea name="message" required placeholder="Your message" rows={5} />
            <button className="btn btn-dark">SEND ENQUIRY</button>
          </form>}
        </div>
      </main>
    );
  if (page === "track")
    return (
      <main className="track-page">
        <section className="service-hero"><img src="/assets/images/men/mens-street-jacket.jpg" alt="Leather jacket detail from the BM Solicitor collection"/><div><small>CLIENT SERVICES</small><h1>Track Your Order</h1><p>Enter your order reference and checkout email to view the latest details.</p><span>ORDER LOOKUP</span></div></section>
        <div>
          <h2>Find your order</h2>
          <p>Use the reference and email entered at checkout.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const reference = String(form.get("reference")).trim().toUpperCase();
            const email = String(form.get("email")).trim().toLowerCase();
            const orders = loadStorage<CheckoutOrder[]>("bms-demo-orders", []);
            setTrackResult(orders.find((order) => order.reference === reference && order.email.toLowerCase() === email) || false);
          }}>
            <input name="reference" required placeholder="Order reference (e.g. BMS-...)" />
            <input name="email" required type="email" placeholder="Email address" />
            <button className="btn btn-dark">TRACK ORDER</button>
          </form>
          {trackResult && <p role="status">Order #{trackResult.reference} · received · Cash on Delivery · ${trackResult.total.toFixed(2)} USD</p>}
          {trackResult === false && <p role="status">No matching order was found in this browser. Check the reference and email, or use the same browser where checkout was completed.</p>}
          <button onClick={() => navigate("contact")} className="text-link">
            NEED ASSISTANCE? CONTACT US <Icon name="arrow" />
          </button>
        </div>
      </main>
    );
  if (page === "size-guide")
    return (
      <main className="support-page">
        <section className="service-hero"><img src="/assets/images/mohana/womens-brown-jacket-editorial.png" alt="Tailored leather jacket showing its fit and silhouette"/><div><small>THE PERFECT FIT</small><h1>Size Guide</h1><p>Find your fit with our outerwear measurement guide.</p><span>MEASURE · COMPARE · CHOOSE</span></div></section>
        <div className="size-content">
          <h2>Body Measurements</h2>
          <table>
            <thead>
              <tr>
                <th>SIZE</th>
                <th>CHEST</th>
                <th>WAIST</th>
                <th>HIP</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["XS", "34–35", "28–29", "34–35"],
                ["S", "36–37", "30–31", "36–37"],
                ["M", "38–39", "32–33", "38–39"],
                ["L", "40–41", "34–35", "40–41"],
                ["XL", "42–44", "36–38", "42–44"],
                ["XXL", "45–47", "39–41", "45–47"],
              ].map((r) => (
                <tr key={r[0]}>
                  {r.map((c, index) => (
                    <td key={`${r[0]}-${index}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Measurements shown in inches. For layering or a more relaxed fit, we recommend selecting
            one size larger.
          </p>
        </div>
      </main>
    );
  const qs = [
    ["Where does BM Solicitor deliver?", "Choose your destination at checkout. Delivery availability and any local duties depend on the destination selected."],
    ["How can I track my order?", "Use the order reference and email address from checkout on the Track Your Order page, in the same browser where the order was placed."],
    ["What is your return policy?", "See Returns & Exchanges for the current return window and item-condition guidance."],
    ["How do I find my correct size?", "Open the Size Guide for body measurements. Product pages also list their available sizes."],
    ["How should I care for my outerwear?", "Care varies by material. Follow the fabric-specific instructions in each product’s Details & Care section."],
    ["Are duties and taxes included?", "Duties and taxes are not calculated in the current checkout; check your local import rules before ordering."],
  ];
  return (
    <main className="support-page">
      <section className="service-hero"><img src="/assets/images/mohana/mens-campaign.png" alt="BM Solicitor leather outerwear collection"/><div><small>CLIENT SERVICES</small><h1>Frequently Asked Questions</h1><p>Helpful guidance for shopping, sizing, delivery and care.</p><span>THE DETAILS, CONSIDERED</span></div></section>
      <div className="faq">
        {qs.map(([question, answer], i) => (
          <button onClick={() => setOpen(open === i ? -1 : i)} key={question}>
            <span>{question}</span>
            <Icon name={open === i ? "minus" : "plus"} />
            {open === i && <p>{answer}</p>}
          </button>
        ))}
      </div>
    </main>
  );
}

function ServiceBar() {
  return (
    <section className="service-bar">
      <div>
        <Icon name="truck" />
        <span>
          <b>COMPLIMENTARY DELIVERY</b>
          <small>Express delivery on every order</small>
        </span>
      </div>
      <div>
        <Icon name="shield" />
        <span>
          <b>30-DAY RETURNS</b>
          <small>Complimentary and considered</small>
        </span>
      </div>
      <div>
        <Icon name="globe" />
        <span>
          <b>CLIENT SERVICES</b>
          <small>Personal assistance, worldwide</small>
        </span>
      </div>
    </section>
  );
}

function Newsletter() {
  const [sent, setSent] = useState(false);
  return (
    <section className="newsletter">
      <small>PRIVATE ACCESS</small>
      <h2>
        Enter the world of
        <br />
        <i>BM Solicitor.</i>
      </h2>
      <p>Be the first to discover new collections, private releases, and stories from the house.</p>
      {sent ? (
        <b className="thanks">Thank you for your interest.</b>
      ) : (
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const email = new FormData(e.currentTarget).get("email")?.toString().trim().toLowerCase();
            if (email) {
              try {
                const saved = JSON.parse(localStorage.getItem("bms-newsletter-interest") || "[]") as string[];
                localStorage.setItem("bms-newsletter-interest", JSON.stringify([...new Set([...saved, email])]));
              } catch {
                // Keep the on-page acknowledgement usable if browser storage is unavailable.
              }
            }
            setSent(true);
          }}
        >
          <input name="email" required type="email" placeholder="Email address" />
          <button>
            <Icon name="arrow" />
          </button>
        </form>
      )}
      <span>By subscribing, you agree to our Privacy Policy.</span>
    </section>
  );
}

function Footer() {
  const go = (p: Page | string) => navigate(p);
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <Logo light />
          <p>Outerwear with character. Distinctive silhouettes for the world beyond.</p>
          <div className="socials">
            <span aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></span>
            <span aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></span>
            <span aria-label="TikTok" title="TikTok"><SocialIcon name="tiktok" /></span>
            <span aria-label="Pinterest" title="Pinterest"><SocialIcon name="pinterest" /></span>
          </div>
        </div>
        <div>
          <small>COLLECTIONS</small>
          <button onClick={() => go("men")}>Men’s Outerwear</button>
          <button onClick={() => go("women")}>Women’s Outerwear</button>
          <button onClick={() => go("overcoat")}>Coats & Layers</button>
          <button onClick={() => go("unisex")}>Unisex Jackets</button>
          <button onClick={() => go("new-arrivals")}>New Arrivals</button>
          <button onClick={() => go("shop")}>All Products</button>
          <button onClick={() => go("contact")}>Custom Bulk Orders</button>
          <button onClick={() => go("shop?collection=best")}>Best Sellers</button>
          <button onClick={() => go("shop?collection=sale")}>Sale</button>
          <button onClick={() => go("shop?collection=premium")}>Premium Collection</button>
        </div>
        <div>
          <small>CLIENT SERVICES</small>
          <button onClick={() => go("contact")}>Contact Us</button>
          <button onClick={() => go("faq")}>Frequently Asked Questions</button>
          <button onClick={() => go("shipping")}>Shipping & Delivery</button>
          <button onClick={() => go("returns")}>Returns & Exchanges</button>
          <button onClick={() => go("size-guide")}>Size Guide</button>
          <button onClick={() => go("track")}>Track Your Order</button>
        </div>
        <div>
          <small>THE HOUSE</small>
          <button onClick={() => go("about")}>About BM Solicitor</button>
          <button onClick={() => go("account")}>My Account</button>
          <button onClick={() => go("wishlist")}>Wishlist</button>
          <button onClick={() => go("privacy")}>Privacy Policy</button>
          <button onClick={() => go("terms")}>Terms & Conditions</button>
        </div>
      </div>
      <address className="footer-legal-entity">
        <strong>BM SOLICITOR LLC</strong>
        <span>30 N Gould St, Ste 70235 · Sheridan, WY 82801-6317-301</span>
      </address>
      <div className="footer-bottom">
        <span>© 2026 BM Solicitor. All Rights Reserved.</span>
        <span>CASH ON DELIVERY</span>
        <span className="footer-locale">
          <Icon name="globe" size={15} /> UNITED STATES / USD
        </span>
      </div>
    </footer>
  );
}

export default function App() {
  const getRoute = () => {
    const legacyHash = location.hash.replace(/^#\/?/, "");
    if (legacyHash) return legacyHash;
    const [routePath, productSlug] = location.pathname.split("/").filter(Boolean);
    if (routePath === "products" && productSlug) {
      return `product?slug=${encodeURIComponent(decodeURIComponent(productSlug))}`;
    }
    return `${routePath || "home"}${location.search}`;
  };
  const [route, setRoute] = useState(getRoute());
  const [path, queryString = ""] = route.split("?");
  const page = path as Page;
  const params = new URLSearchParams(queryString);
  const collection = params.get("collection") || "all";
  const initialCategory = params.get("category") || "All";
  const searchTerm = params.get("q") || "";
  const productId = Number(params.get("id"));
  const productSlug = params.get("slug");
  const resolvedSlug = productSlug ? productSlugAliases[productSlug] ?? productSlug : undefined;
  const matchedProduct = products.find((product) => product.id === productId || product.slug === resolvedSlug);
  const selectedProduct = matchedProduct || products[0];
  const [cart, setCart] = useState<CartItem[]>(() => loadStorage<CartItem[]>("bms-cart", []));
  const [wishlist, setWishlist] = useState<number[]>(() => loadStorage<number[]>("bms-wishlist", []));
  const [lastOrder, setLastOrder] = useState<CheckoutOrder | null>(() => readLastOrder());
  const [toast, setToast] = useState("");
  const [sidePanel, setSidePanel] = useState<string | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);

  useEffect(() => {
    if (!sidePanel) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSidePanel(null); };
    addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previous; removeEventListener("keydown", closeOnEscape); };
  }, [sidePanel]);

  useEffect(() => {
    const onRouteChange = () => {
      setRoute(getRoute());
      scrollTo({ top: 0, behavior: "smooth" });
    };
    addEventListener("popstate", onRouteChange);
    addEventListener("hashchange", onRouteChange);
    return () => {
      removeEventListener("popstate", onRouteChange);
      removeEventListener("hashchange", onRouteChange);
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("bms-cart", JSON.stringify(cart));
      localStorage.setItem("bms-wishlist", JSON.stringify(wishlist));
    } catch {
      // The storefront remains usable when browser storage is disabled or full.
    }
  }, [cart, wishlist]);
  useEffect(() => {
    const title =
      page === "product"
        ? `${matchedProduct ? selectedProduct.name : "Product Not Found"} | BM Solicitor`
        : `${page === "home" ? "Luxury Outerwear" : page.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())} | BM Solicitor`;
    document.title = title;
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.append(description);
    }
    description.content =
      page === "product"
        ? selectedProduct.shortDescription
        : page === "men"
          ? "Explore refined men's jackets, insulated layers, and considered winter outerwear from BM Solicitor."
          : page === "women"
            ? "Discover women's coats, polished jackets, and considered winter layers from BM Solicitor."
            : page === "overcoat"
              ? "Explore leather trenches, shearling-collar jackets, and longer outerwear."
              : page === "new-arrivals"
                ? "Shop the latest men's and women's outerwear arrivals from BM Solicitor."
                : page === "unisex"
                  ? "Explore versatile unisex leather jackets and distinctive varsity and bomber silhouettes from BM Solicitor."
                  : "Discover considered leather jackets and distinctive outerwear from BM Solicitor.";
  }, [page, selectedProduct, matchedProduct]);
  openDrawer = (panel) => setSidePanel(panel || null);
  navigate = (p: Page | string) => {
    const next = new URL(p, location.origin);
    const panelRoute = next.pathname.replace(/^\//, "");
    if (["cart", "account", "wishlist", "checkout"].includes(panelRoute)) {
      setSidePanel(panelRoute);
      return;
    }
    if (["shop", "men", "women", "product", "home", "overcoat", "new-arrivals"].includes(panelRoute)) setSidePanel(null);
    if (next.pathname === "/product" && next.searchParams.has("slug")) {
      const slug = next.searchParams.get("slug");
      next.pathname = `/products/${encodeURIComponent(slug || "")}`;
      next.searchParams.delete("slug");
    } else if (next.pathname === "/home") {
      next.pathname = "/";
    }
    history.pushState({}, "", `${next.pathname}${next.search}`);
    setRoute(getRoute());
    scrollTo({ top: 0, behavior: "smooth" });
  };
  const add = (
    p: Product,
    size = p.sizes.includes("M") ? "M" : p.sizes[0],
    color = p.colors[0],
  ) => {
    if (!p.sizes.includes(size) || !p.colors.includes(color)) return;
    setCart((x) => [...x, { ...p, selectedSize: size, selectedColor: color }]);
    setToast(`${p.name} added to your bag`);
    setTimeout(() => setToast(""), 2600);
  };
  const wish = (id: number) =>
    setWishlist((x) => (x.includes(id) ? x.filter((i) => i !== id) : [...x, id]));
  const common = { onAdd: add, onWish: wish, wishlist };
  const render = () => {
    if (page === "home") return <Home {...common} />;
    if (["men", "women", "unisex", "overcoat", "new-arrivals"].includes(page)) return <Shop {...common} collection={page === "new-arrivals" ? "new" : page} initialCategory="All" searchTerm="" key={page} />;
    if (page === "shop")
      return (
        <Shop
          {...common}
          collection={collection}
          initialCategory={initialCategory}
          searchTerm={searchTerm}
          key={`${collection}-${initialCategory}-${searchTerm}`}
        />
      );
    if (page === "product" && !matchedProduct)
      return <main className="light-page"><div className="empty"><h1>We couldn’t find that piece.</h1><p>Explore the collection to discover another style.</p><button className="btn btn-dark" onClick={() => navigate("shop")}>SHOP THE COLLECTION</button></div></main>;
    if (page === "product")
      return (
        <ProductDetail
          product={selectedProduct}
          onAdd={add}
          onWish={wish}
          wished={wishlist.includes(selectedProduct.id)}
          key={selectedProduct.id}
        />
      );
    if (page === "cart") return <Cart items={cart} setItems={setCart} />;
    if (page === "checkout") return <Checkout items={cart} onComplete={(order) => { setLastOrder(order); setCart([]); navigate("order-confirmation"); }} />;
    if (page === "order-confirmation") return <OrderConfirmation order={lastOrder} onContinue={() => navigate("home")} />;
    if (page === "account") return <Account />;
    if (page === "wishlist")
      return (
        <main className="light-page">
          <div className="page-title">
            <small>YOUR EDIT</small>
            <h1>Wishlist</h1>
            <p>{wishlist.length} saved pieces</p>
          </div>
          <div className="section product-grid wishlist-grid">
            {products
              .filter((p) => wishlist.includes(p.id))
              .map((p) => (
                <ProductCard key={p.id} product={p} onAdd={add} onWish={wish} wished />
              ))}
            {!wishlist.length && (
              <div className="empty">
                <Icon name="heart" size={42} />
                <h2>Your wishlist awaits.</h2>
                <p>Save the pieces you love and return to them anytime.</p>
                <button className="btn btn-dark" onClick={() => navigate("shop")}>
                  DISCOVER THE COLLECTION
                </button>
              </div>
            )}
          </div>
        </main>
      );
    if (["about", "privacy", "terms", "returns", "shipping"].includes(page))
      return <EditorialPage page={page} />;
    return <SupportPage page={page} />;
  };
  const panelTitles: Record<string, string> = { cart: "Your shopping bag", wishlist: "Your wishlist", account: "Your account", checkout: "Secure checkout", "order-confirmation": "Order details" };
  const panelContent = sidePanel === "cart" ? <Cart items={cart} setItems={setCart} />
    : sidePanel === "checkout" ? <Checkout items={cart} onComplete={(order) => { setLastOrder(order); setCart([]); setSidePanel("order-confirmation"); }} />
      : sidePanel === "order-confirmation" ? <OrderConfirmation order={lastOrder} onContinue={() => { setSidePanel(null); navigate("home"); }} />
        : sidePanel === "account" ? <Account />
          : sidePanel === "wishlist" ? <WishlistPanel wishlist={wishlist} onAdd={add} onWish={wish} /> : null;
  const headerless = page === "checkout";
  return (
    <>
      {!headerless && (
        <div className={page === "home" ? "home-header-layer" : ""}>
          <Header cartCount={cart.length} wishlistCount={wishlist.length} currentPage={page} />
        </div>
      )}
      <div className="page-wrap">{render()}</div>
      {!headerless && <Footer />}
      {sidePanel && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSidePanel(null); }}><aside className="side-drawer" role="dialog" aria-modal="true" aria-label={panelTitles[sidePanel] || "Store panel"}><div className="side-drawer-heading"><span>{panelTitles[sidePanel] || "Store"}</span><button onClick={() => setSidePanel(null)} aria-label="Close panel"><Icon name="close" /></button></div><div className="side-drawer-body">{panelContent}</div></aside></div>}
      <div className="floating-support">
        {assistantOpen && <ChatAssistant onClose={() => setAssistantOpen(false)} />}
        <a className="floating-whatsapp" href="https://wa.me/923247800007" target="_blank" rel="noopener noreferrer" title="Chat with us on WhatsApp" aria-label="Chat with us on WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2A12.7 12.7 0 0 0 5.1 22.4L3.4 28.7l6.5-1.7A12.7 12.7 0 1 0 16 3.2Zm0 22.9c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.8 1 1-3.7-.3-.4a10.3 10.3 0 1 1 9.1 4.8Zm5.7-7.7c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.4 8.4 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.9 5.1.8.3 1.4.5 1.9.6.8.2 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4Z"/></svg></a>
        <button className="floating-assistant" onClick={() => setAssistantOpen((open) => !open)} aria-label={assistantOpen ? "Close BM Solicitors Assistant" : "Open BM Solicitors Assistant"}><img src="/assets/images/bm-solicitor-logo.png" alt="" /></button>
      </div>
      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
          <button onClick={() => navigate("cart")}>VIEW BAG</button>
        </div>
      )}
    </>
  );
}
