const add_task_form = document.querySelector(".add-tasks form");
const task_menu = document.querySelector(".add-tasks");
let current_project = "default";

add_task_form.addEventListener("submit", (e) => {
    e.preventDefault();
    add_task();
});

function createTask(title, description, due_date, priority = "low", project = "default") {
    return {
        title,
        description: description?.trim() || "No description",
        due_date,
        priority,
        project,
    };
}

function add_task() {
    const task_title = document.getElementById("title").value.trim();
    const input_description = document.getElementById("description");
    const due_date = document.getElementById("date").value;
    const input_priority = document.querySelector(`input[name="priority"]:checked`);

    if (!task_title) return; // prevent empty titles

    const task = createTask(
        task_title,
        input_description?.value,
        due_date,
        input_priority?.value || "low",
        current_project
    );

    saveTaskToStorage(task);
    renderTasks();
    add_task_form.reset();
}


function saveTaskToStorage(activity){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    tasks.push(activity);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(){
    const insert_tasks = document.getElementById("inner-content");
    let counter = 1;

    insert_tasks.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const filtered_tasks = current_project === "default"? tasks 
    : tasks.filter(task => task.project === current_project);

    filtered_tasks.forEach((task, index) => {
        insert_tasks.insertAdjacentHTML("beforeend", 
            `<div class="task" data-index="${index}">
                <p class="title">${counter++}. ${task.title}</p>
                <span>
                    <p class="date">${task.due_date}</p>
                    <p class="priority">${task.priority}</p>
                    <button class="btn x-btn" data-index="${index}"><i>x</i></button>
                </span>
            </div>`
        );
    });    
    insert_tasks.insertAdjacentHTML("beforeend", 
        `<button id="add-task-btn" class="btn">
          <i class="fas fa-add"></i> Add Task
        </button>`
    );

    //event listeners
    document.querySelectorAll(".x-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.currentTarget.dataset.index;
            deleteTask(index);
        });
    });

    document.getElementById("add-task-btn").addEventListener('click', ()=>{
        task_menu.classList.toggle("hidden")
    });
}



function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

document.getElementById("projects-container").addEventListener("click", (e) => {
    if (e.target.classList.contains("project-btn")) {
        current_project = e.target.dataset.name;
        renderTasks();
        document.querySelectorAll(".nav-btn").forEach(btn => 
            btn.classList.remove("active-btn")
        );
        e.target.classList.add("active-btn");
    }
});


document.querySelector("#view-all-tasks").addEventListener('click', ()=>{
    current_project = "default";
    renderTasks();
});

document.querySelector(".tasks-btn").addEventListener('click', (e)=>{
    document.querySelectorAll(".nav-btn").forEach(btn => 
        btn.classList.remove("active-btn")
    );
    e.target.classList.add("active-btn");
});

renderTasks();