//Consultar mas columnas, modificar URL
const URL = "https://sheets.googleapis.com/v4/spreadsheets/108FBMScjh_seZ284-T0cZgpW_OpdiU9iJNGlycV4aJU/values/Cursos!A:N?key=AIzaSyA1pfILJrar9ay5u1PoOWVuz4t8VhxA6jE"
let infoFetch = [];
const nodeAPI_Offer = document.getElementById("API_educativeOffer");

class AvailableCourses {
    constructor(nameSpeciality){
        const courses = this.getCourses(nameSpeciality);
        if (courses.length > 0) {
            const containerCourses = this.sendCourses(courses);
            this.mountNode(containerCourses);
            Specialties.showSpecialties();
            window.scroll(top);            
            AvailableCourses.alternateTitle(`Cursos de ${nameSpeciality.toUpperCase()}`);            
        }
    }

    getCourses(specialitie){
        let courses = []
        infoFetch.forEach(element => {
            if(element.specialty.toUpperCase() === specialitie) {
                courses.push(element.courses)
            }
        });
        return courses;
    }

    constructorCourse(course){
        if (course.observaciones == undefined) {
            course.observaciones = "";
        } else {
            const textObs = course.observaciones;
            course.observaciones = "Observaciones: " + textObs;
        }
        const container = document.createElement("div");
        //container.className = "course";
        container.innerHTML = `
        <div class="course">
            <p class="containerCourse--title"><strong>${course.curso}</strong></p>
            <p class="containerCourse--profesor">Profesor: ${course.profesor.toLowerCase()}</p>
            <br>
            <p>Inicia:  <b>${course.fecha_inicio}</b></p>
            <p>Termina:  <b>${course.fecha_termino}</b></p>        
            <p>Horario:  <b>${course.hora_inicio} a ${course.Hora_fin}</b> hrs.</p>
            <br>
            <p>Modalidad del curso: <b><i>${course.modalidad_curso}</i></b></p>
            <p>${course.horas} horas de duración</p>
            <p>Dias de clase: ${course.dias_de_clases}</p>        
            <p>${course.observaciones}</p>
        </div>
        <a class="button__link educativeOffer__button" href="../html/Inscribete.html">Inscribete...</a>
        `;
        return container;
    }

    mountNode(containerCourses){
        const coursesContainers = document.createElement("div");
        coursesContainers.id = "containerCourses";
        coursesContainers.className ="containerCourses";
        containerCourses.forEach( course => {            
            coursesContainers.appendChild(course);
        })
        nodeAPI_Offer.appendChild(coursesContainers);        
        Specialties.showButtonBack();
    }

    sendCourses(array){
        let arrayCourses = [];        
        array[0].forEach(element => {            
            const course = this.constructorCourse(element);
            arrayCourses.push(course);
        })                
        return arrayCourses;
    }

    toogleClass(element) {
        const nodeLineSVG = document.querySelector(`#${element}`);
        nodeLineSVG.classList.toggle(element);
    }    

    static alternateTitle(stringText){
        const title = document.querySelector("#alternateTitle");    
        title.innerText = stringText;
    }

    static removeCourses() {
        const containerCourses = document.querySelector("#containerCourses");        
        nodeAPI_Offer.removeChild(containerCourses);
    }    
}

class ObjFromArray {
    arrayKeys = [];
    constructor (array){
        this.arrayProperties(array);
        const arrayWithObjects = this.trasnformArrayOfObjects(array);
        const specialities = this.sortBySpeciality(arrayWithObjects);        
        return specialities;
    }
    
    arrayProperties(array){
        array[0].forEach( element => this.arrayKeys.push(element))
    }
    
    trasnformArrayOfObjects(array){
        let arrayWithObject = []
        array.forEach( element => {
            let i = 0;
            const course = element.reduce( (obj, item)=> {
                const prop = this.arrayKeys[i];
                if (!obj[item]) {
                    Object.defineProperty(obj, prop, {
                        value: item,
                        writable: true,
                        enumerable: true,
                        configurable: false
                    })
                }
                i++;
                return obj
            }, {})
            arrayWithObject.push(course)
        })
        
        arrayWithObject.shift();
        const arrayWithPlaces = this.coursesWithPlaces(arrayWithObject)
        return arrayWithPlaces
    }

    coursesWithPlaces(array){
        const withPlace = [];
        array.forEach(element => {
            const places = Number.parseInt(element.inscritos)
                if (places < 25 && places != NaN) {
                    withPlace.push(element)
                }
        })
        return withPlace
    }

    sortBySpeciality(array){
        const onlySpecialities = [];
        array.forEach( item => {
          if (!onlySpecialities.includes(item.especialidad)) {
            onlySpecialities.push(item.especialidad)
          }
        });
        const forSpecialities = onlySpecialities.map( item => {
          const coursesArray = array.filter( itemObj => itemObj.especialidad === item)
          const objSpecialities = {
            specialty : item,
            courses : coursesArray
          }
          return objSpecialities
        })
        return forSpecialities;
    }
}
    
class Specialties {
    static textTitle = "Seleciona una especialidad para ver los cursos disponibles:"

    constructor(arrayResponse){        
        this.title()
        this.createContainer(arrayResponse);
        this.createButtoBack();
        //this.createRegistrationButton();
        Specialties.showSpecialties();
    }

    title(){
        const title = document.createElement("h4");
        title.innerText = Specialties.textTitle;
        title.id = "alternateTitle"
        title.className ="educativeOffer__api--title";
        nodeAPI_Offer.appendChild(title);
    }
    
    createContainer(arrayResponse){
        const container = document.createElement("div");
        container.className = `container__Specialties container__Specialties--HIDE`;
        container.id = "containerSpecialties";
        arrayResponse.forEach(element => {
            container.innerHTML += `
            <div class="Specialties--containers">
            ${element.specialty.toLowerCase()} </div>`             
        });
        container.addEventListener("click", event => locateEvent(event));      
        nodeAPI_Offer.appendChild(container);
    }
    
    createButtoBack(){
        const buttonBack = document.createElement("div");        
        buttonBack.className = "buttonBack buttonBack--HIDE";
        buttonBack.id = "buttonBack";
        buttonBack.innerHTML = `        
        <img src="/assets/arrowBack.svg" alt="Retroceder">
        <span>REGRESAR</span>`;        
        nodeAPI_Offer.appendChild(buttonBack);
    }
    createRegistrationButton(){        
        const registrationButton = document.createElement("a");
        registrationButton.innerText = "Preinscríbete...";
        registrationButton.href= document.querySelector("#inscription");
        registrationButton.className = "button__link floating__button floating__button--HIDE";
        registrationButton.id = "buttonFloatingReg";
        nodeAPI_Offer.appendChild(registrationButton);
    }

    static showSpecialties(){    
        const nodeSpecialties = document.querySelector("#containerSpecialties");
        nodeSpecialties.classList.toggle("container__Specialties--HIDE");
    }

    static showButtonBack() {
        //habilitar si se usa boton flotante
        //const nodeButtonFloatingReg = document.querySelector("#buttonFloatingReg");
        //nodeButtonFloatingReg.classList.toggle("floating__button--HIDE");
        const nodeButtonBack = document.querySelector("#buttonBack");
        nodeButtonBack.classList.toggle("buttonBack--HIDE");
        nodeButtonBack.addEventListener("click", backToSpecialties)
    }

}

//functions of EventListener
const backToSpecialties = function () {    
    Specialties.showSpecialties();
    AvailableCourses.removeCourses();
    Specialties.showButtonBack();
    AvailableCourses.alternateTitle(Specialties.textTitle);
}

function locateEvent(event) {
    const ubication = event.target.innerText.toUpperCase();    
    const showCourses = new AvailableCourses(ubication);
}

async function conexion(URL) {
    try {
        const info = await fetch(`${URL}`);        
        const infoJSON = await info.json()
        const responseWithArray = infoJSON.values;        
        const response = new ObjFromArray(responseWithArray);
        console.log(response);        
        const specialitie = new Specialties(response);        
        infoFetch = [...response];        
    } catch (error) {
        console.log(error)
        const titleError = document.createElement("h3");
        titleError.innerHTML= `
        <h3 class="error__API">Error al consultar la información. 
        Por favor intenta más tarde. 
        Estamos trabajando para darte un mejor servicio.</h3>`;
        nodeAPI_Offer.appendChild(titleError);
    }
}

conexion(URL);
