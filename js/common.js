function handleChooser(chosen) {
    if (storageName.startsWith('data-sequence')) { // sequence diagram app
      switch(chosen) {
        case 'kanban':
          location.href = 'https://kan-ban.org/index.html?switch=1';
          return;
        case 'flowchart':
          location.href = 'https://kan-ban.org/flow/index.html?switch=1';
          return;
        case 'state':
          location.href = 'https://kan-ban.org/state/index.html?switch=1';
          return;       
        case 'json':
          location.href = 'https://kan-ban.org/json/index.html?switch=1';
          return;                  
        default:
          break;
      }
    } else if (storageName.startsWith('data-kanban')) { // kan-ban app
      switch(chosen) {
        case 'sequence':
          location.href = 'https://kan-ban.org/sequence/index.html?switch=1';
          return;
        case 'flowchart':
          location.href = 'https://kan-ban.org/flow/index.html?switch=1';
          return;
        case 'state':
          location.href = 'https://kan-ban.org/state/index.html?switch=1';
          return;     
        case 'json':
          location.href = 'https://kan-ban.org/json/index.html?switch=1';
          return;                    
        default:
          break;
      }
    } else if (storageName.startsWith('data-flow')) { // flowchart app
      switch(chosen) {
        case 'sequence':
          location.href = 'https://kan-ban.org/sequence/index.html?switch=1';
          return;
        case 'kanban':
          location.href = 'https://kan-ban.org/index.html?switch=1';
          return;
        case 'state':
            location.href = 'https://kan-ban.org/state/index.html?switch=1';
            return;          
        case 'json':
          location.href = 'https://kan-ban.org/json/index.html?switch=1';
          return;               
        default:
          break;
      }
    } else if (storageName.startsWith('data-state')) { // state transition app
    switch(chosen) {
      case 'sequence':
        location.href = 'https://kan-ban.org/sequence/index.html?switch=1';
        return;
      case 'kanban':
        location.href = 'https://kan-ban.org/index.html?switch=1';
        return;
      case 'flowchart':
        location.href = 'https://kan-ban.org/flow/index.html?switch=1';
        return;
      case 'json':
        location.href = 'https://kan-ban.org/json/index.html?switch=1';
        return;        
      default:
        break;
      } 
    } else if (storageName.startsWith('data-json')) { // JSON validator app 
    switch(chosen) {
      case 'sequence':
        location.href = 'https://kan-ban.org/sequence/index.html?switch=1';
        return;
      case 'kanban':
        location.href = 'https://kan-ban.org/index.html?switch=1';
        return;
      case 'flowchart':
        location.href = 'https://kan-ban.org/flow/index.html?switch=1';
        return;
      case 'state':
        location.href = 'https://kan-ban.org/state/index.html?switch=1';
        return;        
      default:
        break;
    }
  }
    endChooser();
  }

  function showChooser() {
    let modal = new bootstrap.Modal(document.getElementById('chooseModal'), {});
    modal.show();
  }

  function endChooser() {
    let modal = new bootstrap.Modal(document.getElementById('chooseModal'), {});
    modal.hide();
  }  

  function showToast(msg) {
    document.getElementById('toast_msg').innerText = msg;
    toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast'))
    toast.show();
  }
  
  function positionAdorner(rect) {
    const padding = 5;
    let adorner = document.getElementById("selection_adorner");
    adorner.style.position = 'absolute';
    adorner.style.display = 'block';
    adorner.style.width = (rect.width + 2 * padding) + 'px';
    adorner.style.height = (rect.height + 2 * padding) + 'px';
    adorner.style.top = (rect.y + window.scrollY) - padding + 'px';
    adorner.style.left = (rect.x + window.scrollX - padding) + 'px';

    let editor = document.getElementById("selection_editor");
    editor.style.display = 'block';
    editor.style.top = rect.y + window.scrollY - padding + 'px';
    editor.style.left = (rect.x + rect.width + (2 * padding) + window.scrollX) + 'px';
  }