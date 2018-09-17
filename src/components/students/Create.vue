<template>
  <div>
    Create Student
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
      <b-card title="Tag">
        <input-tag :tags.sync="student.tags" :addTagOnKeys="[13]" placeholder="文字入力後EnterでTagとして認識されます"></input-tag>
      </b-card>
      <b-btn @click="save">Save</b-btn>
    </b-form>
  </div>
</template>
<script>
import schema from './schema'
import firebase from 'firebase/app'
import InputTag from 'vue-input-tag'

export default {
  name: 'StudentCreate',
  components: {
    'input-tag': InputTag
  },
  created: function () {
    firebase.firestore().collection('schools').get().then((snapshot) => {
      schema.school.fields[0].values = []
      snapshot.forEach((doc) => {
        const obj = doc.data()
        obj.id = doc.id
        obj.name = obj.base.name + obj.base.kind
        schema.school.fields[0].values.push(obj)
      })
      this.schoolSchema = schema.school
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
          cardId: ''
        },
        school:
        {
          schoolId: null,
          enteranceYear: '',
          note: ''
        },
        tags: []
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true
      }
    }
  },
  methods: {
    save: function () {
      firebase.firestore().collection('students').add(this.student)
        .then((docRef) => {
          this.flash({ message: 'Success', variant: 'success' })
        }).catch((error) => {
          this.flash({ message: error, variant: 'error' })
        })
      this.student = {}
      this.$router.push('/students')
    }
  }
}
</script>

<style>

</style>
