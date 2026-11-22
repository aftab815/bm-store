export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: number;
  supabaseId?: string;
  variantOptions?: { id: string; size: string; color: string }[];
  sku: string;
  name: string;
  slug: string;
  category: "men" | "women" | "overcoat";
  subcategory: string;
  gender: "men" | "women" | "unisex";
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  fabric: string;
  material: string;
  materialType: string;
  fit: string;
  care: string;
  styleTips: string;
  features: string[];
  stockStatus: "in-stock" | "out-of-stock";
  images: ProductImage[];
  sizes: string[];
  colors: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  image: string;
  color: string;
  audience: "men" | "women" | "unisex";
  isNew: boolean;
  isPremium: boolean;
  badge?: string;
};

type ProductDefinition = Omit<
  Product,
  | "id"
  | "sku"
  | "slug"
  | "subcategory"
  | "material"
  | "materialType"
  | "features"
  | "stockStatus"
  | "description"
  | "images"
  | "image"
  | "color"
  | "audience"
  | "isNew"
  | "isPremium"
  | "badge"
> & {
  imagePath: string;
};

const menPhotos = [
  {
    src: "/assets/images/men/black-puffer.png",
    alt: "Model wearing a black quilted puffer jacket in a dark studio",
  },
  {
    src: "/assets/images/men/leather-bomber.png",
    alt: "Model wearing a dark brown leather bomber with tailored trousers",
  },
  {
    src: "/assets/images/men/navy-bomber.png",
    alt: "Model wearing a navy wool bomber in a pale stone setting",
  },
  {
    src: "/assets/images/men/ivory-puffer.png",
    alt: "Model wearing an ivory insulated puffer against a snowy landscape",
  },
  {
    src: "/assets/images/men/charcoal-overcoat.png",
    alt: "Model wearing a long charcoal overcoat in an architectural setting",
  },
  {
    src: "/assets/images/men/mens-street-jacket.jpg",
    alt: "Street-style model wearing a dark technical jacket",
  },
  {
    src: "/assets/images/men/camel-bomber-detail.jpg",
    alt: "Camel-toned bomber jacket shown on a hanger",
  },
];

const womenPhotos = [
  {
    src: "/assets/images/women/camel-coat.png",
    alt: "Model wearing a belted camel wool coat against a winter mountain backdrop",
  },
  {
    src: "/assets/images/women/burgundy-parka.png",
    alt: "Model wearing a long burgundy hooded parka",
  },
  {
    src: "/assets/images/women/ivory-overcoat.png",
    alt: "Model wearing a tailored ivory double-breasted overcoat",
  },
  {
    src: "/assets/images/women/black-coat-editorial.jpg",
    alt: "Model wearing a black coat on a city street",
  },
  {
    src: "/assets/images/women/camel-coat-street.jpg",
    alt: "Model wearing a camel wrap coat on city steps",
  },
  {
    src: "/assets/images/women/blue-coat-street.jpg",
    alt: "Model wearing a pale blue long coat in a city square",
  },
];

const overcoatPhotos = {
  men: [
    {
      src: "/assets/images/overcoat/mens-charcoal-overcoat.png",
      alt: "Model wearing a long charcoal overcoat in an architectural setting",
    },
    {
      src: "/assets/images/overcoat/womens-camel-overcoat.png",
      alt: "Model wearing a belted camel wool overcoat",
    },
    {
      src: "/assets/images/overcoat/womens-ivory-overcoat.png",
      alt: "Model wearing an ivory double-breasted overcoat",
    },
    {
      src: "/assets/images/overcoat/womens-camel-street.jpg",
      alt: "Model wearing a camel wrap overcoat on city steps",
    },
  ],
  women: [
    {
      src: "/assets/images/overcoat/womens-camel-overcoat.png",
      alt: "Model wearing a belted camel wool overcoat",
    },
    {
      src: "/assets/images/overcoat/womens-ivory-overcoat.png",
      alt: "Model wearing an ivory double-breasted overcoat",
    },
    {
      src: "/assets/images/overcoat/womens-black-overcoat.jpg",
      alt: "Model wearing a black overcoat on a city street",
    },
    {
      src: "/assets/images/overcoat/womens-camel-street.jpg",
      alt: "Model wearing a camel wrap overcoat on city steps",
    },
  ],
};

const definitions: ProductDefinition[] = [
  {
    name: "The Kensington City Puffer",
    category: "men",
    gender: "men",
    price: 79,
    shortDescription: "A clean-lined, cold-weather puffer with considered insulation and an easy city fit.",
    fabric: "Matte recycled-nylon shell with a smooth lining and lightweight synthetic insulation.",
    fit: "Regular through the body with room for a fine knit; hip-length with a protective stand collar.",
    care: "Close fastenings and machine wash cold on a gentle cycle. Tumble dry low with dryer balls; do not bleach.",
    styleTips: "Layer over merino and finish with straight-leg wool trousers or dark denim.",
    imagePath: menPhotos[0].src,
    colors: ["Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Milano Espresso Leather Bomber",
    category: "men",
    gender: "men",
    price: 96,
    shortDescription: "A refined bomber silhouette with a soft hand and understated hardware.",
    fabric: "Supple leather-effect shell with a brushed interior and tonal rib-knit trims.",
    fit: "A relaxed regular fit with a defined hem, designed to sit neatly at the waist.",
    care: "Wipe clean with a soft, dry cloth. Keep away from heat and moisture; specialist leather cleaning only.",
    styleTips: "Wear over a fine-gauge roll-neck with tailored trousers for a quiet evening look.",
    imagePath: menPhotos[1].src,
    colors: ["Espresso", "Black"],
    sizes: ["S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Roma Navy Wool Bomber",
    category: "men",
    gender: "unisex",
    price: 74,
    shortDescription: "A softly structured wool-blend layer that brings polish to everyday dressing.",
    fabric: "Brushed wool-blend shell with a soft cotton-rich lining and ribbed edges.",
    fit: "Regular fit with a lightly dropped shoulder for comfortable mid-layering.",
    care: "Dry clean only. Brush gently after wear and store on a broad hanger.",
    styleTips: "Pair the deep navy tone with stone chinos, a crisp shirt, or dark denim.",
    imagePath: menPhotos[2].src,
    colors: ["Navy", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: false,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Alpine Ivory Down Puffer",
    category: "men",
    gender: "men",
    price: 84,
    shortDescription: "A warm, lightweight puffer in a crisp winter shade with a softly protective collar.",
    fabric: "Water-resistant recycled-polyester shell, smooth lining, and responsibly sourced down blend.",
    fit: "Regular fit with a little extra ease through the chest for cold-weather layers.",
    care: "Machine wash cold on a gentle cycle with down-safe detergent. Tumble dry low until fully dry.",
    styleTips: "Balance the light shell with charcoal knitwear and relaxed black trousers.",
    imagePath: menPhotos[3].src,
    colors: ["Ivory", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: true,
    isFeatured: true,
    isBestSeller: false,
  },
  {
    name: "Northline Quilted Field Jacket",
    category: "men",
    gender: "men",
    price: 68,
    shortDescription: "A practical quilted layer with a neat profile and useful everyday pockets.",
    fabric: "Lightweight water-repellent cotton-nylon shell with recycled fill and a smooth lining.",
    fit: "Straight, easy fit with adjustable cuffs and room to layer over a shirt or fine knit.",
    care: "Machine wash cold on a gentle cycle; close all fastenings and line dry.",
    styleTips: "Wear with a merino crewneck and sturdy denim for a relaxed weekend uniform.",
    imagePath: menPhotos[5].src,
    colors: ["Olive", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: false,
    isFeatured: true,
    isBestSeller: false,
  },
  {
    name: "Cortina Brushed Wool Jacket",
    category: "men",
    gender: "men",
    price: 72,
    shortDescription: "A soft, versatile wool layer that moves easily between work and weekend.",
    fabric: "Brushed wool-blend face with a smooth recycled-polyester lining.",
    fit: "Comfortable regular fit, finished at the hip with a clean straight hem.",
    care: "Dry clean only. Air between wears and store folded or on a shaped hanger.",
    styleTips: "Layer over a crisp Oxford shirt or a lightweight roll-neck with tailored denim.",
    imagePath: menPhotos[2].src,
    colors: ["Navy", "Camel"],
    sizes: ["S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Riviera Suede-Effect Bomber",
    category: "men",
    gender: "men",
    price: 88,
    shortDescription: "A tactile bomber with a polished finish and a versatile, understated shape.",
    fabric: "Soft suede-effect microfiber with a smooth lining and tonal knit trims.",
    fit: "Regular fit with a neat shoulder and gently gathered cuffs.",
    care: "Professional specialist cleaning recommended. Brush lightly with a suede brush and avoid rain.",
    styleTips: "Keep the texture in focus with a fine knit, clean denim, and minimal leather trainers.",
    imagePath: menPhotos[6].src,
    colors: ["Camel", "Espresso"],
    sizes: ["S", "M", "L", "XL"],
    isNewArrival: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Studio Reversible Insulated Gilet",
    category: "men",
    gender: "men",
    price: 59,
    shortDescription: "A versatile two-sided layer for added warmth without unnecessary weight.",
    fabric: "Recycled-nylon shell on one side and a soft matte finish on the reverse, with light fill.",
    fit: "Regular fit with a clean armhole that layers comfortably over knitwear.",
    care: "Machine wash cold on a gentle cycle; reshape while damp and line dry.",
    styleTips: "Wear over a hoodie for the outdoors or reverse it over a knit for a cleaner city look.",
    imagePath: menPhotos[0].src,
    colors: ["Black", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Bromley Rib-Knit Zip Jacket",
    category: "men",
    gender: "men",
    price: 56,
    shortDescription: "A compact knit jacket with a polished zip front and an easy layering weight.",
    fabric: "Cotton-merino blend knit with a soft brushed inner face and durable metal zip.",
    fit: "Regular fit with ribbed cuffs and hem to keep the silhouette close and comfortable.",
    care: "Hand wash cool with a gentle wool detergent. Dry flat and reshape; do not wring.",
    styleTips: "Use it as a soft mid-layer beneath a tailored coat or as a light jacket indoors.",
    imagePath: menPhotos[2].src,
    colors: ["Navy", "Oat"],
    sizes: ["S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Ashford Storm-Shell Parka",
    category: "men",
    gender: "men",
    price: 91,
    shortDescription: "A longer protective parka with a weather-ready shell and refined hardware.",
    fabric: "Water-resistant recycled-nylon shell with sealed pocket details and a smooth lining.",
    fit: "Relaxed through the body, with an adjustable waist and coverage to mid-thigh.",
    care: "Machine wash cold on a gentle cycle. Close fastenings and reproof periodically as needed.",
    styleTips: "Layer over a wool suit or chunky knit when the forecast turns unsettled.",
    imagePath: menPhotos[0].src,
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Mayfair Lightweight Trench",
    category: "men",
    gender: "men",
    price: 82,
    shortDescription: "A clean, transitional trench that layers neatly over workday essentials.",
    fabric: "Cotton-rich water-repellent twill with a breathable half lining.",
    fit: "Classic straight fit with a removable belt and a versatile knee-length cut.",
    care: "Specialist dry clean. Spot clean small marks promptly and hang to air after wear.",
    styleTips: "Style over a suit for the commute or wear open with a fine knit and denim.",
    imagePath: menPhotos[4].src,
    colors: ["Stone", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Cotswold Weekend Fleece",
    category: "men",
    gender: "men",
    price: 54,
    shortDescription: "A soft, light layer with a clean zip front for cool morning walks.",
    fabric: "Dense recycled-polyester fleece with a cotton-blend pocket lining.",
    fit: "Easy regular fit with a high collar and adjustable hem.",
    care: "Machine wash cold with similar colours. Line dry and avoid fabric softener.",
    styleTips: "Wear beneath a shell on the trail or with relaxed denim for off-duty days.",
    imagePath: menPhotos[5].src,
    colors: ["Charcoal", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "The Lumiere Belted Wool Coat",
    category: "women",
    gender: "women",
    price: 93,
    shortDescription: "A softly sculpted wrap coat with a defined waist and graceful long line.",
    fabric: "Double-faced wool-blend cloth with a smooth, lightweight lining through the sleeves.",
    fit: "Relaxed shoulders and a removable self-belt create a flattering, adjustable shape.",
    care: "Dry clean only. Air after wear and store on a broad, shaped hanger.",
    styleTips: "Tie the belt loosely over a fine roll-neck, tailored trousers, and leather boots.",
    imagePath: womenPhotos[0].src,
    colors: ["Camel", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Bordeaux Hooded City Parka",
    category: "women",
    gender: "women",
    price: 78,
    shortDescription: "A warm, softly tailored parka with a protective hood and elegant long coverage.",
    fabric: "Water-resistant cotton-nylon shell with a smooth lining and lightweight recycled fill.",
    fit: "Comfortably shaped through the waist with adjustable drawcords and a mid-thigh hem.",
    care: "Machine wash cold on a gentle cycle. Close all fastenings and line dry.",
    styleTips: "Let the rich burgundy colour lift black knitwear, denim, and winter boots.",
    imagePath: womenPhotos[1].src,
    colors: ["Burgundy", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: true,
    isBestSeller: false,
  },
  {
    name: "Atelier Ivoire Cashmere-Blend Coat",
    category: "women",
    gender: "women",
    price: 99,
    shortDescription: "A luminous ivory coat with a clean double-breasted front and soft hand.",
    fabric: "Cashmere-blend wool cloth with a smooth lining and tonal buttons.",
    fit: "Straight, tailored shape with gentle room through the shoulder for fine layers.",
    care: "Dry clean only. Use a soft garment brush and store in a breathable cover.",
    styleTips: "Wear over monochrome separates or add contrast with dark denim and a soft scarf.",
    imagePath: womenPhotos[2].src,
    colors: ["Ivory", "Camel"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Studio Cropped Cloud Puffer",
    category: "women",
    gender: "women",
    price: 69,
    shortDescription: "A contemporary cropped puffer with light insulation and a soft, rounded shape.",
    fabric: "Water-resistant recycled-polyester shell with a smooth lining and lofty synthetic fill.",
    fit: "Relaxed cropped fit with a high collar and room for a midweight knit.",
    care: "Machine wash cold on a gentle cycle. Tumble dry low with dryer balls until fully lofted.",
    styleTips: "Balance the cropped proportion with high-rise denim, wide-leg trousers, or a knit skirt.",
    imagePath: womenPhotos[2].src,
    colors: ["Ivory", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Rosa Quilted City Jacket",
    category: "women",
    gender: "women",
    price: 66,
    shortDescription: "A lightweight quilted jacket with a soft sheen and easy city proportions.",
    fabric: "Quilted recycled-nylon shell with a smooth lining and low-bulk insulation.",
    fit: "Regular fit with a curved hem and subtle shaping through the waist.",
    care: "Machine wash cold on a gentle cycle. Fasten before washing and line dry.",
    styleTips: "Layer over a fine knit with straight-leg jeans and polished ankle boots.",
    imagePath: womenPhotos[1].src,
    colors: ["Burgundy", "Olive"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Celine Soft-Touch Bomber",
    category: "women",
    gender: "women",
    price: 76,
    shortDescription: "A softly structured bomber that brings a modern note to everyday layers.",
    fabric: "Brushed cotton-blend shell with a smooth lining and rib-knit collar, cuff, and hem.",
    fit: "Easy regular shape with a neat shoulder and a gently blouson profile.",
    care: "Dry clean recommended. Keep away from direct heat and store on a hanger.",
    styleTips: "Style with a fluid midi skirt or tailored trousers to balance its relaxed shape.",
    imagePath: womenPhotos[4].src,
    colors: ["Camel", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Cloudline Hooded Puffer",
    category: "women",
    gender: "women",
    price: 86,
    shortDescription: "An enveloping hooded puffer that pairs practical warmth with a clean silhouette.",
    fabric: "Water-resistant recycled-nylon shell, soft lining, and lightweight down-alternative fill.",
    fit: "Comfortably relaxed, with an adjustable hood and coverage to the upper thigh.",
    care: "Machine wash cold on a gentle cycle. Tumble dry low with dryer balls until completely dry.",
    styleTips: "Keep the look tonal with cream knitwear and soft grey tailoring.",
    imagePath: womenPhotos[2].src,
    colors: ["Winter White", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: true,
    isFeatured: true,
    isBestSeller: false,
  },
  {
    name: "Cafe Society Leather Jacket",
    category: "women",
    gender: "women",
    price: 98,
    shortDescription: "A refined leather-effect jacket with a soft drape and pared-back detailing.",
    fabric: "Supple leather-effect outer with a smooth lining and polished tonal hardware.",
    fit: "Regular fit, shaped gently at the waist and designed for a fine knit underneath.",
    care: "Wipe with a soft cloth and keep dry. Specialist leather cleaning only.",
    styleTips: "Wear over a silk blouse or fine knit with dark denim for an effortless evening layer.",
    imagePath: womenPhotos[3].src,
    colors: ["Black", "Espresso"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Merino Funnel-Neck Cardigan",
    category: "women",
    gender: "women",
    price: 57,
    shortDescription: "A soft, versatile knit layer with a refined collar and polished zip fastening.",
    fabric: "Fine merino-cotton yarn with a smooth hand and gentle natural warmth.",
    fit: "Comfortable regular fit with a softly structured funnel neck.",
    care: "Hand wash cool or use a wool cycle. Dry flat and reshape while damp.",
    styleTips: "Wear buttoned as a top with tailored trousers or open beneath a long coat.",
    imagePath: womenPhotos[5].src,
    colors: ["Oat", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Harbour Lightweight Trench",
    category: "women",
    gender: "women",
    price: 82,
    shortDescription: "A fluid, water-repellent trench designed for the shifting weather of the city.",
    fabric: "Cotton-rich twill with a water-repellent finish and breathable partial lining.",
    fit: "Relaxed straight fit with an adjustable belt and clean knee-length proportions.",
    care: "Specialist dry clean. Hang to air after wear and spot clean when needed.",
    styleTips: "Layer over a blazer or knit dress and leave the belt loosely tied.",
    imagePath: womenPhotos[4].src,
    colors: ["Stone", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Sloane City Knit Jacket",
    category: "women",
    gender: "women",
    price: 62,
    shortDescription: "A polished knit jacket with the ease of a cardigan and the finish of outerwear.",
    fabric: "Soft merino-blend knit with a smooth inner facing and refined button closure.",
    fit: "Regular fit with a gently shaped waist and neat hip-length hem.",
    care: "Hand wash cool with wool detergent and dry flat away from direct sunlight.",
    styleTips: "Pair with a silk blouse and tailored trousers for an understated workday layer.",
    imagePath: womenPhotos[0].src,
    colors: ["Camel", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Faye Weatherproof City Jacket",
    category: "women",
    gender: "women",
    price: 64,
    shortDescription: "A lightweight, weather-ready layer with a refined finish for everyday city wear.",
    fabric: "Soft cotton-nylon shell with a water-repellent finish and breathable partial lining.",
    fit: "Easy regular fit with a neat collar, adjustable cuffs, and a hip-length hem.",
    care: "Machine wash cold on a gentle cycle and line dry. Refresh the water-repellent finish as needed.",
    styleTips: "Layer over a fine knit with straight-leg denim or tailored trousers.",
    imagePath: womenPhotos[4].src,
    colors: ["Stone", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "The Mayfair Double-Face Overcoat",
    category: "overcoat",
    gender: "women",
    price: 99,
    shortDescription: "A generous double-face overcoat with a softly defined waist and timeless lapels.",
    fabric: "Double-faced wool-blend cloth, finished with a soft brushed texture and unlined body.",
    fit: "Relaxed longline fit with a self-belt and dropped shoulder for elegant layering.",
    care: "Dry clean only. Brush gently and store on a broad hanger in a breathable garment bag.",
    styleTips: "Wear open over a tonal knit set or cinch the belt over a fine roll-neck.",
    imagePath: overcoatPhotos.women[0].src,
    colors: ["Camel", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Kingswell Heritage Overcoat",
    category: "overcoat",
    gender: "men",
    price: 96,
    shortDescription: "A tailored long coat with a clean shoulder and considered, seasonless proportions.",
    fabric: "Dense wool-blend melton with a smooth lining and refined horn-effect buttons.",
    fit: "Regular tailored fit with room for a suit jacket or substantial knit beneath.",
    care: "Dry clean only. Brush in the direction of the nap and store on a shaped hanger.",
    styleTips: "Layer over suiting for work or wear with a dark roll-neck and wool trousers.",
    imagePath: overcoatPhotos.men[0].src,
    colors: ["Charcoal", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Montreux Belted Wrap Overcoat",
    category: "overcoat",
    gender: "women",
    price: 92,
    shortDescription: "A softly enveloping wrap coat with clean lines and an adjustable waist.",
    fabric: "Brushed wool-rich cloth with a smooth lining through the sleeves.",
    fit: "Relaxed longline fit with a removable belt and generous room for layering.",
    care: "Dry clean only. Air between wears and keep on a broad, padded hanger.",
    styleTips: "Pair with a fine-gauge knit, straight trousers, and a tonal leather boot.",
    imagePath: overcoatPhotos.women[1].src,
    colors: ["Ivory", "Camel"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Fitzrovia Herringbone Overcoat",
    category: "overcoat",
    gender: "men",
    price: 88,
    shortDescription: "A subtle herringbone texture gives this city overcoat quiet depth.",
    fabric: "Wool-blend herringbone with a smooth recycled-polyester lining.",
    fit: "Straight regular fit with a notch lapel and a comfortable mid-thigh length.",
    care: "Dry clean only. Brush gently after wear and allow the cloth to rest between outings.",
    styleTips: "Let the woven texture complement a plain knit, crisp shirt, and tailored denim.",
    imagePath: overcoatPhotos.men[0].src,
    colors: ["Navy", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: false,
    isFeatured: true,
    isBestSeller: false,
  },
  {
    name: "Monaco Sculpted Belted Coat",
    category: "overcoat",
    gender: "women",
    price: 94,
    shortDescription: "A softly structured coat with a defined waist and enduring, elegant proportions.",
    fabric: "Double-face wool blend with a smooth sleeve lining and tonal belt.",
    fit: "Tailored through the shoulder with a gently flared line below the waist.",
    care: "Specialist dry clean. Remove the belt before cleaning and store the coat on a broad hanger.",
    styleTips: "Wear with a fine roll-neck and knee-high boots for a composed winter silhouette.",
    imagePath: overcoatPhotos.women[3].src,
    colors: ["Camel", "Winter White"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: true,
  },
  {
    name: "Regent Double-Breasted Overcoat",
    category: "overcoat",
    gender: "men",
    price: 98,
    shortDescription: "A confident double-breasted coat with a precise lapel and refined drape.",
    fabric: "Brushed wool-rich melton with a fully lined interior and polished buttons.",
    fit: "Tailored regular fit with a clean shoulder and enough room for a suit.",
    care: "Dry clean only. Steam lightly from a distance and store on a broad hanger.",
    styleTips: "Button over a charcoal suit or wear open with a black knit and tailored trousers.",
    imagePath: overcoatPhotos.men[0].src,
    colors: ["Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: false,
    isFeatured: true,
    isBestSeller: false,
  },
  {
    name: "Alba Cloud Cashmere-Blend Coat",
    category: "overcoat",
    gender: "women",
    price: 99,
    shortDescription: "A softly luminous overcoat with clean tailoring and a sumptuous hand.",
    fabric: "Cashmere-blend wool cloth with a smooth, breathable lining.",
    fit: "Straight, refined fit with a softly padded shoulder and elegant knee-length finish.",
    care: "Dry clean only. Use a garment brush and store in a breathable cover.",
    styleTips: "Keep the palette quiet with cream knitwear or create contrast with black tailoring.",
    imagePath: overcoatPhotos.women[1].src,
    colors: ["Winter White", "Camel"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNewArrival: false,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Windsor City Car Coat",
    category: "overcoat",
    gender: "unisex",
    price: 87,
    shortDescription: "A pared-back car coat with a sharp collar and effortless everyday versatility.",
    fabric: "Compact wool-blend cloth with a smooth lining and discreet button closure.",
    fit: "Comfortable straight fit with a clean shoulder and upper-thigh length.",
    care: "Dry clean only. Brush lightly and hang to air after wearing.",
    styleTips: "Layer over a fine knit and dark denim or wear over a suit for a softer formal look.",
    imagePath: overcoatPhotos.men[0].src,
    colors: ["Charcoal", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    name: "Harrow Espresso Leather Racer",
    category: "men",
    gender: "men",
    price: 89,
    shortDescription: "A clean-lined leather-effect racer with a low-profile collar and understated zip hardware.",
    fabric: "Supple leather-effect shell with a smooth recycled-polyester lining.",
    fit: "Regular fit with a neat shoulder, shaped waist, and room for a fine knit.",
    care: "Wipe with a soft dry cloth. Keep away from heat and moisture; specialist cleaning recommended.",
    styleTips: "Wear with dark denim and a fine-gauge crew neck for a pared-back weekend look.",
    imagePath: menPhotos[1].src,
    colors: ["Espresso"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNewArrival: false,
    isFeatured: false,
    isBestSeller: true,
  },
];

// Curated Mohana Leather shots from the image bundle supplied for this store.
// Keep one real view per product unless additional distinct views of that exact
// garment are available; never pad a gallery with a different jacket.
const mohanaProductImages: Record<string, string> = {
  "The Kensington City Puffer": "/assets/images/mohana/shearling-product.png",
  "Milano Espresso Leather Bomber": "/assets/images/mohana/brown-racer.png",
  "Roma Navy Wool Bomber": "/assets/images/mohana/blue-leather-bomber.png",
  "Alpine Ivory Down Puffer": "/assets/images/mohana/brown-blazer.png",
  "Northline Quilted Field Jacket": "/assets/images/mohana/black-leather-overshirt-model.png",
  "Cortina Brushed Wool Jacket": "/assets/images/mohana/black-zip-jacket.png",
  "Riviera Suede-Effect Bomber": "/assets/images/mohana/brown-racer-alt.png",
  "Studio Reversible Insulated Gilet": "/assets/images/mohana/varsity-black.png",
  "Bromley Rib-Knit Zip Jacket": "/assets/images/mohana/black-racer.png",
  "Ashford Storm-Shell Parka": "/assets/images/mohana/black-moto-jacket.png",
  "Mayfair Lightweight Trench": "/assets/images/mohana/brown-trench.png",
  "Cotswold Weekend Fleece": "/assets/images/mohana/black-shearling-editorial.png",
  "The Lumiere Belted Wool Coat": "/assets/images/mohana/brown-biker-model.png",
  "Bordeaux Hooded City Parka": "/assets/images/mohana/brown-biker-model.png",
  "Atelier Ivoire Cashmere-Blend Coat": "/assets/images/mohana/brown-blazer.png",
  "Studio Cropped Cloud Puffer": "/assets/images/mohana/black-studded-biker-product.png",
  "Rosa Quilted City Jacket": "/assets/images/mohana/black-belted-jacket.png",
  "Celine Soft-Touch Bomber": "/assets/images/mohana/women-biker-editorial.png",
  "Cloudline Hooded Puffer": "/assets/images/mohana/black-studded-biker-model.png",
  "Cafe Society Leather Jacket": "/assets/images/mohana/black-studded-biker-model.png",
  "Merino Funnel-Neck Cardigan": "/assets/images/mohana/women-blue-coat-model.png",
  "Harbour Lightweight Trench": "/assets/images/mohana/brown-biker-model.png",
  "Sloane City Knit Jacket": "/assets/images/mohana/black-belted-jacket.png",
  "Faye Weatherproof City Jacket": "/assets/images/mohana/womens-brown-jacket-editorial.png",
  "The Mayfair Double-Face Overcoat": "/assets/images/mohana/brown-trench.png",
  "Kingswell Heritage Overcoat": "/assets/images/mohana/black-leather-blazer.png",
  "Montreux Belted Wrap Overcoat": "/assets/images/mohana/brown-blazer.png",
  "Fitzrovia Herringbone Overcoat": "/assets/images/mohana/black-moto-jacket.png",
  "Monaco Sculpted Belted Coat": "/assets/images/mohana/brown-biker-model.png",
  "Regent Double-Breasted Overcoat": "/assets/images/mohana/brown-trench.png",
  "Alba Cloud Cashmere-Blend Coat": "/assets/images/mohana/brown-blazer.png",
  "Windsor City Car Coat": "/assets/images/mohana/black-leather-blazer.png",
  "Harrow Espresso Leather Racer": "/assets/images/mohana/black-biker-model.png",
};

const mohanaCatalogDetails: Record<string, { name: string; color: string; silhouette: string; gender?: ProductDefinition["gender"] }> = {
  "The Kensington City Puffer": { name: "Shearling-Collar Flight Jacket", color: "Cognac", silhouette: "shearling" },
  "Milano Espresso Leather Bomber": { name: "Chestnut Chest-Zip Racer Jacket", color: "Chestnut", silhouette: "racer" },
  "Roma Navy Wool Bomber": { name: "Blue Leather Bomber Jacket", color: "Blue", silhouette: "bomber" },
  "Alpine Ivory Down Puffer": { name: "Chestnut Leather Blazer", color: "Chestnut", silhouette: "blazer" },
  "Northline Quilted Field Jacket": { name: "Black Button-Front Leather Overshirt", color: "Black", silhouette: "overshirt" },
  "Cortina Brushed Wool Jacket": { name: "Black Zip-Front Leather Jacket", color: "Black", silhouette: "racer" },
  "Riviera Suede-Effect Bomber": { name: "Quilted-Shoulder Leather Racer", color: "Cognac", silhouette: "racer" },
  "Studio Reversible Insulated Gilet": { name: "Black Varsity Jacket with Leather Sleeves", color: "Black", silhouette: "varsity" },
  "Bromley Rib-Knit Zip Jacket": { name: "Black Cafe Racer Jacket", color: "Black", silhouette: "racer" },
  "Ashford Storm-Shell Parka": { name: "Black Leather Moto Jacket", color: "Black", silhouette: "biker" },
  "Mayfair Lightweight Trench": { name: "Brown Leather Trench Coat", color: "Brown", silhouette: "trench" },
  "Cotswold Weekend Fleece": { name: "Black Shearling-Collar Flight Jacket", color: "Black", silhouette: "shearling" },
  "The Lumiere Belted Wool Coat": { name: "Women's Brown Leather Biker Jacket", color: "Brown", silhouette: "biker" },
  "Bordeaux Hooded City Parka": { name: "Brown Leather Jacket — City Edit", color: "Brown", silhouette: "biker" },
  "Atelier Ivoire Cashmere-Blend Coat": { name: "Chestnut Leather Blazer with Red Lining", color: "Chestnut", silhouette: "blazer" },
  "Studio Cropped Cloud Puffer": { name: "Black Studded Leather Biker Jacket", color: "Black", silhouette: "biker" },
  "Rosa Quilted City Jacket": { name: "Black Belted Leather Jacket", color: "Black", silhouette: "belted" },
  "Celine Soft-Touch Bomber": { name: "Women's Black Leather Biker Jacket", color: "Black", silhouette: "biker" },
  "Cloudline Hooded Puffer": { name: "Studded Black Leather Biker — Portrait Edit", color: "Black", silhouette: "biker" },
  "Cafe Society Leather Jacket": { name: "Studded Black Leather Biker — Studio Edit", color: "Black", silhouette: "biker" },
  "Merino Funnel-Neck Cardigan": { name: "Women's Blue Longline Coat", color: "Blue", silhouette: "coat" },
  "Harbour Lightweight Trench": { name: "Women's Brown Leather Jacket — Car Edit", color: "Brown", silhouette: "biker" },
  "Sloane City Knit Jacket": { name: "Black Belted Leather Jacket — Tailored Edit", color: "Black", silhouette: "belted" },
  "Faye Weatherproof City Jacket": { name: "Women's Brown Leather Jacket — Evening Edit", color: "Brown", silhouette: "biker" },
  "The Mayfair Double-Face Overcoat": { name: "Belted Leather Trench", color: "Brown", silhouette: "trench", gender: "men" },
  "Kingswell Heritage Overcoat": { name: "Black Leather Blazer", color: "Black", silhouette: "blazer", gender: "unisex" },
  "Montreux Belted Wrap Overcoat": { name: "Chestnut Leather Blazer — Tailored Edit", color: "Chestnut", silhouette: "blazer", gender: "unisex" },
  "Fitzrovia Herringbone Overcoat": { name: "Black Leather Moto Jacket — Heritage Edit", color: "Black", silhouette: "biker", gender: "unisex" },
  "Monaco Sculpted Belted Coat": { name: "Brown Leather Jacket — Women's Edit", color: "Brown", silhouette: "biker" },
  "Regent Double-Breasted Overcoat": { name: "Brown Leather Trench — City Edit", color: "Brown", silhouette: "trench", gender: "men" },
  "Alba Cloud Cashmere-Blend Coat": { name: "Blue Longline Coat — Women's Edit", color: "Blue", silhouette: "coat" },
  "Windsor City Car Coat": { name: "Black Leather Blazer — City Edit", color: "Black", silhouette: "blazer", gender: "unisex" },
  "Harrow Espresso Leather Racer": { name: "Black Leather Biker — Model Edit", color: "Black", silhouette: "biker" },
};

const silhouetteDetails: Record<string, Pick<ProductDefinition, "shortDescription" | "fabric" | "fit" | "care" | "styleTips">> = {
  shearling: {
    shortDescription: "A substantial flight silhouette finished with a plush shearling collar and turned-back cuffs.",
    fabric: "Leather outer with a soft shearling-style collar and warm lining.",
    fit: "Regular fit with room for a knit layer and a hip-length finish.",
    care: "Specialist leather cleaning recommended. Wipe gently with a soft cloth and store on a broad hanger.",
    styleTips: "Pair with dark denim and a simple knit to let the collar and leather finish stand out.",
  },
  racer: {
    shortDescription: "A streamlined zip-front jacket with a clean collar and considered pocket detailing.",
    fabric: "Leather outer with a smooth lining and metal zip fastenings.",
    fit: "Regular fit, shaped through the body and easy to layer over a light knit.",
    care: "Specialist leather cleaning recommended. Wipe gently with a soft cloth and store on a broad hanger.",
    styleTips: "Wear with a crewneck, straight-leg denim, and understated boots.",
  },
  bomber: {
    shortDescription: "A relaxed zip-front bomber in a deep blue finish, cut for everyday layering.",
    fabric: "Blue leather outer with a smooth lining and ribbed cuffs and hem.",
    fit: "Regular bomber fit with a neat shoulder and an easy waist-length hem.",
    care: "Specialist leather cleaning recommended. Wipe gently with a soft cloth and store on a broad hanger.",
    styleTips: "Balance the blue tone with charcoal trousers, a light knit, and clean trainers.",
  },
  blazer: {
    shortDescription: "A softly structured leather blazer with a tailored lapel and polished front closure.",
    fabric: "Leather outer with a smooth lining and tonal button fastening.",
    fit: "Tailored regular fit with gentle shaping through the waist and room for a fine layer.",
    care: "Specialist leather cleaning recommended. Wipe gently with a soft cloth and store on a broad hanger.",
    styleTips: "Style over a fine-gauge knit with tailored trousers or dark denim.",
  },
  overshirt: {
    shortDescription: "A button-front leather overshirt with chest pockets and a relaxed utility feel.",
    fabric: "Leather outer with stitched pocket panels, metal buttons, and a smooth lining.",
    fit: "Relaxed regular fit designed to layer comfortably over a tee or fine knit.",
    care: "Specialist leather cleaning recommended. Wipe gently with a soft cloth and store on a broad hanger.",
    styleTips: "Wear open over a plain tee with dark denim for an easy weekend look.",
  },
  varsity: {
    shortDescription: "A classic varsity shape with a clean body, leather sleeves, and striped rib trims.",
    fabric: "Wool-blend body with leather sleeves, a smooth lining, and rib-knit trims.",
    fit: "Regular fit with a ribbed hem that sits neatly at the waist.",
    care: "Specialist leather cleaning recommended. Store on a broad hanger and keep away from moisture.",
    styleTips: "Keep the varsity silhouette casual with a crew tee, straight denim, and sneakers.",
  },
  biker: {
    shortDescription: "A confident leather biker silhouette with angled seams and polished zip hardware.",
    fabric: "Leather outer with a smooth lining and metal zip detailing.",
    fit: "Regular fit with a shaped waist and enough room for a light mid-layer.",
    care: "Specialist leather cleaning recommended. Wipe gently with a soft cloth and store on a broad hanger.",
    styleTips: "Layer over a simple tee or fine knit with dark denim and ankle boots.",
  },
  belted: {
    shortDescription: "A tailored leather jacket with a defined waist, clean seams, and a polished buckle.",
    fabric: "Leather outer with a smooth lining and metal belt hardware.",
    fit: "Shaped through the waist with an adjustable belt and a hip-length finish.",
    care: "Specialist leather cleaning recommended. Wipe gently with a soft cloth and store on a broad hanger.",
    styleTips: "Wear over a fine knit with slim trousers or a simple skirt and boots.",
  },
  trench: {
    shortDescription: "A longline leather trench with a double-breasted front and a defined waist.",
    fabric: "Leather outer with a smooth lining, structured lapels, and button closure.",
    fit: "Straight longline fit with room for tailored layers underneath.",
    care: "Specialist leather cleaning recommended. Hang after wear and store on a broad coat hanger.",
    styleTips: "Layer over tailoring or a fine knit and let the long line remain the focus.",
  },
  coat: {
    shortDescription: "A clean longline coat with a polished collar and an easy city silhouette.",
    fabric: "Soft blue coat fabric with a smooth lining and tailored front closure.",
    fit: "Straight longline fit with room for a light sweater or tailored layers.",
    care: "Follow the garment care label. Air between wears and store on a broad hanger.",
    styleTips: "Pair with a neutral knit, straight-leg trousers, and simple leather shoes.",
  },
};

// Until a product has its own verified multi-angle shoot, show only the real
// matching product image. Never manufacture gallery angles by repetition.
const productPhotos = (product: ProductDefinition) => [{
  src: product.imagePath,
  alt: `${product.name} by Mohana Leather`,
}, ...(product.imagePath === "/assets/images/mohana/brown-racer.png"
  ? [{ src: "/assets/images/mohana/brown-racer-back.png", alt: "Rear view of the brown leather racer jacket" }]
  : product.imagePath === "/assets/images/mohana/black-zip-jacket.png"
    ? [{ src: "/assets/images/mohana/black-zip-jacket-back.png", alt: "Rear view of the black leather zip jacket" }]
    : [])];

const subcategoryFor = (product: ProductDefinition) => {
  const name = product.name.toLowerCase();
  const types: [string, string][] = [
    ["trench", "Trench Coat"], ["bomber", "Bomber Jacket"], ["biker", "Biker Jacket"],
    ["moto", "Biker Jacket"], ["racer", "Racer Jacket"], ["varsity", "Varsity Jacket"],
    ["overshirt", "Leather Overshirt"], ["blazer", "Leather Blazer"], ["belted", "Belted Jacket"],
    ["parka", "Parka"], ["quilt", "Quilted Jacket"],
    ["coat", "Coat"], ["jacket", "Leather Jacket"],
    ["gilet", "Gilet"], ["fleece", "Fleece Layer"], ["cardigan", "Knit Layer"],
    ["knit", "Knit Layer"],
  ];
  return types.find(([term]) => name.includes(term))?.[1] || "Everyday Jacket";
};

const materialTypeFor = (product: ProductDefinition) => {
  const fabric = product.fabric.toLowerCase();
  if (fabric.includes("leather")) return "Leather";
  if (/wool|cashmere|merino/.test(fabric)) return "Wool & knit";
  if (fabric.includes("cotton")) return "Cotton blend";
  return "Technical fabric";
};

export const products: Product[] = definitions.map((definition, index) => {
  const category = definition.category;
  const gender = definition.gender;
  const catalogDetails = mohanaCatalogDetails[definition.name];
  const silhouette = silhouetteDetails[catalogDetails?.silhouette ?? "biker"];
  const product: ProductDefinition = {
    ...definition,
    category,
    ...silhouette,
    name: catalogDetails?.name ?? definition.name,
    gender: catalogDetails?.gender ?? gender,
    imagePath: mohanaProductImages[definition.name] ?? definition.imagePath,
    colors: catalogDetails ? [catalogDetails.color] : definition.colors,
  };
  const images = productPhotos(product);
  const color = product.colors[0];
  const description = `${product.shortDescription} ${product.fabric} ${product.fit} ${product.care} ${product.styleTips}`;
  const isNew = product.isNewArrival;
  return {
    ...product,
    sku: `BMS-${category === "men" ? "M" : category === "women" ? "W" : "O"}-${String(index + 1).padStart(3, "0")}`,
    subcategory: subcategoryFor(product),
    material: product.fabric,
    materialType: materialTypeFor(product),
    features: [product.fit, product.fabric],
    stockStatus: "in-stock",
    id: index + 1,
    slug: product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    description,
    images,
    image: images[0].src,
    color,
    audience: product.gender,
    isNew,
    isPremium: product.price >= 90,
    badge: isNew ? "NEW" : product.isBestSeller ? "BESTSELLER" : undefined,
  };
});

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

export const productSlugAliases: Record<string, string> = {
  ...Object.fromEntries(definitions.map((definition, index) => [slugify(definition.name), products[index].slug])),
  "brown-double-breasted-leather-trench": products.find((product) => product.name === "Belted Leather Trench")!.slug,
};

export const categoryCounts = {
  men: products.filter((product) => product.category === "men" && product.gender === "men").length,
  women: products.filter((product) => product.category === "women" && product.gender === "women").length,
  overcoat: products.filter((product) => product.category === "overcoat").length,
  unisex: products.filter((product) => product.gender === "unisex").length,
};
