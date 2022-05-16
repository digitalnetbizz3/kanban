var nodeToEdit = null
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
        storageName = 'data-gantt-shared';
        localStorage.setItem(storageName, output)
        app.changeStorage()
        closeLeftPanel()
        setTimeout(() => {updateDiagram()}, 500)
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

  let duration = document.querySelector('#duration')
  let startdate = document.querySelector('#start_date')

  for(let i=1; i<=60; i++) {
    var option = document.createElement("option");
    option.value = i
    option.text = i + ' day(s)'
    duration.add(option);
  }
  let currDate = new Date()
  startdate.value = currDate.toISOString().split('T')[0]

  setTimeout(() => {
    let storageLocation = document.querySelector("#storageOptions");
    storageLocation.value = storageName;

    prepare_for_edit();
  }, 500)  
}

function showLoad() {
  let load_dialog = document.querySelector("#load");
  let kanban_data = document.querySelector("#data_text");
  closeLeftPanel();
  load_dialog.style.display = 'block';
  kanban_data.value = app.getJSON();
}

function hideLoad() {
  let load_dialog = document.querySelector("#load");
  load_dialog.style.display = 'none';
  openLeftPanel();
}

function reorder(isUp) {
  let user_list = document.querySelector("#resource_list");
  let from = user_list.selectedIndex;
  let to = (isUp) ? from-1 : from+1;
  app.reorderResource(from, to);
  app.persist();
  user_list.selectedIndex = to;
  setTimeout(function() {
    prepare_for_edit();
  }, 100);
}

function add_resource() {
  let new_user_name = document.querySelector("#newUserName");
  app.addResource(new_user_name.value);
  setTimeout(function() {
    prepare_for_edit();
  }, 100);
}

function remove_resource() {
  let resource_list = document.querySelector("#resource_list");
  let resourceToDelete = resource_list.value;
  if(resource_list.options.length == 1) {
      toast_dialog.show('You need at least one resource for this app.');
      return;
  }
  app.removeResource(resourceToDelete);
  setTimeout(function() {
    resource_list.selectedIndex = 0;
    prepare_for_edit();
  }, 100);
}

function update_resource() {
  let resource_list = document.querySelector("#resource_list");
  let new_user_name = document.querySelector("#newUserName");
  let user_context = app.findResource(resource_list.value);
  
  if (new_user_name.value == user_context.name) {
    toast_dialog.show("nothing changed.")
    return
  }
  else {
    user_context.name = new_user_name.value;
    app.persist();
    updateDiagram();
  }
}

function addResource(isBefore) {
  let resource_list = document.querySelector("#resource_list");
  let new_user = document.querySelector("#newUserName");
  if (new_user.value.length > 0) {
      let userName = new_user.value;
      let idx = resource_list.selectedIndex;
      app.addResource(userName, idx, isBefore);
  }
  new_user.value = '';
}

function openLeftPanel() {
  let leftPanel = document.querySelector("#left_panel");
  let restorePanel = document.querySelector("#restore_panel");
  restorePanel.style.display = 'none';
  leftPanel.style.display = 'table-cell';
}

function closeLeftPanel() {
  let leftPanel = document.querySelector("#left_panel");
  let restorePanel = document.querySelector("#restore_panel");
  leftPanel.style.display = 'none';
  restorePanel.style.display = 'block';
}

function toggleLeftPanel() {
  let leftPanel = document.querySelector("#left_panel");
  let restorePanel = document.querySelector("#restore_panel");
  let diagram = document.querySelector("diagram");
  
  if (restorePanel.style.display == 'none') {
    leftPanel.style.display = 'none';
    restorePanel.style.display = 'block';
  } else {
    restorePanel.style.display = 'none';
    leftPanel.style.display = 'table-cell';
  } 
}

function prepare_for_new() {
  let new_user_name = document.querySelector("#newUserName");
  let add_or_update = document.querySelector("#add_or_update");
 
  add_or_update.onclick = add_resource;
  new_user_name.value = '';
  new_user_name.focus()
  add_or_update.innerText = 'Add';
}

function prepare_for_edit() {
  let resource_list = document.querySelector("#resource_list");
  let user_context = app.findResource(resource_list.value);
  app.updateId(user_context.id)

  setTimeout(() => {
    let reorder_up = document.querySelector("#reorder_up");
    let reorder_dn = document.querySelector("#reorder_dn");
    let resource_list = document.querySelector("#resource_list");
    let workitem_list = document.querySelector("#workitem_list");
    let new_user_name = document.querySelector("#newUserName");
    let add_or_update = document.querySelector("#add_or_update");
    let idx = resource_list.selectedIndex;
    let size = resource_list.options.length;
  
    let user_context = app.findResource(resource_list.value);
  
    add_or_update.onclick = update_resource;
    new_user_name.value = user_context.name;
    add_or_update.innerText = 'Update';
  
    reorder_dn.disabled = false;
    reorder_up.disabled = false;
        
    if (idx == 0) {
      reorder_up.disabled = true;
    }
    if (idx == size - 1) {
      reorder_dn.disabled = true;
    }
    workitem_list.selectedIndex = 0    
    setButtonStates()
    updateDiagram();
  }, 200)
}
function setButtonStates() {
  let edit_workitem = document.querySelector("#edit_workitem");
  let remove_workitem = document.querySelector("#remove_workitem");

  let hasWorkItem = (workitem_list.options.length > 0) 
  edit_workitem.disabled = !hasWorkItem
  remove_workitem.disabled = !hasWorkItem  

}

function updateDiagram() {
  var element = document.getElementById("diagram");
  var insertSvg = function(svgCode, bindFunctions) {
    element.innerHTML = svgCode;
  };
  var graphDefinition = app.getMarkDown();
  var graph = mermaidAPI.render("mermaid", graphDefinition, insertSvg);
}

function closeModalForWorkItemMetadata() {
  let load_dialog = document.querySelector("#workitem_metadata");
  load_dialog.style.display = 'none';
}

function showModalForWorkItemMetadata(isEdit) {
  let input = document.querySelector('#title')
  let commitButton = document.querySelector('#button_title_modal')
  let load_dialog = document.querySelector("#workitem_metadata")


  if (isEdit) {
    let list = document.querySelector('#workitem_list')
    let duration = document.querySelector('#duration')
    let startdate = document.querySelector('#start_date')

    let selectedId = list.value
    let workItem = app.findWorkItemFromContext(selectedId)

    startdate.value = workItem.startdate
    input.value = workItem.name
    duration.value = workItem.duration
    commitButton.innerText = 'Update Work-Item'
    commitButton.onclick = editWorkItem
  } else {
    input.value = '';
    commitButton.innerText = 'Add Work-Item'
    commitButton.onclick = addWorkItem
  }
  load_dialog.style.display = 'block';
  input.focus();  
}

function removeWorkItemMetadata() {
  let list = document.querySelector('#workitem_list')
  let selectedId = list.value
  app.removeWorkItem(selectedId)

  prepare_for_edit()
}

function editWorkItem() {
  let list = document.querySelector('#workitem_list')
  let duration = document.querySelector('#duration')
  let startdate = document.querySelector('#start_date')
  let title = document.querySelector('#title')

  if (title.value.length > 0) {
    let id = list.value
    app.updateWorkItem(id, title.value, startdate.value, duration.value)
    updateDiagram()
  } else {
    toast_dialog.show('Need title to add new work-item')
  }
  closeModalForWorkItemMetadata()
}
function addWorkItem() {
  let duration = document.querySelector('#duration')
  let startdate = document.querySelector('#start_date')
  let title = document.querySelector('#title')

  if (title.value.length > 0) {
    app.addWorkItem(title.value, startdate.value, duration.value)
    updateDiagram()
  } else {
    toast_dialog.show('Need title to add new work-item')
  }
  closeModalForWorkItemMetadata()

}