import { PropTypes } from 'react'

export default PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
})
