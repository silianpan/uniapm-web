<!--  -->
<template>
    <div>
       <Input search  @on-search="handleSearchAction" enter-button placeholder="swagger" />
    </div>
</template>

<script>
import api from '@/libs/api'
export default {
  props: { },
  components: {},
  data () {
    return {
    }
  },
  methods: {
    handleSearchAction: function(value) {
      console.log(value)
      const prefix = '/admin'
      api.get('/swagger/admin/v2/api-docs').then(resp => {
        const d = resp
        let { paths, tags } = d
        let rebuildData = {
        }
        tags.map(t => {
          rebuildData[t.name] =
          {
            module: {
              code: t.description.replace(/\s/g, ''),
              name: t.name,
              type: 'api',
              pid: '209c7640456d48cfad6e6095c54cbb91',
              pids: '-1,209c7640456d48cfad6e6095c54cbb91',
              desc: t.description
            }
          }
          return t
        })

        Object.keys(paths).map(field => {
          let vl = paths[field]
          Object.keys(vl).map(method => {
            let { tags, summary, description } = vl[method]
            tags.map(t => {
              if (!rebuildData[t].elements) {
                rebuildData[t].elements = []
              }
              rebuildData[t].elements.push({
                uri: `${prefix}${field}`,
                type: 'uri',
                name: summary,
                code: `uri${(prefix + field).split('/').join(':')}`,
                method: method.toUpperCase(),
                desc: description
              })
            })
            return method
          })
        })

        console.log(rebuildData)
        console.log(d)
        this.import(rebuildData)
      })
    },
    async import(rebuildData) {
      // for (let key in rebuildData) {
      //   await api.post('/api-uniapm/admin/module/import/api', rebuildData[key])
      // }
    }
  },

  mounted: function() {
  },
  computed: {}
}

</script>
<style  scoped>
</style>
