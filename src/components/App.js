import React, { Component } from 'react';
import logo from '../logo.svg';
import '../styles/App.css';
import Modal from 'react-modal';

const url = 'https://api.nytimes.com/svc/books/v3/lists/';
const api_key = '5bb7856e68b546a58449e0f44cb24269';
const default_arg = 'combined-print-and-e-book-fiction';
const nonfiction_arg = 'combined-print-and-e-book-nonfiction';

const google_url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
const google_isbn = '';
const google_review = '';
const google_api_key = 'AIzaSyB-JCkygYmKNnEs0Lncbj5TlZHJ_VZJylI'; 

const customStyles = {
  content : {
    top                   : '33%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root')

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      modalIsOpen: false,
      modal_index: -1,
      title: "",
      author: "",
      amazonUrl: "",
      review: ""

    };
    this.handleClick = this.handleClick.bind(this)
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  
    handleClick(title, author, description, amazonUrl, primary_isbn10) {
      console.log(`${title} clicked`);
      var googleisbn = primary_isbn10;

      console.log(title);
      this.setState({title: title});
      this.setState({description: description});
	  this.setState({author: author});
	  this.setState({amazonUrl: amazonUrl});
      
      fetch(google_url + googleisbn + '&key=' + google_api_key)
        .then(response => response.json())
	    .then(data => this.setState({review: data.items[0].volumeInfo.averageRating }));
    }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    this.setState({modal_index: -1})
  }

  componentDidMount() {
  	  // this.fetchData();

    fetch(url + default_arg + '?api_key=' + api_key)
      .then(response => response.json())
	  .then(data => this.setState({ list: data.results.books }));      
}

 
   render() {
    const { list } = this.state;
     return (     	
     	<div className="modal-container">      		
    		<p className="nav">New York Times Combined Print and E-Book Fiction Bestseller List | </p>
       <div className="book-list">
       	{ list.map(list => 
       		<div className="book-container">
       			<div className="book-tile" key={ list.primary_isbn10 } onClick={ this.openModal } >
	       			<div className="book front">
	       				<img src={ list.book_image } alt="book cover" onClick={() => { this.handleClick(list.title, list.author, list.description, list.amazon_product_url, list.primary_isbn10)}}></img>

	       			</div>
	       		</div>
       		</div>
       	)}	       
       	</div> 
			<Modal 
		      isOpen={this.state.modalIsOpen}
		      onAfterOpen={this.afterOpenModal}
		      onRequestClose={this.closeModal}
		      style={customStyles}
		      contentLabel="Example Modal"
		      >
			  <h3>{this.state.title}</h3> 
			  <p className="author">{this.state.author}</p>
			  <p className="description">{this.state.description}</p>
			  <p className="amazon-url"><a href={ this.state.amazonUrl }>Buy on Amazon</a></p>
			  <p className="google-rating">Average Google Books Rating: {this.state.review}</p>
			</Modal>
		</div>
    );
  }

}

export default App;