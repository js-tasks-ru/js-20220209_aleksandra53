export default class ColumnChart {
  chartHeight = 50;
  subElements = {};

  constructor({data = [], label = '', value = 0, link = '', formatHeading = data => data} = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;

    this.render();
  }

  get template() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.value}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getContainerBody()}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.getSubElements();

    if (!this.data.length) this.element.classList.add('column-chart_loading');
  }

  update(data) {
    this.data = data;
    this.subElements.body.innerHTML = this.getContainerBody();
  }

  remove() {
    this.element.remove();
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
  }

  getLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
  }

  getContainerBody() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(value => {
      return `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${(value / maxValue * 100).toFixed(0)}%"></div>`;
    }).join('');
  }
}
