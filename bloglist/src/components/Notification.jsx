import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

// const Notification = ({ message }) =>
const Notification = () => {
  const message = useSelector((state) => state.notification)
  console.log('message', message)
  return (
    <>
      {message !== '' && (
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
      )}
    </>
  )
}

// Notification.propTypes = {
//   message: PropTypes.string.isRequired,
// }

export default Notification
