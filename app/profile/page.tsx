import { Suspense } from 'react'
import UserProfileForm from './UserProfileForm'

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfileForm />
    </Suspense>
  )
}