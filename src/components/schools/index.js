import List from './List'
import Create from './Create'
import Edit from './Edit'

const School = {
  template: `
    <div class="school">
      <router-view></router-view>
    </div>
  `
}

export default {
  path: '/school',
  component: School,
  children: [
    {
      path: '',
      name: 'SchoolList',
      component: List
    },
    {
      path: 'new',
      name: 'SchoolCreate',
      component: Create
    },
    {
      path: ':id/edit',
      name: 'SchoolEdit',
      component: Edit
    }
  ]
}
