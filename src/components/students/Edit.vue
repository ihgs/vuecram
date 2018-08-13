<template>
  <div>
    Edit Student
    <b-form>
      <b-card title="Base">
        <vue-form-generator :schema="nameSchema" :model="student.base" :options="formOptions"></vue-form-generator>
      </b-card>
      <b-card>
        <vue-form-generator :schema="cardSchema" :model="student.card" :options="formOptions"></vue-form-generator>
      </b-card>
      <b-card>
        <vue-form-generator :schema="schoolSchema" :model="student.school" :options="formOptions"></vue-form-generator>
      </b-card>
      <b-btn @click="update">Update</b-btn>
    </b-form>
  </div>
</template>
<script>
import schema from './schema'
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  name: 'StudentCreate',
  created: function () {
    firebase.database().ref('schools').once('value').then((data) => {
      const obj = data.val()
      schema.school.fields[0].values = Object.keys(obj).map(function (key) {
        return {
          id: key,
          name: obj[key].base.name + obj[key].base.kind
        }
      })
      this.schoolSchema = schema.school

      const id = this.$route.params.id
      firebase.database().ref('/students/' + id).once('value').then((snapshot) => {
        this.student = snapshot.val()
      })
    })
  },
  data: function () {
    return {
      nameSchema: schema.base,
      cardSchema: schema.card,
      schoolSchema: {},
      schools: [],
      student: {
        base: {
          familyName: '',
          firstName: '',
          familyNameKana: '',
          firstNameKana: '',
          birthday: ''
        },
        card: {
          mail: '',
          cardIds: ['']
        },
        school:
        {
          schoolId: null,
          enteranceYear: '',
          note: ''
        }
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true
      }
    }
  },
  methods: {
    update: function () {
      const updates = {}
      updates[ '/students/' + this.$route.params.id ] = this.student
      firebase.database().ref().update(updates)
    }
  }
}
</script>

<style>

</style>
