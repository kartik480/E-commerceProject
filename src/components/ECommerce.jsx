import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaSearch, FaShoppingCart, FaStar, FaStarHalfAlt,
  FaRegStar, FaPlus, FaMinus, FaTrash, FaHeart, FaRegHeart,
  FaTruck, FaCheckCircle, FaClock, FaBoxOpen, FaTag,
  FaCreditCard, FaMobile, FaMoneyBillWave, FaChevronLeft,
  FaChevronRight, FaFilter, FaUser, FaMapMarkerAlt, FaBox,
  FaShieldAlt, FaThumbsUp, FaShareAlt, FaStore
} from "react-icons/fa";
import "./ECommerce.css";

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */

const categories = [
  { id: "all",         emoji: "🛍️",  label: "All" },
  { id: "electronics", emoji: "📱",  label: "Electronics" },
  { id: "fashion",     emoji: "👕",  label: "Fashion" },
  { id: "home",        emoji: "🏠",  label: "Home & Kitchen" },
  { id: "books",       emoji: "📚",  label: "Books" },
  { id: "sports",      emoji: "🏋️",  label: "Sports" },
  { id: "beauty",      emoji: "✨",  label: "Beauty" },
];

const products = [
  // Electronics
  { id: 1,  name: "Wireless Noise-Cancelling Headphones", category: "electronics", emoji: "🎧", price: 2499, original: 3999, rating: 4.5, reviews: 2841, badge: "Best Seller", desc: "Premium sound quality with 30-hour battery life, foldable design, and deep bass technology.", tags: ["Wireless","ANC","30hr Battery"] },
  { id: 2,  name: "Smart Watch Pro Series 5",             category: "electronics", emoji: "⌚", price: 3999, original: 5999, rating: 4.3, reviews: 1567, badge: "Top Rated",  desc: "Track fitness, calls, and notifications. AMOLED display, IP68 water-resistant.", tags: ["AMOLED","IP68","Heart Rate"] },
  { id: 3,  name: "Portable Bluetooth Speaker",           category: "electronics", emoji: "🔊", price: 1299, original: 2199, rating: 4.5, reviews: 3204, badge: "Deal",        desc: "360° surround sound, 12-hour playtime, IPX5 waterproof rating.", tags: ["360° Sound","IPX5","12hr"] },
  { id: 4,  name: "4-Port USB-C Hub",                    category: "electronics", emoji: "🔌", price:  899, original: 1499, rating: 4.2, reviews:  982, badge: null,          desc: "Fast-charging hub with 4K HDMI, USB 3.0 ports, and SD card reader.", tags: ["4K HDMI","USB 3.0","SD Card"] },
  { id: 5,  name: "Mechanical Keyboard RGB",             category: "electronics", emoji: "⌨️", price: 1799, original: 2999, rating: 4.4, reviews: 1340, badge: "Hot",          desc: "Tactile blue switches, per-key RGB lighting, aluminium frame.", tags: ["RGB","Blue Switch","TKL"] },
  { id: 6,  name: "Webcam 1080p Full HD",                category: "electronics", emoji: "📷", price:  999, original: 1699, rating: 4.1, reviews:  745, badge: null,          desc: "Auto-focus, built-in stereo mic, plug-and-play for any OS.", tags: ["1080p","Autofocus","Mic"] },
  // Fashion
  { id: 7,  name: "Classic Oversized Cotton Tee",        category: "fashion",     emoji: "👕", price:  499, original:  799, rating: 4.2, reviews: 4512, badge: "Popular",     desc: "100% organic cotton, unisex fit, pre-shrunk. Available in 12 colours.", tags: ["Organic","Unisex","Oversized"] },
  { id: 8,  name: "Slim-Fit Stretch Jeans",              category: "fashion",     emoji: "👖", price: 1299, original: 1999, rating: 4.4, reviews: 2189, badge: null,          desc: "4-way stretch denim, reinforced stitching, 5-pocket design.", tags: ["Stretch","Slim Fit","Denim"] },
  { id: 9,  name: "Lightweight Running Sneakers",        category: "fashion",     emoji: "👟", price: 2499, original: 3499, rating: 4.6, reviews: 3871, badge: "Top Pick",    desc: "Breathable mesh upper, cushioned sole, ideal for running & gym.", tags: ["Breathable","Cushioned","Unisex"] },
  { id: 10, name: "Zip-Up Hoodie — Fleece",              category: "fashion",     emoji: "🧥", price:  899, original: 1499, rating: 4.3, reviews: 1672, badge: null,          desc: "Soft fleece inner, kangaroo pocket, ribbed cuffs. Perfect for layering.", tags: ["Fleece","Zip-Up","Warm"] },
  { id: 11, name: "Canvas Backpack 30L",                 category: "fashion",     emoji: "🎒", price: 1199, original: 1999, rating: 4.5, reviews: 2034, badge: "Deal",        desc: "Durable waxed canvas, padded laptop sleeve (up to 15\"), adjustable straps.", tags: ["30L","Laptop Sleeve","Unisex"] },
  // Home & Kitchen
  { id: 12, name: "French Press Coffee Maker 1L",        category: "home",        emoji: "☕", price:  799, original: 1299, rating: 4.7, reviews: 5610, badge: "Best Seller", desc: "Double-wall insulation, stainless steel plunger, BPA-free glass.", tags: ["1 Litre","BPA-Free","Stainless"] },
  { id: 13, name: "Smart Air Purifier HEPA H13",         category: "home",        emoji: "🌬️", price: 4999, original: 7999, rating: 4.4, reviews:  987, badge: "Premium",     desc: "True HEPA H13 filter, covers 600 sq ft, real-time AQI display.", tags: ["HEPA H13","600sqft","AQI Display"] },
  { id: 14, name: "Bamboo Chopping Board Set (3 pcs)",   category: "home",        emoji: "🪵", price:  499, original:  899, rating: 4.6, reviews: 3421, badge: null,          desc: "Eco-friendly bamboo, non-slip feet, grooved juice channels.", tags: ["Eco-Friendly","3-Piece","Non-Slip"] },
  { id: 15, name: "LED Desk Lamp — Touch Dimmer",        category: "home",        emoji: "💡", price:  699, original: 1099, rating: 4.3, reviews: 1890, badge: "Deal",        desc: "5 brightness levels, 3 colour modes, USB charging port on base.", tags: ["Touch Dimmer","USB Port","Eye Care"] },
  { id: 16, name: "Ceramic Coffee Mug Set (4 pcs)",      category: "home",        emoji: "🍵", price:  599, original:  899, rating: 4.8, reviews: 6230, badge: "Top Rated",  desc: "Dishwasher-safe, microwave-safe, 350ml capacity, matte finish.", tags: ["350ml","Dishwasher Safe","Matte"] },
  // Books
  { id: 17, name: "Atomic Habits — James Clear",         category: "books",       emoji: "📖", price:  399, original:  599, rating: 4.9, reviews: 12480, badge: "Bestseller", desc: "The no.1 New York Times bestseller on building good habits and breaking bad ones.", tags: ["Self-Help","Bestseller","Habits"] },
  { id: 18, name: "The Psychology of Money",             category: "books",       emoji: "📗", price:  349, original:  499, rating: 4.8, reviews:  9210, badge: "Popular",    desc: "Timeless lessons on wealth, greed, and happiness by Morgan Housel.", tags: ["Finance","Mindset","Bestseller"] },
  { id: 19, name: "Deep Work — Cal Newport",             category: "books",       emoji: "📘", price:  379, original:  549, rating: 4.6, reviews:  5670, badge: null,         desc: "Rules for focused success in a distracted world. Essential for knowledge workers.", tags: ["Productivity","Focus","Self-Help"] },
  { id: 20, name: "Zero to One — Peter Thiel",           category: "books",       emoji: "📙", price:  359, original:  499, rating: 4.5, reviews:  4320, badge: null,         desc: "Notes on startups, or how to build the future. A classic for entrepreneurs.", tags: ["Startup","Entrepreneurship","Tech"] },
  // Sports
  { id: 21, name: "Premium Yoga Mat 6mm",                category: "sports",      emoji: "🧘", price:  899, original: 1499, rating: 4.5, reviews: 3760, badge: "Top Pick",   desc: "Non-slip TPE surface, alignment lines, carrying strap included.", tags: ["Non-Slip","6mm","Eco TPE"] },
  { id: 22, name: "Resistance Bands Set (5 levels)",     category: "sports",      emoji: "💪", price:  599, original:  999, rating: 4.4, reviews: 2890, badge: "Deal",        desc: "Natural latex, 5 resistance levels from 5 to 50 lbs. Great for home gym.", tags: ["5-Level","Natural Latex","Home Gym"] },
  { id: 23, name: "Insulated Water Bottle 1L",           category: "sports",      emoji: "🍶", price:  449, original:  699, rating: 4.7, reviews: 5120, badge: "Popular",    desc: "Triple-wall vacuum insulation, keeps cold 24h, hot 12h, leak-proof lid.", tags: ["1 Litre","24hr Cold","Leak-Proof"] },
  { id: 24, name: "Speed Jump Rope — Adjustable",        category: "sports",      emoji: "🪢", price:  299, original:  449, rating: 4.3, reviews: 1450, badge: null,         desc: "Ball-bearing handles, 360° rotation, adjustable cable length 2.8m.", tags: ["Speed","Ball-Bearing","Adjustable"] },
  // Beauty
  { id: 25, name: "Vitamin C Brightening Serum 30ml",    category: "beauty",      emoji: "💧", price:  699, original:  999, rating: 4.6, reviews: 4190, badge: "Best Seller", desc: "15% stabilised Vitamin C, hyaluronic acid, brightens & evens skin tone.", tags: ["Vit-C 15%","Hyaluronic","Brightening"] },
  { id: 26, name: "SPF 50+ Lightweight Moisturiser",     category: "beauty",      emoji: "🧴", price:  849, original: 1299, rating: 4.5, reviews: 2870, badge: "Popular",    desc: "Broad-spectrum SPF 50, non-greasy, suitable for all skin types.", tags: ["SPF 50+","Non-Greasy","All Skin"] },
  { id: 27, name: "Argan Oil Deep Hair Mask",            category: "beauty",      emoji: "💆", price:  499, original:  799, rating: 4.4, reviews: 1980, badge: null,         desc: "100% organic argan oil, repairs damage, adds shine. Leave-in for 20 min.", tags: ["Argan Oil","Damage Repair","Shine"] },
];

const banners = [
  { gradient: "linear-gradient(120deg,#15803d,#22c55e)", emoji: "⚡", heading: "Lightning Deals", sub: "Up to 60% off on Electronics", cta: "electronics" },
  { gradient: "linear-gradient(120deg,#0369a1,#38bdf8)", emoji: "👗", heading: "Fashion Week",    sub: "New arrivals — Flat 40% off",  cta: "fashion"     },
  { gradient: "linear-gradient(120deg,#b45309,#fbbf24)", emoji: "🏠", heading: "Home Makeover",  sub: "Transform your space today",   cta: "home"        },
];

const mockOrders = [
  { id: "OCT-7821", date: "28 May 2026", status: "Delivered",   items: ["Wireless Headphones", "USB-C Hub"], total: 3398, emoji: "✅" },
  { id: "OCT-7644", date: "20 May 2026", status: "In Transit",  items: ["Yoga Mat", "Water Bottle 1L"],      total: 1348, emoji: "🚚" },
  { id: "OCT-7502", date: "11 May 2026", status: "Delivered",   items: ["Atomic Habits", "Deep Work"],       total:  778, emoji: "✅" },
  { id: "OCT-7389", date: "02 May 2026", status: "Delivered",   items: ["French Press Coffee Maker"],        total:  799, emoji: "✅" },
];

/* ═══════════════════════════════════════
   RICH PRODUCT DETAIL DATA
═══════════════════════════════════════ */

const catHighlights = {
  electronics: [
    "Premium components sourced from certified global suppliers",
    "Multi-device compatibility: iOS, Android, Windows & Mac",
    "Energy-efficient design with industry-leading battery life",
    "Ergonomic build tested for 8-hour continuous comfort",
    "Quick-charge technology — minimal downtime, maximum productivity",
    "1-year manufacturer warranty with doorstep service",
  ],
  fashion: [
    "OEKO-TEX certified fabric — free from harmful substances",
    "Pre-washed & pre-shrunk: true-to-size fit guaranteed",
    "Colourfast dye — stays vibrant wash after wash",
    "Reinforced stitching at stress points for lasting durability",
    "Eco-conscious manufacturing with low carbon footprint",
    "Available in multiple size options with inclusive size guide",
  ],
  home: [
    "Food-grade, BPA-free materials safe for daily use",
    "Heavy-duty construction designed to last 5+ years",
    "Dishwasher & microwave safe for effortless cleaning",
    "Space-efficient design built for modern kitchens",
    "Eco-friendly packaging made from 100% recycled materials",
    "Passes REACH & RoHS safety compliance standards",
  ],
  books: [
    "International bestseller — over 5 million copies sold worldwide",
    "Actionable frameworks backed by scientific research",
    "Highly readable prose — no jargon, just clear insight",
    "Recommended by leading CEOs, coaches & universities",
    "Perfect as a gift or personal deep-read",
    "Printed on FSC-certified sustainable paper",
  ],
  sports: [
    "Professional-grade materials trusted by certified trainers",
    "Non-toxic, eco-certified — safe for home and gym",
    "Lightweight and ultra-portable — fits in any gym bag",
    "Suitable for beginners through advanced athletes",
    "Designed for both indoor & outdoor training environments",
    "30-day satisfaction guarantee — no questions asked",
  ],
  beauty: [
    "Dermatologist-tested, clinically proven formula",
    "Free from parabens, sulphates, and artificial fragrances",
    "100% cruelty-free and vegan — never tested on animals",
    "Visible results in 2–4 weeks with consistent use",
    "Suitable for all skin tones and skin types",
    "Recyclable packaging as part of our sustainability pledge",
  ],
};

const catSpecs = {
  electronics: { "Connectivity": "Wireless (Bluetooth 5.2) + Wired (3.5mm)", "Power Source": "Rechargeable Li-ion Battery", "Compatibility": "iOS, Android, Windows, macOS", "Charging Port": "USB-C", "Operating Range": "Up to 10 metres", "In The Box": "Main Unit, USB-C Cable, User Manual", "Warranty": "1 Year Manufacturer Warranty", "Country of Origin": "China / India" },
  fashion:     { "Material": "100% Organic Cotton / Premium Blend", "Fit Type": "Regular / Relaxed Fit", "Occasion": "Casual, Sports, Everyday", "Wash Care": "Machine Wash Cold, Tumble Dry Low", "Available Colours": "Multiple (see listing)", "Size Range": "XS – 3XL (Unisex)", "Country of Origin": "India" },
  home:        { "Material": "Food-Grade, BPA-Free", "Capacity / Size": "As specified", "Dishwasher Safe": "Yes", "Microwave Safe": "Yes (where applicable)", "Certification": "REACH, RoHS, LFGB", "Warranty": "6 Months", "In The Box": "Product + Accessories as listed", "Country of Origin": "India" },
  books:       { "Language": "English", "Format": "Paperback", "Pages": "~280–340 pages", "Publisher": "Penguin / Portfolio / Scribner", "Genre": "Non-fiction / Self-Development", "Reading Level": "General Adult", "Edition": "Latest Edition", "ISBN": "See product label" },
  sports:      { "Material": "Natural Latex / Eco-TPE", "Dimensions": "As specified per product", "Weight": "Lightweight (< 1 kg)", "Usage": "Home Gym, Outdoor, Studio", "Certification": "SGS, CE Certified", "Warranty": "6 Months", "In The Box": "Product + Carry Bag/Strap", "Country of Origin": "India" },
  beauty:      { "Skin Type": "All Skin Types", "Volume / Weight": "As specified", "Key Ingredients": "See product description", "Free From": "Parabens, Sulphates, Mineral Oil", "Shelf Life": "24 months from manufacture", "Cruelty-Free": "Yes", "Vegan": "Yes", "Country of Origin": "India" },
};

const catGallery = {
  electronics: ["📦","🔋","🔧","📡"],
  fashion:     ["📦","🪡","🎨","✨"],
  home:        ["📦","🍳","🧼","♻️"],
  books:       ["📦","📝","🌟","🎁"],
  sports:      ["📦","💪","🏃","🌿"],
  beauty:      ["📦","🌿","💎","🌸"],
};

const sampleReviews = [
  { user:"Arjun S.",  avatar:"🧑",  rating:5, title:"Exceeded every expectation!",  text:"Absolutely love this product. The build quality is premium, it arrived well-packaged, and has been working flawlessly for 2 months. 100% recommend to anyone on the fence.",  date:"20 May 2026", helpful:47 },
  { user:"Priya K.",  avatar:"👩",  rating:4, title:"Great value for money",         text:"Really good product for the price point. Delivery was faster than expected. Packaging was excellent. Knocked off one star as the manual could be clearer, but the product itself is solid.", date:"14 May 2026", helpful:31 },
  { user:"Rohit M.",  avatar:"👨",  rating:5, title:"Would buy again without hesitation", text:"Bought this as a gift and the recipient loved it. Very high quality and exactly as described. Octadecent's packaging and delivery experience also stood out.", date:"8 May 2026",  helpful:22 },
  { user:"Sneha T.",  avatar:"🧕",  rating:4, title:"Solid purchase, minor nitpicks", text:"Works great out of the box. Performance is excellent. Only minor thing is that a carry case would've been nice. Overall very satisfied and would definitely recommend.", date:"2 May 2026",  helpful:18 },
];

const commonOffers = [
  "10% instant discount with SBI / HDFC Credit Card (max. ₹500 off)",
  "Extra 5% off on your first Octadecent order — use code FIRST5",
  "No-cost EMI available on eligible cards for orders above ₹1,999",
];

function getGallery(p)    { return [p.emoji, ...(catGallery[p.category] ?? ["📦","✨","🌟","🎁"])]; }
function getHighlights(p) { return catHighlights[p.category] ?? ["High-quality product","Authentic brand","Fast delivery","Easy returns"]; }
function getSpecs(p)      { return { "Product Name": p.name, "Category": categories.find(c=>c.id===p.category)?.label ?? p.category, ...catSpecs[p.category] }; }

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i =>
        i <= Math.floor(rating) ? <FaStar key={i} /> :
        i - rating < 1          ? <FaStarHalfAlt key={i} /> :
                                   <FaRegStar key={i} />
      )}
    </span>
  );
}

function fmt(n) {
  return n >= 1000 ? `₹${(n/1000).toFixed(1)}k` : `₹${n}`;
}

function discount(p, o) { return Math.round((1 - p/o) * 100); }

/* ═══════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════ */

function ProductCard({ product: p, onView, cartQty, onAdd, onRemove }) {
  const [wished, setWished] = useState(false);
  const disc = discount(p.price, p.original);

  return (
    <div className="pcCard" onClick={() => onView(p)}>
      <div className={`pcVisual cat-${p.category}`}>
        <span className="pcEmoji">{p.emoji}</span>
        {p.badge && <span className="pcBadge">{p.badge}</span>}
        <button
          className={`wishBtn ${wished ? "wished" : ""}`}
          onClick={e => { e.stopPropagation(); setWished(w => !w); }}
        >
          {wished ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
      <div className="pcBody">
        <p className="pcName">{p.name}</p>
        <div className="pcRating">
          <Stars rating={p.rating} />
          <span className="pcRatingNum">{p.rating}</span>
          <span className="pcReviews">({p.reviews.toLocaleString()})</span>
        </div>
        <div className="pcPriceRow">
          <span className="pcPrice">{fmt(p.price)}</span>
          <span className="pcOriginal">{fmt(p.original)}</span>
          <span className="pcDiscount">{disc}% off</span>
        </div>
        <div className="pcDelivery"><FaTruck /> Free delivery</div>

        {cartQty === 0 ? (
          <button
            className="pcAddBtn"
            onClick={e => { e.stopPropagation(); onAdd(p); }}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        ) : (
          <div className="pcCounter" onClick={e => e.stopPropagation()}>
            <button onClick={() => onRemove(p.id)}><FaMinus /></button>
            <span>{cartQty}</span>
            <button onClick={() => onAdd(p)}><FaPlus /></button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   REVIEWS SECTION
═══════════════════════════════════════ */

function ReviewsSection({ product: p }) {
  const breakdown = [
    { star: 5, pct: 62 }, { star: 4, pct: 21 },
    { star: 3, pct: 9  }, { star: 2, pct: 5  }, { star: 1, pct: 3 },
  ];
  const [helpful, setHelpful] = useState({});

  return (
    <div className="rvSection">
      {/* Summary */}
      <div className="rvSummary">
        <div className="rvBigScore">
          <span className="rvScore">{p.rating}</span>
          <Stars rating={p.rating} />
          <span className="rvTotal">{p.reviews.toLocaleString()} ratings</span>
        </div>
        <div className="rvBars">
          {breakdown.map(({ star, pct }) => (
            <div key={star} className="rvBarRow">
              <span className="rvBarLabel">{star} ★</span>
              <div className="rvBarTrack">
                <div className="rvBarFill" style={{ width: `${pct}%` }} />
              </div>
              <span className="rvBarPct">{pct}%</span>
            </div>
          ))}
        </div>
        <div className="rvVerifiedNote">
          <FaCheckCircle /> All reviews are from verified purchasers
        </div>
      </div>

      {/* Review cards */}
      <div className="rvList">
        {sampleReviews.map((r, i) => (
          <div key={i} className="rvCard">
            <div className="rvCardTop">
              <span className="rvAvatar">{r.avatar}</span>
              <div className="rvMeta">
                <p className="rvUser">{r.user}</p>
                <div className="rvStarDate">
                  <Stars rating={r.rating} />
                  <span className="rvDate">{r.date}</span>
                </div>
              </div>
              <span className="rvVerified">✅ Verified Purchase</span>
            </div>
            <p className="rvTitle">{r.title}</p>
            <p className="rvText">{r.text}</p>
            <button
              className={`rvHelpful ${helpful[i] ? "rvHelpfulDone" : ""}`}
              onClick={() => setHelpful(h => ({ ...h, [i]: !h[i] }))}
            >
              <FaThumbsUp /> Helpful ({r.helpful + (helpful[i] ? 1 : 0)})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PRODUCT DETAIL
═══════════════════════════════════════ */

function ProductDetail({ product: p, cartQty, onAdd, onRemove, onBack, onBuyNow, allProducts, getCartQty, onViewProduct }) {
  const [activeImg,  setActiveImg]  = useState(0);
  const [pincode,    setPincode]    = useState("");
  const [pincodeRes, setPincodeRes] = useState(null);
  const [qty,        setQty]        = useState(1);
  const [activeTab,  setActiveTab]  = useState("highlights");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [p.id]);

  const disc     = discount(p.price, p.original);
  const emi      = Math.ceil(p.price / 12);
  const catLabel = categories.find(c => c.id === p.category)?.label ?? p.category;
  const gallery  = getGallery(p);
  const similar  = allProducts.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);

  function checkPin() {
    if (pincode.length === 6) {
      const d = new Date(); d.setDate(d.getDate() + 1);
      const ds = d.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"short" });
      setPincodeRes({ ok: true,  msg: `Free delivery by ${ds}, before 6 PM` });
    } else {
      setPincodeRes({ ok: false, msg: "Enter a valid 6-digit pincode" });
    }
  }

  function handleAdd()    { for (let i = 0; i < qty; i++) onAdd(p); }
  function handleBuyNow() { handleAdd(); onBuyNow(); }

  return (
    <div className="pdPage">

      {/* BREADCRUMB NAV */}
      <div className="pdNav">
        <button className="pdBackBtn" onClick={onBack}><FaChevronLeft /> Back</button>
        <span className="pdCrumb">Home › {catLabel} › <span className="pdCrumbCurrent">{p.name}</span></span>
        <button className="pdShareBtn"><FaShareAlt /> Share</button>
      </div>

      {/* ── 3-COLUMN MAIN ── */}
      <div className="pdMainGrid">

        {/* COL 1: Gallery */}
        <div className="pdGalleryCol">
          <div className="pdThumbList">
            {gallery.map((e, i) => (
              <button
                key={i}
                className={`pdThumb cat-${p.category} ${activeImg === i ? "pdThumbActive" : ""}`}
                onClick={() => setActiveImg(i)}
              >{e}</button>
            ))}
          </div>
          <div className={`pdMainImg cat-${p.category}`}>
            <span className="pdMainEmoji">{gallery[activeImg]}</span>
            {p.badge && <span className="pdImgBadge">{p.badge}</span>}
          </div>
          <div className="pdTagsRow">
            {p.tags.map(t => <span key={t} className="pdTag">{t}</span>)}
          </div>
        </div>

        {/* COL 2: Product Info */}
        <div className="pdInfoCol">
          <h2 className="pdTitle">{p.name}</h2>

          {/* Rating row */}
          <div className="pdRatingRow">
            <Stars rating={p.rating} />
            <span className="pdRatingNum">{p.rating}</span>
            <span className="pdPipe">|</span>
            <span className="pdReviewsLink" onClick={() => setActiveTab("reviews")}>
              {p.reviews.toLocaleString()} ratings
            </span>
            <span className="pdPipe">|</span>
            <button className="pdWriteBtn" onClick={() => setActiveTab("reviews")}>Write a Review</button>
          </div>

          <hr className="pdHr" />

          {/* Price */}
          <div className="pdPriceSection">
            <p className="pdMrpLine">M.R.P: <del className="pdMrp">{fmt(p.original)}</del></p>
            <div className="pdPriceBig">
              <span className="pdFinalPrice">{fmt(p.price)}</span>
              <span className="pdDiscPill">{disc}% off</span>
            </div>
            <p className="pdEmiLine">No-cost EMI from <strong>₹{emi}/month</strong>. No hidden charges.</p>
            <p className="pdTaxLine">✅ Price inclusive of all taxes. Free delivery included.</p>
          </div>

          <hr className="pdHr" />

          {/* Offers */}
          <div className="pdBlock">
            <h4 className="pdBlockHead"><FaTag /> Available Offers</h4>
            <div className="pdOffersList">
              {commonOffers.map((o, i) => (
                <div key={i} className="pdOfferItem">
                  <span className="pdOfferBullet" />
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="pdHr" />

          {/* Delivery */}
          <div className="pdBlock">
            <h4 className="pdBlockHead"><FaTruck /> Delivery Options</h4>
            <div className="pdPincodeWrap">
              <input
                type="text"
                className="pdPincodeInput"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                maxLength={6}
                onChange={e => { setPincode(e.target.value.replace(/\D/g,"")); setPincodeRes(null); }}
                onKeyDown={e => e.key === "Enter" && checkPin()}
              />
              <button className="pdPincodeBtn" onClick={checkPin}>Check</button>
            </div>
            {pincodeRes && (
              <p className={`pdPincodeMsg ${pincodeRes.ok ? "pinOk" : "pinErr"}`}>
                {pincodeRes.msg}
              </p>
            )}
            <div className="pdDeliveryItems">
              <div className="pdDelRow"><FaTruck />      <div><strong>Free Delivery</strong><span>On all orders above ₹499</span></div></div>
              <div className="pdDelRow"><FaClock />      <div><strong>Estimated by Tomorrow</strong><span>Standard shipping, before 6 PM</span></div></div>
              <div className="pdDelRow"><FaBoxOpen />    <div><strong>30-Day Returns</strong><span>No-questions-asked refund policy</span></div></div>
              <div className="pdDelRow"><FaCheckCircle /><div><strong>In Stock</strong><span>Ships within 24 hours of order</span></div></div>
            </div>
          </div>

          <hr className="pdHr" />

          {/* Seller */}
          <div className="pdSellerBox">
            <FaStore className="pdSellerIcon" />
            <div>
              <p className="pdSellerTitle">Sold by <strong>OctaStore Official</strong></p>
              <p className="pdSellerMeta">⭐ 4.8 · 98% positive feedback · 50,000+ orders</p>
            </div>
          </div>
        </div>

        {/* COL 3: Buy Box */}
        <div className="pdBuyBox">
          <div className="pdBuyBoxCard">
            <div className="pdBuyPriceRow">
              <span className="pdBuyPrice">{fmt(p.price)}</span>
              <span className="pdBuyDisc">{disc}% off</span>
            </div>
            <p className="pdBuyMrp">M.R.P <del>{fmt(p.original)}</del></p>
            <p className="pdBuyStock"><FaCheckCircle /> In Stock — ready to ship</p>
            <p className="pdBuyDelivery"><FaTruck /> Free delivery by Tomorrow</p>

            {/* Qty */}
            <div className="pdBuyQtyRow">
              <span>Qty:</span>
              <div className="pdBuyQty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}><FaMinus /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}><FaPlus /></button>
              </div>
            </div>

            {cartQty > 0 && <p className="pdAlreadyCart">🛒 {cartQty} already in cart</p>}

            <button className="pdBuyCartBtn" onClick={handleAdd}>
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="pdBuyNowBtn" onClick={handleBuyNow}>
              ⚡ Buy Now
            </button>

            <div className="pdBuyTrust">
              <div><FaShieldAlt /> Secure Payment</div>
              <div><FaTruck />    Free Shipping</div>
              <div><FaBoxOpen />  Easy Returns</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="pdTabsBlock">
        <div className="pdTabNav">
          {[["highlights","✨ Highlights"],["specifications","📋 Specifications"],["reviews","💬 Reviews"]].map(([id,label]) => (
            <button
              key={id}
              className={`pdTabBtn ${activeTab === id ? "pdTabActive" : ""}`}
              onClick={() => setActiveTab(id)}
            >{label}</button>
          ))}
        </div>

        <div className="pdTabContent">
          {activeTab === "highlights" && (
            <div className="pdHighlightsWrap">
              <div className="pdHLGrid">
                {getHighlights(p).map((h, i) => (
                  <div key={i} className="pdHLItem">
                    <FaCheckCircle className="pdHLIcon" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
              <div className="pdAboutCard">
                <h4>About This Product</h4>
                <p>{p.desc}</p>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="pdSpecsWrap">
              <table className="pdSpecsTable">
                <tbody>
                  {Object.entries(getSpecs(p)).map(([k, v]) => (
                    <tr key={k}>
                      <td className="pdSpecKey">{k}</td>
                      <td className="pdSpecVal">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && <ReviewsSection product={p} />}
        </div>
      </div>

      {/* ── SIMILAR PRODUCTS ── */}
      {similar.length > 0 && (
        <div className="pdSimilarWrap">
          <h3 className="pdSimilarHead">Similar Products You May Like</h3>
          <div className="pdSimilarGrid">
            {similar.map(sp => (
              <ProductCard
                key={sp.id}
                product={sp}
                cartQty={getCartQty(sp.id)}
                onView={() => onViewProduct(sp)}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════
   CART DRAWER
═══════════════════════════════════════ */

function CartDrawer({ open, onClose, items, onQty, onRemove, onCheckout }) {
  const total   = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const savings = items.reduce((s, i) => s + (i.product.original - i.product.price) * i.qty, 0);

  return (
    <>
      <div className={`cartOverlay ${open ? "cartOverlayOpen" : ""}`} onClick={onClose} />
      <div className={`cartDrawer ${open ? "cartDrawerOpen" : ""}`}>
        <div className="cartHeader">
          <h3><FaShoppingCart /> My Cart <span className="cartCountBadge">{items.reduce((s,i)=>s+i.qty,0)}</span></h3>
          <button className="cartClose" onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cartEmpty">
            <span className="cartEmptyEmoji">🛒</span>
            <p>Your cart is empty</p>
            <span>Start shopping to add items</span>
            <button className="cartEmptyBtn" onClick={onClose}>Browse Products</button>
          </div>
        ) : (
          <>
            <div className="cartItems">
              {items.map(({ product: p, qty }) => (
                <div className="cartItem" key={p.id}>
                  <div className={`cartItemImg cat-${p.category}`}>{p.emoji}</div>
                  <div className="cartItemInfo">
                    <p className="cartItemName">{p.name}</p>
                    <p className="cartItemPrice">{fmt(p.price)}</p>
                    <div className="cartItemQty">
                      <button onClick={() => onQty(p.id, -1)}><FaMinus /></button>
                      <span>{qty}</span>
                      <button onClick={() => onQty(p.id, +1)}><FaPlus /></button>
                    </div>
                  </div>
                  <button className="cartItemRemove" onClick={() => onRemove(p.id)}>
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cartFooter">
              {savings > 0 && (
                <div className="cartSavings">🎉 You save {fmt(savings)} on this order</div>
              )}
              <div className="cartTotals">
                <div className="cartTotalRow"><span>Subtotal</span><span>{fmt(total)}</span></div>
                <div className="cartTotalRow"><span>Delivery</span><span className="freeTag">Free</span></div>
                <div className="cartTotalRow cartGrandTotal"><span>Total</span><span>{fmt(total)}</span></div>
              </div>
              <button className="cartCheckoutBtn" onClick={onCheckout}>
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   ORDERS VIEW
═══════════════════════════════════════ */

function OrdersView({ orders, onBack }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const statusColor = { Delivered: "#16a34a", "In Transit": "#f97316", Processing: "#6366f1" };

  return (
    <div className="ordersPage">
      <div className="ordersHeader">
        <button className="ordersBack" onClick={onBack}><FaChevronLeft /> Back to Shopping</button>
        <h2>My Orders</h2>
      </div>

      <div className="ordersList">
        {orders.map(o => (
          <div className="orderCard" key={o.id}>
            <div className="orderTop">
              <div className="orderMeta">
                <span className="orderId">{o.id}</span>
                <span className="orderDate">{o.date}</span>
              </div>
              <span
                className="orderStatus"
                style={{ background: statusColor[o.status] + "18", color: statusColor[o.status] }}
              >
                {o.emoji} {o.status}
              </span>
            </div>
            <div className="orderItems">
              {o.items.map(item => (
                <span key={item} className="orderItem"><FaBox /> {item}</span>
              ))}
            </div>
            <div className="orderBottom">
              <span className="orderTotal">Order Total: <strong>{fmt(o.total)}</strong></span>
              <div className="orderActions">
                <button className="orderBtn">Track</button>
                {o.status === "Delivered" && <button className="orderBtn orderBtnOutline">Reorder</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   CHECKOUT VIEW
═══════════════════════════════════════ */

function CheckoutView({ items, onBack, onPlaceOrder }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const [payMethod, setPayMethod] = useState("card");
  const [cardNum,   setCardNum]   = useState("");
  const [expiry,    setExpiry]    = useState("");
  const [cvv,       setCvv]       = useState("");
  const [name,      setName]      = useState("");
  const [address,   setAddress]   = useState("");
  const [pincode,   setPincode]   = useState("");

  const total   = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const savings = items.reduce((s, i) => s + (i.product.original - i.product.price) * i.qty, 0);

  function handlePlace(e) {
    e.preventDefault();
    onPlaceOrder();
  }

  return (
    <div className="checkoutPage">
      <button className="checkoutBack" onClick={onBack}><FaChevronLeft /> Back to Cart</button>
      <h2 className="checkoutTitle">Checkout</h2>

      <div className="checkoutGrid">
        {/* LEFT: forms */}
        <div className="checkoutLeft">
          {/* DELIVERY */}
          <div className="checkoutCard">
            <h4><FaMapMarkerAlt /> Delivery Address</h4>
            <div className="checkoutFields">
              <input placeholder="Full Name"     value={name}    onChange={e => setName(e.target.value)} />
              <input placeholder="Street Address" value={address} onChange={e => setAddress(e.target.value)} className="fullWidth" />
              <input placeholder="Pincode"        value={pincode} onChange={e => setPincode(e.target.value)} />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="checkoutCard">
            <h4><FaCreditCard /> Payment Method</h4>
            <div className="payMethods">
              {[
                { id: "card", icon: <FaCreditCard />, label: "Credit / Debit Card" },
                { id: "upi",  icon: <FaMobile />,     label: "UPI / Net Banking"   },
                { id: "cod",  icon: <FaMoneyBillWave />, label: "Cash on Delivery" },
              ].map(m => (
                <label key={m.id} className={`payOption ${payMethod === m.id ? "paySelected" : ""}`}>
                  <input type="radio" name="pay" value={m.id} checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} />
                  <span className="payOptionIcon">{m.icon}</span>
                  <span>{m.label}</span>
                </label>
              ))}
            </div>

            {payMethod === "card" && (
              <div className="cardFields">
                <input
                  placeholder="Card Number"
                  value={cardNum}
                  maxLength={19}
                  onChange={e => setCardNum(e.target.value.replace(/\D/g,"").replace(/(\d{4})/g,"$1 ").trim())}
                  className="fullWidth"
                />
                <input placeholder="MM / YY" value={expiry} onChange={e => setExpiry(e.target.value)} />
                <input placeholder="CVV" value={cvv} maxLength={3} onChange={e => setCvv(e.target.value.replace(/\D/g,""))} type="password" />
              </div>
            )}
            {payMethod === "upi" && (
              <div className="cardFields">
                <input placeholder="UPI ID  (e.g. name@upi)" className="fullWidth" />
              </div>
            )}
            {payMethod === "cod" && (
              <p className="codNote">💵 Pay ₹{total.toLocaleString()} in cash at delivery. No extra charges.</p>
            )}
          </div>
        </div>

        {/* RIGHT: order summary */}
        <div className="checkoutRight">
          <div className="checkoutCard">
            <h4>Order Summary ({items.reduce((s,i)=>s+i.qty,0)} items)</h4>
            <div className="coItems">
              {items.map(({ product: p, qty }) => (
                <div key={p.id} className="coItem">
                  <span className="coEmoji">{p.emoji}</span>
                  <span className="coName">{p.name}</span>
                  <span className="coQtyPrice">×{qty}  {fmt(p.price * qty)}</span>
                </div>
              ))}
            </div>
            <div className="coTotals">
              <div className="coTotalRow"><span>Subtotal</span><span>{fmt(total)}</span></div>
              <div className="coTotalRow"><span>Delivery</span><span className="freeTag">Free</span></div>
              {savings > 0 && <div className="coTotalRow savingsRow"><span>Savings</span><span>-{fmt(savings)}</span></div>}
              <div className="coTotalRow coGrand"><span>Total</span><span>{fmt(total)}</span></div>
            </div>
            <button className="coPlaceBtn" onClick={handlePlace}>
              Place Order  {fmt(total)}
            </button>
            <p className="coSafe">🔒 100% secure & encrypted payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ORDER SUCCESS
═══════════════════════════════════════ */

function OrderSuccessView({ onContinue }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const orderId = `OCT-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="successPage">
      <div className="successCard">
        <div className="successCircle"><FaCheckCircle /></div>
        <h2>Order Placed!</h2>
        <p>Your order <strong>{orderId}</strong> has been confirmed.</p>
        <div className="successEta">
          <FaTruck /> <span>Estimated delivery: <strong>Tomorrow by 6 PM</strong></span>
        </div>
        <button className="successBtn" onClick={onContinue}>Continue Shopping</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   BANNER CAROUSEL
═══════════════════════════════════════ */

function BannerCarousel({ onCategoryClick }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  function go(n) {
    setIdx(i => (i + n + banners.length) % banners.length);
  }

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const b = banners[idx];

  return (
    <div className="bannerWrap">
      <div className="banner" style={{ background: b.gradient }} key={idx}>
        <div className="bannerText">
          <p className="bannerTag">Limited Time Offer</p>
          <h3>{b.heading}</h3>
          <p className="bannerSub">{b.sub}</p>
          <button className="bannerCta" onClick={() => onCategoryClick(b.cta)}>
            Shop Now →
          </button>
        </div>
        <span className="bannerEmoji">{b.emoji}</span>
      </div>

      <button className="bannerArrow bannerPrev" onClick={() => go(-1)}><FaChevronLeft /></button>
      <button className="bannerArrow bannerNext" onClick={() => go(+1)}><FaChevronRight /></button>

      <div className="bannerDots">
        {banners.map((_, i) => (
          <span key={i} className={`bannerDot ${i === idx ? "dotActive" : ""}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */

export default function ECommerce() {
  const navigate = useNavigate();

  const [view,    setView]    = useState("browse"); // browse | product | orders | checkout | success
  const [selProd, setSelProd] = useState(null);
  const [cart,    setCart]    = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("all");
  const [search,  setSearch]  = useState("");
  const [orders,  setOrders]  = useState(mockOrders);
  const [sortBy,  setSortBy]  = useState("default");

  /* helpers */
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function getQty(id) { return cart.find(i => i.product.id === id)?.qty ?? 0; }

  function addToCart(product) {
    setCart(c => {
      const existing = c.find(i => i.product.id === product.id);
      return existing
        ? c.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...c, { product, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart(c => c
      .map(i => i.product.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    );
  }

  function removeFromCart(id) { setCart(c => c.filter(i => i.product.id !== id)); }

  function placeOrder() {
    const newOrder = {
      id:     `OCT-${Math.floor(1000 + Math.random() * 9000)}`,
      date:   new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }),
      status: "Processing",
      items:  cart.map(i => i.product.name),
      total:  cart.reduce((s, i) => s + i.product.price * i.qty, 0),
      emoji:  "⏳",
    };
    setOrders(o => [newOrder, ...o]);
    setCart([]);
    setCartOpen(false);
    setView("success");
  }

  /* filtered + sorted products */
  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const catOk  = activeCat === "all" || p.category === activeCat;
      const searchOk = p.name.toLowerCase().includes(search.toLowerCase()) ||
                       p.category.toLowerCase().includes(search.toLowerCase());
      return catOk && searchOk;
    });
    if (sortBy === "priceLow")  list = [...list].sort((a,b) => a.price - b.price);
    if (sortBy === "priceHigh") list = [...list].sort((a,b) => b.price - a.price);
    if (sortBy === "rating")    list = [...list].sort((a,b) => b.rating - a.rating);
    return list;
  }, [activeCat, search, sortBy]);

  /* views */
  if (view === "product" && selProd) return (
    <div className="ecPage">
      <ECHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} onOrders={() => setView("orders")} onHome={() => navigate("/")} search={search} onSearch={setSearch} />
      <ProductDetail
        product={selProd}
        cartQty={getQty(selProd.id)}
        onAdd={addToCart}
        onRemove={id => changeQty(id, -1)}
        onBack={() => setView("browse")}
        onBuyNow={() => { setCartOpen(false); setView("checkout"); }}
        allProducts={products}
        getCartQty={getQty}
        onViewProduct={prod => setSelProd(prod)}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onQty={changeQty} onRemove={removeFromCart} onCheckout={() => { setCartOpen(false); setView("checkout"); }} />
    </div>
  );

  if (view === "orders") return (
    <div className="ecPage">
      <ECHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} onOrders={() => setView("orders")} onHome={() => navigate("/")} search={search} onSearch={setSearch} />
      <OrdersView orders={orders} onBack={() => setView("browse")} />
    </div>
  );

  if (view === "checkout") return (
    <div className="ecPage">
      <ECHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} onOrders={() => setView("orders")} onHome={() => navigate("/")} search={search} onSearch={setSearch} />
      <CheckoutView items={cart} onBack={() => { setCartOpen(true); setView("browse"); }} onPlaceOrder={placeOrder} />
    </div>
  );

  if (view === "success") return (
    <div className="ecPage">
      <ECHeader cartCount={cartCount} onCartOpen={() => setCartOpen(true)} onOrders={() => setView("orders")} onHome={() => navigate("/")} search={search} onSearch={setSearch} />
      <OrderSuccessView onContinue={() => setView("browse")} />
    </div>
  );

  /* default: browse */
  return (
    <div className="ecPage">
      <ECHeader
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onOrders={() => setView("orders")}
        onHome={() => navigate("/")}
        search={search}
        onSearch={setSearch}
      />

      {/* CATEGORY STRIP */}
      <div className="catStrip">
        {categories.map(c => (
          <button
            key={c.id}
            className={`ecCatPill ${activeCat === c.id ? "ecCatActive" : ""}`}
            onClick={() => setActiveCat(c.id)}
          >
            <span>{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      <main className="ecMain">
        {/* BANNER */}
        {!search && <BannerCarousel onCategoryClick={id => { setActiveCat(id); }} />}

        {/* RESULTS HEADER */}
        <div className="resultsBar">
          <p className="resultsCount">
            {search
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
              : `${filtered.length} Products`}
          </p>
          <div className="sortRow">
            <FaFilter />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sortSelect">
              <option value="default">Sort: Relevance</option>
              <option value="priceLow">Price: Low → High</option>
              <option value="priceHigh">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* PRODUCT GRID */}
        {filtered.length === 0 ? (
          <div className="noResults">
            <span>🔍</span>
            <p>No products found for "{search}"</p>
            <button onClick={() => { setSearch(""); setActiveCat("all"); }}>Clear search</button>
          </div>
        ) : (
          <div className="productGrid">
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                cartQty={getQty(p.id)}
                onView={prod => { setSelProd(prod); setView("product"); }}
                onAdd={addToCart}
                onRemove={id => changeQty(id, -1)}
              />
            ))}
          </div>
        )}
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onQty={changeQty}
        onRemove={removeFromCart}
        onCheckout={() => { setCartOpen(false); setView("checkout"); }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════
   SHARED HEADER
═══════════════════════════════════════ */

function ECHeader({ cartCount, onCartOpen, onOrders, onHome, search, onSearch }) {
  return (
    <header className="ecHeader">
      <div className="ecHeaderInner">
        <button className="ecBackBtn" onClick={onHome}><FaArrowLeft /></button>

        <div className="ecBrand">
          <span className="ecBrandIcon">🛍️</span>
          <div>
            <h1 className="ecBrandTitle">E-Commerce</h1>
            <p className="ecBrandSub">Millions of products</p>
          </div>
        </div>

        <div className="ecSearchBar">
          <FaSearch className="ecSearchIcon" />
          <input
            type="text"
            placeholder='Search products, brands, categories…'
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          {search && <button className="clearSearch" onClick={() => onSearch("")}>✕</button>}
        </div>

        <div className="ecHeaderActions">
          <button className="ecOrdersBtn" onClick={onOrders}>
            <FaBox /> Orders
          </button>
          <button className="ecCartBtn" onClick={onCartOpen}>
            <FaShoppingCart />
            {cartCount > 0 && <span className="ecCartBadge">{cartCount}</span>}
          </button>
          <button className="ecUserBtn"><FaUser /></button>
        </div>
      </div>
    </header>
  );
}
