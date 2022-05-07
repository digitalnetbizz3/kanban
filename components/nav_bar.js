
class nav_bar {
  static name = 'nav-bar'

  static componentLoad() {
    gapp.component(nav_bar.name, {
      props: ["menus"],
      template: `
      <nav class="navbar navbar-expand-lg navbar-light bg-primary mb-2">
          <div class="container-fluid">
              <span class="navbar-brand text-light">看板 / kan-ban / org</span>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
              </div>
              <div class="d-flex">
                  <li class="nav-item dropdown pe-5 ps-5" style="list-style-type: none;">
                      <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Options
                      </a>
                      <ul class="dropdown-menu dropdown-menu-primary" aria-labelledby="navbarDropdown">
                          <li><a class="dropdown-item" data-bs-toggle="modal" href="#chooseModal">Choose App</a></li>
                          <li><hr class="dropdown-divider"/></li>
                          <li v-for="menu in menus"><a class="dropdown-item" href="#" @click="$emit('clicked', $event.target.innerText)">{{menu}}</a></li>
                      </ul>
                  </li>
              </div>
          </div>
      </nav>        
      `,
      data() {
        return {
          open: false,
        };
      },
    });
  }
}
  
registerComponent(nav_bar)