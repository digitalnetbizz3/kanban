
  var storageName = 'data-json'

  function appLoad() {
    showToast('Paste or edit your JSON in the editor, it will auto-validate.')
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

  function handleChooser(chosen) {
    if (storageName.startsWith('data-sequence')) { // sequence diagram app
      switch(chosen) {
        case 'kanban':
          location.href = 'https://kan-ban.org/index.html?switch=1'
          return
        case 'flowchart':
          location.href = 'https://kan-ban.org/flow/index.html?switch=1'
          return
        case 'state':
          location.href = 'https://kan-ban.org/state/index.html?switch=1'
          return
        case 'json':
          location.href = 'https://kan-ban.org/json/index.html?switch=1'
          return
        case 'class':
            location.href = 'https://kan-ban.org/class/index.html?switch=1'
            return        
        case 'gantt':
          location.href = 'https://kan-ban.org/gantt/index.html?switch=1'
          return                               
        default:
          break
      }
    } else if (storageName.startsWith('data-kanban')) { // kan-ban app
      switch(chosen) {
        case 'sequence':
          location.href = 'https://kan-ban.org/sequence/index.html?switch=1';
          return;
        case 'flowchart':
          location.href = 'https://kan-ban.org/flow/index.html?switch=1'
          return
        case 'state':
          location.href = 'https://kan-ban.org/state/index.html?switch=1'
          return   
        case 'json':
          location.href = 'https://kan-ban.org/json/index.html?switch=1'
          return
        case 'class':
          location.href = 'https://kan-ban.org/class/index.html?switch=1'
          return       
        case 'gantt':
          location.href = 'https://kan-ban.org/gantt/index.html?switch=1'
          return                             
        default:
          break
      }
    } else if (storageName.startsWith('data-flow')) { // flowchart app
      switch(chosen) {
        case 'sequence':
          location.href = 'https://kan-ban.org/sequence/index.html?switch=1'
          return
        case 'kanban':
          location.href = 'https://kan-ban.org/index.html?switch=1'
          return
        case 'state':
            location.href = 'https://kan-ban.org/state/index.html?switch=1'
            return   
        case 'json':
          location.href = 'https://kan-ban.org/json/index.html?switch=1'
          return
        case 'class':
          location.href = 'https://kan-ban.org/class/index.html?switch=1'
          return      
        case 'gantt':
          location.href = 'https://kan-ban.org/gantt/index.html?switch=1'
          return                                
        default:
          break
      }
    } else if (storageName.startsWith('data-state')) { // state transition app
    switch(chosen) {
      case 'sequence':
        location.href = 'https://kan-ban.org/sequence/index.html?switch=1'
        return
      case 'kanban':
        location.href = 'https://kan-ban.org/index.html?switch=1'
        return
      case 'flowchart':
        location.href = 'https://kan-ban.org/flow/index.html?switch=1'
        return
      case 'json':
        location.href = 'https://kan-ban.org/json/index.html?switch=1'
        return
      case 'class':
        location.href = 'https://kan-ban.org/class/index.html?switch=1'
        return       
      case 'gantt':
        location.href = 'https://kan-ban.org/gantt/index.html?switch=1'
        return                
      default:
        break
      } 
    } else if (storageName.startsWith('data-json')) { // JSON validator app 
    switch(chosen) {
      case 'sequence':
        location.href = 'https://kan-ban.org/sequence/index.html?switch=1'
        return
      case 'kanban':
        location.href = 'https://kan-ban.org/index.html?switch=1'
        return
      case 'flowchart':
        location.href = 'https://kan-ban.org/flow/index.html?switch=1'
        return
      case 'state':
        location.href = 'https://kan-ban.org/state/index.html?switch=1'
        return
      case 'class':
        location.href = 'https://kan-ban.org/class/index.html?switch=1'
        return
      case 'gantt':
        location.href = 'https://kan-ban.org/gantt/index.html?switch=1'
        return                        
      default:
        break
    }
  } else if (storageName.startsWith('data-class')) { // Class diagram app 
    switch(chosen) {
      case 'sequence':
        location.href = 'https://kan-ban.org/sequence/index.html?switch=1'
        return
      case 'kanban':
        location.href = 'https://kan-ban.org/index.html?switch=1'
        return
      case 'flowchart':
        location.href = 'https://kan-ban.org/flow/index.html?switch=1'
        return
      case 'state':
        location.href = 'https://kan-ban.org/state/index.html?switch=1'
        return
      case 'json':
        location.href = 'https://kan-ban.org/json/index.html?switch=1'
        return    
      case 'gantt':
        location.href = 'https://kan-ban.org/gantt/index.html?switch=1'
        return                           
      default:
        break
    }
  } else if (storageName.startsWith('data-gantt')) { // Gantt app 
    switch(chosen) {
      case 'sequence':
        location.href = 'https://kan-ban.org/sequence/index.html?switch=1'
        return
      case 'kanban':
        location.href = 'https://kan-ban.org/index.html?switch=1'
        return
      case 'flowchart':
        location.href = 'https://kan-ban.org/flow/index.html?switch=1'
        return
      case 'state':
        location.href = 'https://kan-ban.org/state/index.html?switch=1'
        return
      case 'json':
        location.href = 'https://kan-ban.org/json/index.html?switch=1'
        return    
      case 'class':
        location.href = 'https://kan-ban.org/class/index.html?switch=1'
        return                        
      default:
        break
    }
  }

  endChooser();
}    