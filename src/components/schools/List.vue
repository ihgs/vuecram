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

export default {
  name: 'SchoolList',
  mounted: function () {
    this.reload()
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
      firebase.firestore().collection('schools').doc(id).delete()
      this.reload()
    },
    reload: function () {
      firebase.firestore().collection('schools').get().then((snapshot) => {
        this.items = []
        snapshot.forEach((doc) => {
          const obj = doc.data()
          obj.id = doc.id
          this.items.push(obj)
        })
      })
    }
  }
}

</script>
