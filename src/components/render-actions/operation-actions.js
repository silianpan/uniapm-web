const OperationActions = {
  /** 如果 actions 中没有定义的action 而定义了actionsProps 调用 此方法生成 按钮 */
  getActionsByProps: function(h, params, column, vm, props) {
    let tip = props.tip || {}
    let btnIcon = props.btnIcon || {}
    let iconRender = []
    if (!vm._.isNil(btnIcon.customIcon)) {
      iconRender.push(
        h('Icon', {
          props: {
            custom: btnIcon.customIcon,
            size: btnIcon.iconSize || 12
          }
        })
      )
    } else if (!vm._.isNil(btnIcon.icon)) {
      iconRender.push(
        h('Icon', {
          props: {
            type: btnIcon.icon,
            size: btnIcon.iconSize || 12
          }
        })
      )
    }
    if (tip.type === 'poptip') {
      return h(
        'Poptip',
        {
          props: {
            confirm: true,
            title: tip.title,
            okText: tip.okText || '确定'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            'on-ok': () => {
              vm.getActionHandle(props.handleName)(params, column)
            }
          }
        },
        [
          h(
            'Button',
            {
              props: {
                size: props.size || 'small',
                type: props.type || 'primary'
              },
              style: {
                marginRight: '5px'
              }
            },
            iconRender
          )
        ]
      )
    }
    return h(
      'Tooltip',
      {
        props: {
          placement: tip.placement,
          content: tip.content || props.handleName
        }
      },
      [
        h(
          'Button',
          {
            props: {
              size: props.size || 'small',
              type: props.type || 'primary'
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click: () => {
                vm.getActionHandle(props.handleName)(params, column)
              }
            }
          },
          iconRender
        )
      ]
    )
  },
  /** 下拉 */
  dropDown: function(h, params, column, vm, dropDownOptions = {}) {
    let btnRenders = []
    if (vm._.isNil(dropDownOptions.customIcon)) {
      btnRenders.push(
        h('Icon', {
          props: {
            custom: dropDownOptions.customIcon,
            size: dropDownOptions.iconSize || 12
          }
        })
      )
    }
    btnRenders.push(h('span', dropDownOptions.name))
    btnRenders.push(
      h('Icon', {
        props: {
          type: 'ios-arrow-down'
        }
      })
    )

    let _dropDownItems = dropDownOptions.dropdownItems || []
    let drowDownItemsRenders = _dropDownItems.map(item => {
      let iconRender
      if (!vm._.isNil(item.customIcon)) {
        iconRender = h('Icon', {
          props: {
            custom: item.customIcon,
            size: item.iconSize || 16
          }
        })
      } else if (!vm._.isNil(item.icon)) {
        iconRender = h('Icon', {
          props: {
            type: item.icon,
            size: item.iconSize || 16
          }
        })
      }
      if (iconRender !== null) {
        return h(
          'DropdownItem',
          {
            props: {
              name: item.handleName
            }
          },
          [iconRender, h('span', item.name)]
        )
      }
      return h(
        'DropdownItem',
        {
          props: {
            name: item.handleName
          }
        },
        h('span', item.name)
      )
    })

    return h(
      'Dropdown',
      {
        props: {
          placement: 'bottom-end'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-click': handleName => {
            vm.getActionHandle(handleName)(params, column)
          }
        }
      },
      [
        h(
          'i-button',
          {
            props: {
              type: dropDownOptions.type,
              size: dropDownOptions.btnSize || 'small'
            }
          },
          btnRenders
        ),
        h(
          'DropdownMenu',
          {
            props: {},
            slot: 'list'
          },
          drowDownItemsRenders
        )
      ]
    )
  },
  switchStatus: function(h, params, column, vm) {
    const row = params.row
    return h(
      'i-Switch',
      {
        props: {
          size: 'large',
          value: row[column.key] === (column.switchOnValue || 0)
        },
        on: {
          'on-change': function(val) {
            if (vm._.isFunction(column.onChange)) {
              column.onChange(val, params)
            }
          }
        }
      },
      [
        h(
          'span',
          {
            slot: 'open'
          },
          column.switchOnLabel
        ),
        h(
          'span',
          {
            slot: 'close'
          },
          column.switchOffLabel
        )
      ]
    )
  },
  /** 删除按钮 */
  delete: function(h, params, column, vm) {
    return h(
      'Poptip',
      {
        props: {
          confirm: true,
          title: '确定删除改条数据么',
          okText: '确定'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.getActionHandle('delete')(params, column)
          }
        }
      },
      [
        h('Button', {
          props: {
            type: 'error',
            size: 'small',
            icon: 'md-trash'
          }
        })
      ]
    )
  }
}
export { OperationActions }
