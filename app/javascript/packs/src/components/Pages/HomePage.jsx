// app/javascript/src/components/Pages/HomePage.jsx
import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"

export default function HomePage() {

    const container = document.getElementById("react-root")
    const signedInStr = container?.dataset.signedIn
    const signedIn = signedInStr === "true"

    return (
        <div className="d-flex vh-100 align-items-center justify-content-center">
            <div className="text-center">
                <h1 className="mb-3">Welcome to SupportDesk</h1>
                <p className="mb-4">
                    Get started by creating an account or signing in.
                </p>
                {signedIn && (
                    <a href="/tickets/new" className="btn btn-md btn-primary me-2">
                        Create Ticket
                    </a>
                )}
                {!signedIn && (
                    <>
                        <a href="/users/sign_up" className="btn btn-primary me-2">
                            Sign Up
                        </a>
                        <a href="/users/sign_in" className="btn btn-secondary">
                            Sign In
                        </a>
                    </>
                )}
            </div>
        </div>
    )
}
