import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaSearch, FaPlus, FaMinus, FaShoppingCart,
  FaFire, FaTag, FaTruck, FaLeaf, FaShieldAlt, FaTimes,
  FaMapMarkerAlt, FaCheckCircle, FaClock, FaMotorcycle,
  FaStar, FaStarHalfAlt, FaRegStar, FaChevronRight,
  FaBoxOpen, FaHeart, FaRegHeart, FaShare
} from "react-icons/fa";
import "./QuickCommerce.css";

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */

const categories = [
  { id:"all",     emoji:"🏪", label:"All"             },
  { id:"fruits",  emoji:"🍎", label:"Fruits & Veggies" },
  { id:"dairy",   emoji:"🥛", label:"Dairy & Eggs"     },
  { id:"snacks",  emoji:"🍿", label:"Snacks"           },
  { id:"drinks",  emoji:"🥤", label:"Drinks"           },
  { id:"instant", emoji:"🍜", label:"Instant & Frozen" },
  { id:"bakery",  emoji:"🍞", label:"Bakery"           },
  { id:"care",    emoji:"🧴", label:"Personal Care"    },
  { id:"home",    emoji:"🧹", label:"Home Care"        },
];

function mkProd(id, name, brand, cat, emoji, price, orig, unit, rating, rev, badge, desc, variants, details, nutrition, tags) {
  return { id, name, brand, category: cat, emoji, price, original: orig, unit, rating, reviews: rev, badge, desc, variants, details, nutrition, tags };
}

const allProducts = [
  /* ── Fruits & Veggies ── */
  mkProd(1,"Fresh Avocado","Farm Direct","fruits","🥑",89,110,"2 pcs",4.5,1230,"19% OFF","Hand-picked Hass avocados, perfectly ripe and creamy. Rich in healthy monounsaturated fats and dietary fiber.",[{label:"2 pcs",price:89,original:110},{label:"4 pcs",price:169,original:210},{label:"6 pcs",price:239,original:300}],{ingredients:"Fresh Avocado (Persea americana)",storage:"Room temp until ripe, then refrigerate up to 5 days",shelfLife:"4–7 days",country:"India",type:"Premium"},{calories:160,protein:2,carbs:9,fat:15,fiber:7},["Rich in Good Fats","Keto-Friendly","Vegan"]),
  mkProd(2,"Organic Blueberries","Organic India","fruits","🫐",129,160,"200 g",4.7,2340,"🌿 Organic","Plump, juicy blueberries packed with antioxidants. Great for smoothies, oats, and snacking.",[{label:"200 g",price:129,original:160},{label:"400 g",price:249,original:310}],{ingredients:"Fresh Blueberries",storage:"Refrigerate and use within 5 days",shelfLife:"5–7 days",country:"India",type:"Organic"},{calories:57,protein:0.7,carbs:14,fat:0.3,fiber:2.4},["Antioxidant Rich","Low Calorie","Vegan"]),
  mkProd(3,"Roma Tomatoes","Fresh Valley","fruits","🍅",30,40,"500 g",4.3,987,"25% OFF","Vine-ripened Roma tomatoes with rich flavour. Perfect for salads, curries, and pasta sauces.",[{label:"500 g",price:30,original:40},{label:"1 kg",price:55,original:75},{label:"2 kg",price:100,original:140}],{ingredients:"Fresh Tomatoes",storage:"Store at room temperature, avoid direct sunlight",shelfLife:"5–7 days",country:"India",type:"Fresh"},{calories:18,protein:0.9,carbs:3.9,fat:0.2,fiber:1.2},["Low Calorie","Rich in Lycopene","Vegan"]),
  mkProd(4,"Green Broccoli","Farm Fresh","fruits","🥦",49,65,"1 head",4.4,765,"Deal","Fresh broccoli florets, a powerhouse of vitamins C and K. Steam, stir-fry or eat raw.",[{label:"1 head ~350g",price:49,original:65},{label:"2 heads",price:89,original:120}],{ingredients:"Fresh Broccoli",storage:"Refrigerate in a plastic bag for up to 5 days",shelfLife:"4–6 days",country:"India",type:"Fresh"},{calories:55,protein:3.7,carbs:11,fat:0.6,fiber:2.6},["High in Vitamin C","Iron-Rich","Vegan"]),
  mkProd(5,"Seedless Grapes","Grape Garden","fruits","🍇",85,105,"500 g",4.6,1540,"19% OFF","Sweet and crunchy seedless grapes freshly sourced from Nashik vineyards.",[{label:"500 g",price:85,original:105},{label:"1 kg",price:159,original:200}],{ingredients:"Fresh Seedless Grapes",storage:"Refrigerate; wash before eating",shelfLife:"5–7 days",country:"India",type:"Premium"},{calories:69,protein:0.7,carbs:18,fat:0.2,fiber:0.9},["Natural Sugars","No Seeds","Vegan"]),
  mkProd(6,"Salad Mix","Green Bowl","fruits","🥗",55,70,"250 g",4.2,890,"Deal","Ready-to-eat salad mix with lettuce, spinach, arugula and radicchio. Washed and packed hygienically.",[{label:"250 g",price:55,original:70},{label:"500 g",price:99,original:130}],{ingredients:"Lettuce, Spinach, Arugula, Radicchio",storage:"Refrigerate; use within 3 days of opening",shelfLife:"3–5 days",country:"India",type:"Ready-to-Eat"},{calories:20,protein:1.8,carbs:3,fat:0.3,fiber:1.8},["Ready to Eat","Low Calorie","Washed & Packed"]),

  /* ── Dairy & Eggs ── */
  mkProd(7,"Farm Fresh Eggs","Happy Hens","dairy","🥚",90,110,"12 pcs",4.8,4520,"Best Seller","Free-range, antibiotic-free eggs from happy hens. Rich protein source, great for everyday use.",[{label:"6 pcs",price:49,original:60},{label:"12 pcs",price:90,original:110},{label:"30 pcs",price:215,original:270}],{ingredients:"Eggs",storage:"Refrigerate; use within 30 days",shelfLife:"30 days",country:"India",type:"Free Range"},{calories:155,protein:13,carbs:1.1,fat:11,fiber:0},["Free Range","High Protein","No Antibiotics"]),
  mkProd(8,"Organic Full-Fat Milk","Mother Dairy","dairy","🥛",68,78,"1 L",4.6,3210,"Organic","Fresh, pasteurised organic full-fat milk. Ideal for tea, coffee, cereals and baking.",[{label:"500 ml",price:38,original:44},{label:"1 L",price:68,original:78},{label:"2 L",price:130,original:152}],{ingredients:"Organic Whole Milk",storage:"Refrigerate below 4°C; use within 3 days of opening",shelfLife:"7 days unopened",country:"India",type:"Organic"},{calories:61,protein:3.2,carbs:4.8,fat:3.3,fiber:0},["Organic","Calcium Rich","No Preservatives"]),
  mkProd(9,"Cheddar Cheese Slices","Amul","dairy","🧀",139,170,"200 g",4.5,1870,"18% OFF","Creamy, sharp cheddar cheese slices — perfect for sandwiches, burgers and quesadillas.",[{label:"200 g",price:139,original:170},{label:"400 g",price:269,original:330}],{ingredients:"Pasteurised Milk, Salt, Cultures, Rennet",storage:"Refrigerate; use within 7 days of opening",shelfLife:"90 days unopened",country:"India",type:"Processed"},{calories:380,protein:24,carbs:2,fat:31,fiber:0},["High Protein","Calcium Rich","Vegetarian"]),
  mkProd(10,"Greek Yogurt Plain","Epigamia","dairy","🍦",95,120,"400 g",4.7,2980,"Best Seller","Thick, creamy, strained Greek yogurt with no artificial flavors. High protein, low sugar.",[{label:"200 g",price:55,original:70},{label:"400 g",price:95,original:120}],{ingredients:"Skimmed Milk, Active Cultures",storage:"Refrigerate; use within 7 days of opening",shelfLife:"20 days",country:"India",type:"Strained"},{calories:97,protein:10,carbs:4,fat:5,fiber:0},["High Protein","Probiotic","No Added Sugar"]),
  mkProd(11,"Salted Butter","Amul","dairy","🧈",55,68,"100 g",4.5,2150,"19% OFF","Rich and creamy salted butter from Amul — perfect for toast, baking, and cooking.",[{label:"100 g",price:55,original:68},{label:"500 g",price:255,original:320}],{ingredients:"Pasteurised Cream, Salt",storage:"Refrigerate; freeze for long-term storage",shelfLife:"90 days refrigerated",country:"India",type:"Salted"},{calories:717,protein:0.9,carbs:0.1,fat:81,fiber:0},["Premium Quality","Cooking Essential","No Preservatives"]),

  /* ── Snacks & Munchies ── */
  mkProd(12,"Oat & Honey Cookies","NutriChoice","snacks","🍪",79,99,"200 g",4.3,2540,"Deal","Baked oat cookies with real honey, packed with fibre. A healthier, guilt-free snack.",[{label:"200 g",price:79,original:99},{label:"400 g",price:149,original:189}],{ingredients:"Whole Oats, Honey, Wheat Flour, Sugar, Edible Oil",storage:"Store in a cool dry place away from sunlight",shelfLife:"6 months",country:"India",type:"Baked"},{calories:480,protein:7,carbs:68,fat:18,fiber:5},["Whole Grain","No Maida","Baked Not Fried"]),
  mkProd(13,"Veggie Chips","Lay's","snacks","🍟",55,70,"100 g",4.2,3470,"21% OFF","Crispy veggie chips made from real potatoes, beetroot, and spinach. Light and flavourful.",[{label:"100 g",price:55,original:70},{label:"200 g",price:99,original:130}],{ingredients:"Potato, Beetroot, Spinach, Sunflower Oil, Seasoning",storage:"Store in a cool, dry place; consume within 3 days of opening",shelfLife:"4 months",country:"India",type:"Fried"},{calories:536,protein:6,carbs:57,fat:30,fiber:5},["No Artificial Colours","Real Veggies","Gluten-Free"]),
  mkProd(14,"Mixed Nuts Premium","Happilo","snacks","🥜",149,180,"150 g",4.6,1870,"17% OFF","Premium mix of almonds, cashews, walnuts, pistachios and raisins. No added salt or oil.",[{label:"150 g",price:149,original:180},{label:"300 g",price:279,original:340},{label:"500 g",price:449,original:550}],{ingredients:"Almonds, Cashews, Walnuts, Pistachios, Raisins",storage:"Store in a cool, dry place or refrigerate",shelfLife:"6 months",country:"India, UAE (mixed origin)",type:"Raw & Roasted"},{calories:580,protein:18,carbs:30,fat:45,fiber:6},["No Added Salt","Omega-3 Rich","Heart Healthy"]),
  mkProd(15,"Microwave Popcorn","Act II","snacks","🍿",89,110,"3 packs",4.4,4120,"19% OFF","Movie-time butter popcorn, ready in 2 minutes. Light, fluffy and perfectly salted.",[{label:"3 packs (240g)",price:89,original:110},{label:"6 packs (480g)",price:169,original:210}],{ingredients:"Corn, Butter Flavour, Salt, Edible Oil",storage:"Store in a cool, dry place",shelfLife:"6 months",country:"India",type:"Microwave"},{calories:420,protein:6,carbs:78,fat:11,fiber:8},["Ready in 2 Min","Movie Snack","No Trans Fat"]),

  /* ── Beverages ── */
  mkProd(16,"Cold Brew Coffee","Sleepy Owl","drinks","☕",85,105,"250 ml",4.6,2890,"19% OFF","Smooth, low-acidity cold brew coffee made from 100% arabica beans. No sugar, no dairy.",[{label:"250 ml",price:85,original:105},{label:"4-pack 1L",price:320,original:400}],{ingredients:"Water, Arabica Coffee",storage:"Refrigerate; shake well before drinking",shelfLife:"10 days refrigerated",country:"India",type:"Cold Brew"},{calories:5,protein:0.3,carbs:0.5,fat:0,fiber:0},["100% Arabica","No Sugar","Vegan"]),
  mkProd(17,"Sparkling Water","Aha! Water","drinks","🥤",45,60,"1 L",4.3,1560,"25% OFF","Clean and refreshing sparkling mineral water with a hint of natural lime. Zero calories.",[{label:"500 ml",price:25,original:35},{label:"1 L",price:45,original:60},{label:"6-pack 6L",price:249,original:340}],{ingredients:"Carbonated Water, Natural Lime Flavour",storage:"Refrigerate after opening; consume within 24 hours",shelfLife:"12 months unopened",country:"India",type:"Sparkling"},{calories:0,protein:0,carbs:0,fat:0,fiber:0},["Zero Calories","Hydrating","No Sugar"]),
  mkProd(18,"Mango Smoothie","Raw Pressery","drinks","🍹",75,95,"200 ml",4.5,2120,"21% OFF","100% real mango smoothie, cold-pressed with no preservatives. Pure fruit goodness.",[{label:"200 ml",price:75,original:95},{label:"4-pack 800ml",price:280,original:360}],{ingredients:"Mango Pulp (98%), Lemon Juice (2%)",storage:"Refrigerate; consume within 3 days of opening",shelfLife:"45 days sealed",country:"India",type:"Cold-Pressed"},{calories:89,protein:0.5,carbs:22,fat:0.2,fiber:1.5},["100% Fruit","No Preservatives","No Added Sugar"]),
  mkProd(19,"Green Tea Bags","Organic India","drinks","🍵",120,145,"25 bags",4.7,3670,"17% OFF","Certified organic whole-leaf green tea. Rich in antioxidants, supports metabolism and focus.",[{label:"25 bags",price:120,original:145},{label:"100 bags",price:430,original:540}],{ingredients:"Organic Green Tea Leaves (Camellia sinensis)",storage:"Store in a cool, dry place away from strong odors",shelfLife:"24 months",country:"India (Darjeeling)",type:"Organic"},{calories:2,protein:0,carbs:0.5,fat:0,fiber:0},["Certified Organic","Rich in Antioxidants","FSSAI Approved"]),

  /* ── Instant & Frozen ── */
  mkProd(20,"Maggi Noodles 2-Min","Nestlé","instant","🍜",56,65,"280 g (4 packs)",4.5,8970,"14% OFF","India's favourite 2-minute noodles. The classic masala flavour everyone loves.",[{label:"4 packs 280g",price:56,original:65},{label:"12 packs 840g",price:160,original:189}],{ingredients:"Wheat Flour, Palm Oil, Salt, Masala Mix (Coriander, Onion, Spices)",storage:"Store in a cool, dry place",shelfLife:"12 months",country:"India",type:"Instant"},{calories:350,protein:8,carbs:54,fat:11,fiber:2},["2 Minute Cook","Kids Favourite","Pan-Ready"]),
  mkProd(21,"Frozen Pizza Margherita","DiGiorno","instant","🍕",219,279,"350 g",4.2,1340,"21% OFF","Stone-baked frozen margherita pizza with mozzarella and tomato. Ready in 12 minutes.",[{label:"350 g",price:219,original:279}],{ingredients:"Wheat Flour, Tomato Sauce, Mozzarella Cheese, Yeast, Seasoning",storage:"Keep frozen at -18°C; do not refreeze after thawing",shelfLife:"6 months frozen",country:"India",type:"Frozen"},{calories:260,protein:11,carbs:33,fat:9,fiber:2},["Stone Baked","No Artificial Colours","Freezer to Oven"]),

  /* ── Bakery ── */
  mkProd(22,"Multigrain Bread","Britannia","bakery","🍞",55,65,"400 g",4.4,3210,"15% OFF","Soft, sliced multigrain bread with wheat, oats, ragi and flax seeds. High in fibre.",[{label:"400 g",price:55,original:65},{label:"800 g",price:99,original:120}],{ingredients:"Whole Wheat Flour, Oats, Ragi, Flaxseeds, Yeast, Salt",storage:"Store in a cool, dry place; refrigerate in summer",shelfLife:"7 days",country:"India",type:"Sliced Loaf"},{calories:243,protein:8,carbs:46,fat:3,fiber:4},["No Maida","High Fibre","5 Grains"]),
  mkProd(23,"Croissants Plain","French Loaf","bakery","🥐",89,110,"4 pcs",4.6,1870,"19% OFF","Buttery, flaky all-butter croissants freshly baked every morning. Crispy outside, soft inside.",[{label:"4 pcs",price:89,original:110},{label:"8 pcs",price:169,original:210}],{ingredients:"Wheat Flour, Butter (25%), Yeast, Salt, Sugar, Eggs",storage:"Best consumed on day of purchase; freeze for up to 1 month",shelfLife:"2 days at room temp",country:"India",type:"Fresh Baked"},{calories:406,protein:8,carbs:45,fat:21,fiber:2},["All-Butter","Freshly Baked","No Preservatives"]),

  /* ── Personal Care ── */
  mkProd(24,"Vitamin C Face Serum","Minimalist","care","💧",699,999,"30 ml",4.7,5420,"30% OFF","15% Ethyl Ascorbic Acid serum for brightening, anti-aging and even skin tone. Alcohol-free.",[{label:"30 ml",price:699,original:999}],{ingredients:"Aqua, Ethyl Ascorbic Acid 15%, Niacinamide 3%, Hyaluronic Acid",storage:"Store below 25°C; keep away from direct sunlight",shelfLife:"18 months unopened; 6 months opened",country:"India",type:"Serum"},{calories:null,protein:null,carbs:null,fat:null,fiber:null},["Alcohol-Free","Cruelty-Free","Dermatologist Tested"]),
  mkProd(25,"SPF 50+ Sunscreen","Neutrogena","care","🧴",849,1299,"50 ml",4.5,3670,"35% OFF","Lightweight, non-greasy broad-spectrum SPF 50+ sunscreen. Suitable for all skin types.",[{label:"50 ml",price:849,original:1299},{label:"88 ml",price:1299,original:1999}],{ingredients:"Avobenzone, Homosalate, Octisalate, Octocrylene, Titanium Dioxide",storage:"Store below 30°C; do not leave in hot car",shelfLife:"2 years",country:"USA",type:"Chemical SPF"},{calories:null,protein:null,carbs:null,fat:null,fiber:null},["Broad Spectrum","Water Resistant","Fragrance Free"]),
];

/* ── Sections ──────────────────────────────── */

const sections = [
  { id:"top",     title:"Top Picks For You",    badge:"🔥 Trending",         ids:[1,2,7,12,16,22] },
  { id:"fruits",  title:"Fruits & Vegetables",  badge:"🌿 Fresh Daily",       ids:[1,2,3,4,5,6]    },
  { id:"dairy",   title:"Dairy & Eggs",          badge:"🥛 Morning Essentials",ids:[7,8,9,10,11]    },
  { id:"snacks",  title:"Snacks & Munchies",     badge:"🍿 Grab & Go",         ids:[12,13,14,15]    },
  { id:"drinks",  title:"Beverages",             badge:"🥤 Stay Refreshed",    ids:[16,17,18,19]    },
  { id:"instant", title:"Instant & Frozen",      badge:"⚡ Quick Meals",       ids:[20,21]          },
  { id:"bakery",  title:"Bakery & Biscuits",     badge:"🍞 Fresh Baked",       ids:[22,23]          },
  { id:"care",    title:"Personal Care",         badge:"✨ Glow Up",           ids:[24,25]          },
];

function resolveSection(sec) {
  return { ...sec, products: sec.ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean) };
}

const resolvedSections = sections.map(resolveSection);

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */

function pct(p, o) { return Math.round((1 - p/o) * 100); }

function Stars({ r }) {
  return (
    <span className="qcStars">
      {[1,2,3,4,5].map(i =>
        i <= Math.floor(r) ? <FaStar key={i} /> :
        i - r < 1          ? <FaStarHalfAlt key={i} /> :
                              <FaRegStar key={i} />
      )}
    </span>
  );
}

/* ══════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
══════════════════════════════════════════════════════ */

function useReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("rv"); obs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    const tid = setTimeout(() => el.querySelectorAll(".rvEl:not(.rv)").forEach(n => obs.observe(n)), 60);
    return () => { clearTimeout(tid); obs.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* ══════════════════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════════════════ */

function ProductCard({ product: p, cartQty, onAdd, onRemove, onView, index }) {
  const disc = pct(p.price, p.original);
  return (
    <div
      className="qcCard rvEl"
      style={{ "--d": `${index * 0.06}s` }}
      onClick={() => onView(p)}
    >
      <div className={`qcCardImg qcCat-${p.category}`}>
        <span className="qcCardEmoji">{p.emoji}</span>
        {p.badge && <span className="qcCardBadge">{p.badge}</span>}
      </div>
      <div className="qcCardBody">
        <p className="qcCardBrand">{p.brand}</p>
        <p className="qcCardName">{p.name}</p>
        <p className="qcCardUnit">{p.unit}</p>
        <div className="qcCardPrice">
          <span className="qcFinalPrice">₹{p.price}</span>
          <span className="qcOriginalPrice">₹{p.original}</span>
          <span className="qcDiscPill">{disc}%</span>
        </div>
        <div className="qcCardAction" onClick={e => e.stopPropagation()}>
          {cartQty === 0 ? (
            <button className="qcAddBtn" onClick={() => onAdd(p, p.variants?.[0] ?? null)}>
              <FaPlus /> Add
            </button>
          ) : (
            <div className="qcCounter">
              <button onClick={() => onRemove(p.id)}><FaMinus /></button>
              <span>{cartQty}</span>
              <button onClick={() => onAdd(p, null)}><FaPlus /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PRODUCT DETAIL
══════════════════════════════════════════════════════ */

function ProductDetail({ product: p, cartQty, onAdd, onRemove, onBack, onCartOpen, allProductsRef }) {
  const [activeImg,  setActiveImg]  = useState(0);
  const [activeVar,  setActiveVar]  = useState(0);
  const [wished,     setWished]     = useState(false);
  const [activeTab,  setActiveTab]  = useState("about");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [p.id]);

  const variant  = p.variants?.[activeVar];
  const price    = variant?.price ?? p.price;
  const original = variant?.original ?? p.original;
  const disc     = pct(price, original);

  const gallery  = [p.emoji, "📦", "🔍", "⭐"];
  const similar  = allProductsRef.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);

  const hasNutrition = p.nutrition && p.nutrition.calories !== null;

  return (
    <div className="qcDetailPage">

      {/* ── NAV ── */}
      <div className="qcDetailNav">
        <button className="qcDetailBack" onClick={onBack}><FaArrowLeft /></button>
        <p className="qcDetailBreadcrumb">
          {categories.find(c => c.id === p.category)?.label ?? p.category}
          {" "}<FaChevronRight />{" "}
          <span>{p.name}</span>
        </p>
        <div className="qcDetailNavActions">
          <button className="qcNavIconBtn" onClick={() => setWished(w => !w)}>
            {wished ? <FaHeart style={{color:"#ef4444"}} /> : <FaRegHeart />}
          </button>
          <button className="qcNavIconBtn"><FaShare /></button>
          <button className="qcNavCartBtn" onClick={onCartOpen}>
            <FaShoppingCart />
            {cartQty > 0 && <span className="qcNavCartCount">{cartQty}</span>}
          </button>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="qcDetailGrid">

        {/* LEFT: Gallery */}
        <div className="qcDetailLeft">
          <div className="qcGalleryThumbCol">
            {gallery.map((e, i) => (
              <button
                key={i}
                className={`qcThumb qcCat-${p.category} ${activeImg === i ? "qcThumbActive" : ""}`}
                onClick={() => setActiveImg(i)}
              >{e}</button>
            ))}
          </div>
          <div className={`qcMainImage qcCat-${p.category}`}>
            <span className="qcMainEmoji">{gallery[activeImg]}</span>
            {p.badge && <span className="qcDetailBadge">{p.badge}</span>}
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="qcDetailRight">
          <p className="qcDetailBrand">{p.brand}</p>
          <h2 className="qcDetailName">{p.name}</h2>

          {/* Rating */}
          <div className="qcDetailRatingRow">
            <Stars r={p.rating} />
            <span className="qcDetailRatingNum">{p.rating}</span>
            <span className="qcDetailReviews">{p.reviews.toLocaleString()} ratings</span>
          </div>

          {/* Delivery promise */}
          <div className="qcDeliveryPromise">
            <FaTruck /> Delivery in <strong>15 minutes</strong>
            <span className="qcDeliveryDot" />
            <FaLeaf className="qcLeaf" /> Fresh Guaranteed
          </div>

          <hr className="qcHr" />

          {/* Variants */}
          {p.variants && (
            <div className="qcVariantsBlock">
              <p className="qcBlockLabel">Select Size / Weight</p>
              <div className="qcVariantRow">
                {p.variants.map((v, i) => (
                  <button
                    key={i}
                    className={`qcVariantBtn ${activeVar === i ? "qcVariantActive" : ""}`}
                    onClick={() => setActiveVar(i)}
                  >
                    <span className="qcVariantLabel">{v.label}</span>
                    <span className="qcVariantPrice">₹{v.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <hr className="qcHr" />

          {/* Price */}
          <div className="qcDetailPriceBlock">
            <span className="qcDetailFinalPrice">₹{price}</span>
            <del className="qcDetailOriginal">₹{original}</del>
            <span className="qcDetailDiscPill">{disc}% OFF</span>
          </div>
          <p className="qcDetailTaxNote">Inclusive of all taxes · Free delivery</p>

          {/* Offers */}
          <div className="qcDetailOffersCard">
            <FaTag className="qcOfferIcon" />
            <div>
              <p className="qcOfferTitle">Available Offers</p>
              <p className="qcOfferText">10% off with ICICI Bank · Use code SAVE10 &nbsp;|&nbsp; Extra 5% on 1st order</p>
            </div>
          </div>

          {/* Cart action */}
          <div className="qcDetailCartAction">
            {cartQty === 0 ? (
              <button className="qcDetailAddBtn" onClick={() => onAdd(p, variant)}>
                <FaShoppingCart /> Add to Cart
              </button>
            ) : (
              <div className="qcDetailCounter">
                <button onClick={() => onRemove(p.id)}><FaMinus /></button>
                <span>{cartQty} in cart</span>
                <button onClick={() => onAdd(p, variant)}><FaPlus /></button>
              </div>
            )}
            <div className="qcDetailTrust">
              <span><FaShieldAlt /> 100% Safe</span>
              <span><FaLeaf /> Fresh</span>
              <span><FaTruck /> 15 Min</span>
              <span><FaBoxOpen /> Easy Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="qcTabsBlock">
        <div className="qcTabNav">
          {[["about","About"],["details","Details"],["nutrition","Nutrition"]].map(([id,label]) => (
            <button
              key={id}
              className={`qcTabBtn ${activeTab === id ? "qcTabActive" : ""}`}
              onClick={() => setActiveTab(id)}
            >{label}</button>
          ))}
        </div>

        <div className="qcTabContent">
          {activeTab === "about" && (
            <div className="qcAboutContent">
              <p className="qcAboutDesc">{p.desc}</p>
              {p.tags && (
                <div className="qcTagsRow">
                  {p.tags.map(t => <span key={t} className="qcDetailTag">{t}</span>)}
                </div>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="qcDetailsContent">
              {[
                ["Ingredients",    p.details?.ingredients ],
                ["Storage Info",   p.details?.storage     ],
                ["Shelf Life",     p.details?.shelfLife   ],
                ["Country of Origin", p.details?.country  ],
                ["Type / Variant", p.details?.type        ],
              ].filter(([,v]) => v).map(([k,v]) => (
                <div key={k} className="qcDetailRow">
                  <span className="qcDetailKey">{k}</span>
                  <span className="qcDetailVal">{v}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "nutrition" && (
            hasNutrition ? (
              <div className="qcNutritionContent">
                <p className="qcNutritionNote">Per 100g / serving</p>
                <div className="qcNutritionGrid">
                  {[
                    { label:"Calories",     val:p.nutrition.calories, unit:"kcal", color:"#f97316" },
                    { label:"Protein",      val:p.nutrition.protein,  unit:"g",    color:"#16a34a" },
                    { label:"Carbohydrates",val:p.nutrition.carbs,    unit:"g",    color:"#3b82f6" },
                    { label:"Total Fat",    val:p.nutrition.fat,      unit:"g",    color:"#8b5cf6" },
                    { label:"Dietary Fiber",val:p.nutrition.fiber,    unit:"g",    color:"#22c55e" },
                  ].map(n => (
                    <div key={n.label} className="qcNutrCard">
                      <span className="qcNutrVal" style={{color:n.color}}>{n.val}{n.unit}</span>
                      <span className="qcNutrLabel">{n.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="qcNoNutrition">Nutritional information not available for this product.</p>
            )
          )}
        </div>
      </div>

      {/* ── SIMILAR ── */}
      {similar.length > 0 && (
        <div className="qcSimilarBlock">
          <h3 className="qcSimilarTitle">You may also like</h3>
          <div className="qcSimilarGrid">
            {similar.map((sp, i) => (
              <ProductCard key={sp.id} product={sp} cartQty={0} index={i}
                onAdd={onAdd} onRemove={onRemove}
                onView={() => window.scrollTo({top:0,behavior:"instant"}) || onBack(sp)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CART DRAWER
══════════════════════════════════════════════════════ */

function CartDrawer({ open, onClose, items, onQty, onRemove, onCheckout }) {
  const [coupon,     setCoupon]     = useState("");
  const [couponMsg,  setCouponMsg]  = useState(null);
  const [couponDisc, setCouponDisc] = useState(0);

  const subtotal  = items.reduce((s,i) => s + i.price * i.qty, 0);
  const delivery  = subtotal > 199 ? 0 : 29;
  const discount  = couponDisc + Math.round(subtotal * 0.05);   // 5% auto
  const total     = Math.max(subtotal + delivery - discount, 0);
  const savings   = (items.reduce((s,i) => s + (i.original - i.price) * i.qty, 0)) + discount;
  const count     = items.reduce((s,i) => s + i.qty, 0);

  function applyCoupon() {
    if (coupon.toUpperCase() === "SAVE10") {
      setCouponDisc(Math.round(subtotal * 0.1));
      setCouponMsg({ ok: true, text: "SAVE10 applied — extra 10% off!" });
    } else if (coupon.toUpperCase() === "FRESH5") {
      setCouponDisc(Math.round(subtotal * 0.05));
      setCouponMsg({ ok: true, text: "FRESH5 applied — extra 5% off!" });
    } else {
      setCouponDisc(0);
      setCouponMsg({ ok: false, text: "Invalid coupon code" });
    }
  }

  return (
    <>
      <div className={`qcCartOverlay ${open ? "qcCartOverlayOpen" : ""}`} onClick={onClose} />
      <div className={`qcCartDrawer ${open ? "qcCartDrawerOpen" : ""}`}>

        {/* Header */}
        <div className="qcCartHead">
          <div>
            <h3>My Cart</h3>
            {count > 0 && <p className="qcCartCount">{count} item{count > 1 ? "s" : ""}</p>}
          </div>
          <button className="qcCartClose" onClick={onClose}><FaTimes /></button>
        </div>

        {/* Delivery promise */}
        {count > 0 && (
          <div className="qcCartDelivery">
            <FaMotorcycle className="qcCartDeliveryIcon" />
            <span>Delivery in <strong>15 minutes</strong></span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="qcCartEmpty">
            <span>🛒</span>
            <p>Your cart is empty</p>
            <span>Add items to get started</span>
            <button onClick={onClose}>Browse Products</button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="qcCartItems">
              {items.map(item => (
                <div key={item.id} className="qcCartItem">
                  <div className={`qcCartItemImg qcCat-${item.category}`}>{item.emoji}</div>
                  <div className="qcCartItemInfo">
                    <p className="qcCartItemName">{item.name}</p>
                    <p className="qcCartItemUnit">{item.unit}</p>
                    <p className="qcCartItemPrice">₹{item.price}
                      <del className="qcCartItemOrig"> ₹{item.original}</del>
                    </p>
                  </div>
                  <div className="qcCartItemQty">
                    <button onClick={() => onQty(item.id, -1)}><FaMinus /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => onQty(item.id, +1)}><FaPlus /></button>
                  </div>
                  <button className="qcCartRemove" onClick={() => onRemove(item.id)}><FaTimes /></button>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="qcCouponBlock">
              <p className="qcCouponLabel"><FaTag /> Coupons & Offers</p>
              <div className="qcCouponRow">
                <input
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(null); }}
                  onKeyDown={e => e.key === "Enter" && applyCoupon()}
                />
                <button onClick={applyCoupon}>Apply</button>
              </div>
              {couponMsg && (
                <p className={`qcCouponMsg ${couponMsg.ok ? "qcCouponOk" : "qcCouponErr"}`}>
                  {couponMsg.ok ? "✅" : "❌"} {couponMsg.text}
                </p>
              )}
              <p className="qcCouponHint">Try: <strong>SAVE10</strong> or <strong>FRESH5</strong></p>
            </div>

            {/* Bill */}
            <div className="qcBillBlock">
              <p className="qcBillTitle">Bill Details</p>
              <div className="qcBillRows">
                <div className="qcBillRow"><span>Items total</span><span>₹{subtotal}</span></div>
                <div className="qcBillRow"><span>Delivery fee</span><span>{delivery === 0 ? <span className="qcFreeTag">FREE</span> : `₹${delivery}`}</span></div>
                <div className="qcBillRow qcBillDiscount"><span>Discount & Offers</span><span>-₹{discount}</span></div>
                {delivery > 0 && <p className="qcFreeNote">Add ₹{199-subtotal} more for free delivery</p>}
              </div>
              <div className="qcBillTotal">
                <span>Total Payable</span>
                <span>₹{total}</span>
              </div>
              {savings > 0 && (
                <div className="qcSavingsBanner">🎉 You save ₹{savings} on this order!</div>
              )}
            </div>

            <button className="qcCheckoutBtn" onClick={() => { onClose(); onCheckout(); }}>
              Proceed to Checkout · ₹{total}
            </button>
          </>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   CHECKOUT VIEW
══════════════════════════════════════════════════════ */

function CheckoutView({ items, onBack, onPlaceOrder }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const [payMethod, setPayMethod] = useState("upi");
  const [upiId,     setUpiId]     = useState("");
  const [slot,      setSlot]      = useState("now");
  const [address,   setAddress]   = useState(0); // index in savedAddresses

  const subtotal   = items.reduce((s,i) => s + i.price * i.qty, 0);
  const discount   = Math.round(subtotal * 0.05);
  const delivery   = subtotal > 199 ? 0 : 29;
  const total      = Math.max(subtotal + delivery - discount, 0);
  const count      = items.reduce((s,i) => s + i.qty, 0);

  const savedAddresses = [
    { type:"🏠 Home",   addr:"123, MG Road, Koramangala, Bengaluru – 560034" },
    { type:"💼 Work",   addr:"Octadecent HQ, 4th Floor, Embassy Tech Village, Bengaluru" },
  ];

  return (
    <div className="qcCheckoutPage">
      <div className="qcCheckoutHead">
        <button className="qcCheckoutBack" onClick={onBack}><FaArrowLeft /> Back to Cart</button>
        <h2>Checkout</h2>
      </div>

      <div className="qcCheckoutGrid">
        {/* LEFT */}
        <div className="qcCheckoutLeft">

          {/* Address */}
          <div className="qcCheckoutCard">
            <h4><FaMapMarkerAlt /> Delivery Address</h4>
            {savedAddresses.map((a, i) => (
              <label key={i} className={`qcAddressOption ${address === i ? "qcAddressActive" : ""}`}>
                <input type="radio" checked={address === i} onChange={() => setAddress(i)} />
                <div>
                  <p className="qcAddressType">{a.type}</p>
                  <p className="qcAddressText">{a.addr}</p>
                </div>
              </label>
            ))}
            <button className="qcAddAddressBtn">+ Add New Address</button>
          </div>

          {/* Delivery Slot */}
          <div className="qcCheckoutCard">
            <h4><FaClock /> Delivery Slot</h4>
            <div className="qcSlotRow">
              {[
                { id:"now",      label:"Express",   sub:"15 minutes", icon:"⚡" },
                { id:"schedule", label:"Scheduled", sub:"Today 6–8 PM", icon:"📅" },
              ].map(s => (
                <button
                  key={s.id}
                  className={`qcSlotBtn ${slot === s.id ? "qcSlotActive" : ""}`}
                  onClick={() => setSlot(s.id)}
                >
                  <span className="qcSlotIcon">{s.icon}</span>
                  <span className="qcSlotLabel">{s.label}</span>
                  <span className="qcSlotSub">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="qcCheckoutCard">
            <h4><FaShieldAlt /> Payment Method</h4>
            <div className="qcPayMethods">
              {[
                { id:"upi",    icon:"📱", label:"UPI / Net Banking"   },
                { id:"card",   icon:"💳", label:"Credit / Debit Card" },
                { id:"wallet", icon:"👛", label:"Wallet"              },
                { id:"cod",    icon:"💵", label:"Cash on Delivery"    },
              ].map(m => (
                <label
                  key={m.id}
                  className={`qcPayOption ${payMethod === m.id ? "qcPayActive" : ""}`}
                >
                  <input type="radio" checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} />
                  <span className="qcPayIcon">{m.icon}</span>
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
            {payMethod === "upi" && (
              <input className="qcUpiInput" placeholder="Enter UPI ID (e.g. name@upi)" value={upiId} onChange={e => setUpiId(e.target.value)} />
            )}
            {payMethod === "cod" && (
              <p className="qcCodNote">💵 ₹{total} to be paid in cash at delivery. No extra charge.</p>
            )}
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div className="qcCheckoutRight">
          <div className="qcCheckoutCard qcSummaryCard">
            <h4>Order Summary ({count} items)</h4>
            <div className="qcSummaryItems">
              {items.map(i => (
                <div key={i.id} className="qcSummaryItem">
                  <span>{i.emoji}</span>
                  <span className="qcSummaryName">{i.name}</span>
                  <span>×{i.qty}</span>
                  <span className="qcSummaryPrice">₹{i.price * i.qty}</span>
                </div>
              ))}
            </div>
            <div className="qcSummaryBill">
              <div className="qcBillRow"><span>Items</span><span>₹{subtotal}</span></div>
              <div className="qcBillRow"><span>Delivery</span><span>{delivery === 0 ? <span className="qcFreeTag">FREE</span> : `₹${delivery}`}</span></div>
              <div className="qcBillRow qcBillDiscount"><span>Discount</span><span>-₹{discount}</span></div>
              <div className="qcBillTotal"><span>Total</span><span>₹{total}</span></div>
            </div>
            <button className="qcPlaceOrderBtn" onClick={onPlaceOrder}>
              <FaCheckCircle /> Place Order · ₹{total}
            </button>
            <p className="qcSecureNote"><FaShieldAlt /> 100% secure & encrypted payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ORDER TRACKING
══════════════════════════════════════════════════════ */

const STAGES = [
  { icon:"✅", label:"Order Placed",    sub:"We received your order" },
  { icon:"📦", label:"Being Packed",    sub:"Your items are being packed" },
  { icon:"🛵", label:"Picked Up",       sub:"Delivery partner on the way to store" },
  { icon:"🛣️", label:"On the Way",     sub:"Delivery partner heading to you" },
  { icon:"🎉", label:"Delivered",       sub:"Enjoy your fresh groceries!" },
];

function OrderTracking({ order, onDone }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const [stage, setStage] = useState(0);
  const [rated, setRated] = useState(0);

  useEffect(() => {
    if (stage >= STAGES.length - 1) return;
    const delays = [0, 2500, 5000, 9000, 14000];
    const timers = delays.slice(1).map((d, i) =>
      setTimeout(() => setStage(i + 1), d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const delivered = stage === STAGES.length - 1;

  return (
    <div className="qcTrackPage">
      <div className="qcTrackHead">
        <h2>{delivered ? "🎉 Delivered!" : "⚡ On the Way"}</h2>
        <p className="qcTrackId">Order #{order.id}</p>
        <p className="qcTrackEta">
          {delivered ? "Your order has been delivered" : `Arriving in ~${Math.max(1, 15 - stage * 3)} minutes`}
        </p>
      </div>

      {/* Stage tracker */}
      <div className="qcStages">
        {STAGES.map((s, i) => (
          <div key={i} className={`qcStage ${i <= stage ? "qcStageDone" : ""} ${i === stage ? "qcStageCurrent" : ""}`}>
            <div className="qcStageIconWrap">
              <span className="qcStageIcon">{s.icon}</span>
              {i === stage && !delivered && <div className="qcStagePulse" />}
            </div>
            {i < STAGES.length - 1 && (
              <div className={`qcStageLine ${i < stage ? "qcStageLineDone" : ""}`} />
            )}
            <div className="qcStageMeta">
              <p className="qcStageLabel">{s.label}</p>
              {i === stage && <p className="qcStageSub">{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Delivery partner card (shows after stage 2) */}
      {stage >= 2 && (
        <div className="qcDeliveryPartner">
          <span className="qcDPAvatar">🧑‍🦱</span>
          <div className="qcDPInfo">
            <p className="qcDPName">Ramesh Kumar</p>
            <p className="qcDPMeta">⭐ 4.8 · 2,340 deliveries · 🛵 KA-01-HX-5678</p>
          </div>
          <a className="qcDPCall" href="tel:+919999999999"><FaMotorcycle /></a>
        </div>
      )}

      {/* Order summary */}
      <div className="qcTrackSummary">
        <p className="qcTrackSummaryTitle">Your Order</p>
        {order.items.map((item, i) => (
          <div key={i} className="qcTrackItem">
            <span>{item.emoji}</span>
            <span className="qcTrackItemName">{item.name}</span>
            <span>×{item.qty}</span>
            <span className="qcTrackItemPrice">₹{item.price * item.qty}</span>
          </div>
        ))}
        <div className="qcTrackTotal">
          <span>Total Paid</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      {/* Rate if delivered */}
      {delivered && (
        <div className="qcRateBlock">
          <p className="qcRateTitle">Rate your experience</p>
          <div className="qcRateStars">
            {[1,2,3,4,5].map(n => (
              <button key={n} className={`qcRateStar ${rated >= n ? "qcRateStarOn" : ""}`} onClick={() => setRated(n)}>
                <FaStar />
              </button>
            ))}
          </div>
          {rated > 0 && (
            <button className="qcRateDoneBtn" onClick={onDone}>
              Submit & Continue Shopping
            </button>
          )}
          <button className="qcRateSkip" onClick={onDone}>Skip</button>
        </div>
      )}

      {!delivered && (
        <button className="qcTrackHelpBtn">Need help? Contact support</button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════════════ */

function QCHeader({ cartCount, search, onSearch, onCartOpen, onBack }) {
  return (
    <header className="qcHeader">
      <div className="qcHeaderTop">
        <button className="qcHeaderBack" onClick={onBack}><FaArrowLeft /></button>
        <div className="qcHeaderBrand">
          <span className="qcHeaderBrandIcon">⚡</span>
          <div>
            <p className="qcHeaderTitle">Quick Commerce</p>
            <p className="qcHeaderSub">Delivery in 15 minutes</p>
          </div>
        </div>
        <div className="qcHeaderSearch">
          <FaSearch className="qcSearchIcon" />
          <input
            placeholder='Search "milk, eggs, chips…"'
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          {search && <button onClick={() => onSearch("")} className="qcSearchClear"><FaTimes /></button>}
        </div>
        <button className="qcHeaderCart" onClick={onCartOpen}>
          <FaShoppingCart />
          {cartCount > 0 && <span className="qcHeaderCartBadge">{cartCount}</span>}
        </button>
      </div>
      <div className="qcDeliveryBanner">
        <FaFire className="qcDeliveryFire" />
        <span><strong>Free delivery</strong> on orders above ₹199 &nbsp;·&nbsp; <strong>15-min</strong> express delivery</span>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */

export default function QuickCommerce() {
  const navigate = useNavigate();
  const [view,      setView]      = useState("browse"); // browse | detail | checkout | tracking
  const [selProd,   setSelProd]   = useState(null);
  const [cart,      setCart]      = useState([]);
  const [cartOpen,  setCartOpen]  = useState(false);
  const [activeCat, setActiveCat] = useState("all");
  const [search,    setSearch]    = useState("");
  const [order,     setOrder]     = useState(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const getQty    = id => cart.find(i => i.id === id)?.qty ?? 0;

  function addToCart(product, variant) {
    const price    = variant?.price    ?? product.price;
    const original = variant?.original ?? product.original;
    const unit     = variant?.label    ?? product.unit;
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      if (ex) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { id: product.id, name: product.name, emoji: product.emoji, category: product.category, unit, price, original, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart(c => c.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  }

  function removeFromCart(id) { setCart(c => c.filter(i => i.id !== id)); }

  function placeOrder() {
    const total = cart.reduce((s,i) => s + i.price*i.qty, 0);
    const disc  = Math.round(total * 0.05);
    const delivery = total > 199 ? 0 : 29;
    const newOrder = {
      id: `QC-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      total: Math.max(total + delivery - disc, 0),
    };
    setOrder(newOrder);
    setCart([]);
    setView("tracking");
  }

  const mainRef = useReveal([activeCat, search]);

  const visibleSections = useMemo(() => {
    const q = search.toLowerCase();
    return resolvedSections.map(sec => ({
      ...sec,
      products: sec.products.filter(p => {
        const catOk    = activeCat === "all" || p.category === activeCat || sec.id === "top";
        const searchOk = !q || p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
        return catOk && searchOk;
      })
    })).filter(sec => sec.products.length > 0);
  }, [activeCat, search]);

  /* ── VIEWS ── */

  if (view === "detail" && selProd) return (
    <div className="qcPage">
      <QCHeader cartCount={cartCount} search={search} onSearch={setSearch}
        onCartOpen={() => setCartOpen(true)} onBack={() => setView("browse")} />
      <ProductDetail
        product={selProd}
        cartQty={getQty(selProd.id)}
        onAdd={addToCart}
        onRemove={id => changeQty(id, -1)}
        onBack={(altProd) => { if (altProd && altProd.id) { setSelProd(altProd); } else { setView("browse"); } }}
        onCartOpen={() => setCartOpen(true)}
        allProductsRef={allProducts}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart}
        onQty={changeQty} onRemove={removeFromCart}
        onCheckout={() => { setView("checkout"); }} />
    </div>
  );

  if (view === "checkout") return (
    <div className="qcPage">
      <QCHeader cartCount={cartCount} search={search} onSearch={setSearch}
        onCartOpen={() => setCartOpen(true)} onBack={() => { setCartOpen(true); setView("browse"); }} />
      <CheckoutView items={cart} onBack={() => { setCartOpen(true); setView("browse"); }} onPlaceOrder={placeOrder} />
    </div>
  );

  if (view === "tracking" && order) return (
    <div className="qcPage">
      <QCHeader cartCount={0} search="" onSearch={() => {}} onCartOpen={() => {}} onBack={() => navigate("/")} />
      <OrderTracking order={order} onDone={() => { setOrder(null); setView("browse"); }} />
    </div>
  );

  /* ── BROWSE ── */
  return (
    <div className="qcPage">
      <QCHeader cartCount={cartCount} search={search} onSearch={setSearch}
        onCartOpen={() => setCartOpen(true)} onBack={() => navigate("/")} />

      {/* Category Pills */}
      <div className="qcCatStrip">
        {categories.map(c => (
          <button key={c.id}
            className={`qcCatPill ${activeCat === c.id ? "qcCatActive" : ""}`}
            onClick={() => setActiveCat(c.id)}
          >
            <span>{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      <main className="qcMain" ref={mainRef}>
        {visibleSections.length === 0 ? (
          <div className="qcNoResults">
            <span>🔍</span>
            <p>No products found for "{search}"</p>
            <button onClick={() => { setSearch(""); setActiveCat("all"); }}>Clear</button>
          </div>
        ) : visibleSections.map(sec => (
          <section key={sec.id} className="qcSection">
            <div className="qcSectionHead rvEl">
              <div>
                <h2>{sec.title}</h2>
                <span className="qcSectionBadge">{sec.badge}</span>
              </div>
              <button className="qcSeeAll">See all →</button>
            </div>
            <div className="qcProductGrid">
              {sec.products.map((p, i) => (
                <ProductCard
                  key={p.id} product={p} cartQty={getQty(p.id)} index={i}
                  onAdd={addToCart} onRemove={id => changeQty(id, -1)}
                  onView={prod => { setSelProd(prod); setView("detail"); }}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart}
        onQty={changeQty} onRemove={removeFromCart}
        onCheckout={() => { setCartOpen(false); setView("checkout"); }} />
    </div>
  );
}
