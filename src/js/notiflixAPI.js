import { Report, Block } from 'notiflix';

Report.init({
  width: '640px',
  titleFontSize: '24px',
  messageFontSize: '18px',
});

module.exports = { Report, Block };
