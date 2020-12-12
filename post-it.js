class Nota{
    constructor(title, text){
        this.title = title;
        this.text = text;
        this.hora = new Date().getHours() + ":" + new Date().getMinutes();
        
    }
}

class listaNotas{
    constructor(){
        this.notas = [];
    }
    addNota(nota){
        this.notas.push(nota);
    }
    borrarNota(titulo,texto){
        let notaBorrada = this.notas.findIndex(nota => nota.title == titulo && nota.text == texto);
        if (notaBorrada != -1) {
            this.notas.splice(notaBorrada, 1);
        }
    
    }
    editarNota(titulo,texto,newtitulo,newtexto){
        let notaEditada = this.notas.findIndex(nota => nota.title == titulo && nota.text == texto);
        if (notaEditada != -1) {
            this.notas[notaEditada].title=newtitulo;
            this.notas[notaEditada].text=newtexto;
        }
    }
}

class vistaNota{
    constructor(){
        this.div=null;
        this.fecha=null;
        this.nota=null;
        this.titulo=null;
        this.texto=null;
        this.borrado=null;
        this.editar=null;
        this.pMinutos=null;
        
        this.tiempo=new Date();
        this.minutos=1;
       
        this.margen=1;
        
        
    }   
    crearNota(titulo,texto){
       //this.margen=this.margen+20;
       //this.margin=this.margen.toString();
        
        /*var panel= document.getElementById("notas");
        panel.style.display="flex";
        panel.style.flexFlow="row wrap"*/
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        this.div=document.createElement("div");
        this.div.id="padre";
        this.div.style.position="absolute";
        this.div.style.width="20rem";
        this.div.style.marginLeft=this.margin+"rem";
        this.div.style.display="inline-block";
        document.getElementById("notas").appendChild(this.div);

        this.fecha=document.createElement("p");
        this.fecha.style.opacity="0.5";
        this.fecha.textContent=this.tiempo.toLocaleDateString('es-ES', options);
        this.div.appendChild(this.fecha);

        this.nota=document.createElement("div");
        this.nota.style.width="15rem";
        this.nota.style.height="10rem";
        this.nota.style.backgroundColor="yellow";
        this.div.appendChild(this.nota);

        this.titulo = document.createElement("h3");
        this.titulo.textContent=titulo;
        this.nota.appendChild(this.titulo);
        
        this.texto = document.createElement("p");
        this.texto.textContent=texto;
        this.nota.appendChild(this.texto);
  
        this.pMinutos=document.createElement("p");
        //this.pMinutos.textContent="Creado hace: "+this.minutos+"min";
        this.pMinutos.style.opacity="0.5";
        this.pMinutos.style.marginTop="5.2rem";
        this.pMinutos.style.textAlign="right";
        this.pMinutos.style.fontSize="12px";
        this.nota.appendChild(this.pMinutos);

        this.borrado=document.createElement("img");
        this.borrado.src="./papelera.png";
        this.borrado.style.height="30px";
        this.borrado.style.zIndex="1";
        this.div.appendChild(this.borrado);

        this.editar=document.createElement("img");
        this.editar.src="./lapiz.png";
        this.editar.style.height="30px";
        this.editar.style.zIndex="1";
        this.div.appendChild(this.editar);

       
    }
    /*modificarMinutos(m){
        this.minutos=m;
    }*/
    
    limpiarInput(){
        document.getElementById("titulo").value=" ";
        document.getElementById("texto").value=" ";
    }

    get getTitulo(){
        return document.getElementById("titulo").value;
    }
    get getTexto(){
        return document.getElementById("texto").value;
    }


}



class controlador{
    constructor(){
        this.listaNotas=new listaNotas();
        this.vistaNota=new vistaNota();
        
        this.añadirNota();
        
        if (localStorage.getItem("notas") != null){
            
            let arrayNotas = JSON.parse(localStorage.getItem("notas"));
            
            for (var i=0;i<arrayNotas.length;i++){
                
                this.vistaNota.crearNota(arrayNotas[i].title,arrayNotas[i].text);
                this.listaNotas.addNota(new Nota(arrayNotas[i].title,arrayNotas[i].text));
                this.borrar();
                this.editar();
                this.moverImagen();
            } 
        }
    }

    añadirNota(){
        document.getElementById("crear").addEventListener("click",()=>{
            let titulo= this.vistaNota.getTitulo;
            let texto=this.vistaNota.getTexto;

            this.vistaNota.crearNota(titulo,texto);
            
            this.vistaNota.pMinutos.textContent=this.calculaTiempo(this.vistaNota.tiempo);
            
            setInterval(()=>{
                this.vistaNota.pMinutos.textContent=this.calculaTiempo(this.vistaNota.tiempo) ;
            }, 60000);

            this.listaNotas.addNota(new Nota(titulo,texto));
            localStorage.setItem("notas", JSON.stringify(this.listaNotas.notas));

            /*let m=0;
            window.setInterval(()=>{
                this.vistaNota.modificarMinutos(m);
            },10000);*/

            this.vistaNota.limpiarInput();

            this.borrar();
            this.editar();  
            this.moverImagen();
        })
    }

    borrar(){
        this.vistaNota.borrado.addEventListener("click",(e)=>{
            e.stopPropagation();
            e.target.parentNode.remove();

            let titulo=e.target.parentNode.childNodes[1].childNodes[0].textContent;
            let texto=e.target.parentNode.childNodes[1].childNodes[1].textContent;
            this.listaNotas.borrarNota(titulo,texto);
            localStorage.setItem("notas", JSON.stringify(this.listaNotas.notas));
            
            
         });    
    }

    editar(){
        var tituloEditar=null;
        var textoEditar=null;
        var titulo=null;
        var texto=null;
        var h3=null;
        var p=null;
        var inputTitulo=null;
        var inputTexto=null;
        var cont=0;
        this.vistaNota.editar.addEventListener("click",(e)=>{
            cont++;
            e.stopPropagation();
            //los etiquetas de texto
            h3=e.target.parentNode.childNodes[1].childNodes[0];
            p=e.target.parentNode.childNodes[1].childNodes[1];

            //el contenido de las etiquetas
            titulo=e.target.parentNode.childNodes[1].childNodes[0].childNodes[0];
            texto=e.target.parentNode.childNodes[1].childNodes[1].childNodes[0];

            
            if(cont==1){
                tituloEditar= document.createElement("input");
                tituloEditar.style.backgroundColor="yellow";
                tituloEditar.style.border="1px solid orange";
                tituloEditar.style.display="block";
                h3.appendChild(tituloEditar);
                
                textoEditar= document.createElement("textarea");
                textoEditar.style.border="1px solid orange";
                textoEditar.style.backgroundColor="yellow";
                textoEditar.style.display="block";
                p.appendChild(textoEditar);

            }
            

            //inputs
            inputTitulo=e.target.parentNode.childNodes[1].childNodes[0].childNodes[1];
            inputTexto=e.target.parentNode.childNodes[1].childNodes[1].childNodes[1];
            
            window.addEventListener("keypress",(e)=>{
                cont=0; 
                let ev=e.key;
                let viejoTitulo=titulo.textContent;
                let viejoTexto=texto.textContent;
                
                let nuevoTitulo=tituloEditar.value;
                let nuevoTexto=textoEditar.value;
                if(ev=="Enter" ){
                    if(nuevoTitulo!==""){
                        titulo.textContent=nuevoTitulo;
                    }else{
                        nuevoTitulo=titulo.textContent;
                    }
                    if(nuevoTexto!==""){
                        texto.textContent=nuevoTexto;
                    }else{
                        nuevoTexto=texto.textContent;
                    }  
                
                this.listaNotas.editarNota(viejoTitulo,viejoTexto,nuevoTitulo,nuevoTexto);
                localStorage.setItem("notas", JSON.stringify(this.listaNotas.notas));
                 
                inputTexto.remove();
                inputTitulo.remove();
               
                }
            });
            
        }); 
             
    }

    moverImagen(){
        var arrastrando=false; 

        this.vistaNota.div.addEventListener("mousedown",(e)=>{

            this.divSeleccionada=e.currentTarget;
            arrastrando= !arrastrando;

            window.addEventListener('mousemove',(e)=>{
                if(arrastrando){           
                    this.divSeleccionada.style.marginLeft = (e.x-100)+"px";
                    this.divSeleccionada.style.marginTop = (e.y-150)+"px"; 
                }  
            });
        });
        
        this.vistaNota.div.addEventListener("mouseup",()=>{
            arrastrando=false; 
        });
    }

    calculaTiempo(date){
        if(!date){
            return 0;
        }
        else{
            let creacion = new Date(date);
            let ahora = new Date();
            let resta = ahora.getTime() - creacion.getTime();
            let tiempoPasado = ahora - resta;
            return ("Creada "+getTimeAgo(tiempoPasado));

        }
        
    }
}

const DATE_UNITS = {
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  }
  
  const getSecondsDiff = timestamp => (Date.now() - timestamp) / 1000
  const getUnitAndValueDate = (secondsElapsed) => {
    for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
      if (secondsElapsed >= secondsInUnit || unit === "second") {
        const value = Math.floor(secondsElapsed / secondsInUnit) * -1
        return { value, unit }
      }
    }
  }
  
  const getTimeAgo = timestamp => {
    const rtf = new Intl.RelativeTimeFormat()
  
    const secondsElapsed = getSecondsDiff(timestamp)
    const {value, unit} = getUnitAndValueDate(secondsElapsed)
    return rtf.format(value, unit)
  }


export{controlador}


