let radianInstallPrompt=null;
const byId=id=>document.getElementById(id);
function installed(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function installLabels(){['installPwa','installWelcome'].forEach(id=>{const b=byId(id);if(!b)return;b.textContent=installed()?'نصب شده':(radianInstallPrompt?'نصب روی گوشی':'راهنمای نصب');b.disabled=installed()})}
async function installRadian(){if(installed())return;if(radianInstallPrompt){const p=radianInstallPrompt;radianInstallPrompt=null;p.prompt();try{await p.userChoice}catch(e){}installLabels();return}alert('از منوی مرورگر گزینه «Install app» یا «Add to Home screen» را بزنید.')}
function welcome(){document.querySelectorAll('.overlay.open').forEach(x=>x.classList.remove('open'));const w=byId('welcomeScreen');if(w)w.classList.remove('hidden');document.body.style.overflow='';scrollTo(0,0)}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();radianInstallPrompt=e;installLabels()});
addEventListener('appinstalled',()=>{radianInstallPrompt=null;installLabels()});
byId('installPwa')?.addEventListener('click',installRadian);byId('installWelcome')?.addEventListener('click',installRadian);byId('goWelcome')?.addEventListener('click',welcome);
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));
installLabels();
