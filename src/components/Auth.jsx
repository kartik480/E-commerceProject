import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaEye, FaEyeSlash, FaCheck,
  FaBolt, FaShoppingBag, FaCarSide, FaShieldAlt, FaUserShield
} from "react-icons/fa";
import "./Auth.css";

/* ── FLOATING LABEL INPUT ──────────────────────────── */

function Field({ label, type = "text", value, onChange, error, autoComplete }) {
  const [show, setShow]     = useState(false);
  const isPassword          = type === "password";
  const inputType           = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className={`field ${value ? "hasValue" : ""} ${error ? "hasError" : ""}`}>
      <input
        type={inputType}
        placeholder=" "
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={autoComplete}
      />
      <label>{label}</label>
      {isPassword && (
        <button type="button" className="eyeBtn" onClick={() => setShow(s => !s)}>
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
      {error && <p className="fieldError">{error}</p>}
    </div>
  );
}

/* ── VALIDATORS ────────────────────────────────────── */

function validateLogin({ email, password }) {
  const e = {};
  if (!email)                          e.email    = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) e.email  = "Enter a valid email";
  if (!password)                       e.password = "Password is required";
  else if (password.length < 6)        e.password = "Minimum 6 characters";
  return e;
}

function validateSignup({ name, email, password, confirm }) {
  const e = {};
  if (!name)                             e.name     = "Full name is required";
  if (!email)                            e.email    = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email))  e.email   = "Enter a valid email";
  if (!password)                         e.password = "Password is required";
  else if (password.length < 6)          e.password = "Minimum 6 characters";
  if (!confirm)                          e.confirm  = "Please confirm password";
  else if (confirm !== password)         e.confirm  = "Passwords don't match";
  return e;
}

const ADMIN_CREDENTIALS = { username: "admin", password: "Admin@123" };

function validateAdmin({ username, password }) {
  const e = {};
  if (!username)                         e.username = "Username is required";
  if (!password)                         e.password = "Password is required";
  else if (password.length < 6)          e.password = "Minimum 6 characters";
  return e;
}

/* ── PERKS shown on brand panel ────────────────────── */

const perks = [
  { icon: <FaBolt />,       text: "15-minute quick delivery" },
  { icon: <FaShoppingBag />, text: "Millions of products" },
  { icon: <FaCarSide />,    text: "Safe, reliable rides" },
  { icon: <FaShieldAlt />,  text: "100% secure payments" },
];

/* ── MAIN AUTH PAGE ────────────────────────────────── */

const TAB_ORDER = ["login", "signup", "admin"];

export default function Auth({ defaultTab = "login" }) {
  const navigate = useNavigate();
  const [tab, setTab]           = useState(defaultTab); // "login" | "signup" | "admin"
  const [sliding, setSliding]   = useState(false);
  const [direction, setDirection] = useState(""); // "toLeft" | "toRight"
  const [success, setSuccess]   = useState(false);

  /* login state */
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe]       = useState(false);
  const [loginErrors, setLoginErrors]     = useState({});

  /* signup state */
  const [name, setName]           = useState("");
  const [signupEmail, setSignupEmail]   = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirm, setConfirm]     = useState("");
  const [agreed, setAgreed]       = useState(false);
  const [signupErrors, setSignupErrors] = useState({});

  /* admin state */
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminErrors, setAdminErrors]     = useState({});

  function switchTab(next) {
    if (next === tab || sliding) return;
    const currentIdx = TAB_ORDER.indexOf(tab);
    const nextIdx    = TAB_ORDER.indexOf(next);
    setDirection(nextIdx > currentIdx ? "toLeft" : "toRight");
    setSliding(true);
    setTimeout(() => {
      setTab(next);
      setSliding(false);
      setDirection("");
    }, 320);
  }

  function handleLogin(e) {
    e.preventDefault();
    const errors = validateLogin({ email: loginEmail, password: loginPassword });
    if (Object.keys(errors).length) { setLoginErrors(errors); return; }
    setLoginErrors({});
    setSuccess(true);
    setTimeout(() => navigate("/"), 1400);
  }

  function handleSignup(e) {
    e.preventDefault();
    const errors = validateSignup({
      name, email: signupEmail, password: signupPassword, confirm
    });
    if (Object.keys(errors).length) { setSignupErrors(errors); return; }
    if (!agreed) { setSignupErrors({ agreed: "Please accept the terms" }); return; }
    setSignupErrors({});
    setSuccess(true);
    setTimeout(() => navigate("/"), 1400);
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    const errors = validateAdmin({ username: adminUsername, password: adminPassword });
    if (Object.keys(errors).length) { setAdminErrors(errors); return; }
    if (
      adminUsername !== ADMIN_CREDENTIALS.username ||
      adminPassword !== ADMIN_CREDENTIALS.password
    ) {
      setAdminErrors({ password: "Invalid admin credentials" });
      return;
    }
    setAdminErrors({});
    setSuccess(true);
    setTimeout(() => navigate("/admin-dashboard"), 1400);
  }

  return (
    <div className="authPage">

      {/* ── LEFT BRAND PANEL ── */}
      <div className="brandPanel">
        <button className="authBack" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Home
        </button>

        <div className="brandContent">
          <div className="brandLogo">
            <span className="brandLogoIcon">⚡</span>
            <span className="brandLogoText">Octadecent</span>
          </div>

          <h2 className="brandHeadline">
            Shop. Move.<br />Live the way<br />
            <span>you deserve.</span>
          </h2>

          <p className="brandSub">
            One platform. Endless possibilities.<br />
            Join 10M+ happy customers today.
          </p>

          <ul className="perkList">
            {perks.map((p, i) => (
              <li key={i} className="perkItem" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                <span className="perkIcon">{p.icon}</span>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* decorative circles */}
        <div className="decCircle dec1" />
        <div className="decCircle dec2" />
        <div className="decCircle dec3" />
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="formPanel">

        {/* SUCCESS OVERLAY */}
        {success && (
          <div className="successOverlay">
            <div className="successBadge">
              <FaCheck />
            </div>
            <p>
            {tab === "login" ? "Welcome back!" : tab === "signup" ? "Account created!" : "Admin access granted!"}
          </p>
            <span>Redirecting…</span>
          </div>
        )}

        <div className="formBox">
          {/* TABS */}
          <div className="authTabs">
            <button
              className={`authTab ${tab === "login" ? "tabActive" : ""}`}
              onClick={() => switchTab("login")}
            >
              Login
            </button>
            <button
              className={`authTab ${tab === "signup" ? "tabActive" : ""}`}
              onClick={() => switchTab("signup")}
            >
              Sign Up
            </button>
            <button
              className={`authTab ${tab === "admin" ? "tabActive tabActiveAdmin" : ""}`}
              onClick={() => switchTab("admin")}
            >
              Admin
            </button>
            <span
              className="tabSlider"
              style={{ transform: `translateX(${TAB_ORDER.indexOf(tab) * 100}%)` }}
            />
          </div>

          {/* FORM WRAPPER */}
          <div className={`formSlider ${sliding ? `slide-${direction}` : ""}`}>

            {/* ── LOGIN FORM ── */}
            {tab === "login" && (
              <form className="authForm" onSubmit={handleLogin} noValidate>
                <div className="formGreeting">
                  <h3>Welcome back 👋</h3>
                  <p>Sign in to continue to Octadecent</p>
                </div>

                <div className="formFields">
                  <Field
                    label="Email address"
                    type="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    error={loginErrors.email}
                    autoComplete="email"
                  />
                  <Field
                    label="Password"
                    type="password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    error={loginErrors.password}
                    autoComplete="current-password"
                  />
                </div>

                <div className="formRow">
                  <label className="checkLabel">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <span className="checkBox" />
                    Remember me
                  </label>
                  <button type="button" className="forgotBtn">Forgot password?</button>
                </div>

                <button type="submit" className="authSubmitBtn">
                  Sign In
                </button>

                <div className="orDivider"><span>or continue with</span></div>

                <div className="socialRow">
                  <button type="button" className="socialBtn">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" />
                    Google
                  </button>
                  <button type="button" className="socialBtn">
                    <img src="https://www.svgrepo.com/show/452213/apple.svg" alt="Apple" width="18" />
                    Apple
                  </button>
                </div>

                <p className="switchText">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => switchTab("signup")}>Sign up free</button>
                </p>
              </form>
            )}

            {/* ── SIGNUP FORM ── */}
            {tab === "signup" && (
              <form className="authForm" onSubmit={handleSignup} noValidate>
                <div className="formGreeting">
                  <h3>Create account ✨</h3>
                  <p>Join Octadecent — it's free forever</p>
                </div>

                <div className="formFields">
                  <Field
                    label="Full name"
                    value={name}
                    onChange={setName}
                    error={signupErrors.name}
                    autoComplete="name"
                  />
                  <Field
                    label="Email address"
                    type="email"
                    value={signupEmail}
                    onChange={setSignupEmail}
                    error={signupErrors.email}
                    autoComplete="email"
                  />
                  <Field
                    label="Password"
                    type="password"
                    value={signupPassword}
                    onChange={setSignupPassword}
                    error={signupErrors.password}
                    autoComplete="new-password"
                  />
                  <Field
                    label="Confirm password"
                    type="password"
                    value={confirm}
                    onChange={setConfirm}
                    error={signupErrors.confirm}
                    autoComplete="new-password"
                  />
                </div>

                {/* password strength */}
                {signupPassword && (
                  <PasswordStrength password={signupPassword} />
                )}

                <label className={`checkLabel agreeCheck ${signupErrors.agreed ? "checkError" : ""}`}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => { setAgreed(e.target.checked); setSignupErrors(er => ({ ...er, agreed: "" })); }}
                  />
                  <span className="checkBox" />
                  I agree to the{" "}
                  <button type="button" className="linkBtn">Terms</button>
                  {" "}&amp;{" "}
                  <button type="button" className="linkBtn">Privacy Policy</button>
                </label>
                {signupErrors.agreed && <p className="fieldError agreeErr">{signupErrors.agreed}</p>}

                <button type="submit" className="authSubmitBtn">
                  Create Account
                </button>

                <div className="orDivider"><span>or sign up with</span></div>

                <div className="socialRow">
                  <button type="button" className="socialBtn">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" />
                    Google
                  </button>
                  <button type="button" className="socialBtn">
                    <img src="https://www.svgrepo.com/show/452213/apple.svg" alt="Apple" width="18" />
                    Apple
                  </button>
                </div>

                <p className="switchText">
                  Already have an account?{" "}
                  <button type="button" onClick={() => switchTab("login")}>Sign in</button>
                </p>
              </form>
            )}

            {/* ── ADMIN LOGIN FORM ── */}
            {tab === "admin" && (
              <form className="authForm" onSubmit={handleAdminLogin} noValidate>
                <div className="formGreeting">
                  <div className="adminBadge">
                    <FaUserShield />
                    <span>Admin Portal</span>
                  </div>
                  <h3>Admin Sign In 🛡️</h3>
                  <p>Restricted access — authorised personnel only</p>
                </div>

                <div className="formFields">
                  <Field
                    label="Admin Username"
                    value={adminUsername}
                    onChange={setAdminUsername}
                    error={adminErrors.username}
                    autoComplete="username"
                  />
                  <Field
                    label="Admin Password"
                    type="password"
                    value={adminPassword}
                    onChange={setAdminPassword}
                    error={adminErrors.password}
                    autoComplete="current-password"
                  />
                </div>

                <p className="adminHint">
                  Demo credentials: <code>admin</code> / <code>Admin@123</code>
                </p>

                <button type="submit" className="authSubmitBtn adminSubmitBtn">
                  Access Admin Dashboard
                </button>

                <p className="switchText">
                  Not an admin?{" "}
                  <button type="button" onClick={() => switchTab("login")}>Back to Login</button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PASSWORD STRENGTH METER ───────────────────────── */

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase",     ok: /[A-Z]/.test(password) },
    { label: "Number",        ok: /[0-9]/.test(password) },
    { label: "Symbol",        ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score  = checks.filter(c => c.ok).length;
  const levels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#16a34a"];

  return (
    <div className="pwStrength">
      <div className="pwBars">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="pwBar"
            style={{ background: i <= score ? colors[score] : "#e5e7eb" }}
          />
        ))}
      </div>
      <div className="pwMeta">
        <div className="pwChecks">
          {checks.map((c, i) => (
            <span key={i} className={`pwCheck ${c.ok ? "pwOk" : ""}`}>
              {c.ok ? "✓" : "·"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className="pwLabel" style={{ color: colors[score] }}>
            {levels[score]}
          </span>
        )}
      </div>
    </div>
  );
}
