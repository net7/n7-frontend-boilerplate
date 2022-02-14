import * as moment from 'moment';

export default {
  format(date, format) {
    return moment(date).format(format);
  }
};
