<template>
  <div>
    <time-table-row v-for="daydata in stampdata" :key="daydata.date"
      :daydata="daydata" :title="daydata.date"
      :hour_width="hour_width" :hours="hours"
      :cell_height="cell_height">
    </time-table-row>
  </div>
</template>

<script>
import TimeTableRow from './TimeTableRow'
const moment = require('moment')
moment.locale('ja')

export default {
  name: 'TimeTable',
  components: {
    TimeTableRow
  },
  props: {
    year: Number,
    month: Number,
    timestamps: Array,
    start_hour: {
      type: Number,
      default: 8
    },
    end_hour: {
      type: Number,
      default: 22
    },
    cell_height: {
      type: Number,
      default: 35
    },
    table_width: {
      type: Number,
      default: 550
    }
  },
  mounted: function () {
    this.hour_width = this.table_width / (this.end_hour - this.start_hour)
    this.hours = Array.from(Array(this.end_hour - this.start_hour + 1), (v, k) => k + this.start_hour)
  },
  computed: {
    stampdata: function () {
      const targetMonth = moment([this.year, this.month - 1, 1])
      const data = []
      const tmpStamps = [].concat(this.timestamps)
      do {
        const eventPoints = []
        tmpStamps.forEach((item, index, object) => {
          const point = moment(item.timestamp)
          if (targetMonth.date() === point.date()) {
            const style = (point.hour() - this.start_hour) * this.hour_width
            eventPoints.push(
              {
                title: point.format('HH:mm'),
                style: style
              }
            )
          }
        })
        data.push({
          date: targetMonth.format('YYYY/MM/DD'),
          eventPoints: eventPoints
        })
        targetMonth.add(1, 'day')
      } while (this.month - 1 === targetMonth.month())
      return data
    }
  },
  methods: {
  },
  data: function () {
    return {
      hours: [],
      hour_width: 0
    }
  }
}
</script>
