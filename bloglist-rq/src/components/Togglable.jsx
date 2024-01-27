import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          type="button"
          onClick={toggleVisibility}
        >
          cancel
        </Button>
      </div>
      <div style={hideWhenVisible}>
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          type="button"
          onClick={toggleVisibility}
        >
          {props.buttonLabel}
        </Button>
      </div>
    </>
  )
})

Togglable.displayName = 'Togglable'
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Togglable
