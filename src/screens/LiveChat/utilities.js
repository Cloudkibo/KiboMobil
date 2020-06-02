export function isEmoji (str) {
  var ranges = [
    '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
    '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
    '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
  ]
  var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

  if (str.match(ranges.join('|')) || str.match(regex)) {
    return true
  } else {
    return false
  }
}

export function getmetaurl (text) {
  /* eslint-disable */
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  /* eslint-enable */
  var onlyUrl = ''
  if (text) {
    var testUrl = text.match(urlRegex)
    onlyUrl = testUrl && testUrl[0]
  }
  return onlyUrl
}

export function showDate (prev, next) {
  var p = new Date(prev)
  var n = new Date(next)

  if (n.getMinutes() - p.getMinutes() > 30 || n.getDay() !== p.getDay() || n.getMonth() !== p.getMonth() || n.getFullYear() !== p.getFullYear()) {
    return true
  }
  return false
}

export function formatAMPM (date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours !== 0 ? hours : 12
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ampm
  return strTime
}

export function displayDate (x) {
  var today = new Date()
  var n = new Date(x)
  var days = ['SUN', 'MON', 'TUES', 'WED', 'THU', 'FRI', 'SAT']
  var month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  var s = ''
  if (today.getFullYear() === n.getFullYear()) {
    if (today.getMonth() === n.getMonth()) {
      if (today.getDay() === n.getDay()) {
        s = formatAMPM(n)
      } else {
        s = days[n.getDay()] + ', ' + formatAMPM(n)
      }
    } else {
      s = month[n.getMonth()] + ' ' + n.getDate() + 'TH, ' + formatAMPM(n)
    }
  } else {
    s = (n.getMonth() + 1) + '/' + n.getDate() + '/' + n.getFullYear() + ' ' + formatAMPM(n)
  }

  return s
}

export function validURL (str) {
  /* eslint-disable */
  var pattern = new RegExp('^(https?://)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(:\\d+)?(/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(#[-a-z\\d_]*)?$','i'); // fragment locater
   /* eslint-enable */
  return pattern.test(str)
}
export function timeSince (date) {
  var newDate = new Date(date)
  var seconds = Math.floor((new Date() - newDate) / 1000)

  var interval = Math.floor(seconds / 31536000)

  if (interval > 1) {
    return interval + ' years ago'
  }
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) {
    return interval + ' months ago'
  }
  interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return interval + ' days ago'
  }
  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    return interval + ' hours ago'
  }
  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    return interval + ' minutes ago'
  }
  return Math.floor(seconds) + ' seconds ago'
}
