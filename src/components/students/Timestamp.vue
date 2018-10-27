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
      <b-table :items="items" :fields="fields"></b-table>
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
      return ''
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
    }
  }
}

</script>
