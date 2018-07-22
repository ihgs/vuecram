<template>
  <div>
    Create Student
    <b-form>
      <b-card title="Name">
        <vue-form-generator :schema="nameSchema" :model="student.name" :formOptions="formOptions"></vue-form-generator>
      </b-card>
      <b-card>
        <vue-form-generator :schema="cardSchema" :model="student.card" :formOptions="formOptions"></vue-form-generator>
      </b-card>
      <b-card>
        <div v-for="(school, index) in student.schools"  v-bind:key="index">
          <vue-form-generator  :schema="schoolSchema" :model="school" :formOptions="formOptions"></vue-form-generator>
        </div>
      </b-card>
      <b-btn @click="save">Save</b-btn>
    </b-form>
  </div>
</template>
<script>
import schema from './schema'
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  name: 'StudentCreate',
  data: function () {
    return {
      nameSchema: schema.person,
      cardSchema: schema.card,
      schoolSchema: schema.school,
      student: {
        name: {
          familyName: '',
          firstName: '',
          familyNameKana: '',
          firstNameKana: ''
        },
        card: {
          mail: '',
          cardIds: []
        },
        birthday: '',
        schools: [
          {
            schoolId: '',
            enteranceYear: '',
            node: ''
          },
          {
            schoolId: 'a',
            enteranceYear: '',
            node: ''
          }
        ]
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true
      }
    }
  },
  methods: {
    save: function () {
      firebase.database().ref('students/').push(this.student)
      alert('sucess')
    }
  }
}
</script>

<style>

</style>
