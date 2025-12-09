(()=>{
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  // quick sanity draw to detect canvas rendering early
  try{
    ctx.fillStyle = 'red';
    ctx.fillRect(10,10,40,40);
    console.log('[christmas] quick sanity rect drawn');
  }catch(e){
    console.error('[christmas] canvas quick-draw failed', e);
  }
  let W=0,H=0,animId=null,playing=true;

  function resize(){
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    W = canvas.width = Math.floor(window.innerWidth * dpr);
    H = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  // Tree geometry
  const tree = {
    x: window.innerWidth/2,
    y: window.innerHeight*0.75,
    width: Math.min(window.innerWidth*0.6, 420),
    tiers: 5
  };

  function drawTreeBase(){
    const cx = window.innerWidth/2, cy = window.innerHeight*0.75;
    const w = Math.min(window.innerWidth*0.6, 420);
    // stacked triangles
    for(let i=0;i<tree.tiers;i++){
      const t = tree.tiers - i;
      const h = 40 + t*28;
      const tw = w * (1 - i*0.12);
      const x = cx, y = cy - i*36 - 40;
      ctx.beginPath();
      ctx.moveTo(x, y - h);
      ctx.lineTo(x - tw/2, y + h/2);
      ctx.lineTo(x + tw/2, y + h/2);
      ctx.closePath();
      const grad = ctx.createLinearGradient(x, y-h, x, y+h/2);
      grad.addColorStop(0, '#0b7a2b');
      grad.addColorStop(1, '#033814');
      ctx.fillStyle = grad;
      ctx.fill();
    }
    // trunk
    ctx.fillStyle = '#6b3a1f';
    ctx.fillRect(cx - 18, cy + 48, 36, 48);
  }

  // decorations along branches
  const ornaments = [];
  function placeOrnaments(){
    ornaments.length = 0;
    const cx = window.innerWidth/2, cy = window.innerHeight*0.75;
    const levels = tree.tiers*3 + 6;
    for(let i=0;i<levels;i++){
      const t = i/levels; // 0..1 top->bottom
      const angle = (Math.random()-0.5)*0.6;
      const radius = 20 + t * (tree.width/2);
      const x = cx + Math.sin(angle) * radius * (0.7 + Math.random()*0.3) * (0.6 + t*0.6);
      const y = cy - (1-t)* (tree.tiers*40) + (t*70*(0.8+Math.random()*0.4));
      ornaments.push({x,y,r:6+Math.random()*6,color:pick(['#ff3b30','#ffd60a','#0af','#ff6ec7','#7cf'])});
    }
  }

  function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}

  // particles
  const particles = [];
  function spawn(x,y,count=20,spread=120,vel=3,color=null){
    for(let i=0;i<count;i++){
      const a = Math.random()*Math.PI*2;
      const s = Math.random()*0.8+0.6;
      const speed = (Math.random()*0.6+0.4)*vel;
      particles.push({x:x,y:y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed - (Math.random()*1.5),life:60+Math.random()*60,size:2+Math.random()*8,age:0,color:color||randColor()});
      if(particles.length>2000) particles.shift();
    }
  }

  function randColor(){
    const palette = ['#ffd60a','#ff3b30','#0af','#7cf','#ff6ec7'];
    return pick(palette);
  }

  function update(){
    // update particles
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.vy += 0.06; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.age++;
      if(p.age>p.life) particles.splice(i,1);
    }
    // gentle random twinkles
    if(Math.random()<0.08){
      const o = ornaments[Math.floor(Math.random()*ornaments.length)];
      if(o) spawn(o.x + (Math.random()-0.5)*10, o.y + (Math.random()-0.5)*10, 3, 30, 1.8, o.color);
    }
  }

  function draw(){
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    // dim background glow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

    // tree
    drawTreeBase();

    // ornaments
    for(const o of ornaments){
      // glow
      const g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r*6);
      g.addColorStop(0, hexToRGBA(o.color,0.9));
      g.addColorStop(0.4, hexToRGBA(o.color,0.3));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(o.x,o.y,o.r*3,0,Math.PI*2); ctx.fill();
      // core
      ctx.beginPath(); ctx.arc(o.x,o.y,o.r,0,Math.PI*2);
      ctx.fillStyle = o.color; ctx.fill();
    }

    // particles (glow using lighter blend)
    ctx.globalCompositeOperation = 'lighter';
    for(const p of particles){
      const t = 1 - (p.age/p.life);
      const size = p.size * (0.6 + t*0.8);
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,size*3);
      g.addColorStop(0, hexToRGBA(p.color,0.9*t));
      g.addColorStop(0.3, hexToRGBA(p.color,0.4*t));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x,p.y,size,0,Math.PI*2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function hexToRGBA(h, a){
    const c = h.replace('#','');
    const r = parseInt(c.substr(0,2),16), g=parseInt(c.substr(2,2),16), b=parseInt(c.substr(4,2),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function loop(){
    update();
    draw();
    if(playing) animId = requestAnimationFrame(loop);
  }

  // input events
  function toLocal(e){
    if(e.touches && e.touches.length) return {x:e.touches[0].clientX, y:e.touches[0].clientY};
    return {x:e.clientX,y:e.clientY};
  }

  function onPointer(e){
    const p = toLocal(e);
    spawn(p.x,p.y,30,160,3+Math.random()*2);
  }

  window.addEventListener('click', onPointer);
  window.addEventListener('touchstart', onPointer, {passive:true});

  // play/pause
  const btn = document.getElementById('togglePlay');
  if(btn){
    btn.addEventListener('click', ()=>{
    playing = !playing;
    btn.textContent = playing ? '暂停' : '播放';
    if(playing){ loop(); }
    else cancelAnimationFrame(animId);
    });
  }else{
    console.warn('[christmas] togglePlay button not found');
  }

  // init
  function init(){
    resize();
    tree.x = window.innerWidth/2;
    tree.y = window.innerHeight*0.75;
    tree.width = Math.min(window.innerWidth*0.6,420);
    placeOrnaments();
    // small ambient particles at top
    const cx = window.innerWidth/2, ty = window.innerHeight*0.3;
    for(let i=0;i<40;i++) spawn(cx + (Math.random()-0.5)*100, ty + Math.random()*40,1,40,0.6);
    loop();
  }

  try{
    init();
  }catch(err){
    console.error('[christmas] init failed', err);
    // show error message on canvas so user sees something
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    ctx.fillStyle = '#fff';
    ctx.font = '18px sans-serif';
    ctx.fillText('初始化出错，请查看控制台 (DevTools)', 20, 40);
  }
  // expose for debugging
  window.__christmas = {spawn, particles, ornaments};

})();
