import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tab-layout/tabbar', 'Integration | Component | tab layout/tabbar', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{tab-layout/tabbar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#tab-layout/tabbar}}
      template block text
    {{/tab-layout/tabbar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
