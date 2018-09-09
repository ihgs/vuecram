import List from './List'

const Timestamp = {
  template: `
    <div class="timestamp">
      <router-view></router-view>
    </div>
  `
}

export default {
  path: '/timestamps',
  component: Timestamp,
  children: [
    {
      path: '',
      name: 'TimestampList',
      component: List
    }
  ]
}
