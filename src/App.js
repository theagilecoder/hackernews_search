import React, { Component } from "react";
import "./App.css";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const DEFAULT_QUERY = "redux";

class App extends Component {
  state = {
    result: null,
    searchTerm: DEFAULT_QUERY
  };

  // Dsimiss button
  onDismiss = id => {
    const updatedHits = this.state.result.hits.filter(
      item => item.objectID !== id
    );
    this.setState({ result: { ...this.state.result, hits: updatedHits } });
  };

  // onChange function for Search box
  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  // Can remove this later...
  setSearchTopStories = result => {
    this.setState({ result });
  };

  // call API on mount and on submitting search
  fetchSearchTopStories = searchTerm => {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  };

  // Call after mounting
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  // On Submitting a search...
  onSearchSubmit = event => {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  };

  render() {
    const { searchTerm, result } = this.state;

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search{" "}
          </Search>
        </div>
        {result && <Table list={result.hits} onDismiss={this.onDismiss} />}
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" value={value} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
);

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map(item => (
      <div key={item.objectID} className="table-row">
        <span style={{ width: "40%" }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: "30%" }}>{item.author}</span>
        <span style={{ width: "10%" }}>{item.num_comments}</span>
        <span style={{ width: "10%" }}>{item.points}</span>
        <span style={{ width: "10%" }}>
          <button
            onClick={() => onDismiss(item.objectID)}
            type="button"
            className="button-inline"
          >
            Dismiss
          </button>
        </span>
      </div>
    ))}
  </div>
);

export default App;
