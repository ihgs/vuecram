<template>
  <div>
    <b-container>
      <b-row>
        <b-form-group inline>
          <b-form-input type="date" v-model="displayDate"></b-form-input>
        </b-form-group>
      </b-row>
      <b-row>
        <b-form-group>
          <input-tag :tags.sync="searchTags" :addTagOnKeys="[13]" placeholder="Filter by tag"></input-tag>
          <b-form-checkbox v-model="showAll">Show all</b-form-checkbox>
        </b-form-group>
      </b-row>
      <b-row>
        <time-table :items="filterdItems"></time-table>
      </b-row>
      <b-row>
        <b-btn v-b-modal.modal1 size="sm" class="timestampBtn">Timestamp</b-btn>
      </b-row>
    </b-container>
    <b-modal id="modal1" title="Timestamp manually" @shown="updateTime" @ok="handleOk">
        <v-select v-model="selected_student" label="text" :options="options.student">
        </v-select>
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
import vSelect from 'vue-select'
import InputTag from 'vue-input-tag'

const moment = require('moment')
moment.locale('ja')

export default {
  name: 'TimestampList',
  components: {
    TimeTable,
    vSelect,
    InputTag
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
            if (this.studentMap[stampObj.student_id] !== undefined) {
              this.studentMap[stampObj.student_id].timestamps.push(stampObj)
            }
          })
          this.items = Object.values(this.studentMap)
          this.filterByTagsAndConditions()
        })
    },
    isDisplay: function (student) {
      return this.showAll || !student.school.graduated
    },
    filterByTagsAndConditions: function () {
      if (this.searchTags.length > 0) {
        this.filterdItems = this.items.filter((studentTs) => {
          if (!this.isDisplay(studentTs.student)) {
            return false
          }
          let allinclude = true
          this.searchTags.forEach((tag) => {
            if (studentTs.student.tags === undefined || !studentTs.student.tags.includes(tag)) {
              allinclude = false
            }
          })
          return allinclude
        })
      } else {
        this.filterdItems = this.items.filter((studentTs) => {
          return this.isDisplay(studentTs.student)
        })
      }
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
      if (this.selected_student === null) {
        return false
      }
      const stamp = {
        'device_name': 'system',
        'timestamp': moment(this.timestamp).toDate(),
        'student_id': this.selected_student.value
      }
      firebase.firestore().collection('stamps').add(stamp)
    }
  },
  watch: {
    'displayDate': function (value) {
      const date = moment(value, 'YYYY-MM-DD')
      if (date.isValid()) {
        this.update(date)
      }
    },
    'searchTags': function () {
      this.filterByTagsAndConditions()
    },
    'showAll': function () {
      this.filterByTagsAndConditions()
    }
  },
  data: function () {
    return {
      displayDate: null,
      studentMap: {},
      items: [],
      filterdItems: [],
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
      selected_student: null,
      searchTags: [],
      showAll: false
    }
  }
}
</script>

<style scoped>
.timestampBtn {
  margin: 20px;
}
</style>
