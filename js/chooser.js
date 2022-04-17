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
      default:
        break;
    }
  }
    endChooser();
  }

  function showChooser() {
    let chooser_dialog = document.querySelector("#chooser");
    chooser_dialog.style.display = 'block';
  }

  function endChooser() {
    let chooser_dialog = document.querySelector("#chooser");
    chooser_dialog.style.display = 'none';
  }  
