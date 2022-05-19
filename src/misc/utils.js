import Swal from 'sweetalert2'
import sjcl from 'sjcl'

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

export function randomString(length) {
  var result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%&*_-+=.,/:|';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export function encrypt(password, plainText) {
  return sjcl.encrypt(password, plainText)
}

export function decrypt(password, encryptedText) {
  return sjcl.decrypt(password, encryptedText)
}

export function formatIsoDate(date) {
  const monthNames = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
    '07': 'Jul', '08': 'Avg', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
  }
  if(date && date.length == 10 && date[4] == '-' && date[7] == '-') {
    const year = date.substring(0, 4)
    const month = date.substring(5, 7)
    const day = date.substring(8)
    return `${day}-${monthNames[month]}-${year}`
  }
  else {
    return ''
  }
}
