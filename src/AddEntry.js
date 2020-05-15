class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      people : ["John","Tube","P","Cheow"],
      display : [],
    }
    this.onChange = this.onChange.bind(this);
    this.remove = this.remove.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

  onChange(e) {
    const theName = e.target.value;
    var display = this.state.display.slice();
    display.push(theName);
    console.log(display);
    this.setState({
      display : display,
    });
  }

  remove(theName) {
    var display = this.state.display.slice();
    const index = display.findIndex((x)=> {return x===theName});
    display.splice(index - 1 ,1);
    console.log(display);
    this.setState({
      display : display,
    });
  }

  onSubmit(e) {
    console.log(e.target);
    //alert(e.target.P.value);
      }

    render() {
      const list = this.state.people.map((person) => {
        return (<option value = {person}> {person} </option>);
      } );
      const listAmounts = this.state.display.map((person) => {
        return (
          <div>
          <lable>{person}</lable>
          <input
          type = "number"
          name = {person} 
          id = {person} 
          placeholder = "Input Amount"
          />
          <input type = "button" onClick ={ () => {this.remove({person})}} value = "Delete"/>
          </div>
        );
      })
      return (
        <div>
        <form onSubmit = {this.onSubmit}>
          <select multiple = {true}
            onChange = {this.onChange}>
            {list}
          </select>
          {listAmounts}
          <input type = "submit" value = "Submit"/>
        </form>
        </div>
      );
    }
}