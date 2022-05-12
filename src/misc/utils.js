import Swal from 'sweetalert2'

const HOST_ADDRESS = 'https://secrets.luka.in.rs'
const AUTH_HEADER_NAME = 'Authorization'
const AUTH_HEADER_VALUE_PREFIX = 'Bearer: '

export function getScriptUrl(path) {
  return `${HOST_ADDRESS}/php/${path}`
}

export function getAuthorizationHeader(token) {
  let header = {}
  header[AUTH_HEADER_NAME] = AUTH_HEADER_VALUE_PREFIX + token
  return header
}

export function reportSuccess(message) {
  return Swal.fire({
    title: 'Success',
    text: message,
    icon: 'success',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    confirmButtonText: 'OK',
  })
}

export function reportError(message) {
  return Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-secondary',
    },
    confirmButtonText: 'Close'
  })
}

export function confirmAction(title, question) {
  return Swal.fire({
    showCancelButton: true,
    confirmButtonText: title,
    icon: 'question',
    title: title,
    text: question,
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-primary me-3',
      cancelButton: 'btn btn-secondary'
    },
  })
}

export function takeInput(title, question, isPassword) {
  let input = isPassword? 'password': 'text'
  return Swal.fire({
    input: input,
    inputLabel: question,
    inputPlaceholder: question,
    showCancelButton: true,
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-primary me-3',
      cancelButton: 'btn btn-secondary'
    },
    confirmButtonText: title,
    icon: 'info',
    title: title,
    inputValidator: (value) => {
      if (!value) {
        return 'Input field cannot be empty'
      }
    },
    inputAttributes: {
      autocapitalize: 'off',
      autocorrect: 'off'
    }
  })
}
