import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { tracked } from '@glimmer/tracking';
import AbilityService from 'ember-casl/services/ability';

module('Unit | Service | ability', function (hooks) {
  setupTest(hooks);

  test('it computes basic definition', function (assert) {
    this.owner.register(
      'service:dummy-ability',
      class DummyAbility extends AbilityService {
        get definition() {
          return ({ can, cannot }) => {
            can('read', 'post');
            cannot('write', 'post');
          };
        }
      }
    );
    let dummyAbility = this.owner.lookup('service:dummy-ability');

    assert.ok(dummyAbility.can('read', 'post'));
    assert.notOk(dummyAbility.cannot('read', 'post'));
    assert.ok(dummyAbility.cannot('write', 'post'));
    assert.notOk(dummyAbility.can('write', 'post'));
  });

  test('it computes tracked property based definition', function (assert) {
    this.owner.register(
      'service:dummy-ability',
      class DummyAbility extends AbilityService {
        @tracked
        isWriter = false;

        @tracked
        isAdmin = false;

        get isEditor() {
          return this.isAdmin && this.isWriter;
        }

        get definition() {
          return ({ can }) => {
            can('read', 'post');
            if (this.isWriter) {
              can('write', 'post');
            }
            if (this.isEditor) {
              can('edit', 'post');
            }
          };
        }
      }
    );
    let dummyAbility = this.owner.lookup('service:dummy-ability');

    assert.ok(dummyAbility.can('read', 'post'));
    assert.notOk(dummyAbility.cannot('read', 'post'));
    assert.ok(dummyAbility.cannot('write', 'post'));
    assert.notOk(dummyAbility.can('write', 'post'));
    assert.ok(dummyAbility.cannot('edit', 'post'));
    assert.notOk(dummyAbility.can('edit', 'post'));

    dummyAbility.isWriter = true;

    assert.ok(dummyAbility.can('read', 'post'));
    assert.notOk(dummyAbility.cannot('read', 'post'));
    assert.ok(dummyAbility.can('write', 'post'));
    assert.notOk(dummyAbility.cannot('write', 'post'));
    assert.ok(dummyAbility.cannot('edit', 'post'));
    assert.notOk(dummyAbility.can('edit', 'post'));

    dummyAbility.isAdmin = true;

    assert.ok(dummyAbility.can('read', 'post'));
    assert.notOk(dummyAbility.cannot('read', 'post'));
    assert.ok(dummyAbility.can('write', 'post'));
    assert.notOk(dummyAbility.cannot('write', 'post'));
    assert.ok(dummyAbility.can('edit', 'post'));
    assert.notOk(dummyAbility.cannot('edit', 'post'));
  });

  test('it gives relevant rule for an ability', function (assert) {
    let reason = 'You are not a writer';
    this.owner.register(
      'service:dummy-ability',
      class DummyAbility extends AbilityService {
        get definition() {
          return ({ can, cannot }) => {
            can('read', 'post');
            cannot('write', 'post').because(reason);
          };
        }
      }
    );
    let dummyAbility = this.owner.lookup('service:dummy-ability');
    assert.ok(dummyAbility.relevantRuleFor('write', 'post').reason, reason);
  });
});
