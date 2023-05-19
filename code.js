
const popup = document.getElementById("popup");
const aceptar = document.getElementById("Accept");

aceptar.addEventListener("click", function() {
  const inputs = document.querySelectorAll("input[type='checkbox']");
  const UserSelected = [];
  inputs.forEach(input => {
    if(input.checked){
      UserSelected.push(input.value);
    }
  })
  localStorage.setItem("Subjects",UserSelected)
  window.location.href = "./calendar/calendar.html";
});

window.addEventListener("load", function() {
  popup.style.display = "block";
});

