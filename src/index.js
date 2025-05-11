import './styles.css';
import './projects';
import './tasks';


const nav_status = document.querySelector("nav");
const project_menu = document.querySelector(".add-projects");


document.getElementById("navigation").addEventListener('click', ()=>{
    nav_status.classList.toggle('hide-nav');
}); 

document.getElementById("add-project-btn").addEventListener('click', ()=>{
    project_menu.classList.toggle("hidden")
});

//cancel btn for submitting task
document.querySelectorAll(".cancel-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.target.closest(".pop-ups").classList.add("hidden");
    });
});