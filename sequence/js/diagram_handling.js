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
          storageName = 'data-sequence-shared';
          localStorage.setItem(storageName, output)
          app.changeStorage();
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

    setTimeout(() => {
      let storageLocation = document.querySelector("#storageOptions");
      storageLocation.value = storageName;
  
      let radios = document.getElementsByName('sequenceType');
      radios.forEach(radio => {
        radio.addEventListener('change', function() {
          let currentSelection = radio.value;
          toggleAddEditUI(currentSelection == 'note');
        });
      });
      prepare_for_edit();
  
    }, 500)
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
      toast_dialog.show("note field is mandatory.");
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
    let noteUI = document.querySelector('#add_note_ui');

    if(noteUI.style.display != 'none') {
      addEditNote(el);
      return;
    }
    
    let isAdd = el.innerText == 'Add New';

    let fromUserList = document.querySelector("#from_user_list");
    let toUserList = document.querySelector("#to_user_list");
    let arrowList = document.querySelector("#arrow_list");
    let messageText = document.querySelector("#message_text");

    if (messageText.value.length == 0) {
      toast_dialog.show("message field is mandatory.");
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
      let buttonNoteAddText = document.querySelector("#add_edit_msg_button");

      buttonNoteAddText.innerText = 'Update';
      fromUserList.value = node.from;
      positionList.value = node.position;
      noteText.value = node.note;
    }
  }

  function addSequenceDialog() {
    
    toggleAddEditUI(false);
    freezeRadioOptions(false);
    let modalElement = document.querySelector(".sequencemodal");
    modalElement.style.left = '10px';
    let dialog = document.querySelector("#dialog");
    dialog.style.display = 'inline';
    
    let fromUserList = document.querySelector("#from_user_list");
    let toUserList = document.querySelector("#to_user_list");
    let arrowList = document.querySelector("#arrow_list");
    let messageText = document.querySelector("#message_text");
    let buttonMsgAddText = document.querySelector("#add_edit_msg_button");
    let buttonNoteAddText = document.querySelector("#add_edit_msg_button");
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
    let new_user_name = document.querySelector("#newUserName");
    let add_or_update = document.querySelector("#add_or_update");
    let participant_radio = document.querySelector("#participant");
    
    add_or_update.onclick = add_user;
    participant_radio.checked = true;
    new_user_name.value = '';
    new_user_name.focus()
    add_or_update.innerText = 'Add';
  }

  function prepare_for_edit() {
    let reorder_up = document.querySelector("#reorder_up");
    let reorder_dn = document.querySelector("#reorder_dn");

    let user_list = document.querySelector("#user_list");
    let new_user_name = document.querySelector("#newUserName");
    let add_or_update = document.querySelector("#add_or_update");
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
        toast_dialog.show('You need at least one participant/actor for this app.');
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
          toast_dialog.show("nothing changed.")
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