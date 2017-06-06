import { ShoppingAngular2Page } from './app.po';

describe('shopping-angular2 App', () => {
  let page: ShoppingAngular2Page;

  beforeEach(() => {
    page = new ShoppingAngular2Page();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
