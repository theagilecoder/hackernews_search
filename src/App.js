import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const DEFAULT_QUERY = "redux";

class App extends Component {
  state = {
    results: null,
    searchKey: "",
    searchTerm: DEFAULT_QUERY,
    error: null
  };

  // Dsimiss button
  onDismiss = id => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const updatedHits = hits.filter(item => item.objectID !== id);
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  };

  // onChange function for Search box
  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  // Can remove this later...
  setSearchTopStories = result => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  };

  // call API on mount and on submitting search
  fetchSearchTopStories = (searchTerm, page = 0) => {
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`
    )
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error }));
  };

  // Call after mounting
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm); //First API call
  }

  needsToSearchTopStories = searchTerm => {
    return !this.state.results[searchTerm];
  };

  // On Submitting a search...
  onSearchSubmit = event => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  };

  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

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
        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </button>
        </div>
      </div>
    );
  }
}

class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={el => (this.input = el)}
        />
        <button type="submit">{children}</button>
      </form>
    );
  }
}

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

export { Search, Table };
