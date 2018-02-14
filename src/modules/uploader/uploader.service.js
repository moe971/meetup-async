// @flow
import axios from 'axios'

/**               **/
/** CONFIGURATION **/
/**               **/

const instance = axios.create({
  withCredentials: true,
  validateStatus: function(status) {
    return status < 400 // Reject only if the status code is greater than or equal to 400
  }
})

export function upload(file: Object): Promise<*> {
  const url = '/upload'
  const formData = new FormData()
  formData.append('sampleFile', file)
  return instance
    .post(url, formData)
    .then(res => (res.status === 204 ? null : res.data))
    .catch(e => {
      throw e
    })
}
