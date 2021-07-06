import Service from '@ember/service';
import { AbilityBuilder, Ability } from '@casl/ability';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';

export default class AbilityService extends Service {
  #ability = createCache(() => {
    let { build, ...params } = new AbilityBuilder(Ability);

    this.definition?.(params);

    return build();
  });

  get ability() {
    return getValue(this.#ability);
  }

  can() {
    return this.ability.can(...arguments);
  }

  cannot() {
    return this.ability.cannot(...arguments);
  }

  relevantRuleFor() {
    return this.ability.relevantRuleFor(...arguments);
  }
}
