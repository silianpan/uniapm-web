import _moment from 'moment'
export const timeRange = {
  '1小时': {
    start_time: _moment().subtract(1, 'hours').format('X'),
    end_time: _moment().format('X')
  },
  '3小时': {
    start_time: _moment().subtract(3, 'hours').format('X'),
    end_time: _moment().format('X')
  },
  '6小时': {
    start_time: _moment().subtract(6, 'hours').format('X'),
    end_time: _moment().format('X')
  },
  '12小时': {
    start_time: _moment().subtract(12, 'hours').format('X'),
    end_time: _moment().format('X')
  },
  '1天': {
    start_time: _moment().subtract(1, 'days').format('X'),
    end_time: _moment().format('X')
  },
  '今天': {
    start_time: _moment().startOf('day').format('X'),
    end_time: _moment().format('X')
  },
  '昨天': {
    start_time: _moment().subtract(1, 'days').startOf('day').format('X'),
    end_time: _moment().subtract(1, 'days').endOf('day').format('X')
  },
  '最近7天': {
    start_time: _moment().subtract(6, 'days').format('X'),
    end_time: _moment().format('X')
  },
  '最近30天': {
    start_time: _moment().subtract(29, 'days').format('X'),
    end_time: _moment().format('X')
  },
  '最近1年': {
    start_time: _moment().subtract(11, 'months').format('X'),
    end_time: _moment().format('X')
  }
}
