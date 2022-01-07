// Variables

const carrito = document.querySelector(`#carrito`);
const contenedorCarrito = document.querySelector(`#lista-carrito tbody`);
const vaciarCarritoBtn = document.querySelector(`#vaciar-carrito`);
const listaCursos = document.querySelector(`#lista-cursos`);
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    //Cuando agregas u ncurso presionando "Agregar al carrito".
    listaCursos.addEventListener(`click`, agregarCurso);

    //Eliminar cursos del carrito
    carrito.addEventListener(`click`, eliminarCurso);

    //Mostrar cursos del Local Storage.
    document.addEventListener(`DOMContentLoaded`, () => {
        articulosCarrito = JSON.parse(localStorage.getItem(`carrito`)) || [];
        carritoHTML();
    });

    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener(`click`, () => {
        articulosCarrito = []; //Reseteamos el array.
        limpiarHTML(); //Eliminamos todo del HTML.
    })
};



// Funciones

function agregarCurso(e) {
    e.preventDefault();
    if(e.target.classList.contains(`agregar-carrito`)){
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    };
};


//Eliminar un curso del carrito

function eliminarCurso(e) {
    console.log(e.target.classList);
    if(e.target.classList.contains(`borrar-curso`)) {
        const cursoId = e.target.getAttribute(`data-id`);

        //Eliminar del array de articulosCarrito por el data-id.
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        
        carritoHTML(); //Itermamos sobre el carrito y mostramos su HTML.
    };
};


// Leer el contendio del HTML y extraer información del curso seleccionado.

function leerDatosCurso(curso) {
    //Objeto con el contenido del curso actual.
    const infoCurso = {
        imagen: curso.querySelector(`img`).src,
        titulo: curso.querySelector(`h4`).textContent,
        precio: curso.querySelector(`.precio span`).textContent,
        id: curso.querySelector(`a`).getAttribute(`data-id`),
        cantidad: 1
    };

    //Revisar elementos existentes en el Carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if(existe){
        //Actualizamos cantidad
        const cursos = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso; //Retorna el objeto actualizado
            } else { 
                return curso; //Retorna los objetos que no son los duplicados
            };
        });
        articulosCarrito = [...cursos];
    } else {
        //Agregamos elementos al array del Carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    };

    console.log(articulosCarrito);
    carritoHTML();
};


// Carrito en HTML

function carritoHTML() {

    //Limpiar el HTML
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement(`tr`);
        row.innerHTML = `
        <td>
            <img src="${imagen}" width="100">
        </td>    
        <td> ${titulo} </td>
        <td> ${precio} </td>
        <td> ${cantidad} </td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}"> X </a>
        </td>    
        `;
        //Agrega el HTML del Carrito en el Body
        contenedorCarrito.appendChild(row);
    });

    //Agregar el carrito de compras al Local Storage.
    sincronizarStorage();
};


function sincronizarStorage(){
    localStorage.setItem(`carrito`, JSON.stringify(articulosCarrito));
};


//Eliminar los cursos del tbody
function limpiarHTML() {
    //contenedorCarrito.innerHTML = ``; <--- Este método es más lento

    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    };
};