import List from './List'
import Create from './Create'

const Student = {
  template: `
    <div class="student">
      <router-view></router-view>
    </div>
  `
}

export default {
  path: '/student',
  component: Student,
  children: [
    {
      path: '',
      name: 'List',
      component: List
    },
    {
      path: 'new',
      name: 'Create',
      component: Create
    }
  ]
}
