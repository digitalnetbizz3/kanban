  var nodeToEdit = null;
  var app = null;
  var selectedShape = null;  

  function appLoad(appInstance) {
    app = appInstance
    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');
    if (shareData != null) {
      const lib = JsonUrl('lzma');
      lib.decompress(shareData).then(output => { 
        try {
          JSON.parse(output);
          storageName = 'data-class-shared';
          localStorage.setItem(storageName, output)
          app.changeStorage();
          closeLeftPanel();
        } catch(e) {
          toast_dialog.show('shared JSON is invalid')
        }
      })
    } else {
      if (window.location.href.indexOf('switch') < 0) {
        showChooser();  
      }  
    }

    prepare_for_edit();
    setTimeout(() => { 
      let storageLocation = document.querySelector("#storageOptions");
      storageLocation.value = storageName; 
      updateDiagram() 
    }, 500)    
  }

  function toggleAddEditUI(isNote) {
    let noteUI = document.querySelector('#add_note_ui');
    let messageUI = document.querySelector('#add_message_ui');
    if (isNote) {
      // note
      noteUI.style.display = 'inline';
      messageUI.style.display = 'none';
    } else {
      // message
      noteUI.style.display = 'none';
      messageUI.style.display = 'inline';
    }
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

  function showSettings() {
      let settings_dialog = document.querySelector("#settings");
      settings_dialog.style.display = 'block';
  }

  function hideSettings() {
    let settings_dialog = document.querySelector("#settings");
    settings_dialog.style.display = 'none';
  }

  function prepare_for_new() {
    let class_title = document.querySelector("#class_title")
    let add_or_update = document.querySelector("#add_or_update")
    
    class_title.value = ''
    class_title.focus()
    add_or_update.innerText = 'Add'
  }

  function updateClass() {
    let class_title = document.querySelector("#class_title")
    app.updateClassName(class_title.value)
    updateDiagram()
  }
  
  function addClass() {
    app.addClass()
    setTimeout(() => {
      updateDiagram()
      let classes = document.querySelector('#user_list')
      classes.selectedIndex = classes.options.length - 1
    }, 250)
  }

  function addLink() {
    let toClass = document.querySelector('#to_class').value
    let fromClass = app.getContext().name
    let relation = document.querySelector('#relation_list').value

    if (toClass.length > 0 && fromClass.length > 0 && relation.length > 0) {
      app.addLink(toClass, fromClass, relation)
      setTimeout(()=> {
        populateSelection()
        updateDiagram();
      }, 100)
    } else {
      toast_dialog.show('Need to have add fields populated to add relationship')
    }
  }

  function removeRelationshipFromAdorner() {
    let relationships = document.querySelector('#current_relations')
    if (relationships.selectedIndex >= 0) {
      app.removeLink(relationships.value)
      setTimeout(()=> {
        populateSelection()
        updateDiagram();
      }, 100)
    } else {
      toast_dialog.show('Please select a relationship to delete')
    }
  }

  function removeClass() {
    let classes = document.querySelector('#user_list')
    if (classes.options.length == 1) {
      toast_dialog.show('Must be at least 1 class')
      return
    }
    app.updateId(app.findClassByIndex(0).id)    
    app.removeClass(classes.value);
    updateDiagram();    
    setTimeout(() => { classes.selectedIndex = 0;}, 100)    
  }

  function removeMethodMetadataFromClass() {
    let methods = document.querySelector('#method_list')
    app.removeMethodFromContext(methods.value)
    closeModalForClassMetadata()
    updateDiagram()    
  }

  function removeFieldMetadataFromClass() {
    let fields = document.querySelector('#field_list')
    app.removeFieldFromContext(fields.value)
    closeModalForClassMetadata()
    updateDiagram()
  }

  function addMetadataToClass() {
    let input = document.querySelector('#title')
    let static = document.querySelector('#static')
    let access_list = document.querySelector('#access_list')

    if (input.value.trim().length == 0) {
      toast_dialog.show('name cannot be empty');
      return;
    }

    let node = {name: input.value, access: access_list.value, static: static.checked}
    if (isAddingMethod) {
      app.addMethodToContext(node)
    } else {
      app.addFieldToContext(node)
    }
    closeModalForClassMetadata()
    updateDiagram()
  }

  function closeModalForClassMetadata() {
    let load_dialog = document.querySelector("#class_metadata");
    load_dialog.style.display = 'none';
  }

  var isAddingMethod = false;

  function showModalForClassMetadata(isMethod) {
    isAddingMethod = isMethod;
    let button = document.querySelector('#button_title_modal')
    let label = document.querySelector('#name_title_modal')
    let input = document.querySelector('#title')
    let staticContainer = document.querySelector('#static_container')
    let static = document.querySelector('#static')
    let access_list = document.querySelector('#access_list')

    if(isMethod) {
      staticContainer.style.display = 'block';
    } else {
      staticContainer.style.display = 'none';
    }
    access_list.selectedIndex = 3
    input.value = '';
    static.value = false;

    let labelText = (isMethod) ? 'Method Name' : 'Field Name'
    let buttonText = (isMethod) ? 'Add Method' : 'Add Field'
    label.innerText = labelText
    button.innerText = buttonText
    let load_dialog = document.querySelector("#class_metadata");
    load_dialog.style.display = 'block';
    input.focus();  
  }

  function prepare_for_edit() {
    let user_list = document.querySelector("#user_list")
    let class_title = document.querySelector("#class_title")
    let user_context = app.findClass(user_list.value)
    app.updateId(user_context.id)
  }

  var activeAdornerTarget = null;

  function resetAdorner() {
    if(activeAdornerTarget != null) {
      activeAdornerTarget = null;
      let adorner = document.getElementById("selection_adorner");
      let editor = document.getElementById("selection_editor");

      adorner.style.display = 'none';
      editor.style.display = 'none';
    }
  }
  function getIdFromSvgId(svgId) {
    return svgId.split('-')[1];
  }

  function updateDiagram() {
    resetAdorner();
    var element = document.getElementById("diagram");
    var insertSvg = function(svgCode, bindFunctions) {
      element.innerHTML = svgCode;
    };
    var graphDefinition = app.getMarkDown();
    var graph = mermaidAPI.render("mermaid", graphDefinition, insertSvg);
    setTimeout(function() {
      let nodes = document.querySelectorAll('.node');

      nodes.forEach(node => {
        node.onclick = function(e) { 
          isAdornerActive = true;
          activeAdornerTarget = node.getAttribute('id');
          selectedShape = getIdFromSvgId(activeAdornerTarget);
          let rect = node.getBoundingClientRect();
          positionAdorner(rect);
          e.stopPropagation();

          populateSelection();
        }
      });
    }, 500);    
  }
  function populateSelection() {
    let selectedClass = app.findClassByName(selectedShape)
    let addRelationButton = document.querySelector('#add_relationship')
    let titleElement = document.querySelector('#adorner_title')
    let deleteButton = document.querySelector('#delete_relation')
    let relationList = document.querySelector('#current_relations')
    let classList = document.querySelector('#user_list')
    let toClass = document.querySelector('#to_class')

    titleElement.value = selectedClass.name
    deleteButton.disabled = relationList.options.length == 0
    addRelationButton.disabled = toClass.options.length == 0

    if (relationList.options.length > 0) {
      relationList.selectedIndex = 0
    }
    classList.value = selectedClass.id
    classList.onchange()
    app.updateId(selectedClass.id)
  }

  function updateShapeFromAdorner() {
    let titleElement = document.querySelector('#adorner_title');
    if (titleElement.value.length > 0) {
      let shape = app.findClassByName(selectedShape);
      app.updateClassName(titleElement.value)
      updateDiagram();
    } else {
      toast_dialog.show('Title must not be blank.');
    }
  }

  function removeShapeFromAdorner() {
    let classes = document.querySelector('#user_list')
    
    if (classes.length == 1) {
      toast_dialog.show('Must have at least 1 class in diagram')
      return;
    }
    let shape = app.findClassByName(selectedShape);
    app.updateId(app.findClassByIndex(0).id)    
    app.removeClass(shape.id);
    updateDiagram();
    setTimeout(() => { classes.selectedIndex = 0;}, 100)
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
