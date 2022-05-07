
  function editNode(el) {
    let id = el.getAttribute('data-id');
    if (id != null) {
        let rect = el.getBoundingClientRect();
        let x = rect.left + window.scrollX;
        let modalElement = document.querySelector(".inputmodal");
        modalElement.style.left = x + 'px';

        let dialog = document.querySelector("#dialog");
        dialog.style.display = 'inline';
        taskToEdit = app.findTask(id);
        initializeDialog(taskToEdit);
    }
  }

  function updateDiagram() {}

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
    let newCategory = document.querySelector("#category_section");
    let rect = newCategory.getBoundingClientRect();
    let x = rect.left + window.scrollX + 5;

    let modalElement = document.querySelector(".inputmodal");
    modalElement.style.left = x + 'px';
    let dialog = document.querySelector("#dialog");
    dialog.style.display = 'inline';
    let assign = document.querySelector("#assign");   
    assign.selectedIndex = 0
    let taskInfo = document.querySelector("#newTaskInfo");
    taskInfo.focus();
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
    var priority = 'P2';
    let radios = document.getElementsByName('priority');
    radios.forEach(el => {
      if(el.checked) {
        priority = el.id;
      }
    });

    let cal = document.querySelector('#duedate');
    if (taskToEdit != null) {
        taskToEdit.name = taskInfo.value;
        taskToEdit.assign = assign.value;
        taskToEdit.priority = priority;
        taskToEdit.due = cal.value;
        taskToEdit = null;
        app.persist()
    } else {
      let node = {
            name: taskInfo.value,
            priority: priority,
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
    
    let priority = document.querySelector('#' + task.priority);
    priority.checked = true;
    
    let cal = document.querySelector("#duedate");
    cal.value = task.due;

    let check = document.querySelector("#datecheck");
    check.checked = (task.due != '');
    
    taskInfo.focus();
  }

  function resetDialog() {
    let dialog = document.querySelector("#dialog");
    dialog.style.display = 'none';

    let taskInfo = document.querySelector("#newTaskInfo");
    taskInfo.value = "";
    
    let assign = document.querySelector("#assign");
    assign.value = "";
    
    let priority = document.querySelector("#P2");
    priority.check = true;
    
    let cal = document.querySelector("#duedate");
    cal.value = "";

    let check = document.querySelector("#datecheck");
    check.checked = false;
  }

  function showLoad(isConfig) {
    let kanban_data = document.querySelector("#data_text");
    kanban_data.value = app.getJSON();
    
    let leftNav = bootstrap.Collapse.getOrCreateInstance(document.getElementById('left-nav'))
    let col1 = bootstrap.Collapse.getOrCreateInstance(document.getElementById('collapseOne'))
    let col2 = bootstrap.Collapse.getOrCreateInstance(document.getElementById('collapseTwo'))

    if (isConfig) {
      col1.show();
      col2.hide();
    } else {
      col2.show();
      col1.hide();
    }
    leftNav.show();
  }

  function hideLoad() {
    var collapse = document.getElementById('left-nav')
    let nav = new bootstrap.Collapse(collapse, {});
    nav.hide();
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
        toast_dialog.show('You need at least one user for this app.');
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
        toast_dialog.show('Must have at least 1 category');
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

  var app = null
  function appLoad(appInstance) {
    app = appInstance
    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');
    if (shareData != null) {
      const lib = JsonUrl('lzma');
      lib.decompress(shareData).then(output => { 

        try {
          JSON.parse(output);
          storageName = 'data-kanban-shared';
          localStorage.setItem(storageName, output)
          app.changeStorage();
        } catch(e) {
          console.log(e)
          toast_dialog.show('shared JSON is invalid')
        }
      })
    } else {
      
      if (window.location.href.indexOf('switch') < 0) {
        showChooser();  
      }  
    }
    let storageLocation = document.querySelector("#storageOptions");
    storageLocation.value = storageName;
  }