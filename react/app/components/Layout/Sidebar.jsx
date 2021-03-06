import React from "react";
import { Router, Route, Link, History, withRouter } from "react-router";
import { Collapse } from "react-bootstrap";
import SidebarRun from "./Sidebar.run";

import Cookies from "universal-cookie";
const cookies = new Cookies();

class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.userBlockClick = this.userBlockClick.bind(this);
    this.renderDocsSidebar = this.renderDocsSidebar.bind(this);
    this.state = {
      docs: [],
      userBlockCollapse: true,
      collapse: {
        dashboard: this.routeActive(["dashboard"])
      }
    };
  }

  componentWillMount() {
    // get/decode cookie
    if (cookies.get("science")) {
      let cookieData = cookies.get("science");
      // fetch doc instances for this client
      fetch(SERVER_ADDR + "/instances/" + cookieData.id, {
        method: "GET"
      }).then(result => {
        result.json().then(result => {
          if (result.length > 0) {
            // set list of documents for the sidebar
            this.setState({
              docs: result.map(doc => atob(doc))
            });
          }
        });
      });
    }
  }

  renderDocsSidebar() {
    return (
      <li className={this.routeActive("singleview") ? "active" : ""}>
        <div
          className="nav-item"
          onClick={this.toggleItemCollapse.bind(this, "instance_list")}
        >

          <div className="pull-right label label-info">1</div>
          <em className="icon-grid" />
          <span data-localize="sidebar.nav.MENU">Your papers</span>

        </div>
        <Collapse in={this.state.collapse.instance_list} timeout={100}>
          <ul id="instance_list" className="nav sidebar-subnav">
            <li className="sidebar-subnav-header">Submenu</li>
            {this.state.docs.map(doc => (
              <li
                key={doc}
                className={this.routeActive("instance_list") ? "active" : ""}
              >
                <Link to={"/editor#" + btoa(doc)} title="Submenu">
                  <span data-localize="sidebar.nav.SUBMENU">
                    {doc}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Collapse>
      </li>
    );
  }

  componentDidMount() {
    // pass navigator to access router api
    SidebarRun(this.navigator.bind(this));
    $("body").removeClass("layout-h");
    let self = this;
    $("#newDocModal").on("click", function(e) {
      e.preventDefault();
      swal(
        {
          title: "New document",
          text: "Enter document title",
          type: "input",
          showCancelButton: true,
          closeOnConfirm: false,
          animation: "slide-from-top",
          inputPlaceholder: "Title..."
        },
        function(inputValue) {
          const cookies = new Cookies();
          let cookieData = cookies.get("science");
          if (inputValue === false || inputValue === "") {
            swal.showInputError("You need to write something!");
            return false;
          }
          // make fetch reques to create new instance
          var formData = new FormData();
          formData.append("docHash", btoa(inputValue));
          fetch(SERVER_ADDR + "/instances/" + cookieData.id, {
            method: "POST",
            body: formData
          }).then(result => {
            result.json().then(result => {
              let currentDocs = self.state.docs;
              currentDocs.unshift(inputValue);
              self.setState({ docs: currentDocs });
            });
          });
          swal("Nice!", "Document " + inputValue + " created", "success");
        }
      );
    });
  }

  navigator(route) {
    this.props.router.push(route);
  }

  componentWillUnmount() {
    // $("body").addClass("layout-h");
  }

  routeActive(paths) {
    paths = Array.isArray(paths) ? paths : [paths];
    for (let p in paths) {
      if (this.props.router.isActive(paths[p]) === true) return true;
    }
    return false;
  }

  toggleItemCollapse(stateName) {
    var newCollapseState = {};
    for (let c in this.state.collapse) {
      if (this.state.collapse[c] === true && c !== stateName)
        this.state.collapse[c] = false;
    }
    this.setState({
      collapse: {
        [stateName]: !this.state.collapse[stateName]
      }
    });
  }
  userBlockClick() {
    this.setState({
      userBlockCollapse: !this.state.userBlockCollapse
    });
  }

  render() {
    return (
      <aside className="aside">
        {/* START Sidebar (left) */}
        <div className="aside-inner">
          <nav data-sidebar-anyclick-close="" className="sidebar">
            {/* START sidebar nav */}
            <ul className="nav">
              {/* START user info */}
              <li onClick={this.userBlockClick} className="has-user-block">
                <div className="item user-block text-center">
                  <span style={{ color: "white" }}>
                    Profile {"  "}
                    {this.state.userBlockCollapse
                      ? <span className="icon-arrow-up" />
                      : <span className="icon-arrow-down" />}
                  </span>
                </div>
                <Collapse id="user-block" in={this.state.userBlockCollapse}>
                  <div>
                    <div className="item user-block">
                      {/* User picture */}
                      <div className="user-block-picture">
                        <div className="user-block-status">
                          <img
                            src="img/user/02.jpg"
                            alt="Avatar"
                            width="60"
                            height="60"
                            className="img-thumbnail img-circle"
                          />
                          <div className="circle circle-success circle-lg" />
                        </div>
                      </div>
                      {/* Name and Job */}
                      <div className="user-block-info">
                        <span className="user-block-name">Freeman, Lan</span>
                        <span className="user-block-role">
                          Biomedical Engineer
                        </span>
                      </div>
                    </div>
                  </div>
                </Collapse>
              </li>
              {/* END user info */}
              {/* Iterates over all sidebar items */}
              <li className="nav-heading ">
                <span data-localize="sidebar.heading.HEADER">
                  <img
                    src="img/apple-icon-72x72.png"
                    alt="Avatar"
                    width="60"
                    height="60"
                    className="img-thumbnail img-circle center-block"
                  />
                </span>
              </li>
              {/* DOCS LIST */}
              {this.renderDocsSidebar()}
              <li className={this.routeActive(["submenu"]) ? "active" : ""}>
                <div
                  className="nav-item"
                  onClick={this.toggleItemCollapse.bind(this, "submenu")}
                >
                  <div className="pull-right label label-info">1</div>
                  <em className="icon-speedometer" />
                  <span data-localize="sidebar.nav.MENU">Your teams</span>
                </div>
                <Collapse in={this.state.collapse.submenu} timeout={100}>
                  <ul id="submenu" className="nav sidebar-subnav">
                    <li className="sidebar-subnav-header">Submenu</li>
                    <li className={this.routeActive("submenu") ? "active" : ""}>
                      <Link to="submenu" title="Submenu">
                        <span data-localize="sidebar.nav.SUBMENU">
                          University of Stanford
                        </span>
                      </Link>
                    </li>
                    <li className={this.routeActive("submenu") ? "active" : ""}>
                      <Link to="submenu" title="Submenu">
                        <span data-localize="sidebar.nav.SUBMENU">
                          University of Harvard
                        </span>
                      </Link>
                    </li>
                    <li className={this.routeActive("submenu") ? "active" : ""}>
                      <Link to="submenu" title="Submenu">
                        <span data-localize="sidebar.nav.SUBMENU">MIT</span>
                      </Link>
                    </li>
                  </ul>
                </Collapse>
              </li>

            </ul>
            {/* END sidebar nav */}
          </nav>
        </div>
        {/* END Sidebar (left) */}
      </aside>
    );
  }
}

export default withRouter(Sidebar);
