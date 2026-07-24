import { useState } from 'react'
import { useApolloClient, useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const client = useApolloClient()

  const [ login ] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      const token = data.login.value
      props.setToken(token)
      localStorage.setItem('library-user-token', token)

      await client.resetStore()

      setUsername('')
      setPassword('')
    },
    onError: (error) => {
      props.setError(error.message)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    await login({ variables: { username, password } })
  }
  if (!props.show) {
    return null
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm