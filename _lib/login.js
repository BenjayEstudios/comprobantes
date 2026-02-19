const form = document.getElementById('loginForm');
const mensajeDiv = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo){
  mensajeDiv.innerHTML = `<div class="mensaje ${tipo}">${texto}</div>`;
  const msg = mensajeDiv.querySelector(".mensaje");
  setTimeout(()=>{
    msg.style.animation="fadeOut 0.5s ease forwards";
    setTimeout(()=>msg.remove(),500);
  },4000);
}

document.getElementById('toggleClave').addEventListener('click', function(){
  const clave = document.getElementById('pswd');
  if(clave.type==='password'){ clave.type='text'; this.textContent='🙈'; }
  else{ clave.type='password'; this.textContent='👁️'; }
});

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const formData = new FormData(form);
  try{
    const res = await fetch("_lib/login.php", {
      method:"POST",
      body:formData
    });
    const data = await res.json();
    mostrarMensaje(data.mensaje, data.success?"exito":"error");
    if(data.success){
      setTimeout(()=>{ window.location.href=data.redirect; },1000);
    }
  }catch(err){
    mostrarMensaje("❌ Error en la solicitud","error");
    console.error(err);

    console.log(formData.get('usuario'), formData.get('pswd'));
  }
});

