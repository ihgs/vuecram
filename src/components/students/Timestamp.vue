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
import 'firebase/database'
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
    firebase.database().ref('/students/' + this.id).once('value').then((snapshot) => {
      this.student = snapshot.val()
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
    update: function (month) {
      this.year = month.year()
      this.month = month.month() + 1
      this.items = []
      firebase.database().ref('stamps').child(month.format('YYYY')).child(month.format('MM')).child(this.id).once('value').then((data) => {
        const obj = data.val()
        if (!obj) {
          return
        }
        this.items = Object.keys(obj).map(function (key) {
          obj[key].time = moment(obj[key].timestamp).format('lll')
          return obj[key]
        })
      })
    }
  }
}

</script>
