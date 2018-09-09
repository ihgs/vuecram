<template>
  <div>
    <b-form-input type="date" v-model="displayDate"></b-form-input>
    <time-table :items="items"></time-table>
    <b-container>
      <b-row>
        <b-btn v-b-modal.modal1 size="sm" class="timestampBtn">Timestamp</b-btn>
      </b-row>
    </b-container>
    <b-modal id="modal1" title="Timestamp manually" @shown="updateTime" @ok="handleOk">
        <b-form-select v-model="selected_student" :options="options.student">
        </b-form-select>
      <b-form inline>
        <b-form-group>
          <b-form-select v-model="timestamp.year" :options="options.year"></b-form-select>
          <b-form-select v-model="timestamp.month" :options="options.month"></b-form-select>
          <b-form-select v-model="timestamp.day" :options="dayOptions"></b-form-select>
          &nbsp;&nbsp;
          <b-form-select v-model="timestamp.hour" :options="options.hour"></b-form-select>
          <b-form-select v-model="timestamp.minute" :options="options.minute"></b-form-select>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import TimeTable from './TimeTable'
const moment = require('moment')
moment.locale('ja')

export default {
  name: 'TimestampList',
  components: {
    TimeTable
  },
  created: function () {
    firebase.firestore().collection('students').get().then((studentSp) => {
      studentSp.forEach((student) => {
        this.studentMap[student.id] = {}
        this.studentMap[student.id].student = student.data()
        this.studentMap[student.id].timestamps = []
        this.options.student.push(
          {
            value: student.id,
            text: this.fullname(student.data())
          }
        )
      })
    })
  },
  mounted: function () {
    const today = moment()
    this.displayDate = today.format('YYYY-MM-DD')

    const year = today.year()
    this.options.year = [year - 1, year, year + 1]
    this.options.month = []
    for (let i = 0; i < 12; i++) {
      this.options.month.push({value: i, text: i + 1})
    }
    this.options.hour = []
    for (let i = 1; i < 25; i++) {
      this.options.hour.push(i)
    }
    this.options.minute = []
    for (let i = 1; i < 61; i++) {
      this.options.minute.push(i)
    }
  },
  computed: {
    dayOptions: function () {
      const selected = moment(this.timestamp)
      const lastDay = selected.endOf('month').date()
      const days = []
      for (let i = 1; i < lastDay; i++) {
        days.push(i)
      }
      return days
    }
  },
  methods: {
    update: function (date) {
      this.items = []
      Object.keys(this.studentMap).forEach((key) => {
        this.studentMap[key].timestamps = []
      })
      firebase.firestore().collection('stamps')
        .where('timestamp', '>=', date.startOf('day').toDate())
        .where('timestamp', '<=', date.endOf('day').toDate())
        .get().then((stampSp) => {
          stampSp.forEach((stamp) => {
            const stampObj = stamp.data()
            stampObj.time = moment(stampObj.timestamp).format('lll')
            this.studentMap[stampObj.student_id].timestamps.push(stampObj)
          })
          this.items = Object.values(this.studentMap)
        })
    },
    fullname: function (student) {
      if (student && student.base) {
        return student.base.familyName + ' ' + student.base.firstName
      }
      return ''
    },
    updateTime: function () {
      const now = moment()
      this.timestamp.year = now.year()
      this.timestamp.month = now.month()
      this.timestamp.day = now.date()
      this.timestamp.hour = now.hour()
      this.timestamp.minute = now.minute()
    },
    handleOk: function () {
      const stamp = {
        'device_name': 'system',
        'timestamp': moment(this.timestamp).toDate(),
        'student_id': this.selected_student
      }
      firebase.firestore().collection('stamps').add(stamp)
    }
  },
  watch: {
    'displayDate': function (value) {
      this.update(moment(value, 'YYYY-MM-DD'))
    }
  },
  data: function () {
    return {
      displayDate: null,
      studentMap: {},
      items: [],
      timestamp: {
        year: 2000,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0
      },
      options: {
        student: [],
        year: [],
        month: [],
        hour: [],
        minute: []
      },
      selected_student: null
    }
  }
}
</script>

<style scoped>
.timestampBtn {
  margin: 20px;
}
</style>