
class app_chooser {
    static name = 'app-chooser'
  
    static componentLoad() {
      gapp.component(app_chooser.name, {
        template: `
        <div id="chooseModal" class="modal fade">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="width:800px;">
                    <div class="modal-header bg-primary">
                        <div class="h4 modal-title text-light">Applications</div>
                        <button type="button" class="btn-close text-light" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col border rounded p-2 me-2">
                                <img src="https://kan-ban.org/assets/kanban.png" alt="Kanban Board" style="margin-left:35px;cursor:hand;width:150px; height:150px;" onclick="handleChooser('kanban');"/>
                                <div class="h6" style="text-align:center;">Kan-ban board</div>
                            </div>
                            <div class="col border rounded p-2">
                                <img src="https://kan-ban.org/assets/sequence.png" alt="Sequence Diagram" style="margin-left:35px;cursor:hand;width:150px; height:150px;"  onclick="handleChooser('sequence');"/>
                                <div class="h6" style="text-align:center;">Sequence Diagram</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col border rounded p-2 me-2">
                                <img src="https://kan-ban.org/assets/flowchart.png" alt="Kanban Board" style="margin-left:35px;cursor:hand;width:150px; height:150px;" onclick="handleChooser('flowchart');"/>
                                <div class="h6" style="text-align:center;">Flowchart Diagram</div>
                            </div>
                            <div class="col border rounded p-2">
                                <img src="https://kan-ban.org/assets/statetransition.png" alt="Sequence Diagram" style="margin-left:35px;cursor:hand;width:150px; height:150px;" onclick="handleChooser('state');"/>
                                <div class="h6" style="text-align:center;">State Transition</div>
                            </div>
                        </div>
                    </div>      
                    <div class="modal-body">
                        <div class="row">
                            <div class="col border rounded p-2 me-2">
                                <img src="https://kan-ban.org/assets/class.png" alt="Class Diagram" style="margin-left:35px;cursor:hand;width:150px; height:150px;" onclick="handleChooser('class');"/>
                                <div class="h6" style="text-align:center;">Class Diagram</div>
                            </div>                            
                            <div class="col border rounded p-2 me-2">
                                <img src="https://kan-ban.org/assets/json.png" alt="JSON Validator" style="margin-left:35px;cursor:hand;width:150px; height:150px;" onclick="handleChooser('json');"/>
                                <div class="h6" style="text-align:center;">JSON Validator</div>
                            </div>
                        </div>
                    </div>                                  
                    <div class="modal-footer h6">
                        Choose an application from options above or click anywhere else to dismiss
                    </div>
                </div>
            </div>
        </div>
        `,
        data() {
          return {
            open: false,
          };
        },
      });
    }
  }
    
  registerComponent(app_chooser)

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
      default:
        break
    }
  }
  else if (storageName.startsWith('data-class')) { // Class diagram app 
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
      default:
        break
    }
  }
    endChooser();
  }

  function showChooser() {
    let modal = new bootstrap.Modal(document.getElementById('chooseModal'), {})
    modal.show()
  }

  function endChooser() {
    let modal = new bootstrap.Modal(document.getElementById('chooseModal'), {})
    modal.hide()
  }  
