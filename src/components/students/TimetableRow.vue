<template>
  <div class="tt_row">
    <div class="tt_cell" style="width: 100px;" >{{title}}</div>
    <div class="tt_cell">
      <div class="tt_row_student">
        <div class="tt_stamp_row tt_cell" :style="pos_stamp_row()">
          <div class="tt_row_hour" v-for="(h, index) in hours" :key="index" :style="pos_hour_block(index)">
            {{h}}
          </div>
          <div>
            <div>
              <div class="timetable_event_bar"  :style="pos_bar(daydata.bar)"></div>
            </div>
            <div>
              <div class="timetable_event_point" v-for="(point, i) in daydata.eventPoints" :key="i" v-b-tooltip.hover :title="point.title" :style="pos_event(point)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeTableRow',
  props: {
    title: String,
    daydata: Object,
    start_hour: {
      type: Number,
      default: 8
    },
    end_hour: {
      type: Number,
      default: 22
    },
    cell_height: {
      type: Number,
      default: 35
    },
    hour_width: Number,
    hours: Array
  },
  methods: {
    pos_stamp_row: function () {
      return {
        position: 'relative',
        height: this.cell_height + 'px'
      }
    },
    pos_hour_block: function (index) {
      return {
        width: this.hour_width + 'px',
        height: this.cell_height + 'px',
        left: index * this.hour_width + 'px'
      }
    },
    pos_bar: function (bar) {
      if (bar) {
        return {
          width: bar.width + 'px',
          height: '10px',
          left: bar.left + 'px',
          top: '20px'
        }
      }
    },
    pos_event: function (point) {
      if (point) {
        return {
          left: point.style + 'px',
          top: '7px'
        }
      }
    },
    // not used now
    pos_stay_time: function () {
      return {
        left: '538.462px', // TODO
        height: this.cell_height + 'px'
      }
    }
  },
  data: function () {
    return {
    }
  }
}
</script>

<style scoped>
.tt_row_hour{
  color: #BDBDBD;
  border-left: 1px solid #BDBDBD;
  border-bottom: 1px solid #BDBDBD;
  position: absolute;
}

.timetable_event_point{
  width: 10px;
  height: 10px;
  transform: rotate(-45deg);
  background-color: #000080;
  position: absolute;
}

.timetable_event_bar{
  position: absolute;
  background-color: #87CEEB;
  border-radius: 5px;
  opacity: 0.5;
}

.tt_cell{
  display: table-cell;
}
</style>
