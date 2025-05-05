import './styles.css';
import './projects';
import add_project from './projects';


const nav_status = document.querySelector("nav");
const content = document.getElementById("inner-content");
const project_menu = document.querySelector(".add-projects");
const task_menu = document.querySelector(".add-tasks");


document.getElementById("navigation").addEventListener('click', ()=>{
    content.classList.toggle("nav-hidden");
    nav_status.classList.toggle('hide-nav');
}); 

document.getElementById("add-project-btn").addEventListener('click', ()=>{
    project_menu.classList.toggle("hidden")
});

document.getElementById("add-task-btn").addEventListener('click', ()=>{
    task_menu.classList.toggle("hidden")
});

document.querySelectorAll(".cancel-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.target.closest(".pop-ups").classList.add("hidden");
    });
});