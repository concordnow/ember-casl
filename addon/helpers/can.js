import { getOwner } from '@ember/application';
import Helper from '@ember/component/helper';

export default class Can extends Helper {
  compute(args, { service }) {
    let applicationInstance = getOwner(this);
    let ability = applicationInstance.lookup(`service:${service}`);
    return ability.can(...args);
  }
}
