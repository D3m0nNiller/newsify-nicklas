import "./style.scss"

export default function Authenticator() {
    return (
        <section className="login__">
            <div className="login__imageBox">
                <img src="newsify_logo.svg" alt="Newsify Logo" />
            </div>
            <h1 className="login__header">Newsify</h1>
            <p className="login__paragraph">Welcome! Let's dive into your account!</p>
            <div className="login__loginOptions">
                <button type="button" className="login__facebookLogin">Continue with Facebook</button>
                <button type="button" className="login__googleLogin">Continue with Google</button>
            </div>
            <p className="login__anotherOption">or</p>
            <div className="login__alternativeLogin">
                <button type="button" className="login__passwordLogin">Sign in with password</button>
            </div>
            <p className="login__signUp">Dont have an account? <a href="#" className="login__signUpButton">Sign up</a></p>
        </section>
    )
}
