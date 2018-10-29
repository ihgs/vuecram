<template>
  <b-container>
    <b-row>
      {{fullname}}
    </b-row>
    <b-row>
      <b-form-group inline>
        <b-input type="month" v-model="targetMonth"></b-input>
      </b-form-group>
    </b-row>
    <b-row>
      <time-table :year="year" :month="month" :timestamps="items"></time-table>
    </b-row>
    <b-row>
      <b-button v-on:click="exportToCsv()" size="sm">Download CSV</b-button>
    </b-row>
    <b-row>
      <b-table :items="items" :fields="fields">
      </b-table>
    </b-row>
  </b-container>
</template>

<script>
import firebase from 'firebase/app'
import TimeTable from './TimeTable'

const moment = require('moment')
moment.locale('ja')

export default {
  name: 'Timestamp',
  components: {
    TimeTable
  },
  mounted: function () {
    this.id = this.$route.params.id
    firebase.firestore().collection('students').doc(this.id).get().then((snapshot) => {
      this.student = snapshot.data()
    })
    const today = moment()
    this.targetMonth = today.format('YYYY-MM')
    this.update(today)
  },
  watch: {
    targetMonth: function (value) {
      const month = moment(value, 'YYYY-MM')
      this.update(month)
    }
  },
  computed: {
    fullname: function () {
      if (this.student && this.student.base) {
        return this.student.base.familyName + ' ' + this.student.base.firstName
      }
      return '_'
    }
  },
  data: function () {
    return {
      id: null,
      student: null,
      items: [],
      year: 2018,
      month: 1,
      filter: '',
      fields: ['time'],
      targetMonth: ''
    }
  },
  methods: {
    update: function (date) {
      this.year = date.year()
      this.month = date.month() + 1
      this.items = []
      firebase.firestore().collection('stamps')
        .where('timestamp', '>=', date.startOf('month').toDate())
        .where('timestamp', '<=', date.endOf('month').toDate())
        .where('student_id', '==', this.id)
        .get().then((stampSp) => {
          this.items = []
          stampSp.forEach((stamp) => {
            const obj = stamp.data()
            obj.time = moment(obj.timestamp.toDate()).format('lll')
            this.items.push(obj)
          })
        })
    },
    exportToCsv: function () {
      let csvFile = ''
      this.items.forEach((item) => {
        csvFile += item.time + '\n'
      })
      const filename = this.fullname + '.csv'
      const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' })
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename)
      } else {
        const link = document.createElement('a')
        if (link.download !== undefined) {
          var url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', filename)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    }
  }
}

</script>
