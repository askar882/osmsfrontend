const TokenKey = 'JWT-Token'

export function getToken() {
  console.debug('Getting token')
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  console.debug('Setting token: ' + token)
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  console.debug('Removing token')
  return localStorage.removeItem(TokenKey)
}

export function extractToken() {
  console.debug('Extracting token')
  const [payload] = getToken().split('.').slice(1, 2)
    .map(str => Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
    .map(str => JSON.parse(str))
  console.log('JWT token:', payload)
  const { sub: name, id, exp: expiration } = payload
  const roles = payload.roles.split(',')
  return { name, roles, id, expiration }
}
