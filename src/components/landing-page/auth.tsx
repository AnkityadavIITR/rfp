import React from 'react'
import { SignInButton,SignedOut,SignedIn,UserButton } from '@clerk/nextjs'
import { Button } from '../ui/button'

const Auth = () => {
  return (
    <div className="absolute right-5 top-5">
    <SignedOut>
      <SignInButton mode="modal">
        <Button
          id="auth"
          size="sm"
          className="h-[32px] rounded text-sm font-medium"
        >
          Sign in
        </Button>
      </SignInButton>
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </div>
  )
}

export default Auth;
