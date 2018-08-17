<template>
  <div>
    <flash-message variant="success"></flash-message>
    <b-container>
      <b-row align-h="between">
        <b-col cols="5">
          <b-input v-model="filter"></b-input>
        </b-col>
        <b-col cols="2">
          <b-btn variant="primary" to="/schools/new">New</b-btn>
        </b-col>
      </b-row>
      <b-table :items="items" :fields='fields' :filter="filter">
        <template slot="schoolName" slot-scope="row">
          {{row.item.base.name}}{{row.item.base.kind}}
        </template>
        <template slot="action" slot-scope="row">
          <b-btn-group>
            <b-btn variant="warning" :to="'schools/'+row.item.id+'/edit'">Edit</b-btn>
            <b-btn variant="danger" @click="deleteSchool(row.item.id)">Delete</b-btn>
          </b-btn-group>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'

export default {
  name: 'SchoolList',
  mounted: function () {
    firebase.database().ref('schools').once('value').then((data) => {
      const obj = data.val()
      if (!obj) {
        return
      }
      this.items = Object.keys(obj).map(function (key) {
        obj[key].id = key
        return obj[key]
      })
    })
  },
  data: function () {
    return {
      items: [],
      fields: ['schoolName', 'action'],
      filter: ''
    }
  },
  methods: {
    deleteSchool: function (id) {
      firebase.database().ref('schools').child(id).set(null)
    }
  }
}

</script>
