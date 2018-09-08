<template>
  <div>
    Edit school
    <b-form>
      <b-card>
        <vue-form-generator :schema="schoolSchema" :model="school.base" :options="formOptions" @validated="onValidated"></vue-form-generator>
      </b-card>
      <b-btn @click="update" :disabled="invalid">Create</b-btn>
    </b-form>
  </div>
</template>

<script>
import schema from './schema'
import firebase from 'firebase/app'

export default {
  name: 'EditSchool',
  created: function () {
    const id = this.$route.params.id
    firebase.firestore().collection('/schools/').doc(id).get().then((snapshot) => {
      this.school = snapshot.data()
    })
  },
  data: function () {
    return {
      schoolSchema: schema.school,
      school: {},
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true
      },
      invalid: false
    }
  },
  methods: {
    update: function () {
      firebase.firestore().collection('schools').doc(this.$route.params.id).update(this.school)
      this.school.base = {}
      this.flash({ message: 'Success', variant: 'success' })
      this.$router.push('/schools')
    },
    onValidated (isValid, errors) {
      this.invalid = !isValid
    }
  }
}
</script>

<style>

</style>
