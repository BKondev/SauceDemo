import { loginSelectors } from '../selectors/LoginSelectors';

class LoginPage {
  visit() {
    cy.visit('https://www.saucedemo.com/');
  }

  enterUsername(username) {
    cy.get(loginSelectors.usernameField).type(username,{log:false});
  }

  enterPassword(password) {
    cy.get(loginSelectors.passwordField).type(password,{log:false});
  }

  clickLogin() {
    cy.get(loginSelectors.loginButton).click();
  }

  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
  }

  getErrorMessage() {
    return cy.get(loginSelectors.errorMessage);
  }
}

export default new LoginPage();