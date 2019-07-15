class Header extends React.Component {
  render () {
    return (
    <div className="header">
      <div>
        <img className="fleetx-logo-full" alt="fleetx" src="https://ik.imagekit.io/fx/logos/fleetx/fleetx-logo-final-full.svg?v=3"></img>
      </div>
      <div>
         <h2  className="h2" style={{display: 'inline-block', paddingTop: .5 + 'rem', marginTop: 20 + 'px'}}>Real Time Vehicle Location</h2>
          <div className={"pull-right text-muted font-italic"}>
            This shared link is valid till 16 Jul 19, 04:32 PM
          </div>
      </div>
    </div>
    )
  }
}

class MapComponent extends React.Component {
  render () {
    return (<div id="map" style={{width: 160 + '%', height: 584 + 'px  ', overflow: 'auto'}}></div>);
  }
}

class Vehicle extends React.Component {
  render () {
    var active = this.props.active;
    var vehicle = this.props.data;

    function foo (str) {
      for (let i=0;i<str.length;i++) {
        if (str[i] == ',' && i % 10 > 2) {
          str = str.slice(0,i + 1) + '\n' + str.slice(i + 1, str.length)
        }
      }
      return str;
    }

    return (
      <div
      onMouseEnter={this.props.onMouseEnter}
      onMouseLeave={this.props.onMouseLeave}
      className={vehicle == active ? "active-vehicle vehicle" : "inactive-vehicle vehicle"}>
        <div className="vehicle-elem-row"><p>{vehicle.vehicleNumber}</p></div>
        <div className="vehicle-elem-row">{vehicle.vehicleMake + " " + vehicle.vehicleModel}</div>
        <div className="vehicle-elem-row">driver: { !vehicle.driverId || !vehicle.driverName ? "not assigned" : vehicle.driverName}</div>
        <div className="vehicle-elem-row"><p>current status {vehicle.currentStatus.toLowerCase()}</p></div>
        <div className="vehicle-elem-row"><p>{foo (vehicle.address)}</p></div>
        <span className="get-time-to-myLoc">
            <button className="btn btn-outline-primary btn-sm">Get time to my location</button></span>
      </div>)
  }
}
class Search extends React.Component {
  render () {
    let onTypeText = this.props.onTypeText;
    return (
    <div className="pos-rel text-center">
      <input type="text"  onChange={this.props.onChange} className="search-vehicle" placeholder="    Search vehicles / drivers / locations"></input>
    </div>
    )
  }
}
class Body extends React.Component {
  constructor () {
    super();
    this.state = {
      vehicles: [],
      active: undefined,
      update: false,
      isLoading: true,
      endpoint: "/payload"
    };
  };

  filterVehicles (e) {
  var searchText = e.target.value;
  this.setState(function (prevState) {
    var vehicles = Object.assign([],  this.vehicles);
    vehicles = vehicles.filter((vehicle) => vehicle.vehicleName.indexOf(searchText) >= 0 || vehicle.vehicleNumber.indexOf(searchText) >= 0)
    return { vehicles }
  });
  }

  getApiDataAndReloadState (endpoint = "/payload") {
    let newState = {};
    fetch(endpoint, {method: 'POST'})
      .then((resp) => resp.json())
      .then((state) => {
        Object.entries(state).forEach((elem) => {
          newState[elem[0]] = elem[1];
        });
        this.state.active == undefined ? newState.active = newState.vehicles[0] : newState.active = this.state.active;
        newState.isLoading = false;
        newState.update = true;
        this.vehicles = state.vehicles;
        this.setState(newState);
      });
  }
  onMouseLeave (event) {
    this.setState((prevState) => {
      let active = Object.assign({}, prevState.active);  // creating copy of state variable jasper
      active = {};                     // update the name property, assign a new value
      return { active };
    })
  }
  renderMap (activeEle) {
    new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(activeEle.latitude, activeEle.longitude),
      zoom: 20
    });
  }
  onMouseEnter (vehicle, event) {
    this.setState((prevState) => {
      let active = Object.assign({}, prevState.active);  // creating copy of state variable jasper
      active = vehicle;
      this.renderMap(active);
      return { active };
    });
      // set the active element as the one hovered
      // this will call the render method and rest will be taken care itself
  }
  componentDidMount () {
    this.getApiDataAndReloadState();
    setInterval (this.getApiDataAndReloadState.bind(this), 50000);

    // get data here and set to state
    // init a timer to update data every 5 sec and set to state
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return  !nextState.isLoading &&  nextState.update;
  // }
  render () {

    let vehicles = this.state.vehicles;
    let active = this.state.active;

    return (
      <div className="container">
        <div className={"left-child"}>
      <Search onChange={this.filterVehicles.bind(this)} />
      {
          vehicles.length > 0 ? (<ul className={"left-list"}>{
              vehicles.map((vehicle, index) => <Vehicle
                                          key={index}
                                          active={active ? active : {}}
                                          onMouseEnter={this.onMouseEnter.bind(this, vehicle)}
                                          onMouseLeave={this.onMouseLeave.bind(this)}
                                          data={vehicle}/>)
          }
          </ul>) : (<div className="no-search-vehicles" >No vehicles to display</div>)
        } </div>
        <div className="right-child">
          <MapComponent active={active} />
      </div>
      </div>

    )
  }
}
class App extends React.Component {
  render (){
    return  (
  <div>
    <Header />
    <Body/>
  </div>
  )
  }
}
ReactDOM.render(<App />, document.getElementById('app'));
