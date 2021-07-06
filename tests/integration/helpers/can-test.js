import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import AbilityService from 'ember-casl/services/ability';

class DummyAbility extends AbilityService {
  get definition() {
    return ({ can, cannot }) => {
      can('read', 'post');
      cannot('write', 'post');
    };
  }
}

module('Integration | Helper | can', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:dummy-ability', DummyAbility);
  });

  test('it checks valid permission', async function (assert) {
    await render(hbs`{{can 'read' 'post' service='dummy-ability'}}`);

    assert.dom(this.element).hasText('true');
  });

  test('it checks invalid permission', async function (assert) {
    await render(hbs`{{can 'write' 'post' service='dummy-ability'}}`);

    assert.dom(this.element).hasText('false');
  });
});
