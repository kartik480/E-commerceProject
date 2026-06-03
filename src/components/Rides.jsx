import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaLocationArrow, FaHistory, FaUser,
  FaStar, FaPhone, FaBolt, FaCheckCircle, FaShieldAlt,
  FaTimes, FaSearch, FaMotorcycle
} from "react-icons/fa";
import "./Rides.css";

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */

const rideTypes = [
  { id: "bike",  icon: "🛵", name: "Bike",       seats: 1, time: 4,  price: 65,  desc: "1 passenger · Fastest"     },
  { id: "auto",  icon: "🛺", name: "Auto",        seats: 3, time: 7,  price: 120, desc: "Upto 3 passengers"          },
  { id: "mini",  icon: "🚗", name: "Mini",         seats: 4, time: 9,  price: 180, desc: "Upto 4 passengers · AC"     },
  { id: "prime", icon: "🚙", name: "Prime Sedan", seats: 4, time: 12, price: 260, desc: "Premium comfort · AC"       },
];

const quickPlaces = [
  { icon: "🏠", label: "Home",   address: "123, MG Road, Bengaluru"       },
  { icon: "💼", label: "Work",   address: "Octadecent HQ, Koramangala"    },
  { icon: "⭐", label: "Saved",  address: "456, Brigade Road, Bengaluru"  },
];

const recentDestinations = [
  { icon: "🛵", to: "Koramangala 5th Block",  from: "Indiranagar Metro", time: "2 days ago",  fare: "₹89"  },
  { icon: "🚗", to: "Whitefield ITPL",         from: "MG Road",          time: "5 days ago",  fare: "₹210" },
  { icon: "🛺", to: "HSR Layout Sector 4",     from: "Marathahalli",     time: "Last week",   fare: "₹135" },
];

const rideHistory = [
  { id: "RID-4821", date: "28 May 2026", from: "Indiranagar",   to: "Koramangala",     type: "🛵", typeName: "Bike",  price: 89,  rating: 5, driver: "Rajesh K.", vehicle: "KA-01-HX-4521" },
  { id: "RID-4788", date: "23 May 2026", from: "MG Road",       to: "Whitefield",      type: "🚗", typeName: "Mini",  price: 210, rating: 4, driver: "Suresh M.", vehicle: "KA-05-MN-7823" },
  { id: "RID-4712", date: "18 May 2026", from: "Marathahalli",  to: "HSR Layout",      type: "🛺", typeName: "Auto",  price: 135, rating: 5, driver: "Venkat R.", vehicle: "KA-09-AB-1234" },
  { id: "RID-4650", date: "12 May 2026", from: "Silk Board",    to: "Electronic City", type: "🚙", typeName: "Prime", price: 290, rating: 4, driver: "Anil P.",   vehicle: "KA-03-CD-5678" },
];

const mockDrivers = [
  { name: "Rajesh Kumar",  rating: 4.8, trips: 1240, avatar: "👨", vehicle: "Honda Activa",  plate: "KA-01-HX-4521", vehicleEmoji: "🛵" },
  { name: "Suresh Babu",   rating: 4.7, trips: 2340, avatar: "🧔", vehicle: "TVS Jupiter",   plate: "KA-05-MN-7823", vehicleEmoji: "🛺" },
  { name: "Venkat Raman",  rating: 4.9, trips: 3100, avatar: "👴", vehicle: "Maruti Swift",  plate: "KA-09-AB-1234", vehicleEmoji: "🚗" },
  { name: "Anil Patel",    rating: 4.6, trips:  890, avatar: "🧑", vehicle: "Honda City",    plate: "KA-03-CD-5678", vehicleEmoji: "🚙" },
];

/* ═══════════════════════════════════════
   MAP COMPONENT
═══════════════════════════════════════ */

function RideMap({ view, rideType }) {
  const showRoute   = ["selectRide","finding","tracking"].includes(view);
  const showVehicle = view === "tracking";

  return (
    <div className="rideMap">
      {/* Road grid */}
      <div className="mapGrid" />

      {/* Major roads */}
      <div className="mapRoad rh r1" /><div className="mapRoad rh r2" /><div className="mapRoad rh r3" />
      <div className="mapRoad rv r4" /><div className="mapRoad rv r5" /><div className="mapRoad rv r6" />

      {/* Road labels */}
      <span className="mapLabel" style={{top:"23%",left:"18%"}}>MG Road</span>
      <span className="mapLabel" style={{top:"55%",left:"60%"}}>Outer Ring Road</span>
      <span className="mapLabel" style={{top:"38%",left:"42%",transform:"rotate(-90deg)"}}>NH-48</span>

      {/* Green areas */}
      <div className="mapGreen mg1" /><div className="mapGreen mg2" /><div className="mapGreen mg3" />

      {/* SVG Route */}
      {showRoute && (
        <svg className="mapRouteSvg" viewBox="0 0 600 380" preserveAspectRatio="none">
          <path
            d="M 110 300 Q 180 260 230 210 Q 290 150 360 100 Q 420 60 490 50"
            stroke="#16a34a" strokeWidth="5" fill="none"
            strokeDasharray="10 5"
            className={showVehicle ? "routeAnimated" : "routeStatic"}
          />
          <circle cx="110" cy="300" r="8" fill="#16a34a" />
          <circle cx="490" cy="50"  r="8" fill="#ef4444" />
        </svg>
      )}

      {/* Moving vehicle on tracking */}
      {showVehicle && (
        <div className="mapVehicleIcon">{rideType?.icon ?? "🛵"}</div>
      )}

      {/* Origin pulse */}
      <div className="mapPinOrigin">
        <div className="pulseRing" /><div className="pulseRing pr2" /><div className="pulseDot" />
      </div>

      {/* Destination pin */}
      {showRoute && <div className="mapPinDest"><span>📍</span></div>}

      {/* "You are here" label */}
      <div className="mapYouHere"><FaLocationArrow /> You are here</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STARS
═══════════════════════════════════════ */

function StarRow({ n }) {
  return (
    <span className="starRow">
      {[1,2,3,4,5].map(i => (
        <FaStar key={i} style={{ color: i <= n ? "#f59e0b" : "#e5e7eb", fontSize: 12 }} />
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */

export default function Rides() {
  const navigate  = useNavigate();
  const [view,         setView]         = useState("home");
  const [dropInput,    setDropInput]    = useState("");
  const [drop,         setDrop]         = useState("");
  const [selectedRide, setSelectedRide] = useState(rideTypes[0]);
  const [payMethod,    setPayMethod]    = useState("cash");
  const [findPct,      setFindPct]      = useState(0);
  const [driver,       setDriver]       = useState(null);
  const [tripPct,      setTripPct]      = useState(0);
  const [ratedId,      setRatedId]      = useState(null);
  const [userRating,   setUserRating]   = useState(0);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [view]);

  /* simulate finding driver */
  useEffect(() => {
    if (view !== "finding") return;
    setFindPct(0);
    const t = setInterval(() => {
      setFindPct(p => {
        if (p >= 100) {
          clearInterval(t);
          const d = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
          setDriver(d);
          setTimeout(() => setView("tracking"), 600);
          return 100;
        }
        return p + 4;
      });
    }, 100);
    return () => clearInterval(t);
  }, [view]);

  /* simulate trip */
  useEffect(() => {
    if (view !== "tracking") return;
    setTripPct(0);
    const t = setInterval(() => setTripPct(p => Math.min(p + 0.6, 100)), 800);
    return () => clearInterval(t);
  }, [view]);

  function handleDropSelect(addr) {
    setDrop(addr);
    setDropInput(addr);
    setView("selectRide");
  }

  function bookRide() {
    setFindPct(0);
    setDriver(null);
    setView("finding");
  }

  function endTrip() {
    setView("rate");
  }

  function resetHome() {
    setView("home");
    setDrop(""); setDropInput("");
    setDriver(null); setTripPct(0); setFindPct(0);
    setUserRating(0);
  }

  const discPrice = Math.round(selectedRide.price * 0.8);

  return (
    <div className="ridesPage">

      {/* ── HEADER ── */}
      <header className="ridesHeader">
        <button className="ridesBackBtn" onClick={() => navigate("/")}>
          <FaArrowLeft />
        </button>
        <div className="ridesBrand">
          <span>🏍️</span>
          <div>
            <p className="ridesBrandName">Octadecent Rides</p>
            <p className="ridesBrandSub">Safe · Fast · Affordable</p>
          </div>
        </div>
        <div className="ridesHeaderRight">
          {view !== "history" && (
            <button className="ridesHistBtn" onClick={() => setView("history")}>
              <FaHistory /> My Rides
            </button>
          )}
          <button className="ridesAvatarBtn"><FaUser /></button>
        </div>
      </header>

      {/* ══════════════════════ HISTORY ══════════════════════ */}
      {view === "history" && (
        <div className="histPage">
          <div className="histHead">
            <button className="histBackBtn" onClick={resetHome}>← Back</button>
            <h2>My Rides</h2>
          </div>
          <div className="histList">
            {rideHistory.map(r => (
              <div key={r.id} className="histCard">
                <div className="histCardTop">
                  <span className="histType">{r.type} {r.typeName}</span>
                  <span className="histDate">{r.date}</span>
                  <span className="histFare">₹{r.price}</span>
                </div>
                <div className="histRoute">
                  <div className="histRouteRow">
                    <span className="histDot green" />
                    <span>{r.from}</span>
                  </div>
                  <div className="histRouteLine" />
                  <div className="histRouteRow">
                    <span className="histDot red" />
                    <span>{r.to}</span>
                  </div>
                </div>
                <div className="histCardBottom">
                  <span className="histDriver">👤 {r.driver} · {r.vehicle}</span>
                  <StarRow n={r.rating} />
                  <button className="histRebook" onClick={() => { setDrop(r.to); setDropInput(r.to); setView("selectRide"); }}>
                    Rebook
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════ MAP + SHEET VIEWS ══════════════════════ */}
      {view !== "history" && (
        <div className="ridesBody">
          <RideMap view={view} rideType={selectedRide} />

          {/* ── HOME SHEET ── */}
          {view === "home" && (
            <div className="sheet sheetHome">
              <div className="sheetHandle" />
              <h3 className="sheetTitle">Where are you going?</h3>

              {/* Location inputs */}
              <div className="locInputs">
                <div className="locRow">
                  <span className="locDot green" />
                  <div className="locField locFieldFilled">
                    <FaLocationArrow className="locCurrentIcon" />
                    <span>Current Location</span>
                  </div>
                </div>
                <div className="locConnector" />
                <div className="locRow">
                  <span className="locDot red" />
                  <div className="locField">
                    <FaSearch className="locSearchIcon" />
                    <input
                      placeholder="Enter destination"
                      value={dropInput}
                      onChange={e => setDropInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && dropInput.trim() && handleDropSelect(dropInput.trim())}
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {/* Quick places */}
              <div className="quickRow">
                {quickPlaces.map((p, i) => (
                  <button key={i} className="quickBtn" onClick={() => handleDropSelect(p.address)}>
                    <span className="quickIcon">{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Recent */}
              <p className="recentLabel">Recent destinations</p>
              {recentDestinations.map((r, i) => (
                <button key={i} className="recentRow" onClick={() => handleDropSelect(r.to)}>
                  <span className="recentIconBox">{r.icon}</span>
                  <div className="recentInfo">
                    <p className="recentTo">{r.to}</p>
                    <p className="recentFrom">{r.from} · {r.time}</p>
                  </div>
                  <span className="recentFare">{r.fare}</span>
                </button>
              ))}
            </div>
          )}

          {/* ── SELECT RIDE SHEET ── */}
          {view === "selectRide" && (
            <div className="sheet sheetTall">
              <div className="sheetHandle" />

              {/* Route summary */}
              <div className="routeSummaryRow">
                <button className="sheetBackArrow" onClick={() => setView("home")}>←</button>
                <div className="routeSummary">
                  <p className="routeText">Current Location → <strong>{drop || dropInput}</strong></p>
                  <p className="routeMeta">3.2 km · ~{selectedRide.time} min</p>
                </div>
              </div>

              <p className="chooseRideLabel">Choose your ride</p>

              {/* Ride options */}
              <div className="rideOptionsList">
                {rideTypes.map(r => (
                  <button
                    key={r.id}
                    className={`rideOpt ${selectedRide.id === r.id ? "rideOptActive" : ""}`}
                    onClick={() => setSelectedRide(r)}
                  >
                    <span className="rideOptIcon">{r.icon}</span>
                    <div className="rideOptMid">
                      <p className="rideOptName">{r.name}</p>
                      <p className="rideOptDesc">{r.desc}</p>
                    </div>
                    <div className="rideOptRight">
                      <p className="rideOptTime"><FaBolt />{r.time} min</p>
                      <p className="rideOptPrice">₹{Math.round(r.price * 0.8)}</p>
                      <p className="rideOptOriginal">₹{r.price}</p>
                    </div>
                    {selectedRide.id === r.id && <span className="rideOptTick">✓</span>}
                  </button>
                ))}
              </div>

              {/* Coupon */}
              <div className="couponBanner">
                <span>🏷️</span>
                <span><strong>RIDE20</strong> applied — 20% off on your ride!</span>
                <span className="couponSaved">-₹{selectedRide.price - discPrice}</span>
              </div>

              {/* Payment row */}
              <div className="paymentRow">
                <span className="paymentLabel">Pay via</span>
                <div className="paymentOptions">
                  {[{id:"cash",e:"💵",l:"Cash"},{id:"upi",e:"📱",l:"UPI"},{id:"wallet",e:"👛",l:"Wallet"}].map(m => (
                    <button
                      key={m.id}
                      className={`payOpt ${payMethod === m.id ? "payOptActive" : ""}`}
                      onClick={() => setPayMethod(m.id)}
                    >
                      {m.e} {m.l}
                    </button>
                  ))}
                </div>
              </div>

              <button className="bookBtn" onClick={bookRide}>
                Book {selectedRide.name} · ₹{discPrice}
              </button>
            </div>
          )}

          {/* ── FINDING DRIVER SHEET ── */}
          {view === "finding" && (
            <div className="sheet sheetFinding">
              <div className="sheetHandle" />
              <div className="findingWrap">
                <div className="findingIconWrap">
                  <span className="findingVehicle">{selectedRide.icon}</span>
                  <div className="findingRing fr1" /><div className="findingRing fr2" />
                </div>
                <h3 className="findingTitle">Finding your {selectedRide.name}…</h3>
                <p className="findingDesc">Connecting with nearby drivers</p>
                <div className="findingBar">
                  <div className="findingBarFill" style={{ width: `${findPct}%` }} />
                </div>
                <div className="findingDots">
                  <span /><span /><span />
                </div>
                <button className="findingCancel" onClick={() => setView("selectRide")}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── TRACKING SHEET ── */}
          {view === "tracking" && driver && (
            <div className="sheet sheetTall sheetTracking">
              <div className="sheetHandle" />

              {/* ETA pill */}
              <div className="etaPill">
                <FaBolt /> Driver arriving in <strong>{selectedRide.time} min</strong>
              </div>

              {/* Driver card */}
              <div className="driverCard">
                <div className="driverAvatarWrap">
                  <span className="driverAvatar">{driver.avatar}</span>
                  <span className="driverVehicleBadge">{driver.vehicleEmoji}</span>
                </div>
                <div className="driverDetails">
                  <p className="driverName">{driver.name}</p>
                  <div className="driverRatingRow">
                    <FaStar style={{color:"#f59e0b",fontSize:13}} />
                    <span className="driverRating">{driver.rating}</span>
                    <span className="driverTrips">({driver.trips} trips)</span>
                    <span className="driverVerified"><FaShieldAlt /> Verified</span>
                  </div>
                  <p className="driverVehicle">{driver.vehicleEmoji} {driver.vehicle} · <strong>{driver.plate}</strong></p>
                </div>
                <button className="callBtn"><FaPhone /></button>
              </div>

              {/* Route card */}
              <div className="trackRouteCard">
                <div className="trackRouteRow">
                  <span className="trackDot green" />
                  <div>
                    <p className="trackLabel">Pickup</p>
                    <p className="trackValue">Current Location</p>
                  </div>
                </div>
                <div className="trackRouteLine" />
                <div className="trackRouteRow">
                  <span className="trackDot red" />
                  <div>
                    <p className="trackLabel">Drop-off</p>
                    <p className="trackValue">{drop || dropInput}</p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="tripProgressWrap">
                <div className="tripProgressBar">
                  <div className="tripProgressFill" style={{ width: `${tripPct}%` }} />
                  <div className="tripProgressVehicle" style={{ left: `${tripPct}%` }}>
                    {selectedRide.icon}
                  </div>
                </div>
                <div className="tripProgressLabels">
                  <span>Pickup</span>
                  <span className="tripPct">{Math.round(tripPct)}%</span>
                  <span>Destination</span>
                </div>
              </div>

              {/* Bottom */}
              <div className="trackingBottom">
                <div className="fareCard">
                  <p className="fareLabel">Estimated Fare</p>
                  <p className="fareAmt">₹{discPrice}</p>
                  <p className="farePay">
                    {payMethod === "cash" ? "💵 Cash" : payMethod === "upi" ? "📱 UPI" : "👛 Wallet"}
                  </p>
                </div>
                {tripPct >= 80 ? (
                  <button className="endTripBtn" onClick={endTrip}>
                    <FaCheckCircle /> End Trip
                  </button>
                ) : (
                  <button className="cancelTripBtn" onClick={resetHome}>
                    <FaTimes /> Cancel Ride
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── RATE DRIVER SHEET ── */}
          {view === "rate" && driver && (
            <div className="sheet sheetRate">
              <div className="sheetHandle" />
              <div className="rateWrap">
                <div className="rateSuccessIcon"><FaCheckCircle /></div>
                <h3>You've reached your destination!</h3>
                <p className="rateSubtitle">How was your ride with <strong>{driver.name}</strong>?</p>
                <div className="rateDriverMini">
                  <span>{driver.avatar}</span>
                  <span>{driver.name}</span>
                  <span className="rateFareFinal">₹{discPrice} paid</span>
                </div>
                <div className="rateStars">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      className={`rateStar ${userRating >= n ? "rateStarActive" : ""}`}
                      onClick={() => setUserRating(n)}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <p className="rateLabel">
                    {["","😞 Poor","😐 Fair","🙂 Good","😊 Great","🤩 Excellent!"][userRating]}
                  </p>
                )}
                <button
                  className="rateDoneBtn"
                  onClick={resetHome}
                  disabled={userRating === 0}
                >
                  {userRating === 0 ? "Rate to continue" : "Submit & Done"}
                </button>
                <button className="rateSkipBtn" onClick={resetHome}>Skip</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
