
const CurrentDate = new Date();
const Months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Obtubre", "Noviembre", "Diciembre"];
const ActualMonth = CurrentDate.getMonth()+1;
const ActualYear = CurrentDate.getFullYear();
const ActualDay = CurrentDate.getDate();

let Month = ActualMonth;
let Year = ActualYear;
let DaysOfMonth = new Date(CurrentDate.getFullYear(), Month, 0).getDate();
let UserSubjects = localStorage.getItem("Subjects");
let subjectErrors = [];

document.addEventListener("DOMContentLoaded", function() {
    
    daysCreator();
    if(UserSubjects==null|UserSubjects==""){
        showPopup();
    }
    
});

//Crea los divs para cada dia del mes segun la fecha.
const Calendar = document.getElementById("CalendarID");

const daysCreator = ()=>{
    let DaysOfMonth = new Date(CurrentDate.getFullYear(), Month, 0).getDate();
    if (Year % 4 === 0 && Month===1) {
        DaysOfMonth = 29
    }
    DayOrder(FirstDayofMonth(Month, Year))
    for (let index = 1; index <= DaysOfMonth; index++) {
        const miDiv = document.createElement('div');
        const miH3 = document.createElement('h3');
        const miP = document.createElement('p');
        const MonthConteiner = document.getElementById("MonthID");
        miDiv.classList.add('dayOfCalendar');
        miDiv.id=index;

        MonthConteiner.innerHTML = Months[Month-1]+" "+Year;

        miH3.classList.add('dayOfCalendar-number');
        miH3.innerHTML = +index;
        miH3.id="day-"+index;

        miP.id="p-"+index;
        miP.classList.add('dayOfCalendar-text');

        Calendar.appendChild(miDiv);
        miDiv.appendChild(miH3);
        miDiv.appendChild(miP);
    }
    MarkDate(ActualYear, ActualMonth, ActualDay, "highlighted", "Hoy");
    MarkExamns(UserSubjects);
}

const FirstDayofMonth = (month, year)=>{
    let firstDay = new Date(year, month-1, 1);
    let weekDayNumber = firstDay.getDay();
    weekDayNumber = weekDayNumber===0 ? 7 
                                    : weekDayNumber
    return weekDayNumber;
};

const DayOrder = (FirstWeekDay)=>{
        const Days = [ "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
        let weekDay = Days[FirstWeekDay-1];

    for (let index = 1; index <= FirstWeekDay-1; index++) {
        const miDiv = document.createElement('div');
        miDiv.classList.add('dayOfCalendar');
        miDiv.id=index;
        Calendar.appendChild(miDiv);
        }
    return weekDay;
}

const MarkDate = (Year, Month, Day, className, reason) => {   
    let MonthConteiner = document.getElementById("MonthID").textContent;
    let miP = document.getElementById("p-"+Day);
    if(MonthConteiner.includes(Year) && MonthConteiner.includes(Months[Month-1])){
        
        for(let index = 1; index < DaysOfMonth; index++){
            let div = document.getElementById(index);
            if (parseInt(div.textContent) === Day) {
                div.classList.add(className);
                miP.innerHTML = reason;
                break;
            }
        }
    }
}

// Elimina todos los divs de los dias.
const daysEliminate = ()=>{
    while (Calendar.childNodes[15]) {
        Calendar.removeChild(Calendar.lastChild);
    }
}

//Al hacer click en el boton se aumenta la fecha y se ejecuta dayCreator.
const NextMonth = document.getElementById("Next-Month");
NextMonth.addEventListener("click", ()=>{
    daysEliminate();
    (Month<12)   ? Month++
                        : (Month = 1, Year++)
    daysCreator();
})

//Al hacer click en el boton se retrocede la fecha y se ejecuta dayCreator.
const PreviusMonth = document.getElementById("Previus-Month");
PreviusMonth.addEventListener("click", ()=>{
    daysEliminate();
    (Month!=1)   ? Month--
                        : (Month = 12, Year--)
    daysCreator();
})

//Al hacer click en Materias te dirige a la pagina donde estas se eligen.
const Subjects = document.getElementById("Subjects");
Subjects.addEventListener("click", ()=>{
    showPopup();
})

async function getDate(materia, tipoEvento) {
    try {
    const response = await fetch('./files/examenes.json');
    const data = await response.json(); 
    if (data[materia] && data[materia][tipoEvento]) {
        const fecha = new Date(data[materia][tipoEvento]);
        const year = fecha.getFullYear();
        const month = fecha.getMonth()+1; // Los meses se indexan desde 0
        const day = fecha.getDate() +1;
        return {
        year,
        month,
        day
        };
    } else {
        return null; // Devolver null si no se encuentra la materia o el tipo de evento
    }
    } catch (error) {
    // console.error('Error al obtener la fecha:', error);
    return null;
    }
}

// Busca las fehcas de exames de cada materia que reciba y llama a la funcion MarcarFechas para cada una.

const MarkExamns = async  (Subjects)=>{
    const SubjectsArray = Subjects.split(',');
    // console.log(SubjectsArray);
    subjectErrors = [];

    for (const Subject of SubjectsArray) {
        let ExamDate = await  getDate(Subject,"Examen");

        if (ExamDate) {
            const { year, month, day} = ExamDate;
            
            MarkDate(year, month, day, "Exam", Subject);

        }
        else{
            subjectErrors.push(`Fecha de examen de ${Subject} no encontrada`)
            // console.log(subjectErrors);
        }

    };
    // console.log(subjectErrors);
    if(subjectErrors!==null && subjectErrors!==""){
        if(enEjecucion){
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            showPopupMessages();
        } else {showPopupMessages();}
    }
}


const accept = document.getElementById("Accept");
//Guarda los valores que selecciono el usuario y actualiza todos los datos.
accept.addEventListener("click", function() {
    const inputs = document.querySelectorAll("input[type='checkbox']");
    const UserSelected = [];
    
    inputs.forEach(input => {
    if(input.checked){
        UserSelected.push(input.value);
    }
    })
    localStorage.setItem("Subjects",UserSelected);
    UserSubjects = localStorage.getItem("Subjects");
    hiddePopup();
    daysEliminate();
    daysCreator();  
});

const popup = document.getElementById("popup");

function hiddePopup() {
    popup.style.display = "none";
}

function showPopup() {
    popup.style.display = "block";
    checkUserSubjects(UserSubjects);
}

const checkUserSubjects = (values)=>{
    const SubjectsArray = values.split(',');
        SubjectsArray.forEach(function(valor) {
        let input = document.querySelector('input[value="' + valor + '"]');
        if (input) {
            input.checked = true;
        }
        });
    }
    let timeout1;
    let timeout2;
    let enEjecucion = false;


const showPopupMessageBox = (message, duration)=> {
    let popupMessage = document.getElementById("msg");
    if(message!==null|message!==" "){
    popupMessage.textContent = message;
    popupMessage.style.display = "block";
    popupMessage.style.animationDuration = duration + "ms";
    enEjecucion = true;
    timeout1 = setTimeout(function() {
        popupMessage.style.display = "none";
        enEjecucion = false;
    }, duration);
    }
}

const showPopupMessages = ()=>{
    showPopupMessageBox(subjectErrors.shift(),4000);
    
    if (subjectErrors.length>0){
        enEjecucion = true;
        timeout2 = setTimeout(function() {
            showPopupMessages();
            enEjecucion = false;
        }, 4200);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    let elements = document.querySelectorAll('.weekday');
    
    for (var i = 0; i < elements.length; i++) {
        let element = elements[i];
        let content = element.textContent;
        let firstChar = content.charAt(0);
        element.setAttribute('data-initial', firstChar);
    }
});
