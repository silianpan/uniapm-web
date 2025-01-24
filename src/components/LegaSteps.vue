<template>
  <div>
    <Steps :current="stepData.current" :status="stepData.status" :size="stepData.size" :direction="stepData.direction">
      <Step v-for="(item, index) in stepData.contents" :key="index" :title="item.title" :content="item.content" :status="item.status" :icon="item.icon"></Step>
    </Steps>
    <slot name="content"></slot>
    <slot name="footer"></slot>
    <!-- <div style="text-align:center; margin-top: 20px">
      <Button :disabled="stepData.isNextBtnDisabled==true?true:false" :style="stepData.isNextBtnHidden==true?'display:none':''" type="primary" @click="next" style="margin-bottom: 10px">下一步</Button>
      <Button @click="cancle" style="margin-bottom: 10px">取消</Button>
    </div> -->
  </div>
</template>
<script>
export default {
  props: {
    stepData: {
      type: Object,
      default: {}
    }
  }
  // stepData() {
  //   return {
  //     current: this.stepData.current
  //   }
  // },
  // methods: {
  //   next() {
  //     if (this.current === this.stepData.contents.length) {
  //       this.current = 0
  //     } else {
  //       this.current += 1
  //     }
  //     this.$emit(
  //       'currentStepClick',
  //       this.current,
  //       this.stepData.contents[this.current]
  //     )
  //   },
  //   cancle() {
  //     this.$emit('cancleLegaSteps')
  //   }
  // }
}
</script>
