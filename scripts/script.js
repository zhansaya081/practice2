import getTrackingData from './AjaxRequest.js';

let trackingData = '';
let url = 'assets/json/data.json';
let periods = document.querySelector('.profile__period');
for (let child of periods.children) {
  child.addEventListener('click', periodSelectHandler);
  child.addEventListener('focus', periodSelectHandler);
  child.addEventListener('keypress', periodKeypressHandler);
}

async function periodSelectHandler(e) {
  if (e.target.classList.contains('active')) return false;
  await getTrackingData(url).then((res) => (trackingData = res));

  if (!trackingData)
    throw new Error(`Something goes wrong when retreiving data 
    from server`);
  else {
    document
      .querySelector('.profile__period .active')
      .classList.remove('active');

    e.target.classList.add('active');

    let period = e.target.dataset.period;
    updateWidgets(period);
  }
}

function updateWidgets(period) {
  let map = { daily: 'day', weekly: 'week', monthly: 'month' };

  for (let field of trackingData) {
    let title = field.title.replace(' ', '');
    let crnt = document.querySelector('#current' + CSS.escape(title));
    let prev = document.querySelector('#previous' + CSS.escape(title));

    crnt.classList.replace('apearing', 'fading');
    prev.classList.replace('apearing', 'fading');
    
    setTimeout(() => {
      crnt.textContent = `${field.timeframes[period].current}hrs`;
      prev.textContent = `Last ${map[period]} ${field.timeframes[period].previous} hrs`;
      crnt.classList.replace('fading', 'apearing');
      prev.classList.replace('fading', 'apearing');
    }, 200);
  }
}

function periodKeypressHandler(e) {
  document.querySelector('.work .widget__title').focus();
}

getTrackingData(url).then(
  (res) => ((trackingData = res), updateWidgets('daily'))
);