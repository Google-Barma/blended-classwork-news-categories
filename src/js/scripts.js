import { articles } from './articles';
import selectTemplate from '../templates/select.hbs';
import articleTemplate from '../templates/article-template.hbs';

// Фукционал
//  - Пользователь может ввести свое имя и фамилию в форму и отправить ее
//  - После отправки, под формой вы должны отрендерить надпись {name} {secondName},
// выбирите категорию новостей а также селектор где пользователь может выбрать 1 из 3 категорий новостей
//  - После выбора категории новости вы должны отрендерить те новости которые выбрал пользователь
//  - Пользователь может выбрать другую категорию, вы должны отрендерить новости из новой категории
// - При перезагрузке страницы имя пользовател и выбранная категория должна сохранятся

const refs = {
  form: document.querySelector('.form'),
  formSubmitBtn: document.querySelector('.form__submit-btn'),
  formTitle: document.querySelector('.form__title'),
  formFullUserName: document.querySelector('.form__user-name'),
  articlesList: document.querySelector('.article__list'),
  select: document.querySelector('#category'),
};

const submittedData = {};
const categoryList = [];

reloadPage();

refs.form.addEventListener('submit', handleSubmitBtn);
refs.select.addEventListener('change', handleSelect);

function getFormNameData(event) {
  event.preventDefault();

  const formRef = event.target;
  const formData = new FormData(formRef);

  formData.forEach((value, key) => {
    submittedData[key] = value;
  });
}

function handleSubmitBtn(event) {
  getFormNameData(event);
  saveFullNameDateToLocalStorage();
  addFullNameToTitle();
  makeVisibleSelect();
}

function addFullNameToTitle() {
  if (localStorage.submittedData) {
    refs.formFullUserName.textContent = getFullNameDateFromLocaleStorage();
    refs.formTitle.classList.add('js-visible');
  }
}

//TODO поменять на reduce
function makeCategoryList() {
  articles.map(item => {
    if (!categoryList.includes(item['category'])) {
      categoryList.push(item['category']);
    }
  });
}

function addSelectToHTML() {
  const select = selectTemplate(categoryList);
  refs.select.insertAdjacentHTML('beforeend', select);
}

function saveFullNameDateToLocalStorage() {
  localStorage.setItem('submittedData', JSON.stringify(submittedData));
}

function getFullNameDateFromLocaleStorage() {
  const savedNameData = localStorage.getItem('submittedData');
  const parsedNameData = JSON.parse(savedNameData);
  return `${parsedNameData['name']} ${parsedNameData['secondName']}`;
}

function makeVisibleSelect() {
  refs.select.classList.replace('js-invisible', 'js-visible');
  localStorage.setItem('selectVisibility', 'visible');
}

function saveSelectValue() {
  localStorage.setItem('selectValue', refs.select.value);
}

function getSelectValue() {
  const savedSelectValue = localStorage.getItem('selectValue');
  refs.select.value = savedSelectValue;
  return savedSelectValue;
}

function makeArticle() {
  const selectedCategories = generateArticleList(getSelectValue());
  const articlesFromTemplate = articleTemplate(selectedCategories);

  refs.articlesList.innerHTML = articlesFromTemplate;
}

function handleSelect() {
  saveSelectValue();
  makeArticle();
}

function reloadPage() {
  addFullNameToTitle();
  makeCategoryList();
  addSelectToHTML();
  makeArticle();

  if (localStorage.getItem('selectValue')) {
    getSelectValue();
  }

  if (localStorage.getItem('selectVisibility')) {
    makeVisibleSelect();
  }
}

function generateArticleList(cat) {
  const categories = articles.filter(item => item['category'] === cat);

  return categories;
}
