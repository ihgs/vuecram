import List from './List'
import Create from './Create'
import Edit from './Edit'
import Timestamp from './Timestamp'

const Student = {
  template: `
    <div class="student">
      <router-view></router-view>
    </div>
  `
}

export default {
  path: '/students',
  component: Student,
  children: [
    {
      path: '',
      name: 'StudentList',
      component: List
    },
    {
      path: 'new',
      name: 'StudnetCreate',
      component: Create
    },
    {
      path: ':id/edit',
      name: 'StudentEdit',
      component: Edit
    },
    {
      path: ':id/timestamp',
      name: 'Timestamp',
      component: Timestamp
    }
  ]
}
