import PropTypes from 'prop-types'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

// const Notification = ({ message }) =>
const Notification = () => {
  const message = useContext(NotificationContext)[0]
  return (
    message !== '' && (
      <>
        <div
          style={{
            color: 'black',
            border: '5px solid black',
            fontSize: 30,
            background: 'grey',
          }}
        >
          {message}
        </div>
      </>
    )
  )
}

// Notification.propTypes = {
//   message: PropTypes.string.isRequired,
// }

export default Notification
