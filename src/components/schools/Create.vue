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
      firebase.firestore().collection('schools').add(this.school)
        .then((docRef) => {
          this.flash({ message: 'Success', variant: 'success' })
        }).catch((error) => {
          this.flash({ message: error, variant: 'error' })
        })
      this.school.base = {}
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
