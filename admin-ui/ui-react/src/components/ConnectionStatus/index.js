/**
 * @Author: MocYang
 * @Email: 958292256@qq.com
 * @Date: 2021/8/3 9:18
 * @File: index.js
 * @Description
 */
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'

ConnectionStatus.propTypes = {
  size: PropTypes.string,
  active: PropTypes.bool
}

export default function ConnectionStatus(props) {
  const { size = 'medium', active } = props
  const color = active ? '' : 'secondary'
  const text = active ? 'connecting' : 'disconnect'

  return (
    <Button
      size={size}
      color={color}
      variant="outlined"
      disabled
    >{text}</Button>
  )
}
