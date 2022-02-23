export default class ColumnChart {
  chartHeight = 50;

  constructor(params = {}) {
    this.data = this.processData(params.data);
    this.label = params.label;
    this.value = params.value || 0;
    this.link = params.link;
    this.formatHeading = params.formatHeading;

    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = `column-chart ${!this.data.length ? 'column-chart_loading' : ''}`;
    wrapper.style = `--chart-height: ${this.chartHeight}`;
    wrapper.append(this.createTitle());
    wrapper.append(this.createContainer());
    this.element = wrapper;
  }

  update(data) {
    this.data = this.processData(data);
    const body = this.element.querySelector('.column-chart__chart');
    body.innerHTML = '';
    this.createChart(body);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  createTitle() {
    const title = document.createElement('div');
    title.className = 'column-chart__title';
    title.innerHTML = this.label;
    if (this.link) {
      const link = document.createElement('a');
      link.href = `/${this.link}`;
      link.className = 'column-chart__link';
      link.innerHTML = 'View all';
      title.append(link);
    }
    return title;
  }

  createContainer() {
    const container = document.createElement('div');
    container.className = 'column-chart__container';
    container.append(this.createContainerHeader());
    container.append(this.createContainerBody());
    return container;
  }

  createContainerHeader() {
    const header = document.createElement('div');
    header.className = 'column-chart__header';
    header.innerHTML = this.formatHeading ? this.formatHeading(this.value) : this.value;
    return header;
  }

  createContainerBody() {
    const body = document.createElement('div');
    body.className = 'column-chart__chart';
    this.createChart(body);
    return body;
  }

  createChart(body) {
    this.data.forEach(item => {
      const column = document.createElement('div');
      column.style = `--value: ${item.value}`;
      column.dataset.tooltip = item.percent;
      body.append(column);
    });
  }

  processData(data) {
    if (!data) return [];

    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(value => {
      return {
        percent: (value / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(value * scale))
      };
    });
  }
}
