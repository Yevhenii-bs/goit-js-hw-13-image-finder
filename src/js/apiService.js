import axios from 'axios';
axios.defaults.baseURL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.key = '24349054-5479f6a9e6c1378965011a608';
  }

  async fetchPictures() {
    const url = `&q=${this.query}&page=${this.page}&per_page=12&key=${this.key}`;

    const {
      data: { hits },
    } = await axios.get(url);
    return hits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
