import * as dayjs from 'dayjs';

export default {
  format(date, format) {
    return dayjs(date).format(format);
  }
};
