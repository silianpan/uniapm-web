/** 操作按钮属性 配置 */
const ActionsProps = {
  /** 修改 */
  modify: {
    tip: {
      placement: 'top',
      content: '修改'
    },
    btnIcon: {
      customIcon: 'iconfont icon-edit',
      iconSize: 12
    },
    size: 'small',
    type: 'primary',
    handleName: 'modify'
  },

  select: {
    tip: {
      placement: 'top',
      content: '选择'
    },
    btnIcon: {
      icon: 'md-locate',
      iconSize: 14
    },
    size: 'small',
    type: 'primary',
    handleName: 'select'
  },

  /** 删除 */
  delete: {
    tip: {
      placement: 'top',
      content: '删除'
    },
    type: 'error',
    size: 'small',
    btnIcon: {
      icon: 'md-trash'
    },
    handleName: 'delete'
  },

  /** 查看档案 */
  view: {
    tip: {
      placement: 'top',
      content: '查看'
    },
    size: 'small',
    // type: 'primary',
    btnIcon: {
      icon: 'md-eye'
    },
    handleName: 'view'
  },
  // resident actons
  /** 查看健康体检 */
  viewHealthCheckup: {
    tip: {
      placement: 'top',
      content: '健康体检'
    },
    size: 'small',
    // type: 'primary',
    btnIcon: {
      icon: 'md-eye'
    },
    handleName: 'viewHealthCheckup'
  },
  // family actions
  changeTheHeadOfHousehold: {
    tip: {
      placement: 'top',
      content: '更改户主'
    },
    size: 'small',
    // type: 'primary',
    handleName: 'changeTheHeadOfHousehold'
  },
  // 移除家庭关系
  removeFamilyRelationships: {
    tip: {
      type: 'poptip',
      title: '是否解除此家庭关系'
    },
    size: 'small',
    btnIcon: {
      customIcon: ' iconfont icon-jiechubangding',
      iconSize: 14
    },
    handleName: 'removeFamilyRelationships'
  },
  // 更改家庭关系
  modifyFamilyRelationships: {
    tip: {
      placement: 'top',
      content: '更改家庭关系'
    },
    btnIcon: {
      customIcon: 'iconfont icon-edit',
      iconSize: 12
    },
    size: 'small',
    type: 'primary',
    handleName: 'modifyFamilyRelationships'
  },
  changeFamilymembers: {
    tip: {
      placement: 'top',
      content: '家庭成员关系变更'
    },
    btnIcon: {
      customIcon: 'iconfont icon-renshu',
      iconSize: 12
    },
    size: 'small',
    // type: 'primary',
    handleName: 'changeFamilymembers'
  },
  // account 账户
  familyAssetView: {
    tip: {
      placement: 'top',
      content: '家庭资产'
    },
    btnIcon: {
      customIcon: 'iconfont icon-zichan',
      iconSize: 12
    },
    size: 'small',
    // type: 'primary',
    handleName: 'familyAssetView'
  },
  // 家庭账户充值
  familyDeposit: {
    tip: {
      placement: 'top',
      content: '家庭账户充值'
    },
    btnIcon: {
      customIcon: 'iconfont icon-chongzhi',
      iconSize: 12
    },
    size: 'small',
    // type: 'primary',
    handleName: 'familyDeposit'
  },
  // 查看家庭消费记录
  detailConsumingRecordsAction: {
    tip: {
      placement: 'top',
      content: '查看家庭消费记录'
    },
    btnIcon: {
      customIcon: 'iconfont icon-xiaofeijilu',
      iconSize: 12
    },
    size: 'small',
    // type: 'primary',
    handleName: 'detailConsumingRecordsAction'
  },
  // 查看家庭充值记录
  detailDepositRecordsAction: {
    tip: {
      placement: 'top',
      content: '家庭充值记录'
    },
    btnIcon: {
      customIcon: 'iconfont icon-chongzhijilu1',
      iconSize: 12
    },
    size: 'small',
    // type: 'primary',
    handleName: 'detailDepositRecordsAction'
  },
  // 清算
  clearAccount: {
    tip: {
      placement: 'top',
      content: '清算'
    },
    btnIcon: {
      customIcon: 'iconfont icon-qingsuandan',
      iconSize: 12
    },
    size: 'small',
    type: 'primary',
    handleName: 'clearAccount'
  },

  /** 模块管理 */
  moduleElementManage: {
    tip: {
      placement: 'top',
      content: '模块元素管理'
    },
    btnIcon: {
      customIcon: 'iconfont icon-mokuai',
      iconSize: 12
    },
    size: 'small',
    type: 'info',
    handleName: 'moduleElementManage'
  },
  // sys
  resetPassword: {
    tip: {
      type: 'poptip',
      title: '是否重置密码'
    },
    size: 'small',
    btnIcon: {
      customIcon: ' iconfont icon-zhongzhi',
      iconSize: 14
    },
    handleName: 'resetPassword'
  },

  signAuthority: {
    tip: {
      placement: 'top',
      content: '分配模块'
    },
    btnIcon: {
      customIcon: 'iconfont icon-jiaosequanxian',
      iconSize: 12
    },
    size: 'small',
    handleName: 'signAuthority'
  },

  signUser: {
    tip: {
      placement: 'top',
      content: '分配用户'
    },
    btnIcon: {
      customIcon: 'iconfont icon-tubiaozhizuomoban-',
      iconSize: 12
    },
    size: 'small',
    handleName: 'signUser'
  }
}
export default ActionsProps
