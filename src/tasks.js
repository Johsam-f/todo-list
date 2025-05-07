const add_task_form = document.querySelector(".add-tasks form");
const task_menu = document.querySelector(".add-tasks");
let current_project = "default";
let current_view_status = "all";

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
        status: "undone"
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
    let temp_filter_value;
    let delete_project_btn = false;

    insert_tasks.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if(current_view_status === "all"){
        if(current_project !== "default" )delete_project_btn = true;

        temp_filter_value = current_project === "default"? tasks 
        : tasks.filter(task => task.project === current_project);
    }else if(current_view_status === "done"){
        temp_filter_value = tasks.filter(task => task.status === current_view_status);
    }else if(current_view_status === "undone"){
        temp_filter_value = tasks.filter(task => task.status === current_view_status);
    }

    const filtered_tasks = temp_filter_value;
    
    //displaying heading for current tasks
    const display_project = current_project === "default"? "All":current_project;
    insert_tasks.insertAdjacentHTML("beforeend", 
        `<h3><span>${display_project}</span> tasks</h3>`
    );

    filtered_tasks.forEach((task, index) => {
        insert_tasks.insertAdjacentHTML("beforeend", 
            `<div class="task" data-index="${index}" data-name="${task.title}">
                <p class="title">${counter++}. ${task.title}</p>
                <span>
                    <p class="date">${task.due_date}</p>
                    <p class="priority">${task.priority}</p>
                    <button class="btn x-btn" data-index="${index}"><i>x</i></button>
                </span>
            </div>`
        );
    });    
    if(current_view_status === "all"){
        if(delete_project_btn){
            insert_tasks.insertAdjacentHTML("beforeend", 
                `<button id="add-task-btn" class="btn">
                  <i class="fas fa-add"></i> Add Task
                </button>
                <button id="delete-project-btn" class="btn" title="delete project + all tasks" 
                data-name="${current_project}">
                  <i class="fas fa-cancel"></i> Delete Project
                </button>`
            );

            document.getElementById("delete-project-btn").addEventListener('click', (e)=>{
                delete_project(e.target.dataset.name);
            }); 
            
        }else{
            insert_tasks.insertAdjacentHTML("beforeend", 
                `<button id="add-task-btn" class="btn">
                  <i class="fas fa-add"></i> Add Task
                </button>`
            );
        }
        document.getElementById("add-task-btn").addEventListener('click', ()=>{
            task_menu.classList.toggle("hidden")
        });
    }

    //event listeners
    document.querySelectorAll(".x-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.currentTarget.dataset.index;
            deleteTask(index);
        });
    });

    document.querySelectorAll(".task").forEach(task => {
        task.addEventListener("click", (e) => {
            const title = e.currentTarget.dataset.name;
            display_task(title);
        });
    });
}



function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function delete_project(name){
    const proceed_delete = confirm("You sure you want to delete project + all its tasks?");
    if(!proceed_delete)return;

    current_project = "default";
    current_view_status = "all";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let projects = JSON.parse(localStorage.getItem("projects")) || [];
    
    //delete tasks
    tasks = tasks.filter(task => task.project !== name);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    //delete projects
    projects = projects.filter(project => project !== name);
    localStorage.setItem("projects", JSON.stringify(projects));
    
    location.reload(); //for reloading page
}

// function display_task(title){
//     const tasks = JSON.parse(localStorage.getItem("tasks"));
//     tasks.forEach( task =>{
//         if(task.title === title){
//             document.querySelector(".display-task").classList.toggle("hidden");
//             const render_details = document.getElementById("task-details");
//             render_details.innerHTML = `
//                 <h4>Title</h4>
//                 <p>${task.title}</p>
//                 <h4>Description</h4>
//                 <p id="decrip-p">${task.description}</p>
//                 <h4>Due Date</h4>
//                 <p>${task.due_date}</p>
//                 <h4>Priority</h4>
//                 <p>${task.priority}</p>
//                 <h5>Check whether task is complete or not</h5>
//                 <div>
//                     <label><input type="radio" name="status" value="done" ${task.status === "done" ? "checked" : ""}> Done</label>
//                     <label><input type="radio" name="status" value="undone" ${task.status === "undone" ? "checked" : ""}> Undone</label>
//                 </div>
//                 <!--<div>
//                     <label for="done">done</label>
//                     <input type="radio" name="status" value="done" />
//                     <label for="undone">Undone</label>
//                     <input type="radio" name="status" value="undone" />
//                 </div>-->
//             `;

//              // Attach event listener to update status
//             render_details.querySelectorAll('input[name="status"]').forEach(radio => {
//             radio.addEventListener('change', (e) => {
//                 tasks[taskIndex].status = e.target.value;
//                 localStorage.setItem("tasks", JSON.stringify(tasks));
//                 renderTasks(); // Optional: refresh UI if needed
//             });
//         });
//         }
//     });
// }

function display_task(title) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const taskIndex = tasks.findIndex(task => task.title === title);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    const render_details = document.getElementById("task-details");

    document.querySelector(".display-task").classList.remove("hidden");

    render_details.innerHTML = `
        <h4>Title</h4>
        <p>${task.title}</p>
        <h4>Description</h4>
        <p id="decrip-p">${task.description}</p>
        <h4>Due Date</h4>
        <p>${task.due_date}</p>
        <h4>Priority</h4>
        <p>${task.priority}</p>
        <h5>Status</h5>
        <div>
            <label><input type="radio" name="status" value="done" ${task.status === "done" ? "checked" : ""}> Done</label>
            <label><input type="radio" name="status" value="undone" ${task.status === "undone" ? "checked" : ""}> Undone</label>
        </div>
    `;

    //event listener to update status
    render_details.querySelectorAll('input[name="status"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            tasks[taskIndex].status = e.target.value;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        });
    });
}


document.getElementById("projects-container").addEventListener("click", (e) => {
    if (e.target.classList.contains("project-btn")) {
        current_project = e.target.dataset.name;
        current_view_status = "all";
        renderTasks();
        document.querySelectorAll(".nav-btn").forEach(btn => 
            btn.classList.remove("active-btn")
        );
        e.target.classList.add("active-btn");
    }
});


document.querySelector("#view-all-tasks").addEventListener('click', ()=>{
    current_project = "default";
    current_view_status = "all";
    renderTasks();
});

document.querySelector("#view-done-tasks").addEventListener('click', ()=>{
    current_project = "done";
    current_view_status = "done";
    renderTasks();
});

document.querySelector("#view-undone-tasks").addEventListener('click', ()=>{
    current_project = "undone";
    current_view_status = "undone";
    renderTasks();
});

document.querySelector(".tasks-btn").addEventListener('click', (e)=>{
    if(e.target.classList.contains("nav-btn")){
        document.querySelectorAll(".nav-btn").forEach(btn => 
            btn.classList.remove("active-btn")
        );
        e.target.classList.add("active-btn");
    }
});

renderTasks();