// TABS LOGIC
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.style.display = (panel.id === tabId) ? 'flex' : 'none';
        });
    });
});

// RESIZABLE GLASS CONTAINER
const container = document.getElementById('glass-container');
const handle = document.querySelector('.resize-handle');
let resizing = false;
let startX, startY, startW, startH;

handle.addEventListener('mousedown', function(e){
    e.preventDefault();
    resizing = true;
    startX = e.clientX; startY = e.clientY;
    startW = container.offsetWidth; startH = container.offsetHeight;
    container.classList.add('resizing');
    window.addEventListener('mousemove', resizeGlass);
    window.addEventListener('mouseup', stopResizeGlass);
});
function resizeGlass(e){
    if (!resizing) return;
    let newW = Math.max(370, startW + (e.clientX - startX));
    let newH = Math.max(330, startH + (e.clientY - startY));
    newW = Math.min(newW, window.innerWidth-16);
    newH = Math.min(newH, window.innerHeight-24);
    container.style.width = newW + 'px';
    container.style.height = newH + 'px';
}
function stopResizeGlass(e){
    resizing = false;
    container.classList.remove('resizing');
    window.removeEventListener('mousemove', resizeGlass);
    window.removeEventListener('mouseup', stopResizeGlass);
}
// Touch events for resize
handle.addEventListener('touchstart', (ev)=>{
    ev.preventDefault();
    resizing = true;
    let touch = ev.touches[0];
    startX = touch.clientX; startY = touch.clientY;
    startW = container.offsetWidth; startH = container.offsetHeight;
    container.classList.add('resizing');
    window.addEventListener('touchmove', resizeGlassTouch, {passive:false});
    window.addEventListener('touchend', stopResizeGlassTouch, {passive:false});
});
function resizeGlassTouch(ev){
    if(!resizing) return;
    let touch = ev.touches[0];
    let newW = Math.max(370, startW + (touch.clientX - startX));
    let newH = Math.max(330, startH + (touch.clientY - startY));
    newW = Math.min(newW, window.innerWidth - 10);
    newH = Math.min(newH, window.innerHeight - 10);
    container.style.width = newW + 'px';
    container.style.height = newH + 'px';
}
function stopResizeGlassTouch(ev){
    resizing = false;
    container.classList.remove('resizing');
    window.removeEventListener('touchmove', resizeGlassTouch);
    window.removeEventListener('touchend', stopResizeGlassTouch);
}

// CURSOR TRACKING — 3D tilt/glow/cursor-glow
let enableGlow = true;
let enableTilt = true;
let enableAnim = true;
container.addEventListener('mousemove', function(e){
    if(!enableTilt) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    container.style.transform = `perspective(1400px) rotateX(${(y-0.5)*18}deg) rotateY(${(x-0.5)*-23}deg) scale(1.01)`;
    container.setAttribute('data-mouse-over','true');
});
container.addEventListener('mouseleave', function(){
    container.style.transform = 'none';
    container.removeAttribute('data-mouse-over');
});

// Fancy cursor glow
let cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);
document.body.addEventListener('mousemove', function(e){
    if(!enableGlow){
        cursorGlow.style.opacity='0';
        return;
    }
    cursorGlow.style.left = (e.clientX - 70) + 'px';
    cursorGlow.style.top = (e.clientY - 70) + 'px';
    cursorGlow.style.opacity = window.innerWidth < 700 ? 0.12 : 0.69;
});
container.addEventListener('mouseenter', () => {
    if(enableGlow) cursorGlow.style.opacity='0.93';
});
container.addEventListener('mouseleave', () => {
    if(enableGlow) cursorGlow.style.opacity='0.69';
});

// Settings panel logic
const gradients = {
    bluepurple: 'linear-gradient(114deg, #69a8ff, #b76fe5 88%, #7a8ff3 100%)',
    sunset: 'linear-gradient(110deg,#feb47b 10%,#fd6564 70%,#b76fe5 100%)',
    emerald: 'linear-gradient(105deg,#45b59b 5%,#43e7fe 65%,#b76fe5 100%)',
    darknight: 'linear-gradient(120deg,#181820 8%,#5339a4 70%,#b76fe5 100%)'
};
document.getElementById('gradient-select').addEventListener('change', function(){
    const v = this.value;
    document.body.style.background = gradients[v];
    document.querySelector('.gradient-text').style.background = gradients[v];
});
document.getElementById('toggle-glow').addEventListener('change', function(){
    enableGlow = this.checked;
    if(!enableGlow) cursorGlow.style.opacity='0';
});
document.getElementById('toggle-tilt').addEventListener('change', function(){
    enableTilt = this.checked;
    if(!enableTilt) container.style.transform='none';
});
document.getElementById('toggle-anim').addEventListener('change', function(){
    enableAnim = this.checked;
    // Just disables panel animation (fadein) for demo; more can be added
    document.querySelectorAll('.tab-panel').forEach(panel=>{
        panel.style.animation = enableAnim ? 'fadeInMain 0.82s cubic-bezier(.22,1.03,.45,.98)' : 'none';
    });
});
