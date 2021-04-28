document.addEventListener("DOMContentLoaded", function () {

// check width of the window and based on that hide the menu
    if (screen.availWidth < 751) {
        ToggleMenu();
    }

    // function to hide/unhide the menu-sidebar
    function ToggleMenu() {
        document.querySelector('.sidebar').classList.toggle("sidebarTransform");
    }

    // arrays for to dos, project
    let myTodos = [];
    let myProjects = [];
    let projectDisplay = 'Inbox';


    // elements related to the projects
    class Project {
        constructor(projectName) {
            this.projectName = projectName;
        }
    }
    
    //elements triggered when user wants to create a new project
    document.querySelector('#submit_new_project').addEventListener('click', function () {
        if (document.querySelector('#input_new_project').value !='') {
            let project1 = new Project(document.querySelector('#input_new_project').value);
            document.querySelector('#input_new_project').value ='';
            addProj(project1);
            storeProj(); 
            displayProj();
        }  else {document.querySelector('#input_new_project').style.borderColor = 'red'}
    });


    // check if field is valid or not (for project)
    document.querySelector('#input_new_project').addEventListener("keyup", function () {
        borderColorProj();
    });

    // check if field is valid or not (for project)
    function borderColorProj() {
        if (document.querySelector('#input_new_project').value !='') {
            document.querySelector('#input_new_project').style.borderColor = '';
        }
    }

    // add the project to the array
    function addProj(proj) {
        myProjects.push(proj);     
    }

    //locally store the projects
    function storeProj() {
        localStorage.setItem('myProjects', JSON.stringify(myProjects));
    }

    //display the projects
    function displayProj() {
        document.querySelectorAll("#proj").forEach(e => e.parentNode.removeChild(e));

        const divProj = document.querySelector('#project_list');

        for (i in myProjects){
            const ProjectName = document.createElement('h3');
            ProjectName.innerHTML = myProjects[i].projectName;
            ProjectName.id = 'proj';
            divProj.append(ProjectName);
        }


        //trigger functions when user clicks on a project, to display to dos for that project
        document.querySelectorAll('#proj').forEach(proj => {
            proj.addEventListener('click', function () {
                projectDisplay = proj.textContent;
                removeInboxTitle();
                displayToDos();
                hideCreate();
            });
        }); 
    
    }

    // click on the inbox
    document.querySelector('#inbox').addEventListener('click', function () {
        projectDisplay = 'Inbox';
        project.dataset.proj =  projectDisplay;
        removeInboxTitle();
        displayToDos();
        hideCreate();
    });


    // click on the today
    document.querySelector('#date_t').addEventListener('click', function () {
        let currentDate = new Date().toLocaleDateString ().substr(0, 19);
        for (i in myTodos){
            if (myTodos[i].dueDate == currentDate) {console.log(myTodos[i])}
        }
    });



    // click on the  week
    document.querySelector('#date_w').addEventListener('click', function () {
        console.log('w');
    });



    // elements related to the To Dos
    class Todo {
        constructor(project, title, description, dueDate, priority) {
            this.id = maxId() +1;
            this.project = project;
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.priority = priority;
        }
    }

    // define the max id to determine the ID of a new To Do 
    function maxId(){
        let max = [0];
        for (i in myTodos) {
            max.push(myTodos[i].id)
        }
        let max_id = Math.max(...max);
        return max_id;
    }

    // elements from the create To Do Form
    let titleToDo = document.querySelector('#title');
    let descriptionToDo = document.querySelector('#description');
    let dueDateToDo = document.querySelector('#dueDate');
    let prioToDo = document.querySelector('#priority');
    let project = document.querySelector('.todos');



    // action that displays the form to create a new to do 
    document.querySelector('#img_add_top_nav').addEventListener('click', function () {
        document.querySelector('#update_todo').style.display = 'none';    
        resetCreateUpdate();
        displayCreate();
    });

    // click on the menu icon toggle the sidebar-menu
    document.querySelector('#menu').addEventListener('click', function () {
        ToggleMenu();
    });


    // check if field is valid or not (for to do, title)
    document.querySelector('#title').addEventListener("keyup", function () {
        borderColor();
    });

    //click on the create to do button to create a new to do
    document.querySelector('#create_todo').addEventListener('click', function () {
        if (titleToDo.value !='') {
            createToDo(projectDisplay, titleToDo.value, descriptionToDo.value, dueDateToDo.value, prioToDo.value);
        } else {titleToDo.style.borderColor = 'red'}
    });

    // click on the cancel hides the form
    document.querySelector('#cancel').addEventListener('click', function () {
        resetCreateUpdate();
        titleToDo.style.borderColor = '';
        hideCreate();
    });



    // displaying to dos
    function displayToDos() {
        document.querySelectorAll(".item").forEach(e => e.parentNode.removeChild(e));

        const container = document.querySelector('.todos');

        const h2 = document.createElement('h2');
        h2.textContent = projectDisplay;
        h2.id = 'Inbox_title';
        container.append(h2);

        for (const i in myTodos) {
            if(myTodos[i].project == projectDisplay) {
                displayCreateToDo(myTodos[i]);
            }
        }   


        // function creating all DOM elements to display To Dos
        function displayCreateToDo(todo) {
            const div = document.createElement('div');
            div.className = 'item';
            container.append(div);

            const TitleToDoDiv = document.createElement('h4');
            TitleToDoDiv.textContent = todo.title;
            div.append(TitleToDoDiv);

            const imagesDiv = document.createElement('div');
            div.append(imagesDiv);

            const imagePrio = document.createElement('img');
            imagePrio.className = 'icons_prio';
            if (todo.priority == 'Low') {imagePrio.src = "src/img/low.png"; imagePrio.style.backgroundColor = 'rgb(247, 247, 247)';}
            else if (todo.priority == 'High') {imagePrio.src = "src/img/high.png"; imagePrio.style.backgroundColor = 'rgb(247, 247, 247)';}
            else {imagePrio.src = "src/img/medium.png";}
            imagePrio.alt = todo.priority;
            imagePrio.title = todo.priority;
            imagesDiv.append(imagePrio);

            const imageDelete = document.createElement('img');
            imageDelete.className = 'icons';
            imageDelete.src = "src/img/delete.png";
            imageDelete.title = 'Remove the To Do';
            imageDelete.alt = 'Remove';
            imageDelete.addEventListener('click', () => {
                removeTodo(todo);
            });
            imagesDiv.append(imageDelete);

            const imageEdit = document.createElement('img');
            imageEdit.className = 'icons';
            imageEdit.src = "src/img/edit.png";
            imageEdit.title = 'Edit the To Do';
            imageEdit.alt = 'Edit';
            imageEdit.id = 'edit';
            imageEdit.dataset.todo = todo.id;
            imagesDiv.append(imageEdit);

        }  




        // event on the Edit icon to update the to do
        document.querySelectorAll('#edit').forEach(edit_todo => {
            edit_todo.addEventListener('click', function () {
                let x = myTodos.find(x => x.id == edit_todo.dataset.todo);
                titleToDo.value = x.title;
                descriptionToDo.value = x.description;
                dueDateToDo.value = x.dueDate;
                prioToDo.value = x.priority;
                project.value = x.project;
                document.querySelector('#update_todo').style.display = 'block';    
                document.querySelector('#create_todo').style.display = 'none';     
                displayCreate();
                document.querySelector('#update_todo').addEventListener('click', function () {
                    x.title = titleToDo.value;
                    x.description =descriptionToDo.value;
                    x.dueDate =dueDateToDo.value;
                    x.priority = prioToDo.value ;
                    document.querySelector('#update_todo').style.display = 'none';    
                    document.querySelector('#create_todo').style.display = 'block';    
                    store();
                    displayToDos();
                    hideCreate();
                    removeInboxTitle();
                 });
            });
        });

    }  
 

    //avoid duplicates title when user selects another title, as title is created with DOM JS
    function removeInboxTitle() {
        document.querySelector('#Inbox_title').remove();
    }

    //function launched (and others) when user creates a new to do
    function createToDo(project, title, description, dueDate, priority) {
        let todo1 = new Todo(project, title, description, dueDate, priority);
        addTodo(todo1);
        store();
        displayToDos();
        hideCreate();
        resetCreateUpdate();
        removeInboxTitle();
    }

    // local store the to dos
    function store() {
            localStorage.setItem('myTodos', JSON.stringify(myTodos));
    }
    
    // add to dos to the array
    function addTodo(todo) {
        myTodos.push(todo);     
    }

    // hide the form
    function hideCreate() {    
        document.querySelector('.create').style.display = 'none';
        document.querySelector('.todos').style.display = 'block';
    }

    //display the form
    function displayCreate() {    
        document.querySelector('.create').style.display = 'block';
        document.querySelector('.todos').style.display = 'none';
    }


    // check if field is valid or not (for to do / title)
    function borderColor() {
        if (titleToDo.value !='') {
            titleToDo.style.borderColor = '';
        }
    }

    // function that resets the form (create to do form)
    function resetCreateUpdate(){
        titleToDo.value ='';
        descriptionToDo.value='';
        dueDateToDo.value ='';
        prioToDo.value = 'Medium';
    }

    // remove the to do from the array & launch other functions to render that
    function removeTodo(toDo) {
        let tempTodos=[];
        for (const i in myTodos) {
            if(myTodos[i] != toDo) {
                tempTodos.push(myTodos[i])
            }
        }
        myTodos = tempTodos;
        store();
        removeInboxTitle();
        displayToDos();
    }

    //when user loads the page, functions launched to display to do, projects
    function initiateData() {
        if(localStorage.getItem('myTodos')) {
            myTodos = JSON.parse(localStorage.getItem('myTodos'));
        }
        if(localStorage.getItem('myProjects')) {
            myProjects = JSON.parse(localStorage.getItem('myProjects'));
        }
        hideCreate();
        displayToDos();
        displayProj();
    }

    initiateData();

});