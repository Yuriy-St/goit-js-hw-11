'use strict';
import 'modern-normalize';
import '../css/index.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Report } from 'notiflix';

import pixabay from './pixabay';
import imageCard from '../templates/imageCard';

const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionsDelay: 250 });

const formRef = document.getElementById('search-form');

formRef.addEventListener('submit', onSubmit);

async function onSubmit(evnt) {
  try {
    evnt.preventDefault();
    const targetRef = evnt.target;
    const q = targetRef.elements.searchQuery.value;
    const response = await pixabay.searchPictures({ q });
    const markup = markupImageCards(response.data.hits);
    renderGallery(markup);
  } catch (err) {
    processError(err);
  }
}

function markupImageCards(hits) {
  if (!hits.length) return '';
  const markup = hits.reduce((gallery, image) => {
    gallery += imageCard(image);
    return gallery;
  }, '');
  return markup;
}

function renderGallery(markup) {
  const galleryRef = document.querySelector('.gallery');
  galleryRef.innerHTML = markup;
}

function processError(err) {
  // if (!document.getElementById('breed-container').classList.contains('is-hidden')) {
  //   touggleElement(breedSelectRef, 'on');
  // }
  // touggleElement(catInfoRef, 'off');
  Report.failure('Error', err.message, 'Okay');
  console.error(err);
}
