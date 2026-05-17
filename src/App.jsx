import { useState } from "react";

const GOALS = [
  { id: "weight_loss", label: "Weight Loss", icon: "⚖️", desc: "Metabolism-boosting blends", color: "#4a7c14" },
  { id: "anti_aging", label: "Anti-Aging", icon: "✨", desc: "Antioxidant-rich elixirs", color: "#c47c00" },
  { id: "skin_health", label: "Skin Glow", icon: "🌸", desc: "Radiance from within", color: "#b5427a" },
  { id: "liver_cleanse", label: "Liver Cleanse", icon: "🌿", desc: "Detox & renewal", color: "#1a8a60" },
  { id: "energy_boost", label: "Energy Boost", icon: "⚡", desc: "Natural vitality surge", color: "#2563a8" },
  { id: "immunity", label: "Immunity", icon: "🛡️", desc: "Fortify your defenses", color: "#6d44c4" },
  { id: "gut_health", label: "Gut Health", icon: "🌱", desc: "Digestive harmony", color: "#b84f0a" },
  { id: "stress_relief", label: "Stress Relief", icon: "🧘", desc: "Calm & restore", color: "#9a2eb5" },
];

const SCREENS = { PROFILE: "profile", GOALS: "goals", RECIPE: "recipe" };

const C = {
  bg: "#e8f5e2",
  surface: "#f4faf0",
  surfaceAlt: "#dff0d8",
  border: "#b8d9a8",
  borderLight: "#cce8bc",
  accent: "#3a7d14",
  accentLight: "#5aaa28",
  textDark: "#1a3a0a",
  textMid: "#3a6020",
  textMuted: "#6a8f50",
  textFaint: "#8aaa70",
  white: "#ffffff",
};

function LoadingJuice() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", padding: "40px 0" }}>
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${C.accent}, #34d399, #60a5fa, #f59e0b, ${C.accent})`,
          animation: "spin 1.2s linear infinite",
        }} />
        <div style={{ position: "absolute", inset: "8px", borderRadius: "50%", background: C.bg }} />
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🥤</span>
      </div>
      <p style={{ color: C.accent, fontFamily: "'DM Serif Display', serif", fontSize: "20px", letterSpacing: "0.05em" }}>
        Crafting your recipe…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.PROFILE);
  const [profile, setProfile] = useState({ name: "", age: "", email: "" });
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleGoal = (id) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const generateRecipe = async () => {
    setLoading(true);
    setError("");
    setRecipe(null);
    setScreen(SCREENS.RECIPE);

    const goalLabels = selectedGoals.map(id => GOALS.find(g => g.id === id)?.label).join(", ");

    if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
      setError("Missing Anthropic API key. Add VITE_ANTHROPIC_API_KEY to your .env file.");
      setLoading(false);
      return;
    }

    try {
       const response = await fetch("http://localhost:3001/api/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a master juice therapist and nutritionist. Generate a detailed, personalized juicing recipe. 
Return ONLY valid JSON (no markdown, no backticks, no explanation) in this exact structure:
{
  "name": "Creative recipe name",
  "tagline": "Short poetic tagline",
  "ingredients": [
    { "item": "ingredient name", "amount": "quantity", "benefit": "why it's included" }
  ],
  "instructions": ["step 1", "step 2", "step 3"],
  "nutritionHighlights": ["highlight 1", "highlight 2", "highlight 3"],
  "bestTimeTodrink": "when to drink this juice",
  "tip": "one pro tip for maximum benefit",
  "color": "describe the juice color (e.g. vibrant emerald green)"
}`,
          messages: [{
            role: "user",
            content: `Create a personalized juice recipe for ${profile.name}, age ${profile.age || "unknown"}.
Goals: ${goalLabels}.
Make it delicious, achievable, and deeply beneficial for these specific goals. Be creative with the name and make it feel special.`
          }]
        })
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setRecipe(parsed);
    } catch (err) {
      setError("Something went wrong brewing your recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'DM Sans', sans-serif",
      color: C.textDark,
      overflowX: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; }
        input { outline: none; }
        input::placeholder { color: ${C.textFaint}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(40,80,20,0.15); }
        .btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }
      `}</style>

      <header style={{
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderBottom: `1px solid ${C.border}`,
        background: C.white,
        boxShadow: "0 1px 8px rgba(40,80,20,0.08)",
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.accent}, #34d399)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
        }}>🥤</div>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "22px",
          background: `linear-gradient(90deg, ${C.accent}, #2aaa70)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.02em",
        }}>JuicerBuddy</span>
        {screen !== SCREENS.PROFILE && (
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            {[SCREENS.PROFILE, SCREENS.GOALS, SCREENS.RECIPE].map((s) => (
              <div key={s} style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: screen === s ? C.accent : C.border,
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        )}
      </header>

      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px" }}>

        {screen === SCREENS.PROFILE && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <div style={{ marginBottom: "40px" }}>
              <p style={{ color: C.accent, fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
                Welcome to JuicerBuddy
              </p>
              <h1 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(32px, 6vw, 48px)",
                lineHeight: 1.1,
                marginBottom: "16px",
                color: C.textDark,
              }}>
                Your personal<br />
                <em style={{ color: C.accent }}>juice therapist</em>
              </h1>
              <p style={{ color: C.textMid, fontSize: "16px", lineHeight: 1.6 }}>
                Tell us a little about yourself, then choose what you want to achieve. We'll craft a bespoke recipe just for you.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { key: "name", label: "Your Name", placeholder: "e.g. Jordan", icon: "👤" },
                { key: "age", label: "Age", placeholder: "e.g. 32", icon: "🎂" },
                { key: "email", label: "Email (optional)", placeholder: "you@example.com", icon: "✉️" },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", fontSize: "13px", color: C.textMuted, marginBottom: "8px", letterSpacing: "0.05em" }}>
                    {field.label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>
                      {field.icon}
                    </span>
                    <input
                      type={field.key === "age" ? "number" : field.key === "email" ? "email" : "text"}
                      value={profile[field.key]}
                      onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%",
                        padding: "14px 16px 14px 46px",
                        background: C.white,
                        border: `1px solid ${C.border}`,
                        borderRadius: "12px",
                        color: C.textDark,
                        fontSize: "15px",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}22`; }}
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={() => { if (profile.name.trim()) setScreen(SCREENS.GOALS); }}
              disabled={!profile.name.trim()}
              style={{
                marginTop: "32px",
                width: "100%",
                padding: "16px",
                background: profile.name.trim() ? `linear-gradient(135deg, ${C.accent}, #2aaa70)` : C.borderLight,
                border: "none",
                borderRadius: "14px",
                color: profile.name.trim() ? C.white : C.textFaint,
                fontSize: "16px",
                fontWeight: "600",
                cursor: profile.name.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {screen === SCREENS.GOALS && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <button
              onClick={() => setScreen(SCREENS.PROFILE)}
              style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: "0 0 24px", fontSize: "14px" }}
            >
              ← Back
            </button>
            <div style={{ marginBottom: "32px" }}>
              <p style={{ color: C.accent, fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
                Step 2 of 2
              </p>
              <h1 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(28px, 5vw, 40px)",
                lineHeight: 1.15,
                marginBottom: "12px",
                color: C.textDark,
              }}>
                What are you<br />juicing <em style={{ color: C.accent }}>towards?</em>
              </h1>
              <p style={{ color: C.textMid, fontSize: "14px" }}>Select one or more goals. We'll blend them into your recipe.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
              {GOALS.map((goal, i) => {
                const active = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    className="card-hover"
                    onClick={() => toggleGoal(goal.id)}
                    style={{
                      padding: "20px 16px",
                      background: active ? `${goal.color}15` : C.white,
                      border: `1.5px solid ${active ? goal.color : C.border}`,
                      borderRadius: "16px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                      animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {active && (
                      <div style={{
                        position: "absolute", top: "10px", right: "10px",
                        width: "18px", height: "18px", borderRadius: "50%",
                        background: goal.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "10px", color: C.white, fontWeight: "700",
                      }}>✓</div>
                    )}
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{goal.icon}</div>
                    <div style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "16px",
                      color: active ? goal.color : C.textDark,
                      marginBottom: "4px",
                    }}>{goal.label}</div>
                    <div style={{ fontSize: "12px", color: C.textMuted, lineHeight: 1.4 }}>{goal.desc}</div>
                  </button>
                );
              })}
            </div>

            {selectedGoals.length > 0 && (
              <div style={{ marginBottom: "16px", padding: "12px 16px", background: C.white, borderRadius: "10px", border: `1px solid ${C.border}` }}>
                <p style={{ fontSize: "13px", color: C.textMuted, margin: 0 }}>
                  <span style={{ color: C.accent }}>{selectedGoals.length} goal{selectedGoals.length > 1 ? "s" : ""}</span> selected · {selectedGoals.map(id => GOALS.find(g => g.id === id)?.label).join(", ")}
                </p>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={generateRecipe}
              disabled={selectedGoals.length === 0}
              style={{
                width: "100%",
                padding: "16px",
                background: selectedGoals.length > 0 ? `linear-gradient(135deg, ${C.accent}, #2aaa70)` : C.borderLight,
                border: "none",
                borderRadius: "14px",
                color: selectedGoals.length > 0 ? C.white : C.textFaint,
                fontSize: "16px",
                fontWeight: "600",
                cursor: selectedGoals.length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Generate My Recipe ✨
            </button>
          </div>
        )}

        {screen === SCREENS.RECIPE && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <button
              onClick={() => setScreen(SCREENS.GOALS)}
              style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: "0 0 24px", fontSize: "14px" }}
            >
              ← Back to Goals
            </button>

            {loading && <LoadingJuice />}

            {error && (
              <div style={{ padding: "24px", background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: "16px", color: "#b91c1c", textAlign: "center" }}>
                {error}
                <br />
                <button onClick={generateRecipe} style={{ marginTop: "12px", background: "none", border: "1px solid #b91c1c", color: "#b91c1c", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>
                  Try Again
                </button>
              </div>
            )}

            {recipe && !loading && (
              <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
                <div style={{
                  padding: "32px",
                  background: `linear-gradient(145deg, ${C.white}, ${C.surface})`,
                  borderRadius: "20px",
                  border: `1px solid ${C.border}`,
                  marginBottom: "16px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(40,80,20,0.1)",
                }}>
                  <div style={{
                    position: "absolute", top: "-30px", right: "-30px",
                    width: "120px", height: "120px", borderRadius: "50%",
                    background: `radial-gradient(circle, ${C.accent}18, transparent)`,
                  }} />
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🥤</div>
                  <h2 style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(24px, 5vw, 34px)",
                    color: C.accent,
                    marginBottom: "8px",
                    lineHeight: 1.2,
                  }}>{recipe.name}</h2>
                  <p style={{ color: C.textMuted, fontSize: "15px", fontStyle: "italic", marginBottom: "16px" }}>{recipe.tagline}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedGoals.map(id => {
                      const g = GOALS.find(g => g.id === id);
                      return (
                        <span key={id} style={{
                          padding: "4px 12px", borderRadius: "20px",
                          background: `${g.color}15`, border: `1px solid ${g.color}50`,
                          color: g.color, fontSize: "12px", fontWeight: "500",
                        }}>{g.icon} {g.label}</span>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: "16px", padding: "24px", background: C.white, borderRadius: "16px", border: `1px solid ${C.border}` }}>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "20px", color: C.textDark, marginBottom: "20px" }}>
                    🧺 Ingredients
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {recipe.ingredients?.map((ing, i) => (
                      <div key={i} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                        paddingBottom: "12px",
                        borderBottom: i < recipe.ingredients.length - 1 ? `1px solid ${C.borderLight}` : "none",
                        animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
                      }}>
                        <div>
                          <span style={{ color: C.textDark, fontWeight: "500", fontSize: "15px" }}>{ing.item}</span>
                          <br />
                          <span style={{ color: C.textFaint, fontSize: "13px" }}>{ing.benefit}</span>
                        </div>
                        <span style={{
                          color: C.accent, fontWeight: "600", fontSize: "14px",
                          background: `${C.accent}15`, padding: "4px 10px", borderRadius: "8px",
                          whiteSpace: "nowrap", marginLeft: "12px",
                        }}>{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "16px", padding: "24px", background: C.white, borderRadius: "16px", border: `1px solid ${C.border}` }}>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "20px", color: C.textDark, marginBottom: "20px" }}>
                    🔧 Method
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {recipe.instructions?.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                        <span style={{
                          minWidth: "28px", height: "28px", borderRadius: "50%",
                          background: `linear-gradient(135deg, ${C.accent}, #2aaa70)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: C.white, fontWeight: "700", fontSize: "13px",
                        }}>{i + 1}</span>
                        <p style={{ color: C.textMid, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ padding: "20px", background: C.white, borderRadius: "16px", border: `1px solid ${C.border}` }}>
                    <h4 style={{ fontSize: "13px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                      🕐 Best Time
                    </h4>
                    <p style={{ color: C.textDark, fontSize: "14px", lineHeight: 1.5, margin: 0 }}>{recipe.bestTimeTodrink}</p>
                  </div>
                  <div style={{ padding: "20px", background: C.white, borderRadius: "16px", border: `1px solid ${C.border}` }}>
                    <h4 style={{ fontSize: "13px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                      💡 Pro Tip
                    </h4>
                    <p style={{ color: C.textDark, fontSize: "14px", lineHeight: 1.5, margin: 0 }}>{recipe.tip}</p>
                  </div>
                </div>

                <div style={{ marginBottom: "24px", padding: "20px", background: C.white, borderRadius: "16px", border: `1px solid ${C.border}` }}>
                  <h4 style={{ fontSize: "13px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>
                    ⚡ Nutrition Highlights
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {recipe.nutritionHighlights?.map((h, i) => (
                      <span key={i} style={{
                        padding: "6px 14px", borderRadius: "20px",
                        background: `${C.accent}12`, border: `1px solid ${C.accent}30`,
                        color: C.accent, fontSize: "13px",
                      }}>{h}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    className="btn-primary"
                    onClick={generateRecipe}
                    style={{
                      flex: 1, padding: "14px",
                      background: `linear-gradient(135deg, ${C.accent}, #2aaa70)`,
                      border: "none", borderRadius: "12px",
                      color: C.white, fontWeight: "600", fontSize: "15px",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    🔄 New Recipe
                  </button>
                  <button
                    onClick={() => setScreen(SCREENS.GOALS)}
                    style={{
                      flex: 1, padding: "14px",
                      background: "transparent",
                      border: `1px solid ${C.border}`, borderRadius: "12px",
                      color: C.textMuted, fontWeight: "500", fontSize: "15px",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    Change Goals
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
