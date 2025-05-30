const add_project_form = document.querySelector(".add-projects form");

add_project_form.addEventListener("submit", (e) => {
  e.preventDefault();

  const project_name = document.getElementById("Project-name").value.trim();
  if (project_name === "") return;

  saveProjectToStorage(project_name);
  renderProjects();
  add_project_form.reset();
  document.querySelectorAll(".pop-ups").forEach(popup => {
    if (!popup.classList.contains("hidden")) {
        popup.classList.add("hidden");
    }
});
});

function saveProjectToStorage(projectName) {
  let projects = JSON.parse(localStorage.getItem("projects")) || [];

  if (!projects.includes(projectName)) {
    projects.push(projectName);
    localStorage.setItem("projects", JSON.stringify(projects));
  }
}

function renderProjects() {
  const project_list = document.getElementById("projects-container");

  // Remove old buttons
  document.querySelectorAll(".project-btn").forEach(btn => btn.remove());

  const projects = JSON.parse(localStorage.getItem("projects")) || [];

  projects.forEach(project => {
    project_list.insertAdjacentHTML(
      "beforeend",
      `<button class="btn project-btn nav-btn" data-name="${project}">${project}</button>`
    );
  });
}

renderProjects();