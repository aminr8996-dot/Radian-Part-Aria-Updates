(function(){
'use strict';
if(window.__RADIAN_RUNTIME_342__)return;
window.__RADIAN_RUNTIME_342__=true;

function restoreCatalogIfNeeded(){
  try{
    if(typeof PRODUCTS!=='undefined'&&Array.isArray(PRODUCTS)&&PRODUCTS.length>0)return PRODUCTS.length;
    let rebuilt=[];
    if(typeof EMBEDDED_PRODUCTS!=='undefined'&&Array.isArray(EMBEDDED_PRODUCTS)&&EMBEDDED_PRODUCTS.length){
      rebuilt=EMBEDDED_PRODUCTS.map(p=>({...p}));
    }else if(Array.isArray(window.RP)&&window.RP.length){
      rebuilt=window.RP.map((x,i)=>({row:i+1,seq:Number(x[0])||i+1,code:x[1]==null?'':String(x[1]),name:String(x[2]||'').trim(),price:x[3]==null?null:Number(x[3]),group:String(x[4]||'سایر'),packQty:x[5]==null?null:Number(x[5]),unit:String(x[6]||'')})).filter(p=>p.name);
    }
    if(rebuilt.length&&typeof PRODUCTS!=='undefined'){
      PRODUCTS=rebuilt;
      if(typeof renderChips==='function')renderChips();
      if(typeof renderProducts==='function')renderProducts();
      if(typeof renderCart==='function')renderCart();
      if(typeof updateCatalogStatus==='function')updateCatalogStatus();
    }
    return rebuilt.length;
  }catch(e){console.error('catalog restore',e);return 0}
}

function arrangeQuantityDialog(){
  const btn=document.getElementById('confirmAdd');
  const control=document.querySelector('#qtyOverlay .qty-control');
  if(!btn||!control)return;
  if(control.previousElementSibling!==btn)control.parentNode.insertBefore(btn,control);
  btn.style.marginTop='8px';
  btn.style.marginBottom='10px';
  btn.style.position='relative';
  btn.style.zIndex='4';
}

function keepAddButtonVisible(){
  const overlay=document.getElementById('qtyOverlay');
  const input=document.getElementById('qtyInput');
  const btn=document.getElementById('confirmAdd');
  if(!overlay||!overlay.classList.contains('open')||!input||!btn)return;
  if(document.activeElement===input){
    setTimeout(()=>btn.scrollIntoView({block:'nearest',inline:'nearest'}),40);
  }
}

function patchQuantityOpen(){
  try{
    if(typeof openQty!=='function'||openQty.__radian342)return;
    const original=openQty;
    const patched=function(key){
      original(key);
      setTimeout(()=>{
        arrangeQuantityDialog();
        const input=document.getElementById('qtyInput');
        if(input&&document.activeElement===input)input.blur();
      },180);
    };
    patched.__radian342=true;
    openQty=patched;
  }catch(e){console.error('qty patch',e)}
}

function boot(){
  arrangeQuantityDialog();
  patchQuantityOpen();
  restoreCatalogIfNeeded();
  const input=document.getElementById('qtyInput');
  if(input&&!input.dataset.radian342){
    input.dataset.radian342='1';
    input.addEventListener('focus',()=>setTimeout(keepAddButtonVisible,100));
    input.addEventListener('input',keepAddButtonVisible);
  }
  if(window.visualViewport&&!window.__RADIAN_VV_342__){
    window.__RADIAN_VV_342__=true;
    window.visualViewport.addEventListener('resize',keepAddButtonVisible);
    window.visualViewport.addEventListener('scroll',keepAddButtonVisible);
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.addEventListener('load',()=>{setTimeout(boot,120);setTimeout(restoreCatalogIfNeeded,450)});
})();
