<!-- 用户管理 -->
<template>
  <div>
    <LegaTable :options="tableDatas" @refreshActionHandle="pageQuery" @keywordSearchHandle="keywordSearchHandle" @handleFormSearch="handleFormSearch" @handleCreate="handleCreate" @handlerClient="handlerClient">
    </LegaTable>
    <Modal :title="textMap[dialogStatus]" width="600px" v-model="dialogFormVisible" @on-ok="okClick" @on-cancel="cancelClick">
      <LegaForm ref="serviceForm" :labelWidth="formContent.labelWidth" :formItemData="formContent.formItemData" :formData="formContent.formData" :formRules="formContent.formRules"></LegaForm>
    </Modal>
    <Modal title="授权服务" width="600px" v-model="dialogClientVisible">
      <Client :serviceId="currentId" @closeClientDialog="closeClientDialog" ref="serviceClient"></Client>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LegaTable from '@/components/LegaTable'
import LegaForm from '@/components/LegaForm'
import { AuthClientService } from '@/api/auth'
import Client from './Client'
export default {
  components: {
    LegaTable,
    LegaForm,
    Client
  },
  data() {
    return {
      currentId: -1,
      listQuery: {
        current: 1,
        size: 20
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogFormVisible: false,
      dialogClientVisible: false,
      dialogStatus: '',
      serviceManager_btn_edit: false,
      serviceManager_btn_del: false,
      serviceManager_btn_add: false,
      formContent: {
        labelWidth: 80,
        formItemData: [
          [
            {
              type: 'input',
              label: '服务编码',
              prop: 'code',
              tip: '请输入服务编码'
            }
          ],
          [
            {
              type: 'input',
              label: '服务密钥',
              prop: 'secret',
              tip: '请输入服务密钥'
            }
          ],
          [
            {
              type: 'input',
              label: '服务名',
              prop: 'name',
              tip: '请输入服务名'
            }
          ],
          [
            {
              type: 'textArea',
              label: '描述',
              prop: 'description',
              tip: '请输入内容'
            }
          ]
        ],
        formData: {},
        formRules: {
          code: [
            {
              required: true,
              message: '请输入服务编码',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          secret: [
            {
              required: true,
              message: '请输入服务密钥',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: '请输入服务名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          description: [
            {
              required: true,
              message: '请输入描述',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ]
        }
      },
      tableDatas: {
        hasKeywordSearch: true,
        hasAdvancedSearch: true,
        data: [],
        columns: [
          {
            key: 'id',
            title: '序号'
          },
          {
            key: 'code',
            title: '服务编码'
          },
          {
            key: 'secret',
            title: '服务密钥'
          },
          {
            key: 'name',
            title: '服务名'
          },
          {
            key: 'description',
            title: '备注'
          },
          {
            key: 'crtTime',
            title: '创建时间'
          },
          {
            key: 'crtUser',
            title: '创建人'
          },
          {
            key: 'crtName',
            title: '创建人姓名'
          },
          {
            key: 'crtHost',
            title: '创建主机'
          },
          {
            key: 'updTime',
            title: '更新时间'
          },
          {
            key: 'updUser',
            title: '更新人'
          },
          {
            key: 'updName',
            title: '更新姓名'
          },
          {
            key: 'updHost',
            title: '更新主机'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              let opers = []
              if (this.serviceManager_btn_edit) {
                opers.push(
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.handleUpdate(params.row)
                        }
                      }
                    },
                    '编辑'
                  )
                )
              }
              if (this.serviceManager_btn_del) {
                opers.push(
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.handleDelete(params.row)
                        }
                      }
                    },
                    '删除'
                  )
                )
              }
              return h('div', opers)
            }
          }
        ],
        buttons: []
      }
    }
  },
  computed: {
    ...mapGetters(['elements'])
  },
  mounted() {
    this.pageQuery()
    this.serviceManager_btn_edit = this.elements['serviceManager:btn_edit']
    this.serviceManager_btn_del = this.elements['serviceManager:btn_del']
    this.serviceManager_btn_add = this.elements['serviceManager:btn_add']
    this.serviceManager_btn_clientManager = this.elements['serviceManager:btn_clientManager']
    if (this.serviceManager_btn_add) {
      this.tableDatas.buttons.push({
        type: 'primary',
        name: '添加',
        size: 'small',
        clickName: 'handleCreate'
      })
    }

    if (this.serviceManager_btn_clientManager) {
      this.tableDatas.buttons.push({
        type: 'primary',
        name: '授权服务',
        size: 'small',
        clickName: 'handlerClient'
      })
    }
  },
  methods: {
    pageQuery(params = {}, pageIndex = 1, pageSize = 10) {
      this.listQuery.current = pageIndex
      this.listQuery.size = pageSize
      this.getList()
    },
    getList() {
      console.log('fdsfdfdsfd', this.listQuery)
      AuthClientService.page(this.listQuery).then(response => {
        console.log('fdsfd', response)
        this.tableDatas.data = response.data.records
        this.tableDatas.total = response.data.total
      })
    },
    keywordSearchHandle(keyword) {
      this.listQuery.conditions[0].value = keyword
      this.getList()
    },
    handleFormSearch(searchFormData) {},
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      AuthClientService.findById(row.id).then(response => {
        this.formContent.formData = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleDelete(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '此操作将永久删除, 是否继续?',
        onOk: () => {
          AuthClientService.delete(row.id).then(() => {
            this.$Message.success('删除成功！')
            const index = this.tableDatas.data.indexOf(row)
            this.tableDatas.data.splice(index, 1)
          })
        },
        onCancel: () => {}
      })
    },
    handlerClient() {
      this.dialogClientVisible = true
      if (this.$refs.serviceClient !== undefined) {
        this.$refs.serviceClient.serviceId = this.currentId
        this.$refs.serviceClient.initClients()
      }
    },
    closeClientDialog() {
      this.dialogClientVisible = false
    },
    okClick() {
      switch (this.dialogStatus) {
        case 'create':
          this.$refs.serviceForm.$refs.formData.validate(valid => {
            if (valid) {
              AuthClientService.save(this.formContent.formData).then(() => {
                this.dialogFormVisible = false
                this.pageQuery()
                this.$Message.success('创建成功')
              })
            } else {
              this.$Message.warning('请填写完整表单')
              return false
            }
          })
          break
        case 'update':
          this.$refs.serviceForm.$refs.formData.validate(valid => {
            if (valid) {
              this.formContent.formData.password = undefined
              AuthClientService.save(
                this.formContent.formData.id,
                this.formContent.formData
              ).then(() => {
                this.dialogFormVisible = false
                this.pageQuery()
                this.$Message.success('更新成功')
              })
            } else {
              this.$Message.warning('请填写完整表单')
              return false
            }
          })
          break
      }
    },
    cancelClick() {
      this.dialogFormVisible = false
      this.$refs.serviceForm.$refs.formData.resetFields()
    }
  }
}
</script>
