<template>
  <div>
    Edit school
    <b-alert variant="success" :show="showSuccess">Success</b-alert>
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
import 'firebase/database'

export default {
  name: 'EditSchool',
  created: function () {
    const id = this.$route.params.id
    firebase.database().ref('/schools/' + id).once('value').then((snapshot) => {
      this.school = snapshot.val()
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
      showSuccess: false,
      invalid: false
    }
  },
  methods: {
    update: function () {
      const updates = {}
      updates[ '/schools/' + this.$route.params.id ] = this.school
      firebase.database().ref().update(updates)
      this.school.base = {}
      this.showSuccess = true
    },
    onValidated (isValid, errors) {
      this.invalid = !isValid
    }
  }
}
</script>

<style>

</style>
