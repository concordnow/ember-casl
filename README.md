ember-casl
==============================================================================

[![Build Status](https://github.com/concordnow/ember-casl/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/concordnow/ember-casl/actions/workflows/main.yml)
[![Ember Observer Score](https://emberobserver.com/badges/ember-casl.svg)](https://emberobserver.com/addons/ember-casl)

Ember addon for [CASL](https://github.com/stalniy/casl) which makes it easy to add permissions in any Ember application.

This package allows to integrate `@casl/ability` with [Ember](https://emberjs.com/) application.

It provides:
- Ability service that allows you to define CASL ability compatible with Ember tracked properties.
- Can/Cannot component that allow to hide or show UI elements based on user ability to see them.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v10 or above
* ember-auto-import v2.0 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-casl
```


Usage
------------------------------------------------------------------------------

### Ability Service

Define ability like regular Ember services by extending AbilityService.

```js
// services/post-ability.js
import { tracked } from '@glimmer/tracking';
import AbilityService from 'ember-casl/services/ability';

export default class PostAbility extends AbilityService {
  @tracked isWriter = false;

  get definition() {
    return ({ can, cannot }) => {
      can('read', 'post');
      if (this.isWriter) {
        can('write', 'post');
      } else {
        cannot('write', 'post').because("You're not a writer");
      }
    };
  }
}
```

The `definition` getter should return a function taking destructured [AbilityBuilder](https://casl.js.org/v5/en/api/casl-ability#ability-builder) as argument ([build](https://casl.js.org/v5/en/api/casl-ability#build) excluded).

It allows you to define very complex reactive ability (eg. Ability based on tracked property or another service).

Your newly created Ability service expose some fields

| Name              | Type         | Description                                                                                                    |
| ----------------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| `ability`         | CASL Ability | Original [CASL Ability](https://casl.js.org/v5/en/api/casl-ability#ability)                                    |
| `can`             | Method       | Wrapper on [CASL Ability method can](https://casl.js.org/v5/en/api/casl-ability#can-of-pure-ability)           |
| `cannot`          | Method       | Wrapper on [CASL Ability method cannot](https://casl.js.org/v5/en/api/casl-ability#cannot-of-pure-ability)     |
| `relevantRuleFor` | Method       | Wrapper on [CASL Ability method relevantRuleFor](https://casl.js.org/v5/en/api/casl-ability#relevant-rule-for) |

Then you can use those abilities as regular services in your Ember application.

```js
// components/dummy.js
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class Dummy Component extends Component {
  @service postAbility;

  get canRead() {
    return this.postAbility.can('read', 'post');
  }

  get cannotWriteReason() {
    return this.postAbility.relevantRuleFor('read', 'post').reason;
  }
}
```

### Can / Cannot Helpers

You can use `can` & `cannot` helpers in your templates.

```hbs
{{#if (can 'read' 'post' service='post-ability')}}
  <span>You're a reader</span>
{{/if}}
{{#if (cannot 'write' 'post' service='post-ability')}}
  <span>You're not a writer</span>
{{/if}}
```

Positional params are CASL Ability [can](https://casl.js.org/v5/en/api/casl-ability#can-of-pure-ability) / [cannot](https://casl.js.org/v5/en/api/casl-ability#cannot-of-pure-ability) arguments.
`service` is the name of the Ember service.


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
