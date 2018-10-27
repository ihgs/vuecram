<template>
  <div>
    <time-table-row v-for="studentdata in stamdata" :key="studentdata.student.id"
      :daydata="studentdata" :title="fullname(studentdata.student)"
      :hour_width="hour_width" :hours="hours"
      :cell_height="cell_height">
    </time-table-row>
  </div>
</template>

<script>
import TimeTableRow from '../students/TimeTableRow'
const moment = require('moment')
moment.locale('ja')

export default {
  name: 'TimeTable',
  components: {
    TimeTableRow
  },
  props: {
    items: Array,
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
    stamdata: function () {
      const data = []
      const that = this
      this.items.forEach(function (item) {
        const eventPoints = []
        item.timestamps.forEach(function (timestamp) {
          const point = moment(timestamp.timestamp.toDate())
          const style = (point.hour() - that.start_hour) * that.hour_width
          eventPoints.push(
            {
              title: point.format('HH:mm'),
              style: style
            }
          )
        })
        data.push({
          student: item.student,
          eventPoints: eventPoints
        })
      })
      return data
    }
  },
  methods: {
    fullname: function (student) {
      if (student && student.base) {
        return student.base.familyName + ' ' + student.base.firstName
      }
      return ''
    }
  },
  data: function () {
    return {
      hours: [],
      hour_width: 0
    }
  }
}
</script>
