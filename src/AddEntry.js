class AddEntry extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        people : ["John","Tube","P","Cheow"],
        display : [],
      }
      this.onChange = this.onChange.bind(this);
    }
  
    onChange(e) {
      const theName = e.target.value;
      var display = this.state.display.slice();
      if (display.includes(theName)) {
        const index = display.findIndex((x)=> {return x===theName});
        display.splice(index,1);
      } else {
        display.push(theName);
      }
      console.log(display);
      this.setState({
        display : display,
      });
    }

    onSubmit(e) {
      console.log(e.target);
      alert(e.target.Pamt);
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
            name = {person + "amt"} 
            id = {person + "amt"} 
            placeholder = "Input Amount"
            >
            </input>
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

export default AddEntry;