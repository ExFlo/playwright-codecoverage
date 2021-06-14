import { BasePo } from '../../basePo';

// This is e2e tools specifics
export class QuickstartPage extends BasePo {
  // Attribute of the page
  url = 'http://localhost:4200/';

  getComponentSelector(): string {
    return 'app-root';
  }

  // Actions
  async navigateTo() {
    await this.page.goto(this.url);
  }

  async openThePage() {
    await this.navigateTo();
  }
}
