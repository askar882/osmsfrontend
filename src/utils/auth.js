const TokenKey = 'JWT-Token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function extractToken() {
  const [payload] = getToken().split('.').slice(1, 2)
    .map(str => Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
    .map(str => JSON.parse(str))
  const { sub: name, id, exp: expiration } = payload
  const roles = payload.roles.split(',')
  return { name, roles, id, expiration }
}
