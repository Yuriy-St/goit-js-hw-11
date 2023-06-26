'use strict';

import '../css/index.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Report } from 'notiflix';

function processError(err) {
  if (!document.getElementById('breed-container').classList.contains('is-hidden')) {
    touggleElement(breedSelectRef, 'on');
  }
  touggleElement(catInfoRef, 'off');
  Report.failure('Error', 'Something went wrong 🙄 Try reloading the page!', 'Okay');
  console.error(err);
}
