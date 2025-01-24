<template>
<div class ="screen_content">
  <designer :keyMap="keyMap" :parentDesignerData='desigerData' :inputParams='params'></designer>
  <!-- <component :is="currentView"  keep-alive :keyMap="keyMap" :parentDesignerData='desigerData' :inputParams='params'></component> -->
</div>
</template>
<script>
import designer from 'views/graph/designer.vue'
import roleApi from 'api/security/role'
import MenuSerivce from 'api/security/menu'
export default {
  name: 'shower',
  components: {
    designer
  },
  data() {
    return {
      keyMap: { editable: 'false' },
      // currentView: designer,
      desigerData: {},
      params: {}
    }
  },
  created: function() {
    console.log('11')
    this.findBigScreenData()

    console.log('33')
  },
  methods: {
    findBigScreenData() {
      // var params = {name:'大屏展示', displayName:"BigScreen"};
      var params = { sence: 'bigscreen' }
      const self = this
      MenuSerivce.findBySence(params).then(response => {
        let data = response.data
        if (data != null) {
          // 拿到params 的json 数据
          var paramsData = self.decodeParams(data.params)
          if (paramsData != null && paramsData.grsNo != null) {
            self.desigerData = {
              grsNo: paramsData.grsNo
            }
            self.params = paramsData.params
          } else {
            // this.views = [];
          }
        } else {
          // this.views = [];
        }
      }).catch(err => {

      })
      // MenuSerivce.syncFindUniqueBy(params, function(data){
      //    console.log("2");
      //   if (data !=null){

      //       //拿到params 的json 数据
      //       var paramsData = self.decodeParams(data.params);
      //       if(paramsData!=null && paramsData.grsNo !=null){
      //         self.desigerData = {
      //           grsNo:paramsData.grsNo
      //         };
      //         self.params=paramsData.params ;
      //       }else{
      //         // this.views = [];
      //       }
      //   }else{
      //     // this.views = [];
      //   }
      // });
    },
    decodeParams(str) {
      return eval('(' + str + ')')
    }
  }
}
</script>

<style scoped>

.screen_content{
  position: absolute;
  width: 100%;
  height: 100%;
	margin: 0;
  /*-webkit-box-flex: 1;*/
  /*top: 10px;*/
  /*flex: 1;*/
  overflow:scroll;

}
</style>
