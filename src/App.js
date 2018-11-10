import React, { Component } from "react";
// import "./App.css";

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  state = {
    list: [
      {
        title: "React",
        url: "https://reactjs.org/",
        author: "Jordan Walke",
        num_comments: 3,
        points: 4,
        objectID: 0
      },
      {
        title: "Redux",
        url: "https://redux.js.org/",
        author: "Dan Abramov, Andrew Clark",
        num_comments: 2,
        points: 5,
        objectID: 1
      }
    ],
    searchTerm: ""
  };

  onDismiss = id => {
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  };

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    const { list, searchTerm } = this.state;

    return (
      <div className="App">
        <Search value={searchTerm} onChange={this.onSearchChange}>
          Search{" "}
        </Search>
        <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) => (
  <form>
    {children} <input type="text" value={value} onChange={onChange} />
  </form>
);

const Table = ({ list, pattern, onDismiss }) => (
  <div>
    {list.filter(isSearched(pattern)).map(item => (
      <div key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>
          <button onClick={() => onDismiss(item.objectID)} type="button">
            Dismiss
          </button>
        </span>
      </div>
    ))}
  </div>
);

export default App;
