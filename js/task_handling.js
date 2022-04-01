
  function editNode(el) {
    let id = el.getAttribute('data-id');
    if (id != null) {
        let rect = el.getBoundingClientRect();
        let x = rect.left + window.scrollX;
        let modalElement = document.querySelector(".modal");
        modalElement.style.left = x + 'px';

        let dialog = document.querySelector("#dialog");
        dialog.style.display = 'inline';
        taskToEdit = app.findTask(id);
        initializeDialog(taskToEdit);
    }
  }

  function removeNode(el) {
    let id = el.getAttribute('data-id');
    if (id != null) {
        app.removeTask(id);
    }
  }

  function startDrag (evt) {
    let data_id = evt.target.getAttribute('data-id')
    evt.dataTransfer.dropEffect = 'move'
    evt.dataTransfer.effectAllowed = 'move'
    evt.dataTransfer.setData('id', data_id);
  }

  function onDrop(evt) {
      evt.preventDefault();
      let data = evt.dataTransfer.getData('id');
      let category = evt.target.getAttribute('category');
      if (category != null && data != null) {
        app.moveTask(data, category);
      }
  }

  function openPicker(el) {
    let checked = el.checked;
    if (checked) {
        let cal = document.querySelector('#duedate');
        cal.focus();
        cal.showPicker();
    }
  }

  function taskDialog() {
    let modalElement = document.querySelector(".modal");
    modalElement.style.left = '10px';
    let dialog = document.querySelector("#dialog");
    dialog.style.display = 'inline';
  }

  function getDateString() {
    let today = new Date();
    let year = today.getFullYear();
    var month = '' + today.getMonth();
    var day = '' + today.getDay();
    month = (month.length == 1) ? '0' + month: month;
    day = (day.length == 1) ? '0' + day: day;
    return year + '-' + month + '-' + day;
  }

  function updateTask() {
    let taskInfo = document.querySelector("#newTaskInfo");
    let assign = document.querySelector("#assign");   
    let priority = document.querySelector("#priority");
    let cal = document.querySelector('#duedate');
    
    if (taskToEdit != null) {
        taskToEdit.name = taskInfo.value;
        taskToEdit.assign = assign.value;
        taskToEdit.priority = priority.value;
        taskToEdit.due = cal.value;
        taskToEdit = null;
    } else {
        let node = {
            category: 'New',
            name: taskInfo.value,
            priority: priority.value,
            assign: assign.value,
            added: getDateString(),
            due: cal.value,
            comments: []
        };
        app.addTask(node);
    }
    resetDialog();
  }

  function initializeDialog(task) {
    let taskInfo = document.querySelector("#newTaskInfo");
    taskInfo.value = task.name;
    
    let assign = document.querySelector("#assign");
    assign.value = task.assign;
    
    let priority = document.querySelector("#priority");
    priority.value = task.priority;
    
    let cal = document.querySelector("#duedate");
    cal.value = task.due;

    let check = document.querySelector("#datecheck");
    check.checked = (task.due != '');
  }

  function resetDialog() {
    let dialog = document.querySelector("#dialog");
    dialog.style.display = 'none';

    let taskInfo = document.querySelector("#newTaskInfo");
    taskInfo.value = "";
    
    let assign = document.querySelector("#assign");
    assign.value = "";
    
    let priority = document.querySelector("#priority");
    priority.value = "P2";
    
    let cal = document.querySelector("#duedate");
    cal.value = "";

    let check = document.querySelector("#datecheck");
    check.checked = false;
  }

  function showLoad() {
    let load_dialog = document.querySelector("#load");
    let kanban_data = document.querySelector("#kanban_data");

    load_dialog.style.display = 'block';
    kanban_data.value = app.getJSON();
  }

  function hideLoad() {
    let load_dialog = document.querySelector("#load");
    load_dialog.style.display = 'none';
  }

  function resetKanbanData() {
    app.reset()
  }
  
  function updateKanbanData() {
    let kanban_data = document.querySelector("#kanban_data");
    try {
        let update_json = JSON.parse(kanban_data.value);
        app.update(update_json);
    } catch {
        alert('Invalid JSON data.');
    }
  }

  function copyKanbanData() {
    let kanban_data = document.querySelector("#kanban_data");
    navigator.clipboard.writeText(kanban_data.value).then(
        function () {
          alert("data copied to the clipboard");
        }
    );
  }

  function showSettings() {
      let settings_dialog = document.querySelector("#settings");
      settings_dialog.style.display = 'block';
  }

  function hideSettings() {
    let settings_dialog = document.querySelector("#settings");
    settings_dialog.style.display = 'none';
  }

  function removeUser() {
    let user_list = document.querySelector("#user_list");
    let userToDelete = user_list.value;
    if(user_list.options.length == 1) {
        alert('You need at least one user for this app.');
        return;
    }
    app.removeUser(userToDelete);
  }

  function addUser(isBefore) {
    let user_list = document.querySelector("#user_list");
    let new_user = document.querySelector("#newUserName");
    if (new_user.value.length > 0) {
        let userName = new_user.value;
        let idx = user_list.selectedIndex;
        app.addUser(userName, idx, isBefore);
    }
    new_user.value = '';
  }

  function removeCategory() {
    let category_list = document.querySelector("#category_list");
    let categoryToDelete = category_list.value;
    if(category_list.options.length == 1) {
        alert('You need at least one phase for this app.');
        return;
    }
    app.removeCategory(categoryToDelete);
  }

  function addCategory(isBefore) {
    let category_list = document.querySelector("#category_list");
    let new_category = document.querySelector("#newCategoryName");
    if (new_category.value.length > 0) {
        let categoryName = new_category.value;
        let idx = category_list.selectedIndex;
        app.addCategory(categoryName, idx, isBefore);
    }
    new_category.value = '';
  }

  function downloadData() {
    let localData = localStorage.getItem('data');
    var dataUrl = "data:text/json;charset=utf-8," + encodeURIComponent(localData);
    var link = document.createElement("a");
    link.download = "my-kanban.json";
    link.href = dataUrl;
    link.click();
  }