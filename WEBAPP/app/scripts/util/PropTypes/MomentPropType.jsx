import { isMoment } from 'moment';

export function MomentPropType(props, propName, componentName) {
  if (!isMoment(props[propName])) {
    return new Error(`Prop ${propName} of ${componentName} is not a Moment object!`);
  }
}
