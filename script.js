(function(){
  var views=["inicio","cronologia","calculadora","presupuesto","reportar"];
  function show(v){
    if(views.indexOf(v)<0)v="inicio";
    views.forEach(function(n){document.getElementById("v-"+n).hidden=(n!==v)});
    document.querySelectorAll("nav button").forEach(function(b){
      if(b.dataset.go===v)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
    });
    window.scrollTo(0,0);
  }
  function go(v){try{location.hash=v}catch(e){}show(v)}
  document.addEventListener("click",function(e){
    var t=e.target.closest("[data-go]");
    if(t){e.preventDefault();go(t.dataset.go)}
  });
  window.addEventListener("hashchange",function(){show(location.hash.slice(1))});

  var S=function(n){return "S/ "+Math.round(n).toLocaleString("es-PE")};
  var $=function(id){return document.getElementById(id)};
  function calc(){
    var m=+$("monto").value||0,t=(+$("tsd").value||0)/100,me=+$("meses").value||0,
        a=+$("adic").value||0,y=+$("anios").value||0,n=(+$("nom").value||0)/100,f=(+$("inf").value||0)/100;
    var im=Math.pow(1+t,1/12)-1;
    $("rIm").textContent=(im*100).toFixed(3)+" %";
    $("rMes").textContent=S(m*im);
    $("rRet").textContent=S(m*(Math.pow(1+t,me/12)-1));
    $("rVp").textContent=S(a/Math.pow(1+t,y));
    $("rReal").textContent=(((1+n)/(1+f)-1)*100).toFixed(2)+" %";
    $("meterDay").textContent=S(m*im/30);
  }
  ["monto","tsd","meses","adic","anios","nom","inf"].forEach(function(id){$(id).addEventListener("input",calc)});
  function rev(){
    var g=+$("gastado").value;
    $("gLbl").textContent=g;
    $("gSp").textContent="S/ "+g;
    $("gRv").textContent="S/ "+(1000-g);
    $("bSp").style.width=(g/10)+"%";
    $("bRv").style.width=((1000-g)/10)+"%";
  }
  $("gastado").addEventListener("input",rev);
  $("send").addEventListener("click",function(){
    var el=$("repMsg");
    if(!$("msg").value.trim()){el.textContent="Escriba un mensaje antes de enviar.";el.style.color="var(--bad)";return}
    el.style.color="var(--ok)";
    el.textContent="Mensaje recibido (simulación del prototipo). En la versión final pasará a revisión antes de publicarse.";
    $("msg").value="";
  });
  function irr(fl){
    var lo=0,hi=100,i,mid;
    function npv(r){return fl.reduce(function(a,x,t){return a+x/Math.pow(1+r,t)},0)}
    if(npv(0)<=0)return NaN;
    for(i=0;i<200;i++){mid=(lo+hi)/2;if(npv(mid)>0)lo=mid;else hi=mid}
    return (lo+hi)/2;
  }
  function van(){
    var k=(+$("tsd").value||0)/100,m=+$("monto").value||0,im=Math.pow(1+k,1/12)-1,
        i0=+$("i0").value||0,op=+$("op").value||0,n=Math.min(20,Math.max(1,Math.round(+$("nper").value||1))),ev=+$("evit").value||0;
    var ben=ev*m*im/30,sum=0,pvc=i0,pvb=0,rows="",fl=[-i0];
    for(var t=1;t<=n;t++){
      var f=ben-op,fac=1/Math.pow(1+k,t),pv=f*fac;
      sum+=pv;pvc+=op*fac;pvb+=ben*fac;fl.push(f);
      rows+="<tr><td>"+t+"</td><td>"+S(ben)+"</td><td>"+S(op)+"</td><td>"+S(f)+"</td><td>"+fac.toFixed(4)+"</td><td>"+S(pv)+"</td></tr>";
    }
    var vanv=sum-i0,bc=pvc>0?pvb/pvc:0,tir=irr(fl);
    $("vRows").innerHTML=rows;
    $("vBen").textContent=S(ben);
    $("vVan").textContent=S(vanv);
    $("vBc").textContent=bc.toFixed(1);
    $("vTir").textContent=isFinite(tir)?(tir*100).toFixed(0)+" %":"–";
    var el=$("vVer");
    el.textContent=vanv>0?"VAN positivo: con estos supuestos la inversión se acepta.":"VAN no positivo: con estos supuestos la inversión no se justifica.";
    el.style.color=vanv>0?"var(--ok)":"var(--bad)";
  }
  ["tsd","monto","i0","op","nper","evit"].forEach(function(id){$(id).addEventListener("input",van)});
  calc();rev();van();show(location.hash.slice(1));
})();
