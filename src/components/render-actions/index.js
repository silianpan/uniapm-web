import { OperationActions } from './operation-actions'
import { FormatActions } from './format-actions'
const RenderActions = { ...OperationActions, ...FormatActions }
export {
  RenderActions
}
