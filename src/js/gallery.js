import ImagesApiService from './apiService';
import LoadMoreBtn from './load-more-btn';

import imageCardTpl from '../templates/image-card.hbs';

import { defaultModules, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';

import '@pnotify/core/dist/BrightTheme.css'; 

defaultModules.set(PNotifyMobile, {});


import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';

const formInputRef = document.getElementById('search-form');
const galleryListRef = document.getElementById('gallery-list');
const loadMoreBtnRef = document.getElementById('my-element-selector');

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});


const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};
const observer = new IntersectionObserver(onLoadMoreClick, options);

function setError(data) {
  const now = new Date().valueOf();
  let endPoint = 0;

  if (now > endPoint) {
    endPoint = now + data.delay + 1000;
    return error(data);
  }
}

async function onSearch(e) {
  e.preventDefault();
  clearImagesContainer();

  const value = e.target.elements.query.value.trim();
  if (value === '') {
    return setError({
      title: `Please enter some value!`,
      delay: 500,
    });
  }
  imagesApiService.query = value;
  const data = await imagesApiService.fetchPictures();
  renderImagesMarkup(data);

  loadMoreBtn.show();
 

  fetchImages();
  imagesApiService.resetPage();
}
formInputRef.addEventListener('submit', onSearch);

function fetchImages() {
  loadMoreBtn.disable();
  imagesApiService.fetchPictures().then(hits => {
    loadMoreBtn.enable();
    formInputRef.reset();
  });
}

function renderImagesMarkup(hits) {
  galleryListRef.insertAdjacentHTML('beforeend', imageCardTpl(hits));
}

function clearImagesContainer() {
  galleryListRef.innerHTML = '';
}

async function onLoadMoreClick(e) {
  observer.observe(loadMoreBtnRef);
  imagesApiService.incrementPage();

  const data = await imagesApiService.fetchPictures();
  renderImagesMarkup(data);

  galleryListRef.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

loadMoreBtnRef.addEventListener('click', onLoadMoreClick);

function showModal(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }

  const instance = basicLightbox.create(`
        <img class="gallery-image" src="${e.target.dataset.source}" width="800" height="600">
    `);
  instance.show();
}
galleryListRef.addEventListener('click', showModal);

