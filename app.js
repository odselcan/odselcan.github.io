
const KEY="portfolyo-projeler-v1";
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(s))return s}catch(e){}return DEFAULTS.slice()}
let PROJECTS=load(),types=[];
function calcTypes(){types=["Hepsi",...new Set(PROJECTS.map(p=>p.type))];if(!types.includes(active))active="Hepsi"}
const chips=document.getElementById("chips"),grid=document.getElementById("grid");
let active="Hepsi";
function renderChips(){calcTypes();chips.innerHTML="";types.forEach(t=>{const b=document.createElement("button");b.className="chip";b.textContent=t;b.setAttribute("aria-pressed",t===active);b.onclick=()=>{active=t;renderChips();renderGrid()};chips.appendChild(b)})}
function renderGrid(){
  grid.innerHTML="";
  PROJECTS.filter(p=>active==="Hepsi"||p.type===active).forEach(p=>{
    const c=document.createElement("article");c.className="card";
    c.innerHTML=`<div class="thumb" style="background:var(${p.color})"><span>${p.emoji}</span></div>
    <h3>${p.title}</h3><p>${p.desc}</p><div class="tags">${p.tags.map(t=>`<i>${t}</i>`).join("")}</div>
    <a class="go" href="${p.link}">İncele</a>`;
    c.addEventListener("pointermove",e=>{if(e.pointerType==="touch")return;const r=c.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform=`rotateY(${x*14}deg) rotateX(${-y*14}deg) translateY(-8px)`});
    c.addEventListener("pointerleave",()=>c.style.transform="");
    grid.appendChild(c);
  });
}
renderChips();renderGrid();

// Cadı: tıklayınca zıplar
const hop=document.getElementById("hopper");
document.getElementById("walker").addEventListener("click",()=>{hop.classList.remove("hop");void hop.getBoundingClientRect();hop.classList.add("hop")});

// Yönetici paneli. Şifreyi değiştir!
const $=id=>document.getElementById(id),dlg=$("adm");
dlg.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>dlg.close());
function showView(on){$("login").hidden=on;$("manage").hidden=!on;if(on)renderList();else{$("pass").value="";$("err").textContent=""}}
$("lock").onclick=()=>{showView(false);dlg.showModal()};
$("enter").onclick=()=>{if($("pass").value===ADMIN_PASS)showView(true);else $("err").textContent="Şifre yanlış."};
$("pass").onkeydown=e=>{if(e.key==="Enter")$("enter").click()};
function save(){try{localStorage.setItem(KEY,JSON.stringify(PROJECTS))}catch(e){}renderChips();renderGrid();renderList()}
$("add").onclick=()=>{
  const t=$("f-title").value.trim();if(!t){$("msg").textContent="Önce bir proje adı yaz.";return}
  PROJECTS.push({title:t,desc:$("f-desc").value.trim(),type:$("f-type").value.trim()||"Oyunlar",tags:$("f-tags").value.split(",").map(s=>s.trim()).filter(Boolean),emoji:$("f-emoji").value.trim()||"✨",color:$("f-color").value,link:$("f-link").value.trim()||"#"});
  ["f-title","f-desc","f-tags","f-emoji","f-link"].forEach(i=>$(i).value="");$("msg").textContent="Proje eklendi.";save();
};
function renderList(){
  const l=$("list");l.innerHTML="";
  PROJECTS.forEach((p,i)=>{
    const r=document.createElement("div");r.className="row";
    const s=document.createElement("span");s.textContent=p.emoji+" "+p.title;
    const b=document.createElement("button");b.className="del";b.textContent="Sil";
    b.onclick=()=>{if(b.dataset.sure){PROJECTS.splice(i,1);$("msg").textContent="Proje silindi.";save()}else{b.dataset.sure=1;b.textContent="Emin misin?"}};
    r.append(s,b);l.appendChild(r);
  });
  $("json").value=JSON.stringify(PROJECTS,null,1);
  $("tl").innerHTML=types.slice(1).map(t=>`<option value="${t}">`).join("");
}
$("copy").onclick=async()=>{try{await navigator.clipboard.writeText($("json").value);$("msg").textContent="Kopyalandı."}catch(e){$("json").select();$("msg").textContent="Metni seçtim, Ctrl+C ile kopyala."}};
$("reset").onclick=()=>{const b=$("reset");if(b.dataset.sure){try{localStorage.removeItem(KEY)}catch(e){}PROJECTS=DEFAULTS.slice();b.dataset.sure="";b.textContent="Başa döndür";save()}else{b.dataset.sure=1;b.textContent="Emin misin?"}};