(function(){
  const TRUE_INSTALL_FLAG='radian_true_pwa_installed_v2';
  const standaloneNow=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const trueInstalled=()=>{try{return localStorage.getItem(TRUE_INSTALL_FLAG)==='1'}catch(e){return false}};

  // A Chrome home-screen shortcut is NOT treated as a real installed PWA.
  try{installed=trueInstalled}catch(e){}

  function fixedInstallLabels(){
    const isTrue=trueInstalled();
    const isShortcut=standaloneNow()&&!isTrue;
    ['installPwa','installWelcome','drawerInstall'].forEach(id=>{
      const b=document.getElementById(id); if(!b)return;
      if(isTrue){b.textContent='برنامه نصب شده است';b.disabled=true;}
      else if(isShortcut){b.textContent='نصب کامل برنامه';b.disabled=false;}
      else{b.textContent='نصب برنامه روی گوشی';b.disabled=false;}
    });
  }

  function fixedInstallPanel(){
    let p=document.getElementById('radianInstallPanel');
    if(!p){
      p=document.createElement('div');
      p.id='radianInstallPanel';
      p.className='chrome-prompt';
      p.innerHTML=`<div class="chrome-card"><img src="logo.png?v=3407" alt="لوگوی رادیان"><h2>نصب رادیان روی گوشی</h2><p id="installPanelText"></p><button id="installPanelMain" class="chrome-open">نصب برنامه</button><button id="installPanelAlt" class="chrome-alt">راه دوم</button><button id="installPanelClose" class="chrome-stay">بازگشت</button></div>`;
      document.body.appendChild(p);
      document.getElementById('installPanelClose').onclick=()=>p.classList.remove('open');
    }
    const txt=document.getElementById('installPanelText');
    const main=document.getElementById('installPanelMain');
    const alt=document.getElementById('installPanelAlt');
    main.disabled=false;alt.disabled=false;alt.style.display='block';

    if(trueInstalled()){
      txt.innerHTML='نسخه PWA رادیان واقعاً روی این گوشی نصب شده است.';
      main.textContent='برنامه نصب شده است';main.disabled=true;main.onclick=null;alt.style.display='none';
    }else if(standaloneNow()){
      txt.innerHTML='<b>این فقط میانبر Chrome است، نه نصب واقعی برنامه.</b><br>برای داشتن آیکن مستقل رادیان، گزینه نصب واقعی زیر را بزنید.';
      main.textContent='نصب واقعی برنامه اندروید';main.onclick=()=>openApk();
      alt.textContent='باز کردن در Chrome برای نصب PWA';alt.onclick=()=>openInChrome();
    }else if(typeof radianInstallPrompt!=='undefined'&&radianInstallPrompt){
      txt.innerHTML='نصب PWA آماده است. دکمه قرمز را بزنید تا پنجره نصب واقعی Chrome باز شود.';
      main.textContent='نصب رادیان';main.onclick=()=>doNativeInstall();
      alt.textContent='نصب نسخه اندروید (APK)';alt.onclick=()=>openApk();
    }else if(typeof isAndroid==='function'&&isAndroid()&&typeof isChrome==='function'&&!isChrome()){
      txt.innerHTML='این صفحه داخل مرورگر داخلی باز شده است. برای نصب PWA باید وارد Chrome کامل شوید؛ یا می‌توانید نسخه اندروید را مستقیم نصب کنید.';
      main.textContent='باز کردن در Chrome';main.onclick=()=>openInChrome();
      alt.textContent='نصب واقعی برنامه اندروید';alt.onclick=()=>openApk();
    }else{
      txt.innerHTML='Chrome در این لحظه دکمه نصب PWA را ارائه نکرده است. <b>«افزودن به صفحه اصلی» نصب محسوب نمی‌شود و فقط میانبر Chrome می‌سازد.</b><br>برای آیکن مستقل برنامه، از نصب واقعی اندروید استفاده کنید.';
      main.textContent='نصب واقعی برنامه اندروید';main.onclick=()=>openApk();
      alt.textContent='بررسی دوباره نصب PWA';alt.onclick=()=>{if(typeof radianInstallPrompt!=='undefined'&&radianInstallPrompt)doNativeInstall();else setTimeout(fixedInstallPanel,400)};
    }
    p.classList.add('open');
  }

  try{installLabels=fixedInstallLabels}catch(e){}
  try{showInstallPanel=fixedInstallPanel}catch(e){}

  window.addEventListener('appinstalled',()=>{
    try{localStorage.setItem(TRUE_INSTALL_FLAG,'1')}catch(e){}
    fixedInstallLabels();
    const p=document.getElementById('radianInstallPanel');if(p)p.classList.remove('open');
  });

  fixedInstallLabels();
})();
