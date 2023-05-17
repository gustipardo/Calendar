// "use strict";
const CurrentDate = new Date();
const Months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Obtubre", "Noviembre", "Diciembre"]

const ActualMonth = CurrentDate.getMonth()+1;
const ActualYear = CurrentDate.getFullYear();
const ActualDay = CurrentDate.getDate();

let Month = ActualMonth;
let Year = ActualYear;
let DaysOfMonth = new Date(CurrentDate.getFullYear(), Month, 0).getDate();
let UserSubjects = localStorage.getItem("Subjects");

document.addEventListener("DOMContentLoaded", function() {
    (UserSubjects!=null)? daysCreator()
                        : window.location.href = "../popup-box/popup.html";
    
});
//Crea los divs para cada dia del mes segun la fecha.
const Calendar = document.getElementById("CalendarID");
const daysCreator = ()=>{
    let DaysOfMonth = new Date(CurrentDate.getFullYear(), Month, 0).getDate();
    if (Year % 4 === 0 && Month===1) {
        DaysOfMonth = 29
    }
    for (let index = 1; index <= DaysOfMonth; index++) {
        const miDiv = document.createElement('div');
        const MonthConteiner = document.getElementById("MonthID");
        miDiv.classList.add('dayOfCalendar');
        miDiv.id=index;
        MonthConteiner.innerHTML = Months[Month-1]+" "+Year;
        miDiv.innerHTML = +index;
        Calendar.appendChild(miDiv);
    }
    MarkDate(ActualYear, ActualMonth, ActualDay, "highlighted");
    MarkExamns(UserSubjects)
}

const MarkDate = (Year, Month, Day, className) => {   
    let MonthConteiner = document.getElementById("MonthID").textContent;

    if(MonthConteiner.includes(Year) && MonthConteiner.includes(Months[Month-1])){
        
        for(let index = 1; index < DaysOfMonth; index++){
            let div = document.getElementById(index);
            if (parseInt(div.textContent) === Day) {
                div.classList.add(className);
                break;
            }
        }
    }
}

// Elimina todos los divs de los dias.
const daysEliminate = ()=>{
    while (Calendar.childNodes[2]) {
        Calendar.removeChild(Calendar.childNodes[2]);
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
    window.location.href = "../popup-box/popup.html";
})

async function obtenerFecha(materia, tipoEvento) {
    try {
    const response = await fetch('examenes.json');
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
    console.error('Error al obtener la fecha:', error);
    return null;
    }
}

const MarkExamns = async  (Subjects)=>{
    const SubjectsArray = Subjects.split(',');

    for (const Subject of SubjectsArray) {
        let ExamDate = await  obtenerFecha(Subject,"Examen");

        if (ExamDate) {
            const { year, month, day} = ExamDate;
            MarkDate(year, month, day, "Exam");
            console.log(`Fecha del examen de ${Subject}: ${year}-${month}-${day}`);
        }
        else{
            console.log(`No se encontró la fecha del examen de ${Subject}`);
        }

    };
}