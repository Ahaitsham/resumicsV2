import { authAPI } from './api'
import { useAuthStore } from '../store'

// Called after Google returns a credential token
// Works with @react-oauth/google's useGoogleLogin or GoogleLogin component
export async function handleGoogleCredential(credentialResponse, navigate) {
  const { setUser } = useAuthStore.getState()

  try {
    // credentialResponse.credential is a JWT id_token from Google
    const res = await authAPI.googleLogin(credentialResponse.credential)
    setUser(res.data.user, res.data.token)
    navigate('/dashboard')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Google sign-in failed. Please try again.',
    }
  }
}
