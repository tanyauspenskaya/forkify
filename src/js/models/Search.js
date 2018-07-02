import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = 'c429c763c5981d66de70c5dca7c4cb0e';
  
    try {
      const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      //console.log(this.result);
    }
    catch(err) {
      console.log(err);
    }
  }
}
