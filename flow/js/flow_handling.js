  var app = null
  var nodeToEdit = null;
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
          storageName = 'data-flow-shared';
          localStorage.setItem(storageName, output)
          app.changeStorage()
          closeLeftPanel()
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

      setTimeout(() => { 
        // set radio option to current selection
        let initialShape = app.shapes[0];
        document.getElementById(initialShape.type).checked = true;
        document.getElementById('shape_title').value = initialShape.title;

        var ro = new ResizeObserver(entries => {
          for (let entry of entries) {
            if (activeAdornerTarget != null) {
              let node = document.getElementById(activeAdornerTarget);
              let rect = node.getBoundingClientRect();
              positionAdorner(rect);
            }
          }
        });
        // Observe one or multiple elements
        ro.observe(document.getElementById('diagram'));

        let storageLocation = document.querySelector("#storageOptions");
        storageLocation.value = storageName; 
        updateDiagram() 
      }, 500)    
  }

  function addShape() {
    var newShapeSelection = null;
    let titleElement = document.getElementById('shape_title');
    let title = titleElement.value;
    
    if (title.trim() == 0) {
      toast_dialog.show('Shape must have title');
      return;
    }

    let radios = document.getElementsByName('entityType');
    radios.forEach(radio => {
      if (radio.checked) {
          newShapeSelection = radio.id;
      }
    });
    app.addShape(newShapeSelection, title);
    updateDiagram();
    prepareForNew();
  }

  function removeShape() {
    let shapeList = document.querySelector('#shape_list');
    let currSelectionId = shapeList.value;

    if (shapeList.options.length == 1) {
      toast_dialog.show('You need at least one shape in the diagram');
      return;
    }
    app.removeShape(currSelectionId);
    updateDiagram();
    prepareForNew();
  }

  function prepareForNew() {
    let new_user_name = document.querySelector("#shape_title");
    let add_or_update = document.querySelector("#add_or_update");
    let add_new_button = document.querySelector("#add_new_button");
    let edit_button = document.querySelector("#edit_button");
    let process_radio = document.querySelector("#process");
    
    add_or_update.onclick = addShape;
    process_radio.checked = true;
    new_user_name.value = '';
    add_or_update.innerText = 'Add';
    
  }
  
  function prepareForEdit() {
    
    let shapeList = document.querySelector("#shape_list");
    let new_user_name = document.querySelector("#shape_title");
    let add_or_update = document.querySelector("#add_or_update");
    let add_new_button = document.querySelector("#add_new_button");
    let edit_button = document.querySelector("#edit_button");
    let userContext = app.findShape(shapeList.value);

    let radios = document.getElementsByName('entityType');
    radios.forEach(radio => {
      if (radio.id == userContext.type) {
        radio.checked = true;
      }
    });

    add_or_update.onclick = updateShape;
    new_user_name.value = userContext.title;
    add_or_update.innerText = 'Update';
  }

  function updateShape() {
    let shapeList = document.querySelector('#shape_list');
    let titleElement = document.querySelector('#shape_title');
    let currSelectionId = shapeList.value;
    let shape = app.findShape(currSelectionId);

    let newShapeSelection = null;
    let newShapeTitle = titleElement.value;
    if (newShapeTitle.length == 0) {
      toast_dialog.show('Shape must have title');
      return;
    }
    let radios = document.getElementsByName('entityType');
    radios.forEach(radio => {
      if (radio.checked) {
          newShapeSelection = radio.id;
      }
    });
    
    shape.type = newShapeSelection;
    shape.title = newShapeTitle;
    updateDiagram();
  }

  function findAttributeFromParent(el, attributeName) {
    var id = el.getAttribute(attributeName);
    while(id == null || id == undefined) {
      el = el.parentElement;
      if (el == null) {
        return;
      }
      id = el.getAttribute(attributeName);
    }
    return id;
  }

  function showLoad() {
    let load_dialog = document.querySelector("#load");
    let kanban_data = document.querySelector("#data_text");
    closeLeftPanel();
    load_dialog.style.display = 'block';
    kanban_data.value = app.getJSON();
    resetAdorner();
  }

  function hideLoad() {
    let load_dialog = document.querySelector("#load");
    load_dialog.style.display = 'none';
    openLeftPanel();
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

  function showSettings() {
      let settings_dialog = document.querySelector("#settings");
      settings_dialog.style.display = 'block';
  }

  function hideSettings() {
    let settings_dialog = document.querySelector("#settings");
    settings_dialog.display = 'none';
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

  function candidateChanged() {
    let candidateList = document.querySelector('#candidate_list');
    let linkTextRow = document.querySelector('#link_text_row');
    let addLinkButton = document.querySelector("#apply_button_row");

    if (candidateList.value != null) {
      linkTextRow.style.display = 'table-row';
      addLinkButton.style.display = "table-row";
    } else {
      linkTextRow.style.display = 'none';
      addLinkButton.style.display = "none";
    }
  }

  function populateSelection() {
    let shape = app.findShape(selectedShape);
    let titleElement = document.querySelector('#adorner_title');
    titleElement.value = shape.title;
    let candidates = app.getConnectionCandidates(selectedShape);
    let candidateList = document.querySelector('#candidate_list');
    let linkToContainer = document.querySelector('#link_to_container');
    let noOutgoingLabel = document.querySelector("#no_outgoing_label");
    let linkTextRow = document.querySelector('#link_text_row');
    let addLinkButton = document.querySelector("#apply_button_row");
    linkTextRow.style.display = 'none';
    addLinkButton.style.display = "none";

    if (candidates.length > 0) {
      noOutgoingLabel.style.display = 'none';
      linkToContainer.style.display = 'table-row';
      clearSelect(candidateList);
      addSelect(candidateList, candidates); 
    } else {
      noOutgoingLabel.style.display = 'table-row';
      linkToContainer.style.display = 'none';
    }

    let linkContainer = document.querySelector("#existing_links");
    let nolinkContainer = document.querySelector("#no_links");

    if (shape.outgoing > 0) {
      linkContainer.style.display = 'table-row';
      nolinkContainer.style.display = 'none';
      let existingLinkList = document.querySelector("#existing_links_list");
      let links = app.getLinkFrom(shape.id);
      if (links.length > 0) {
        addExistingLink(existingLinkList, links);
      }
    }
    else {
      linkContainer.style.display = 'none';
      nolinkContainer.style.display = 'table-row';
    }
  }

  function clearSelect(selectElement) {
    while (selectElement.options.length > 0) {                
      selectElement.remove(0);
    }
  }       
  
  function addExistingLink(parentElement, linkData) {
    clearSelect(parentElement);
    linkData.forEach(link => {
      let toShape = app.findShape(link.toId);
      let text = "link to " + toShape.title + " (" + toShape.type + ")";
      addOptionIntoSelect(parentElement, link.id, text);
    });
  }

  function removeLink() {
     let existingLinkList = document.querySelector("#existing_links_list");
     app.removeLink(existingLinkList.value);
     updateDiagram();
  }

  function addSelect(selectElement, candidates) {
    addOptionIntoSelect(selectElement, null, '[not set]');
    candidates.forEach(candidate => {
      addOptionIntoSelect(selectElement, candidate.id, candidate.title);
    });
  }         
  
  function addOptionIntoSelect(selectElement, id, title) {
    let option = document.createElement("option");
    option.text = title;
    option.setAttribute('value', id);
    selectElement.add(option);
  } 

  function addLink() {
    let fromShape = app.findShape(selectedShape);
    let candidateList = document.querySelector('#candidate_list');
    let linkTitle = document.querySelector('#link_title');
    app.addLink(fromShape.id, candidateList.value, linkTitle.value);
    updateDiagram();
  }

  function updateShapeFromAdorner() {
    let titleElement = document.querySelector('#adorner_title');
    if (titleElement.value.length > 0) {
      let shape = app.findShape(selectedShape);
      shape.title = titleElement.value;
      updateDiagram();
    } else {
      toast_dialog.show('Title must not be blank.');
    }
  }

  function removeShapeFromAdorner() {
    let shape = app.findShape(selectedShape);
    app.removeShape(shape.id);
    updateDiagram();
  }

  function getIdFromSvgId(svgId) {
    return parseInt(svgId.split('-')[1]);
  }

  function toggleLeftPanel() {
    let leftPanel = document.querySelector("#left_panel");
    let restorePanel = document.querySelector("#restore_panel");
    let diagram = document.querySelector("diagram");
    
    if (restorePanel.style.display == 'none') {
      leftPanel.style.display = 'none';
      restorePanel.style.display = 'table-cell';
    } else {
      restorePanel.style.display = 'none';
      leftPanel.style.display = 'table-cell';
    } 
  }