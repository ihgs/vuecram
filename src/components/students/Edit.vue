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
      <b-card title="Tag">
        <input-tag :tags.sync="student.tags" :addTagOnKeys="[13]" placeholder="文字入力後EnterでTagとして認識されます"></input-tag>
      </b-card>
      <b-btn @click="update">Update</b-btn>
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
    firebase.firestore().collection('schools').get().then((schoolSp) => {
      schema.school.fields[0].values = []
      schoolSp.forEach((schoolDoc) => {
        const obj = schoolDoc.data()
        schema.school.fields[0].values.push(
          {
            id: schoolDoc.id,
            name: obj.base.name + obj.base.kind
          }
        )
      })
      this.schoolSchema = schema.school

      const id = this.$route.params.id
      firebase.firestore().collection('students').doc(id).get().then((snapshot) => {
        this.student = snapshot.data()
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
    update: function () {
      firebase.firestore().collection('students').doc(this.$route.params.id).update(this.student)
      this.student = {}
      this.flash({ message: 'Success', variant: 'success' })
      this.$router.push('/students')
    }
  }
}
</script>

<style>

</style>
