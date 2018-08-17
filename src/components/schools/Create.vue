<template>
  <div>
    Create school
    <b-alert variant="success" :show="showSuccess">Success</b-alert>
    <b-form>
      <b-card>
        <vue-form-generator :schema="schoolSchema" :model="school.base" :options="formOptions" @validated="onValidated"></vue-form-generator>
      </b-card>
      <b-btn @click="save" :disabled="invalid">Create</b-btn>
    </b-form>
  </div>
</template>

<script>
import schema from './schema'
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  name: 'SchoolCreate',
  data: function () {
    return {
      schoolSchema: schema.school,
      school: {
        base: {
        }
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true
      },
      invalid: true,
      showSuccess: false
    }
  },
  methods: {
    save: function () {
      firebase.database().ref('schools/').push(this.school)
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
