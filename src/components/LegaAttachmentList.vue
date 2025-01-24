<template>
  <transition-group tag="ul" class="ivu-upload-list" name=“attachment-list”>
    <li v-for="(file, index) in files" :class="['ivu-upload-list-file', 'ivu-upload-list-file-' + file.status]" :key="index">
      <span :style="getMarginRightWidth(file)" @click="handleFileClick(file)">
        <i class="ivu-icon ivu-icon-document"></i>{{file.name}}
      </span>
      <span class="file-opt-btns">
        <i style="padding-left:10px;" v-for="(opt,index) in file.opts" v-if="file.opts!=undefined && (file.opts.length >0) " :key="index" :class="opt.icon" @click="handleOptAction(opt,file)"></i>
      </span>
    </li>
  </transition-group>
</template>

<script>
export default {
  props: {
    files: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data: function() {
    return {}
  },
  methods: {
    getMarginRightWidth(file) {
      let defaultWidth = 'margin-right:40px;'
      if (file.opts === undefined || file.opts === '[]') {
        return defaultWidth
      } else {
        let width = file.opts.length * 20 + 40
        defaultWidth = 'margin-right:' + width + 'px'
      }
      return defaultWidth
    },

    handleFileClick(file) {
      this.$emit('handleFileClick', file)
    },
    handleOptAction(opt, file) {
      this.$emit('handleOptAction', opt.actionName, file)
    }
  }
}
</script>

<style>
.ivu-upload-list-file .file-opt-btns {
  display: none;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  opacity: 0.75;
  color: #48576a;
  -ms-transform: scale(0.7);
  transform: scale(0.7);
}

.ivu-upload-list-file:hover .file-opt-btns {
  display: inline-block;
}
.ivu-upload-list-file .file-opt-btns {
  opacity: 1;
}

.file-opt-btns {
  line-height: initial;
  padding-left: 10px;
}
</style>
