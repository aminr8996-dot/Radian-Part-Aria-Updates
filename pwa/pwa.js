let radianInstallPrompt=null;
const byId=id=>document.getElementById(id);
const LOGO_URL='logo.png?v=3406';
const APK_URL='https://raw.githubusercontent.com/aminr8996-dot/Radian-Part-Aria-Updates/main/Radian-Part-Aria.apk?download=1';

function installed(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function isAndroid(){return /Android/i.test(navigator.userAgent)}
function isChrome(){return /Chrome\//i.test(navigator.userAgent)&&!/;\s*wv\)/i.test(navigator.userAgent)&&!/\bwv\b/i.test(navigator.userAgent)&&!/Rubika/i.test(navigator.userAgent)}
function isInAppBrowser(){const u=navigator.userAgent;return isAndroid()&&((/;\s*wv\)/i.test(u))||/\bwv\b/i.test(u)||/Rubika/i.test(u))}
function wantsInstall(){try{return new URL(location.href).searchParams.get('install')==='1'}catch(e){return false}}
function installLabels(){['installPwa','installWelcome','drawerInstall'].forEach(id=>{const b=byId(id);if(!b)return;b.textContent=installed()?'برنامه نصب شده است':'نصب برنامه روی گوشی';b.disabled=installed()})}
function installTargetUrl(){const u=new URL(location.href);u.searchParams.set('install','1');u.hash='';return u}
function currentChromeIntent(){const u=installTargetUrl();const fallback=encodeURIComponent(u.href);return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url=${fallback};end`}
function openInChrome(){location.href=currentChromeIntent()}
function openApk(){location.href=APK_URL+'&v=3406'}
function closeInstallPanel(){byId('radianInstallPanel')?.classList.remove('open')}
function refreshLogoRefs(){document.querySelectorAll('img').forEach(img=>{const s=img.getAttribute('src')||'';if(s.includes('logo.png'))img.src=LOGO_URL})}

function showInstallPanel(){
  let p=byId('radianInstallPanel');
  if(!p){
    p=document.createElement('div');
    p.id='radianInstallPanel';
    p.className='chrome-prompt';
    p.innerHTML=`<div class="chrome-card"><img src="${LOGO_URL}" alt="لوگوی رادیان"><h2>نصب رادیان روی گوشی</h2><p id="installPanelText"></p><button id="installPanelMain" class="chrome-open">نصب برنامه</button><button id="installPanelAlt" class="chrome-alt">راه دوم نصب</button><button id="installPanelClose" class="chrome-stay">بازگشت</button></div>`;
    document.body.appendChild(p);
    byId('installPanelClose').onclick=closeInstallPanel;
  }
  const txt=byId('installPanelText');
  const main=byId('installPanelMain');
  const alt=byId('installPanelAlt');
  main.disabled=false; alt.disabled=false; alt.style.display='block';

  if(installed()){
    txt.innerHTML='برنامه رادیان روی این گوشی نصب شده است.';
    main.textContent='برنامه نصب شده است'; main.disabled=true; main.onclick=null;
    alt.style.display='none';
  }else if(radianInstallPrompt){
    txt.innerHTML='نصب آماده است. روی دکمه قرمز بزنید تا پنجره نصب اندروید باز شود.';
    main.textContent='نصب برنامه روی گوشی'; main.onclick=doNativeInstall;
    alt.textContent='نصب مستقیم نسخه اندروید'; alt.onclick=openApk;
  }else if(isAndroid()&&!isChrome()){
    txt.innerHTML='این صفحه داخل مرورگر داخلی باز شده و نصب PWA در آن فعال نیست. می‌توانید در Chrome ادامه دهید یا نسخه اندروید را مستقیم نصب کنید.';
    main.textContent='باز کردن در Chrome و ادامه نصب'; main.onclick=openInChrome;
    alt.textContent='نصب مستقیم برنامه'; alt.onclick=openApk;
  }else{
    txt.innerHTML='کلید نصب خودکار PWA در این پنجره مرورگر فعال نشده است. برای اینکه اینجا متوقف نشوید، دکمه قرمز زیر نسخه اندروید را مستقیم دانلود و نصب می‌کند. برای نصب بدون APK هم می‌توانید از منوی سه‌نقطه Chrome گزینه <b>Install app</b> یا <b>Add to Home screen</b> را انتخاب کنید.';
    main.textContent='نصب مستقیم برنامه'; main.onclick=openApk;
    alt.textContent='باز کردن دوباره در Chrome'; alt.onclick=openInChrome;
  }
  p.classList.add('open');
}

async function doNativeInstall(){
  if(installed()){installLabels();closeInstallPanel();return}
  if(!radianInstallPrompt){showInstallPanel();return}
  const prompt=radianInstallPrompt;
  radianInstallPrompt=null;
  try{
    prompt.prompt();
    const choice=await prompt.userChoice;
    if(choice&&choice.outcome==='accepted')closeInstallPanel();
  }catch(e){}
  installLabels();
}

async function installRadian(){
  if(installed()){installLabels();return}
  if(radianInstallPrompt){await doNativeInstall();return}
  showInstallPanel();
}

function welcome(){document.querySelectorAll('.overlay.open').forEach(x=>x.classList.remove('open'));const w=byId('welcomeScreen');if(w)w.classList.remove('hidden');document.body.style.overflow='';scrollTo(0,0)}

function addRuntimeStyles(){
  const s=document.createElement('style');
  s.textContent=`
  .pwa-install-welcome{display:block!important;width:100%!important;min-height:56px!important;background:#b80f16!important;color:#fff!important;border:0!important;border-radius:15px!important;font-size:17px!important;font-weight:900!important;margin-top:10px!important;box-shadow:0 8px 20px rgba(184,15,22,.18)!important}
  .welcome-logo{display:block!important;width:min(64vw,245px)!important;height:auto!important;max-height:245px!important;object-fit:contain!important;margin-left:auto!important;margin-right:auto!important}
  .brand-logo{display:block!important;object-fit:contain!important}
  .product{position:relative!important;overflow:hidden!important}.product::before{content:""!important;position:absolute!important;inset:2px 20% 2px 3px!important;background:url('${LOGO_URL}') 22% center/60% no-repeat!important;opacity:.075!important;filter:grayscale(100%)!important;pointer-events:none!important}.product>*{position:relative!important;z-index:1!important}
  .radian-menu-btn{border:1px solid #ead3d5;background:#fff7f7;color:#8f1118;border-radius:9px;min-height:36px;padding:5px 10px;font-size:20px;font-weight:900;flex:0 0 46px}.radian-drawer-backdrop{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.45);display:none}.radian-drawer-backdrop.open{display:block}.radian-drawer{position:absolute;top:0;right:0;width:min(86vw,340px);height:100%;background:#fff;box-shadow:-8px 0 28px rgba(0,0,0,.18);padding:18px;overflow:auto}.radian-drawer-head{text-align:center;border-bottom:1px solid #eee;padding-bottom:14px;margin-bottom:12px}.radian-drawer-head img{width:130px;height:130px;object-fit:contain}.radian-drawer-head b{display:block;font-size:18px;margin-top:6px}.radian-menu-item{width:100%;min-height:48px;margin:6px 0;border:1px solid #e4e7ec;background:#fff;border-radius:12px;text-align:right;padding:8px 12px;font-weight:900;color:#344054}.radian-menu-item.primary{background:#b80f16;color:#fff;border-color:#b80f16}.radian-about{font-size:12px;line-height:1.9;color:#667085;background:#f8fafc;border-radius:12px;padding:12px;margin-top:10px;text-align:right}
  .chrome-prompt{position:fixed;inset:0;z-index:900;background:#fff;display:none;align-items:center;justify-content:center;padding:22px}.chrome-prompt.open{display:flex}.chrome-card{width:min(100%,420px);text-align:center}.chrome-card img{width:180px;height:180px;object-fit:contain;margin:0 auto 10px;display:block}.chrome-card h2{font-size:21px;margin:6px 0}.chrome-card p{color:#667085;font-size:13px;line-height:1.9}.chrome-open{width:100%;min-height:58px;border:0;border-radius:15px;background:#b80f16;color:#fff;font-size:16px;font-weight:900;margin-top:14px}.chrome-open:disabled{opacity:.55}.chrome-alt{width:100%;min-height:52px;border:1px solid #b80f16;border-radius:13px;background:#fff7f7;color:#8f1118;font-weight:900;margin-top:9px}.chrome-stay{width:100%;min-height:48px;border:1px solid #d0d5dd;border-radius:13px;background:#fff;color:#344054;font-weight:800;margin-top:8px}`;
  document.head.appendChild(s);
}

function buildMenu(){
  const tools=document.querySelector('.quick-tools');
  if(!tools||byId('radianMenuButton'))return;
  const oldInstall=byId('installPwa'),oldExit=byId('goWelcome');
  if(oldInstall)oldInstall.style.display='none';
  if(oldExit)oldExit.style.display='none';
  const btn=document.createElement('button');
  btn.id='radianMenuButton';btn.className='radian-menu-btn';btn.type='button';btn.setAttribute('aria-label','منوی برنامه');btn.textContent='☰';tools.prepend(btn);
  const back=document.createElement('div');
  back.className='radian-drawer-backdrop';
  back.innerHTML=`<aside class="radian-drawer"><div class="radian-drawer-head"><img src="${LOGO_URL}" alt="لوگوی رادیان"><b>رادیان پارت آریا</b><small>لیست قیمت و ثبت سفارش مشتری</small></div><button class="radian-menu-item primary" id="drawerInstall">نصب برنامه روی گوشی</button>${isAndroid()?'<button class="radian-menu-item" id="drawerChrome">باز کردن در Chrome</button>':''}<button class="radian-menu-item" id="drawerAbout">درباره ما</button><button class="radian-menu-item" id="drawerHome">صفحه اول رادیان</button><button class="radian-menu-item" id="drawerExit">خروج</button><div class="radian-about" id="aboutBox" hidden><b>درباره رادیان پارت آریا</b><br>سامانه مشاهده لیست قیمت و ثبت سفارش مشتریان رادیان پارت آریا.<br>نسخه برنامه: 3.4.0</div></aside>`;
  document.body.appendChild(back);
  const close=()=>back.classList.remove('open');
  btn.onclick=()=>back.classList.add('open');
  back.addEventListener('click',e=>{if(e.target===back)close()});
  byId('drawerInstall').onclick=()=>{close();setTimeout(installRadian,80)};
  byId('drawerChrome')&&(byId('drawerChrome').onclick=()=>{close();openInChrome()});
  byId('drawerAbout').onclick=()=>{const a=byId('aboutBox');a.hidden=!a.hidden};
  byId('drawerHome').onclick=()=>{close();welcome()};
  byId('drawerExit').onclick=()=>{close();welcome()};
}

function maybePromptChrome(){
  if(installed()||!isInAppBrowser())return;
  let p=byId('chromePrompt');if(p)return;
  p=document.createElement('div');p.className='chrome-prompt open';p.id='chromePrompt';
  p.innerHTML=`<div class="chrome-card"><img src="${LOGO_URL}" alt="لوگوی رادیان"><h2>رادیان پارت آریا</h2><p>برای نصب راحت‌تر، می‌توانید در Chrome ادامه دهید. اگر Chrome نصب PWA را نشان نداد، گزینه نصب مستقیم هم در دسترس است.</p><button id="openChromeNow" class="chrome-open">باز کردن در Chrome</button><button id="directApkNow" class="chrome-alt">نصب مستقیم برنامه</button><button id="stayHere" class="chrome-stay">ادامه در همین مرورگر</button></div>`;
  document.body.appendChild(p);
  byId('openChromeNow').onclick=openInChrome;
  byId('directApkNow').onclick=openApk;
  byId('stayHere').onclick=()=>p.remove();
}

addEventListener('beforeinstallprompt',e=>{e.preventDefault();radianInstallPrompt=e;installLabels();if(wantsInstall())setTimeout(showInstallPanel,120)});
addEventListener('appinstalled',()=>{radianInstallPrompt=null;installLabels();closeInstallPanel()});
byId('installPwa')?.addEventListener('click',installRadian);
byId('installWelcome')?.addEventListener('click',installRadian);
byId('goWelcome')?.addEventListener('click',welcome);
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js?v=3406').then(r=>r.update()).catch(()=>{}));
addRuntimeStyles();refreshLogoRefs();buildMenu();installLabels();setTimeout(maybePromptChrome,250);if(wantsInstall()&&!installed())setTimeout(showInstallPanel,650);
