import Swal from 'sweetalert2'

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