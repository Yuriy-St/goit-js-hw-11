'use strict';
import 'modern-normalize';
import '../css/index.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import pixabay from './pixabay';
import templateImageCard from '../templates/templateImageCard';
import { Report, Block } from './notiflixAPI';

const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionsDelay: 250 });
const formRef = document.getElementById('search-form');
const queryInputRef = formRef.elements.searchQuery;
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');

const PER_PAGE = 40;
let currentPage = 0;

formRef.addEventListener('submit', onSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMore);

async function onSubmit(evnt) {
  evnt.preventDefault();
  clearGallery();
  switchLoadMoreBtn();
  loadPhotos();
}

async function onLoadMore(evnt) {
  evnt.preventDefault();
  loadPhotos();
}

async function loadPhotos() {
  switchLoadMoreBtn();
  Block.dots('body', 'Loading...');

  try {
    const q = queryInputRef.value;
    const response = await fetchPictures(q);
    const markup = markupImageCards(response.data);
    renderGallery(markup);
  } catch (err) {
    processError(err);
  } finally {
    Block.remove('body');
  }
}

async function fetchPictures(q) {
  const params = {
    q,
    per_page: PER_PAGE,
    page: ++currentPage,
  };
  const response = await pixabay.searchPictures(params);
  return response;
}

function markupImageCards(data) {
  const { total, hits } = data;
  if (!total) {
    showWarning('Sorry, there are no images matching your search query. Please try again.');
    return '';
  }
  const markup = hits.reduce((gallery, image) => {
    gallery += templateImageCard(image);
    return gallery;
  }, '');
  const loadMore = getPagesLeft(total);
  if (loadMore) {
    switchLoadMoreBtn(true);
  } else {
    switchLoadMoreBtn();
    showWarning("We're sorry, but you've reached the end of search results.");
  }
  return markup;
}

function getPagesLeft(total) {
  const totalPages = Math.ceil(total / PER_PAGE);
  return totalPages - currentPage;
}

function renderGallery(markup) {
  galleryRef.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();

  const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearGallery() {
  galleryRef.innerHTML = '';
  currentPage = 0;
}

function switchLoadMoreBtn(flag = false) {
  const classList = loadMoreBtnRef.classList;
  if (flag) {
    classList.remove('is-hidden');
    return;
  }
  classList.add('is-hidden');
}

function showWarning(message) {
  Report.warning('Ooops!', message);
}

function showError(title, message) {
  Report.failure(title, message, 'Okay');
}

function processError(err) {
  // if (!document.getElementById('breed-container').classList.contains('is-hidden')) {
  //   touggleElement(breedSelectRef, 'on');
  // }
  // touggleElement(catInfoRef, 'off');
  const title = err.name ? `Error: ${err.name}` : 'Error';
  showError(title, err.message);
  console.error(err);
}
