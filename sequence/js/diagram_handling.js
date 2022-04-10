  var nodeToEdit = null;
  
  function appLoad() {
    let radios = document.getElementsByName('sequenceType');
    radios.forEach(radio => {
      radio.addEventListener('change', function() {
        let currentSelection = radio.value;
        toggleAddEditUI(currentSelection == 'note');
      });
    });

    let area = document.querySelector('#whole_content_area');
    let darkTheme = document.querySelector('#theme_dark');
    let whiteTheme = document.querySelector('#theme_white');
    let greenTheme = document.querySelector('#theme_green');
    
    var curr_theme = localStorage.getItem('theme');
    if (curr_theme == 'dark') {
      document.body.style.backgroundColor = '#2e2e2e';
      area.style.backgroundColor = '#2e2e2e'
      darkTheme.checked = true;
    } else {
      area.style.backgroundColor = 'white'; 
      document.body.style.backgroundColor = 'white';
      if (curr_theme == 'forest') 
        greenTheme.checked = true;
      else
        whiteTheme.checked = true;
    }

    prepare_for_edit();
  }

  function startDrag (evt) {
    let data_id = evt.target.getAttribute('data-id')
    evt.dataTransfer.dropEffect = 'move'
    evt.dataTransfer.effectAllowed = 'move'
    evt.dataTransfer.setData('id', data_id);
  }

  function onDrop(evt) {
      evt.preventDefault();
      let sourceId = evt.dataTransfer.getData('id');
      let destId = findAttributeFromParent(evt.target, 'data-id'); //evt.target.getAttribute('data-id');

      if (destId != null && sourceId != null) {
        if (destId == sourceId) {
          return; // nothing to do
        }
        app.moveSequence(sourceId, destId);
        updateDiagram();
      }
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

  function addEditNote(el) {
    let isAdd = el.innerText == 'Add New';
    let fromUserList = document.querySelector("#over_user_list");
    let positionList = document.querySelector("#position_list");
    let noteText = document.querySelector("#note_text");

    if (noteText.value.length == 0) {
      alert("note field is mandatory.");
      return;
    }
    if (isAdd) { // add
      let node = {
          type: 'note',
          from: fromUserList.value,
          note: noteText.value,
          position: positionList.value
      }
      app.addSequence(node);
    } else { // edit
      nodeToEdit.from = fromUserList.value;
      nodeToEdit.note =  noteText.value;
      nodeToEdit.position =  positionList.value;
    }
    updateDiagram();
    endSequenceDialog();
  }

  function addEditMessage(el) {
    let isAdd = el.innerText == 'Add New';

    let fromUserList = document.querySelector("#from_user_list");
    let toUserList = document.querySelector("#to_user_list");
    let arrowList = document.querySelector("#arrow_list");
    let messageText = document.querySelector("#message_text");

    if (messageText.value.length == 0) {
      alert("message field is mandatory.");
      return;
    }
    let arrow = app.filterArrows(arrowList.value)[0];

    if (isAdd) {
      let node = { // add
        type: 'msg',
        from: fromUserList.value,
        to: toUserList.value,
        msg: messageText.value,
        arrow: arrow.notation
      };
      app.addSequence(node);
    } else { // edit
      nodeToEdit.from = fromUserList.value;
      nodeToEdit.to = toUserList.value;
      nodeToEdit.msg = messageText.value;
      nodeToEdit.arrow = arrow.notation;
    }
    updateDiagram();
    endSequenceDialog();
  }

  function editSequence(el) {
    let id = el.getAttribute('data-id');
    let item = app.findSequence(id);
    nodeToEdit = item;

    editSequenceDialog(item);
    updateDiagram();
  }

  function removeSequence(el) {
    let id = el.getAttribute('data-id');
    app.removeSequence(id);
    updateDiagram();
  }
  
  function editSequenceDialog(node) {
    addSequenceDialog();
    freezeRadioOptions(true);

    if (node.type == 'msg') { // message
      toggleAddEditUI(false);
      let fromUserList = document.querySelector("#from_user_list");
      let toUserList = document.querySelector("#to_user_list");
      let arrowList = document.querySelector("#arrow_list");
      let messageText = document.querySelector("#message_text");
      let buttonMsgAddText = document.querySelector("#add_edit_msg_button");
  
      let arrowNode = app.filterArrowsByNotation(node.arrow)[0];

      buttonMsgAddText.innerText = 'Update';
      fromUserList.value = node.from;
      toUserList.value = node.to;
      arrowList.value = arrowNode.name;
      messageText.value = node.msg;

    } else { // note
      toggleAddEditUI(true);
      let fromUserList = document.querySelector("#over_user_list");
      let positionList = document.querySelector("#position_list");
      let noteText = document.querySelector("#note_text");
      let buttonNoteAddText = document.querySelector("#add_edit_note_button");

      buttonNoteAddText.innerText = 'Update';
      fromUserList.value = node.from;
      positionList.value = node.position;
      noteText.value = node.note;
    }
  }

  function addSequenceDialog() {
    toggleAddEditUI(false);
    freezeRadioOptions(false);
    let modalElement = document.querySelector(".modal");
    modalElement.style.left = '10px';
    let dialog = document.querySelector("#dialog");
    dialog.style.display = 'inline';
    
    let fromUserList = document.querySelector("#from_user_list");
    let toUserList = document.querySelector("#to_user_list");
    let arrowList = document.querySelector("#arrow_list");
    let messageText = document.querySelector("#message_text");
    let buttonMsgAddText = document.querySelector("#add_edit_msg_button");
    let buttonNoteAddText = document.querySelector("#add_edit_note_button");
    let fromNoteList = document.querySelector("#over_user_list");
    let positionList = document.querySelector("#position_list");
    let noteText = document.querySelector("#note_text");

    buttonMsgAddText.innerText = 'Add New';
    buttonNoteAddText.innerText = 'Add New';
    fromUserList.selectedIndex = 0;
    toUserList.selectedIndex = 0;
    arrowList.selectedIndex = 0;
    fromNoteList.selectedIndex = 0;
    positionList.selectedIndex = 0;
    messageText.value = "";
    noteText.value = "";

    fromUserList.focus();
  }
  
  function endSequenceDialog() {
    nodeToEdit = null;
    let dialog = document.querySelector("#dialog");
    dialog.style.display = 'none';
  }

  function freezeRadioOptions(isFreeze) {
    let radios = document.getElementsByName('sequenceType');
    radios.forEach(el => {
      el.disabled = isFreeze;
    });
  }

  function showChooser() {
    let chooser_dialog = document.querySelector("#chooser");
    chooser_dialog.style.display = 'block';
  }

  function endChooser() {
    let chooser_dialog = document.querySelector("#chooser");
    chooser_dialog.style.display = 'none';
  }

  function showLoad() {
    let load_dialog = document.querySelector("#load");
    let kanban_data = document.querySelector("#sequence_data");

    load_dialog.style.display = 'block';
    kanban_data.value = app.getJSON();
  }

  function hideLoad() {
    let load_dialog = document.querySelector("#load");
    load_dialog.style.display = 'none';
  }

  function resetSequenceData() {
    app.reset();
    updateDiagram();
  }
  
  function updateSequenceData() {
    let sequence_data = document.querySelector("#sequence_data");
    try {
        let update_json = JSON.parse(sequence_data.value);
        app.update(update_json);
        updateDiagram();
    } catch {
        alert('Invalid JSON data.');
    }
  }

  function copySequenceData() {
    let sequence_data = document.querySelector("#sequence_data");
    navigator.clipboard.writeText(sequence_data.value).then(
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

  function prepare_for_new() {
    let new_user_name = document.querySelector("#newUserName");
    let add_or_update = document.querySelector("#add_or_update");
    let add_new_button = document.querySelector("#add_new_button");
    let edit_button = document.querySelector("#edit_button");
    let participant_radio = document.querySelector("#participant");
    
    add_or_update.onclick = add_user;
    participant_radio.checked = true;
    new_user_name.value = '';
    add_or_update.innerText = 'Add';
    edit_button.style.backgroundColor = '#96a49a';
    add_new_button.style.backgroundColor = 'lightgray';
  }

  function prepare_for_edit() {
    let reorder_up = document.querySelector("#reorder_up");
    let reorder_dn = document.querySelector("#reorder_dn");

    let user_list = document.querySelector("#user_list");
    let new_user_name = document.querySelector("#newUserName");
    let add_or_update = document.querySelector("#add_or_update");
    let add_new_button = document.querySelector("#add_new_button");
    let edit_button = document.querySelector("#edit_button");
    let actor = document.querySelector('#actor');
    let participant = document.querySelector('#participant');
    let idx = user_list.selectedIndex;
    let size = user_list.options.length;

    let user_context = app.findUser(user_list.value);

    if (user_context.type == 'actor') 
        actor.checked = true;
    else    
        participant.checked = true;

    add_or_update.onclick = update_user;
    new_user_name.value = user_context.name;
    add_or_update.innerText = 'Update';
    edit_button.style.backgroundColor = 'lightgray';
    add_new_button.style.backgroundColor = '#96a49a';

    reorder_dn.disabled = false;
    reorder_up.disabled = false;
        
    if (idx == 0) {
      reorder_up.disabled = true;
    }
    if (idx == size - 1) {
      reorder_dn.disabled = true;
    }

    updateDiagram();
  }

  function updateDiagram() {
    var element = document.getElementById("diagram");
    var insertSvg = function(svgCode, bindFunctions) {
      element.innerHTML = svgCode;
    };
    var graphDefinition = app.getMarkDown();
    //alert(graphDefinition);
    var graph = mermaidAPI.render("mermaid", graphDefinition, insertSvg);
  }

  function reorder(isUp) {
    let user_list = document.querySelector("#user_list");
    let from = user_list.selectedIndex;
    let to = (isUp) ? from-1 : from+1;
    app.reorderUser(from, to);
    app.persist();
    user_list.selectedIndex = to;
    setTimeout(function() {
      prepare_for_edit();
    }, 100);
  }

  function add_user() {
    let new_user_name = document.querySelector("#newUserName");
    let new_user_type_value = document.querySelector('input[name="entityType"]:checked').value;
    app.addUser(new_user_name.value, new_user_type_value);
    setTimeout(function() {
      prepare_for_edit();
    }, 100);
  }

  function remove_user() {
    let user_list = document.querySelector("#user_list");
    let userToDelete = user_list.value;
    if(user_list.options.length == 1) {
        alert('You need at least one participant/actor for this app.');
        return;
    }
    app.removeUser(userToDelete);
    setTimeout(function() {
      user_list.selectedIndex = 0;
      prepare_for_edit();
    }, 100);
  }

  function update_user() {
    let user_list = document.querySelector("#user_list");
    let new_user_name = document.querySelector("#newUserName");
    let new_user_type_value = document.querySelector('input[name="entityType"]:checked').value;
    let user_context = app.findUser(user_list.value);
    
    if (new_user_name.value == user_context.name && 
        new_user_type_value == user_context.type) {
          alert("nothing changed.")
        }
    else {
      user_context.name = new_user_name.value;
      user_context.type = new_user_type_value;
      app.persist();
    }
    updateDiagram();
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

  function updateTheme() {
    var curr_theme = localStorage.getItem('theme');
    let darkTheme = document.querySelector('#theme_dark');
    let whiteTheme = document.querySelector('#theme_white');
    var theme_data = 'neutral';
    if(darkTheme.checked) {
      theme_data = 'dark';
    } else if (whiteTheme.checked) {
      theme_data = 'neutral';
    } else {
      theme_data = 'forest';
    }

    if (theme_data != curr_theme) {
      localStorage.setItem('theme', theme_data);
      location.reload();
      return false;
    }
  }

  function downloadData() {
    let jsonOption = document.querySelector('#download_json');
    let mermaidOption = document.querySelector('#download_mermaid');
    var dataUrl = null;
    var fileName = null;

    if(jsonOption.checked) {
      fileName = 'my-sequence.json';
      let localData = localStorage.getItem('data-sequence');
      dataUrl = "data:text/json;charset=utf-8," + encodeURIComponent(localData);
    }
    else if (mermaidOption.checked) {
      fileName = 'my-sequence.md';
      let localData = app.getMarkDown();
      dataUrl = "data:text/json;charset=utf-8," + encodeURIComponent(localData);
    } else {
      domtoimage
        .toJpeg(document.getElementById('diagram'), { quality: 1 })
        .then(function (url) {
          var link = document.createElement("a");
          link.download = "my-sequence.jpeg";
          link.href = url;
          link.click();
        });
      return;
    }

    if (dataUrl != null) {
      var link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();  
    }
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