window.addEventListener('DOMContentLoaded', initJs);

function initJs() {
  let body = document.querySelector('body');
}

//= include 'page_1/subpage_1/_base.js'

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});
