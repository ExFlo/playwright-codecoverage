import { Page } from '@playwright/test';

export class BasePo {
  private _page: Page;
  rootSelector: string;
  index: number;

  constructor(pageTest: Page, parentSelector?: string, index?: number) {
    this.page = pageTest;
    let componentSelector = this.getComponentSelector();
    if (index != null) {
      componentSelector = `nth-match(${componentSelector}, ${index})`;
    }
    this.rootSelector = parentSelector
      ? `${parentSelector} >>  ${componentSelector}`
      : componentSelector;
  }

  getRootSelector() {
    return this.rootSelector;
  }

  getComponentSelector(): string {
    throw new Error('You must implement this function');
  }

  get page() {
    return this._page;
  }

  set page(_page: Page) {
    this._page = _page;
  }

  async waitLoaded() {
    return this.page.waitForSelector(this.rootSelector);
  }
}
