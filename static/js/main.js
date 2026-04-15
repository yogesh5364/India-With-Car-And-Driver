/* ============================================================
   MAIN.JS — Shared across all pages
   ============================================================ */

// ── NAVBAR SCROLL ──
(function(){
  const nav = document.getElementById('navbar');
  if(!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

// ── MOBILE NAV TOGGLE ──
(function(){
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  if(!toggle||!drawer) return;
  toggle.addEventListener('click',()=>{
    const open = drawer.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // close on link click
  drawer.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click',()=>{
      drawer.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow='';
    });
  });
  // close on outside click
  document.addEventListener('click',e=>{
    if(!nav.contains(e.target)&&!drawer.contains(e.target)){
      drawer.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow='';
    }
  });
})();

// ── BACK TO TOP ──
(function(){
  const btn = document.getElementById('back-top');
  if(!btn) return;
  window.addEventListener('scroll',()=>{
    btn.classList.toggle('visible', window.scrollY > 400);
  },{passive:true});
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
})();

// ── SCROLL REVEAL ──
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  els.forEach(el=>io.observe(el));
})();

// ── ACTIVE NAV LINK ──
(function(){
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href===page || (page==='' && href==='index.html')){
      a.classList.add('active');
    }
  });
})();

// ── COUNTER ANIMATION ──
function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target = parseInt(el.dataset.count,10);
    const suffix = el.dataset.suffix||'';
    let start=0;
    const step=Math.ceil(target/60);
    const tick=()=>{
      start=Math.min(start+step,target);
      el.textContent=start.toLocaleString('en-IN')+suffix;
      if(start<target) requestAnimationFrame(tick);
    };
    tick();
  });
}

// trigger counters when stats strip in view
(function(){
  const strip = document.querySelector('.stats-strip');
  if(!strip) return;
  let done=false;
  const io=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting && !done){
      done=true;
      animateCounters();
      io.disconnect();
    }
  },{threshold:0.3});
  io.observe(strip);
})();

// ── POPUP HELPERS (exported) ──
window.showPopup=function(id){
  const el=document.getElementById(id);
  if(el) el.classList.add('active');
};
window.hidePopup=function(id){
  const el=document.getElementById(id);
  if(el) el.classList.remove('active');
};