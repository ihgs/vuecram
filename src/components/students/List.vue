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
            <b-dropdown @click.stop="row.toggleDetails" right split :text="detailText(row.detailsShowing)">
              <b-dropdown-item :to="'students/'+row.item.id+'/timestamp'">Timestamp</b-dropdown-item>
              <b-dropdown-item :to="'students/'+row.item.id+'/edit'">Edit</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item @click="deleteStudent(row.item.id)">Delete</b-dropdown-item>
            </b-dropdown>
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
import moment from 'moment'

const now = moment()

export default {
  name: 'SchoolList',
  created: function () {
    this.reload()
  },
  data: function () {
    return {
      items: [],
      fields: ['fullname', 'age', 'school', 'tags', 'action'],
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
      if (student.school && student.school.id) {
        const school = this.schoolMap[student.school.id]
        if (school) {
          let res = school.base.name + school.base.kind
          if (student.school.graduated) {
            return res + ' 卒業'
          }
          if (student.school.enteranceYear) {
            let hosei = 0
            if (now.month() + 1 >= 4) {
              hosei = 1
            }
            res = res + ' ' + (now.year() - student.school.enteranceYear + hosei) + '年'
          }
          return res
        }
        return ''
      }
    },
    deleteStudent: function (id) {
      if (confirm('削除しますか？')) {
        firebase.firestore().collection('students').doc(id).delete()
        this.reload()
      }
    },
    detailText: function (showing) {
      return (showing ? 'Hide' : 'Show') + 'Detail'
    },
    reload: function () {
      firebase.firestore().collection('schools').get().then((schoolSp) => {
        this.schoolMap = {}
        schoolSp.forEach((schoolDoc) => {
          this.schoolMap[schoolDoc.id] = schoolDoc.data()
        })
        firebase.firestore().collection('students').get().then((studentSp) => {
          this.items = []
          studentSp.forEach((studentDoc) => {
            const studentObj = studentDoc.data()
            this.items.push({
              id: studentDoc.id,
              fullname: this.fullname(studentObj),
              age: this.age(studentObj),
              school: this.school(studentObj),
              tags: studentObj.tags,
              _details: [
                {
                  birthday: studentObj.base ? studentObj.base.birthday : '',
                  cardId: studentObj.card ? studentObj.card.cardId : '',
                  mail: studentObj.card ? studentObj.card.mail : ''
                }
              ]
            })
          })
        })
      })
    }
  }
}

</script>
