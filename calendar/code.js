
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
                        : window.location.href = "../popup.html";
    
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
    MarkExamns(UserSubjects)
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
    window.location.href = "../popup.html";
})

async function obtenerFecha(materia, tipoEvento) {
    try {
    const response = await fetch('../files/examenes.json');
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
    console.log(SubjectsArray);
    
    for (const Subject of SubjectsArray) {
        let ExamDate = await  obtenerFecha(Subject,"Examen");

        if (ExamDate) {
            const { year, month, day} = ExamDate;
            
            MarkDate(year, month, day, "Exam", Subject);
            
            // console.log(`Fecha del examen de ${Subject}: ${year}-${month}-${day}`);
        }
        else{
            console.log(`No se encontró la fecha del examen de ${Subject}`);
        }

    };
}