/* =========================================================================
   MFG Advisory — Admin Panel styling
   Deliberately separate from assets/css/style.css so the public site's
   design is never touched by anything in here.
   ========================================================================= */
:root{
  --a-navy:#0f1f3d;
  --a-copper:#b5843a;
  --a-copper-light:#d4a45c;
  --a-bg:#f4f5f7;
  --a-panel:#ffffff;
  --a-border:#dde1e7;
  --a-text:#1c2530;
  --a-text-mid:#5b6472;
  --a-success:#2e7d4f;
  --a-danger:#b3402f;
  --font: 'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif;
}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:var(--font);background:var(--a-bg);color:var(--a-text);font-size:14px;line-height:1.5}
a{color:inherit}
h1,h2,h3,h4{font-family:var(--font);margin:0}
button{font-family:inherit;cursor:pointer}

/* ---- Login gate ---- */
.login-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--a-navy)}
.login-box{background:#fff;padding:40px 36px;border-radius:8px;width:100%;max-width:360px;box-shadow:0 20px 60px rgba(0,0,0,.35);text-align:center}
.login-box h1{font-size:1.3rem;margin-bottom:6px;color:var(--a-navy)}
.login-box p{color:var(--a-text-mid);font-size:.85rem;margin-bottom:22px}
.login-box input{width:100%;padding:12px 14px;border:1px solid var(--a-border);border-radius:6px;font-size:1rem;margin-bottom:14px;text-align:center;letter-spacing:.1em}
.login-box button{width:100%;padding:12px;border:none;border-radius:6px;background:var(--a-navy);color:#fff;font-weight:600;font-size:.9rem}
.login-box button:hover{background:var(--a-copper)}
.login-error{color:var(--a-danger);font-size:.8rem;margin-top:10px;min-height:1em}
.login-hint{margin-top:18px;font-size:.72rem;color:#9aa3b0;line-height:1.5}

/* ---- App shell ---- */
.admin-app{display:none}
.admin-app.visible{display:block}
.admin-header{background:var(--a-navy);color:#fff;padding:16px 28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;position:sticky;top:0;z-index:20}
.admin-header h1{font-size:1.05rem;font-weight:600}
.admin-header .backend-pill{font-size:.7rem;padding:3px 10px;border-radius:20px;background:rgba(255,255,255,.12);color:var(--a-copper-light);margin-left:10px}
.admin-header-actions{display:flex;gap:10px;flex-wrap:wrap}
.admin-header-actions a{font-size:.8rem;color:#c7cedb;text-decoration:none;align-self:center}
.admin-header-actions a:hover{color:var(--a-copper-light)}

.btn{border:none;border-radius:5px;padding:9px 16px;font-size:.82rem;font-weight:600;cursor:pointer}
.btn-primary{background:var(--a-copper);color:#20130a}
.btn-primary:hover{background:var(--a-copper-light)}
.btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.3);color:#fff}
.btn-ghost:hover{border-color:var(--a-copper-light);color:var(--a-copper-light)}
.btn-outline{background:#fff;border:1px solid var(--a-border);color:var(--a-text)}
.btn-outline:hover{border-color:var(--a-copper)}
.btn-danger{background:#fff;border:1px solid var(--a-danger);color:var(--a-danger)}
.btn-danger:hover{background:var(--a-danger);color:#fff}
.btn-sm{padding:6px 12px;font-size:.75rem}

.admin-layout{display:flex;min-height:calc(100vh - 64px)}
.admin-nav{width:210px;flex:none;background:#fff;border-right:1px solid var(--a-border);padding:18px 0;position:sticky;top:64px;align-self:flex-start;height:calc(100vh - 64px);overflow-y:auto}
.admin-nav button{display:block;width:100%;text-align:left;padding:10px 22px;background:none;border:none;font-size:.85rem;color:var(--a-text-mid);border-left:3px solid transparent}
.admin-nav button:hover{background:#f8f6f2;color:var(--a-navy)}
.admin-nav button.active{color:var(--a-navy);font-weight:600;border-left-color:var(--a-copper);background:#f8f6f2}

.admin-main{flex:1;padding:28px 36px;max-width:920px}
.admin-section{display:none}
.admin-section.active{display:block}
.admin-section h2{font-size:1.3rem;color:var(--a-navy);margin-bottom:4px}
.admin-section .section-sub{color:var(--a-text-mid);font-size:.85rem;margin-bottom:24px}

.field-card{background:var(--a-panel);border:1px solid var(--a-border);border-radius:8px;padding:20px 22px;margin-bottom:16px}
.field-card label{display:block;font-size:.75rem;font-weight:600;color:var(--a-text-mid);text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px}
.field-card input[type="text"],
.field-card input[type="email"],
.field-card input[type="url"],
.field-card textarea{
  width:100%;padding:10px 12px;border:1px solid var(--a-border);border-radius:5px;font-size:.9rem;font-family:inherit;color:var(--a-text);background:#fff;
}
.field-card textarea{min-height:80px;resize:vertical}
.field-card .field-note{font-size:.72rem;color:#8b93a0;margin-top:6px}
.field-key{font-size:.68rem;color:#b7bdc7;font-family:monospace;float:right;text-transform:none;font-weight:400}

.img-field{display:flex;align-items:center;gap:18px}
.img-field img{width:84px;height:84px;object-fit:cover;border-radius:6px;border:1px solid var(--a-border);background:#eee}
.img-field .img-controls{flex:1}
.img-field input[type="file"]{font-size:.78rem}

.save-bar{position:sticky;bottom:0;background:#fff;border-top:1px solid var(--a-border);padding:14px 22px;display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:20px;border-radius:8px 8px 0 0;box-shadow:0 -4px 16px rgba(0,0,0,.05)}
.save-status{font-size:.78rem;color:var(--a-success);min-height:1em}

.testi-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:10px}
.testi-row textarea{grid-column:1/-1}
.testi-card{border:1px solid var(--a-border);border-radius:8px;padding:16px;margin-bottom:14px;position:relative}
.testi-remove{position:absolute;top:10px;right:10px}

.banner{background:#fdf3e3;border:1px solid #ecd6a6;color:#7a5b1e;padding:12px 16px;border-radius:6px;font-size:.82rem;margin-bottom:20px;line-height:1.5}
.banner strong{color:#5c4212}

.loading-row{color:var(--a-text-mid);font-size:.85rem;padding:20px 0}

@media(max-width:800px){
  .admin-layout{flex-direction:column}
  .admin-nav{width:100%;height:auto;position:static;display:flex;overflow-x:auto;padding:8px}
  .admin-nav button{white-space:nowrap;border-left:none;border-bottom:3px solid transparent}
  .admin-nav button.active{border-left:none;border-bottom-color:var(--a-copper)}
  .admin-main{padding:20px}
}
