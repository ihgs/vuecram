<template>
  <div>
    <flash-message variant="success"></flash-message>
    <b-container>
      <b-row align-h="between">
        <b-col cols="5">
          <b-input v-model="filter"></b-input>
        </b-col>
        <b-col cols="2">
          <b-btn variant="primary" to="/students/new">New</b-btn>
        </b-col>
      </b-row>
      <b-table :items="items" :fields="fields" :filter="filter">
        <template slot="action" slot-scope="row">
          <b-btn-group>
            <b-btn @click.stop="row.toggleDetails">{{row.detailsShowing ? 'Hide' : 'Show'}} Detail</b-btn>
            <b-btn variant="warning" :to="'students/'+row.item.id+'/edit'">Edit</b-btn>
            <b-btn variant="danger" @click="deleteStudent(row.item.id)">Delete</b-btn>
          </b-btn-group>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <b-table :items='row.item._details' :fields='detailFields' stacked>
            </b-table>
          </b-card>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import moment from 'moment'

const now = moment()

export default {
  name: 'SchoolList',
  created: function () {
    firebase.database().ref('schools').once('value').then((schoolSp) => {
      firebase.database().ref('students').once('value').then((studentSp) => {
        this.schoolMap = schoolSp.val()
        const obj = studentSp.val()
        this.items = Object.keys(obj).map((key) => {
          obj[key].id = key
          return {
            id: key,
            fullname: this.fullname(obj[key]),
            age: this.age(obj[key]),
            school: this.school(obj[key]),
            _details: [
              {
                birthday: obj[key].base ? obj[key].base.birthday : '',
                cardId: obj[key].card ? obj[key].card.id : '',
                mail: obj[key].card ? obj[key].card.mail : ''
              }
            ]
          }
        })
      })
    })
  },
  data: function () {
    return {
      items: [],
      fields: ['fullname', 'age', 'school', 'action'],
      schoolMap: {},
      detailFields: ['birthday', 'cardId', 'mail'],
      filter: ''
    }
  },
  methods: {
    fullname: function (student) {
      if (student.base) {
        return student.base.familyName + ' ' + student.base.firstName
      }
      return ''
    },
    age: function (student) {
      if (student.base && student.base.birthday) {
        const birthday = moment(student.base.birthday, 'YYYY-MM-DD')
        return now.diff(birthday, 'years')
      }
      return ''
    },
    school: function (student) {
      if (student.school) {
        const school = this.schoolMap[student.school.id]
        if (school) {
          let res = school.base.name + school.base.kind
          if (student.school.graduated) {
            return res + ' 卒業'
          }
          if (student.school.enteranceYear) {
            res = res + ' ' + (now.years() - student.school.enteranceYear) + '年'
          }
          return res
        }
        return ''
      }
    },
    deleteStuedent: function (id) {
      firebase.database().ref('students').child(id).set(null)
    }
  }
}

</script>
