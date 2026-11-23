

export default function Authenticator() {
    return (
        <section className="login">
            <div className="login__imageBox">
                <img src="newsify_logo.svg" alt="Newsify Logo" />
            </div>
            <h1 className="login__header">Newsify</h1>
            <p className="login__paragraph">Welcome! Let's dive into your account!</p>
            <button type="button" className="login__facebookLogin">Continue with Facebook</button>
            <button type="button" className="login__googleLogin">Continue with Google</button>
            <p className="login__anotherOption">or</p>
            <button type="button" className="login__passwordLogin">Sing in with password</button>
            <p className="login_signUp">Dont have an account? <a href="#" className="signUp">Sign up</a></p>
        </section>
    )
}
