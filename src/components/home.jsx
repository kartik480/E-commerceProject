import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  FaBolt, FaShoppingBag, FaCarSide,
  FaSearch, FaShoppingCart, FaUser,
  FaArrowRight, FaPlay,
  FaRocket, FaShieldAlt, FaClock, FaHeadset
} from "react-icons/fa";

const services = [
  {
    tag: "FAST & INSTANT",
    icon: <FaBolt />,
    title: "Quick Commerce",
    desc: "Get daily essentials in minutes with ultra-fast delivery.",
    variant: "green"
  },
  {
    tag: "SHOP ANYTHING",
    icon: <FaShoppingBag />,
    title: "E-Commerce",
    desc: "Explore millions of products across all categories.",
    variant: "teal"
  },
  {
    tag: "SAFE & RELIABLE",
    icon: <FaCarSide />,
    title: "Rides",
    desc: "Book rides anytime, anywhere with trusted drivers.",
    variant: "emerald"
  }
];

const stats = [
  { icon: <FaRocket />, value: "10M+",  label: "Happy Customers",  desc: "Trusted by millions every day." },
  { icon: <FaShieldAlt />, value: "100%", label: "Secure Payments",  desc: "Your transactions are always safe." },
  { icon: <FaClock />,   value: "15 Min", label: "Fast Delivery",    desc: "Lightning fast delivery to your doorstep." },
  { icon: <FaHeadset />, value: "24/7",  label: "Customer Support", desc: "We're here for you anytime." }
];

const serviceRoutes = {
  "Quick Commerce": "/quick-commerce",
  "E-Commerce":     "/ecommerce",
  "Rides":          "/rides",
};

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <h1 className="logo">Octadecent</h1>

        <div className="navLinks">
          <a href="/" className="active">Home</a>
          <a href="/">Services</a>
          <a href="/">Categories</a>
          <a href="/">Deals</a>
          <a href="/">About Us</a>
        </div>

        <div className="navActions">
          <FaSearch />
          <div className="cartWrap">
            <FaShoppingCart />
            <span className="cartBadge">3</span>
          </div>
          <FaUser
            style={{ cursor: "pointer" }}
            title="Sign in"
            onClick={() => navigate("/login")}
          />
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="heroLeft">
          <div className="heroBadge">
            <span className="badgeDot">✦</span> All-in-One Commerce Ecosystem
          </div>

          <h1 className="heroTitle">
            Shop. Move. Live.<br />
            The <span className="heroAccent">Octadecent</span> Way.
          </h1>

          <p className="heroSub">
            Discover a world of endless choices, lightning fast delivery
            and seamless rides – all on one platform.
          </p>

          <div className="heroButtons">
            <button className="btnPrimary">
              Explore All Services <FaArrowRight />
            </button>
            <button className="btnGhost">
              <span className="playIcon"><FaPlay /></span> How It Works
            </button>
          </div>
        </div>

        <div className="heroRight">
          <div className="phoneMock">
            <div className="phoneInner">
              <div className="phoneBar">
                <span className="phoneLogo">Octadecent</span>
              </div>
              <div className="phoneSearch">🔍 Search products...</div>
              <div className="phoneTabs">
                <span>Electronics</span><span>Fashion</span><span>Home</span>
              </div>
              <div className="phoneBanner">
                <p>Mega Sale</p>
                <small>Up to 60% Off</small>
                <button>Shop Now</button>
              </div>
              <p className="phonePopular">Popular Products</p>
              <div className="phoneProducts">
                <div className="phoneProd" />
                <div className="phoneProd" />
                <div className="phoneProd" />
              </div>
            </div>
          </div>

          <div className="floatCard floatTop">
            <FaShoppingBag className="floatIcon" /> Shopping
          </div>
          <div className="floatCard floatRight">
            <FaBolt className="floatIcon" /> Fast Delivery
          </div>
          <div className="floatCard floatBottom">
            <FaCarSide className="floatIcon" /> Easy Rides
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR EXPERIENCE ── */}
      <section className="experienceSection">
        <div className="sectionHead">
          <h2>Choose Your <span>Experience</span></h2>
          <span className="headDivider">✦</span>
          <p>Three powerful services. One amazing platform.</p>
        </div>

        <div className="serviceCards">
          {services.map((s, i) => (
            <div
              className={`serviceCard card-${s.variant}`}
              key={i}
              onClick={() => serviceRoutes[s.title] && navigate(serviceRoutes[s.title])}
              style={serviceRoutes[s.title] ? { cursor: "pointer" } : {}}
            >
              <div className="cardVisual">
                <div className="cardIconWrap">{s.icon}</div>
              </div>
              <div className="cardBody">
                <span className="cardTag">{s.tag}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <button className="cardArrow"><FaArrowRight /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE ── */}
      <section className="whySection">
        <div className="sectionHead">
          <h2>Why Choose <span>Octadecent</span>?</h2>
          <p>Built for speed, convenience and trust.</p>
        </div>

        <div className="statsRow">
          {stats.map((s, i) => (
            <div className="statCard" key={i}>
              <div className="statIconBox">{s.icon}</div>
              <div className="statValue">{s.value}</div>
              <div className="statLabel">{s.label}</div>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
