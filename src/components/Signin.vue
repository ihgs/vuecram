<template>
  <div class="signin">
    <h2>Sign in</h2>
    <b-container>
    <b-form>
      <b-form-group id="username" label="Username">
        <b-input type="text" v-model="username"></b-input>
      </b-form-group>
      <b-form-group id="password" label="Password">
        <b-input type="password" v-model="password" @keyup.enter.native="signIn"></b-input>
      </b-form-group>
      <b-button @click="signIn">Signin</b-button>
    </b-form>
    </b-container>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'Signin',
  data: function () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    signIn: function () {
      firebase.auth().signInWithEmailAndPassword(this.username, this.password).then(
        user => {
          this.$router.push('/')
        },
        err => {
          alert(err.message)
        }
      )
    }
  }
}
</script>
