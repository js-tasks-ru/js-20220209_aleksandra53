export default class SortableTable {
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  get template() {
    return `
      <div class="sortable-table">
        ${this.getHeader()}
        ${this.getBody()}
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.getSubElements();
  }

  sort(id, order) {
    const columnConfig = this.headerConfig.find(columnConfig => columnConfig.id === id);
    const direction = order === 'desc' ? -1 : 1;

    this.data = [...this.data].sort((a, b) => {
      return columnConfig.sortType === 'string' ?
        direction * a[id].localeCompare(b[id], ['ru', 'en']) :
        direction * (a[id] - b[id]);
    });

    this.subElements.columns.forEach(column => column.dataset.order = column.dataset.id === id ? order : '');
    this.subElements.body.innerHTML = this.data.map(rowData => this.getRow(rowData)).join('');
  }

  remove() {
    this.element?.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  getSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(subElement => {
      this.subElements[subElement.getAttribute('data-element')] = subElement;
    });
    this.subElements.columns = this.subElements.body.querySelectorAll('.sortable-table__cell');
  }

  getHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(columnConfig => this.getColumn(columnConfig)).join('')}
      </div>
    `;
  }

  getColumn({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }

  getBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.data.map(rowData => this.getRow(rowData)).join('')}
      </div>
    `;
  }

  getRow(rowData) {
    return `
      <a href="/products/${rowData.id}" class="sortable-table__row">
        ${this.headerConfig.map(({id, template}) => this.getCell(template, rowData[id])).join('')}
      </a>
    `;
  }

  getCell(template, data) {
    if (template) return template(data);
    return `<div class="sortable-table__cell">${data}</div>`;
  }
}

