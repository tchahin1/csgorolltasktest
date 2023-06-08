/* eslint-disable cypress/no-unnecessary-waiting */
describe('Dice betting tests', () => {
  it('login test', () => {
    cy.intercept('GET', 'https://api-staging.csgoroll.com/graphql', (req) => {
      cy.log(req.body.operationName);
      if (req.body.operationName === 'DiceBets') {
        req.alias = `gqlDiceBetsQuery`;
        req.reply({
          statusCode: 200,
          body: {
            data: {
              diceBets: {
                edges: [],
                pageInfo: {
                  endCursor: 'WzI5OTIyOCwxOV0=',
                  hasNextPage: true,
                  __typename: 'PageInfo',
                },
                __typename: 'DiceBetConnection',
              },
            },
          },
        });
      }
    });

    cy.visit('https://csgoroll-www-master-h7r4kpopga-uc.a.run.app/dice'),
      {
        auth: {
          username: 'ancient',
          password: 'things',
        },
      }; // Visit the login page

    // cy.wait('@gqlDiceBetsQuery')
    //   .its('response.body.data.diceBets')
    //   .should('have.property', 'edges');
  });

  it('changes different modes, and asserts that every mode is activated successfully', () => {
    cy.get('[data-test="mode-batch"]').click();
    cy.wait(2000);
    cy.get('[data-test="mode-auto"]').click();
    cy.wait(2000);
    cy.get('[data-test="mode-animation"]').click();
    cy.wait(2000);
    cy.get('[data-test="mode-batch"]').click();
    cy.wait(5000);
    cy.get('[data-test="mode-batch"]')
      .find('.mat-button-wrapper')
      .find('.ml-2')
      .should('have.class', 'switch-on');

    cy.wait(2000);
    cy.get('[data-test="mode-auto"]')
      .find('.mat-button-wrapper')
      .find('.ml-2')
      .should('not.have.class', 'switch-on');
    cy.wait(2000);
    cy.get('[data-test="mode-animation"]')
      .find('.mat-button-wrapper')
      .find('.ml-2')
      .should('not.have.class', 'switch-on');
  });

  it('changing bet ammount with available buttons', () => {
    let val = '';
    cy.get('#mat-input-4')
      .invoke('val')
      .then((betAmount) => {
        if (betAmount) {
          val = betAmount.toString();
        }
        cy.log(val);
      });
    cy.get('[data-test="plus-1"]').click();
    cy.wait(2000);
    cy.get('#mat-input-4')
      .invoke('val')
      .then((newAmount) => {
        let newAmntVal = '';
        if (newAmount) {
          newAmntVal = newAmount.toString();
          expect(Number(newAmntVal)).to.eq(Number(val) + 1);
          val = (Number(val) + 1).toString();
        }
      });
    cy.get('[data-test="plus-10"]').click();
    cy.wait(2000);
    cy.get('#mat-input-4')
      .invoke('val')
      .then((newAmount) => {
        let newAmntVal = '';
        if (newAmount) {
          newAmntVal = newAmount.toString();
          expect(Number(newAmntVal)).to.eq(Number(val) + 10);
          val = (Number(val) + 10).toString();
        }
      });
    cy.get('[data-test="1-div-2"]').click();
    cy.wait(2000);
    cy.get('#mat-input-4')
      .invoke('val')
      .then((newAmount) => {
        let newAmntVal = '';
        if (newAmount) {
          newAmntVal = newAmount.toString();
          expect(Number(newAmntVal)).to.eq(Number(val) / 2);
          val = (Number(val) / 2).toString();
        }
      });
    cy.get('[data-test="x2"]').click();
    cy.wait(2000);
    cy.get('#mat-input-4')
      .invoke('val')
      .then((newAmount) => {
        let newAmntVal = '';
        if (newAmount) {
          newAmntVal = newAmount.toString();
          expect(Number(newAmntVal)).to.eq(Number(val) * 2);
          val = (Number(val) * 2).toString();
        }
      });
    cy.get('[data-test="clear"]').click();
  });

  it('dragging slider and value changes inside inputs', () => {
    let val = '';
    let multiplier = '';
    let chance = '';

    cy.get('[data-test="threshold"]')
      .invoke('val')
      .then((rollVal) => {
        if (rollVal) {
          val = rollVal.toString();
        }
        cy.log(val);
      });

    cy.get('[data-test="multiplier"]')
      .invoke('val')
      .then((multiVal) => {
        if (multiVal) {
          multiplier = multiVal.toString();
        }
      });

    cy.get('[data-test="chance"]')
      .invoke('val')
      .then((chanceVal) => {
        if (chanceVal) {
          chance = chanceVal.toString();
        }
      });

    cy.get('div[class="uo-range"]')
      .find('cw-range')
      .find('div')
      .find('div')
      .should('have.class', 'shaded')
      .find('div')
      .should('have.class', 'bg')
      .first()
      .trigger('mousedown', { force: true })
      .trigger('mousemove', 123, 16, { force: true })
      .trigger('mouseup', { force: true });

    cy.get('[data-test="threshold"]')
      .invoke('val')
      .then((newAmount) => {
        let newAmntVal = '';
        if (newAmount) {
          newAmntVal = newAmount.toString();
          expect(Number(newAmntVal)).to.be.lessThan(Number(val));
        }
      });

    cy.get('[data-test="multiplier"]')
      .invoke('val')
      .then((multiVal) => {
        if (multiVal) {
          expect(Number(multiVal)).to.be.greaterThan(Number(multiplier));
        }
      });

    cy.get('[data-test="chance"]')
      .invoke('val')
      .then((chanceVal) => {
        if (chanceVal) {
          expect(Number(chanceVal)).to.be.lessThan(Number(chance));
        }
      });
  });

  it('changing and updating values', () => {
    let val = '';
    let multiplier = '';
    let chance = '';

    cy.get('[data-test="choice-label"]')
      .find('.text-success')
      .should('have.text', 'Under');
    cy.get('[data-test="threshold"]')
      .invoke('val')
      .then((rollVal) => {
        if (rollVal) {
          val = rollVal.toString();
        }
        cy.log(val);
      });
    cy.get('[data-test="choice-switch"]').click();
    cy.get('[data-test="choice-label"]')
      .find('.text-success')
      .should('have.text', 'Over');
    cy.get('[data-test="threshold"]')
      .invoke('val')
      .then((newAmount) => {
        let newAmntVal = '';
        if (newAmount) {
          newAmntVal = newAmount.toString();
          expect(Number(newAmntVal)).to.be.greaterThan(Number(val));
        }

        cy.get('[data-test="choice-label"]')
          .find('.text-success')
          .invoke('text')
          .then((textVal) => {
            if (textVal) {
              if (textVal.toString() === 'Over') {
                cy.get('[data-test="choice-switch"]').click();
              }
            }
          });
        cy.get('[data-test="multiplier"]')
          .invoke('val')
          .then((multiVal) => {
            if (multiVal) {
              multiplier = multiVal.toString();
            }
          });
        cy.get('[data-test="chance"]')
          .invoke('val')
          .then((chanceVal) => {
            if (chanceVal) {
              chance = chanceVal.toString();
            }
          });
        cy.get('[data-test="threshold"]').clear().type('50');
        cy.wait(2000);
        cy.get('[data-test="multiplier"]')
          .invoke('val')
          .then((multiVal) => {
            if (multiVal) {
              expect(Number(multiVal)).to.be.lessThan(Number(multiplier));
            }
          });

        cy.get('[data-test="chance"]')
          .invoke('val')
          .then((chanceVal) => {
            if (chanceVal) {
              expect(Number(chanceVal)).to.be.greaterThan(Number(chance));
            }
          });
      });
  });

  it('Number of rolls changing text in roll button', () => {
    const val = 5;
    cy.reload();
    cy.wait(2000);
    cy.get('[data-test="mode-batch"]').click();
    cy.wait(4000);
    cy.get('[data-test="rolls-per-click"]').clear().type(val.toString());
    cy.get('.mat-button-wrapper').contains(val.toString());
  });

  it('Section visible in slow role mode', () => {
    cy.wait(2000);
    cy.get('cw-reels[class="ng-star-inserted"]').should('not.exist');
    cy.get('[data-test="mode-animation"]').click();
    cy.wait(2000);
    cy.get('cw-reels[class="ng-star-inserted"]').should('exist');
  });

  // it('intercept bet list request', () => {
  //   cy.visit('/dice');

  //   cy.wait('@gqlDiceBetsQuery')
  //     .its('response.body.data.diceBets')
  //     .should('have.property', 'edges');
  // });

  it('tests all the possible features in auto mode', () => {
    cy.viewport('macbook-13');
    cy.wait(3000);
    cy.get('[data-test="mode-auto"]').click();
    cy.wait(2000);

    const arrows = '{leftarrow}'.repeat(3);

    cy.get('article[class="card card-body h-100"]')
      .find('div[class="mt-2"]')
      .find('div[class="mt-1"]')
      .find('mat-slider')
      .should('have.attr', 'aria-valuenow', 5)
      .type(arrows);

    cy.get('article[class="card card-body h-100"]')
      .find('div[class="mt-2"]')
      .find('div[class="mt-1"]')
      .find('mat-slider')
      .should('have.attr', 'aria-valuenow', 2.62);

    cy.get('#mat-radio-3').click();

    cy.get('#mat-radio-3')
      .find('.mat-radio-label')
      .find('.mat-radio-container')
      .find('input')
      .should('be.checked');

    cy.get('#mat-radio-4')
      .find('.mat-radio-label')
      .find('.mat-radio-container')
      .find('input')
      .should('not.be.checked');

    cy.get('#mat-radio-5').click();

    cy.get('#mat-radio-6')
      .find('.mat-radio-label')
      .find('.mat-radio-container')
      .find('input')
      .should('not.be.checked');

    cy.get('[data-test="on-win-multiplier"]').clear().type('3');

    cy.get('[data-test="on-lose-multiplier"]').clear().type('2');

    cy.get('[data-test="max-bet"]').clear().type('1000');

    cy.get('[data-test="roll-limit"]').clear().type('50');
  });
});
